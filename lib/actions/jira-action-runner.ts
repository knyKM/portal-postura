import { Agent } from "undici";
import { getIntegrationSetting } from "@/lib/settings/integration-settings";
import { getUserJiraSettings } from "@/lib/auth/user-service";
import {
  getActionRequestById,
  updateActionRequestExecutionStatus,
} from "@/lib/actions/action-request-service";
import {
  updateJobStatus,
  updateJobProgress,
  listQueuedActionExecutionJobs,
  getRunningJobsCount,
  getActionExecutionJobById,
} from "@/lib/actions/action-job-service";
import {
  ASSIGNEE_CUSTOM_FIELDS,
  ASSIGNEE_LABEL_FIELDS,
  normalizeAssigneeLabel,
  toLabelValues,
} from "@/lib/actions/assignee-fields";

const DEFAULT_MAX_PARALLEL_JOBS = 3;

type JiraConfig = {
  url: string;
  token: string;
  verifySsl: boolean;
};

type ActionPayload = {
  comment?: string;
  commentAttachment?: { name?: string; type?: string; data?: string };
  customFields?: Array<{ id?: string; value?: string; mode?: string }>;
  assigneeCsvData?: string;
  assigneeCsvFileName?: string;
  labels?: string[];
  fields?: Array<{ key?: string; value?: string }>;
};

class JiraApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getJiraConfig(requesterId: number | null): JiraConfig {
  if (!requesterId) {
    return { url: "", token: "", verifySsl: true };
  }
  const settings = getUserJiraSettings(requesterId);
  return {
    url: settings?.jira_url ?? "",
    token: settings?.jira_token ?? "",
    verifySsl: settings?.jira_verify_ssl !== "false",
  };
}

function normalizeJiraUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function buildJiraHeaders(token: string) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function parseIssueIds(raw: string) {
  return raw
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function detectCsvDelimiter(raw: string) {
  let inQuotes = false;
  let commaCount = 0;
  let semicolonCount = 0;
  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    const next = raw[index + 1];
    if (char === "\"") {
      if (inQuotes && next === "\"") {
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes) {
      if (char === ",") commaCount += 1;
      if (char === ";") semicolonCount += 1;
      if (char === "\n" || char === "\r") {
        break;
      }
    }
  }
  if (semicolonCount > commaCount) return ";";
  return ",";
}

function parseCsvRows(raw: string) {
  const rows: string[][] = [];
  const delimiter = detectCsvDelimiter(raw);
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  const pushCell = () => {
    row.push(current);
    current = "";
  };

  const pushRow = () => {
    if (row.length === 0) return;
    if (row.every((cell) => !cell.trim())) {
      row = [];
      return;
    }
    rows.push(row);
    row = [];
  };

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    const next = raw[index + 1];
    if (char === "\"") {
      if (inQuotes && next === "\"") {
        current += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === delimiter && !inQuotes) {
      pushCell();
      continue;
    }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      pushCell();
      pushRow();
      continue;
    }
    current += char;
  }
  pushCell();
  pushRow();
  return rows;
}

function parseAssigneeBulkCsv(raw: string) {
  const rows = parseCsvRows(raw);
  if (!rows.length) {
    throw new JiraApiError("O arquivo de carga está vazio.", 400);
  }
  const header = rows[0].map((cell) => cell.trim());
  const normalizedHeader = header.map((cell) => normalizeAssigneeLabel(cell));
  const idIndex = normalizedHeader.findIndex((cell) => cell === "id" || cell === "ids");
  if (idIndex === -1 || idIndex !== 0) {
    throw new JiraApiError("A coluna ID deve ser a primeira do template.", 400);
  }
  const labelToId = new Map(
    ASSIGNEE_CUSTOM_FIELDS.map((field) => [
      normalizeAssigneeLabel(field.label),
      field.id,
    ])
  );
  const fieldIndexes = normalizedHeader
    .map((cell, index) => {
      const fieldId = labelToId.get(cell);
      return fieldId ? { index, fieldId } : null;
    })
    .filter((item): item is { index: number; fieldId: string } => item !== null);
  if (!fieldIndexes.length) {
    throw new JiraApiError("Nenhuma coluna de responsável foi reconhecida.", 400);
  }

  const entries: Array<{ issueKey: string; fields: Record<string, unknown> }> = [];
  rows.slice(1).forEach((row) => {
    const issueKey = (row[idIndex] ?? "").trim();
    if (!issueKey) return;
    const fields: Record<string, unknown> = {};
    fieldIndexes.forEach(({ index, fieldId }) => {
      const rawValue = row[index];
      const value = typeof rawValue === "string" ? rawValue.trim() : "";
      if (!value) return;
      if (value === "<limpar>") {
        fields[fieldId] = null;
        return;
      }
      fields[fieldId] = value;
    });
    entries.push({ issueKey, fields });
  });
  if (!entries.length) {
    throw new JiraApiError("Nenhum ID válido foi identificado no arquivo.", 400);
  }
  return entries;
}

function parsePayload(raw: string | null) {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ActionPayload;
  } catch {
    return null;
  }
}

function extractErrorMessage(raw: string, data: Record<string, unknown> | null) {
  return (
    (data?.errorMessages as string[] | undefined)?.[0] ||
    (data?.error as string | undefined) ||
    (data?.message as string | undefined) ||
    raw ||
    ""
  );
}

async function jiraFetch(
  config: JiraConfig,
  path: string,
  init?: RequestInit
) {
  const baseUrl = normalizeJiraUrl(config.url);
  const dispatcher = config.verifySsl
    ? undefined
    : new Agent({ connect: { rejectUnauthorized: false } });
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...buildJiraHeaders(config.token),
    },
    dispatcher,
  });
}

async function getIssueKeys(
  config: JiraConfig,
  filterMode: string,
  filterValue: string
) {
  if (filterMode === "ids") {
    return parseIssueIds(filterValue);
  }
  if (filterMode === "jql") {
    const issues = await fetchIssuesByJql(config, filterValue);
    return issues.map((issue) => issue.key);
  }
  return [];
}

async function fetchIssuesByJql(config: JiraConfig, jql: string) {
  const issues: Array<{ key: string }> = [];
  let startAt = 0;
  const maxResults = 100;
  let total: number | null = null;

  while (total === null || issues.length < total) {
    const response = await jiraFetch(
      config,
      "/rest/api/2/search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jql,
          startAt,
          maxResults,
          fields: ["key"],
        }),
      }
    );
    const raw = await response.text();
    let data: Record<string, unknown> | null = null;
    if (raw) {
      try {
        data = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        data = null;
      }
    }
    if (!response.ok) {
      throw new JiraApiError(
        extractErrorMessage(raw, data),
        response.status
      );
    }
    const fetched = Array.isArray((data as { issues?: unknown })?.issues)
      ? (data as { issues: Array<{ key?: string }> }).issues
      : [];
    issues.push(
      ...fetched
        .map((item: { key?: string }) => item?.key)
        .filter((key: string | undefined) => typeof key === "string")
        .map((key: string) => ({ key }))
    );
    total = typeof data?.total === "number" ? data.total : issues.length;
    startAt += maxResults;
    if (issues.length >= total || fetched.length === 0) {
      break;
    }
  }

  return issues;
}

async function transitionIssue(
  config: JiraConfig,
  issueKey: string,
  targetStatus: string
) {
  const normalizeStatus = (value: string) =>
    value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  const transitionsResponse = await jiraFetch(
    config,
    `/rest/api/2/issue/${encodeURIComponent(issueKey)}/transitions`
  );
  const transitionsRaw = await transitionsResponse.text();
  let transitionsData: Record<string, unknown> | null = null;
  if (transitionsRaw) {
    try {
      transitionsData = JSON.parse(transitionsRaw) as Record<string, unknown>;
    } catch {
      transitionsData = null;
    }
  }
  if (!transitionsResponse.ok) {
    throw new JiraApiError(
      extractErrorMessage(transitionsRaw, transitionsData),
      transitionsResponse.status
    );
  }
  const transitions = Array.isArray(
    (transitionsData as { transitions?: unknown })?.transitions
  )
    ? (transitionsData as { transitions: Array<{ name?: string }> }).transitions
    : [];
  const normalizedTarget = normalizeStatus(targetStatus);
  const match = transitions.find(
    (transition: {
      name?: string;
      to?: { name?: string; statusCategory?: { name?: string } };
    }) => {
      const transitionName = transition?.name
        ? normalizeStatus(transition.name)
        : "";
      const targetName = transition?.to?.name
        ? normalizeStatus(transition.to.name)
        : "";
      const categoryName = transition?.to?.statusCategory?.name
        ? normalizeStatus(transition.to.statusCategory.name)
        : "";
      return (
        transitionName === normalizedTarget ||
        targetName === normalizedTarget ||
        (normalizedTarget === "done" && categoryName === "done")
      );
    }
  );
  if (!match?.id) {
    throw new JiraApiError("", transitionsResponse.status);
  }

  const transitionResponse = await jiraFetch(
    config,
    `/rest/api/2/issue/${encodeURIComponent(issueKey)}/transitions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transition: { id: match.id } }),
    }
  );
  if (!transitionResponse.ok) {
    const transitionRaw = await transitionResponse.text();
    let transitionError: Record<string, unknown> | null = null;
    if (transitionRaw) {
      try {
        transitionError = JSON.parse(transitionRaw) as Record<string, unknown>;
      } catch {
        transitionError = null;
      }
    }
    throw new JiraApiError(
      extractErrorMessage(transitionRaw, transitionError),
      transitionResponse.status
    );
  }
}

async function updateIssueFields(
  config: JiraConfig,
  issueKey: string,
  fields: Record<string, unknown>
) {
  const response = await jiraFetch(
    config,
    `/rest/api/2/issue/${encodeURIComponent(issueKey)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    }
  );
  if (!response.ok) {
    const raw = await response.text();
    let data: Record<string, unknown> | null = null;
    if (raw) {
      try {
        data = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        data = null;
      }
    }
    throw new JiraApiError(extractErrorMessage(raw, data), response.status);
  }
}

type JiraEditMetaField = {
  schema?: {
    type?: string;
    items?: string;
    system?: string;
    custom?: string;
  };
  allowedValues?: Array<{ id?: string; name?: string; value?: string }>;
};

async function fetchIssueEditMeta(config: JiraConfig, issueKey: string) {
  const response = await jiraFetch(
    config,
    `/rest/api/2/issue/${encodeURIComponent(issueKey)}/editmeta`
  );
  const raw = await response.text();
  let data: Record<string, unknown> | null = null;
  if (raw) {
    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      data = null;
    }
  }
  if (!response.ok) {
    throw new JiraApiError(extractErrorMessage(raw, data), response.status);
  }
  return (data?.fields as Record<string, JiraEditMetaField>) ?? {};
}

function parseLabelList(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function matchAllowedValue(
  allowed: Array<{ id?: string; name?: string; value?: string }>,
  rawValue: string
) {
  const normalized = rawValue.trim().toLowerCase();
  if (!normalized) return null;
  const matchesId = (id?: string) => {
    if (!id) return false;
    return String(id).toLowerCase() === normalized;
  };
  const direct = allowed.find(
    (item) =>
      (item.value && item.value.toLowerCase() === normalized) ||
      (item.name && item.name.toLowerCase() === normalized) ||
      matchesId(item.id)
  );
  if (direct) return direct;
  return null;
}

function buildFieldValue(
  fieldKey: string,
  rawValue: string,
  meta?: JiraEditMetaField
) {
  const trimmed = rawValue.trim();
  if (!trimmed) return null;
  const allowed = meta?.allowedValues ?? [];
  const schemaType = meta?.schema?.type ?? "";
  const schemaItems = meta?.schema?.items ?? "";

  const isMulti =
    schemaType === "array" &&
    (schemaItems === "option" || allowed.length > 0);
  const isSingle =
    schemaType === "option" ||
    schemaType === "issuetype" ||
    schemaType === "priority" ||
    allowed.length > 0;

  if (isMulti) {
    const values = parseLabelList(trimmed);
    const mapped = values
      .map((value) => matchAllowedValue(allowed, value))
      .filter(Boolean) as Array<{ id?: string; name?: string; value?: string }>;
    if (!mapped.length) {
      throw new JiraApiError(
        `Valor "${trimmed}" não encontrado nas opções do campo ${fieldKey}.`,
        400
      );
    }
    return mapped.map((item) => ({ id: item.id, value: item.value ?? item.name }));
  }

  if (isSingle) {
    const matched = matchAllowedValue(allowed, trimmed);
    if (!matched && allowed.length > 0) {
      throw new JiraApiError(
        `Valor "${trimmed}" não encontrado nas opções do campo ${fieldKey}.`,
        400
      );
    }
    if (matched) {
      return { id: matched.id, value: matched.value ?? matched.name };
    }
    return { value: trimmed };
  }

  return trimmed;
}

async function getIssueLabels(config: JiraConfig, issueKey: string) {
  const response = await jiraFetch(
    config,
    `/rest/api/2/issue/${encodeURIComponent(issueKey)}?fields=labels`
  );
  const raw = await response.text();
  let data: Record<string, unknown> | null = null;
  if (raw) {
    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      data = null;
    }
  }
  if (!response.ok) {
    throw new JiraApiError(extractErrorMessage(raw, data), response.status);
  }
  const fields = (data as { fields?: Record<string, unknown> })?.fields ?? {};
  const labels = fields.labels;
  if (Array.isArray(labels)) {
    return labels.filter((label) => typeof label === "string") as string[];
  }
  return [];
}

function mergeLabels(existing: string[], incoming: string[]) {
  const seen = new Set<string>();
  const merged: string[] = [];
  existing.forEach((label) => {
    const normalized = label.trim();
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(normalized);
  });
  incoming.forEach((label) => {
    const normalized = label.trim();
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(normalized);
  });
  return merged;
}

async function addIssueComment(
  config: JiraConfig,
  issueKey: string,
  comment: string
) {
  const response = await jiraFetch(
    config,
    `/rest/api/2/issue/${encodeURIComponent(issueKey)}/comment`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: comment }),
    }
  );
  if (!response.ok) {
    const raw = await response.text();
    let data: Record<string, unknown> | null = null;
    if (raw) {
      try {
        data = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        data = null;
      }
    }
    throw new JiraApiError(extractErrorMessage(raw, data), response.status);
  }
}

async function deleteIssue(config: JiraConfig, issueKey: string) {
  const response = await jiraFetch(
    config,
    `/rest/api/2/issue/${encodeURIComponent(issueKey)}`,
    { method: "DELETE" }
  );
  if (!response.ok) {
    const raw = await response.text();
    let data: Record<string, unknown> | null = null;
    if (raw) {
      try {
        data = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        data = null;
      }
    }
    throw new JiraApiError(extractErrorMessage(raw, data), response.status);
  }
}

async function addIssueAttachment(
  config: JiraConfig,
  issueKey: string,
  attachment: { name: string; type: string; data: string }
) {
  const buffer = Buffer.from(attachment.data, "base64");
  const form = new FormData();
  const blob = new Blob([buffer], { type: attachment.type || "application/octet-stream" });
  form.append("file", blob, attachment.name);

  const response = await jiraFetch(
    config,
    `/rest/api/2/issue/${encodeURIComponent(issueKey)}/attachments`,
    {
      method: "POST",
      headers: {
        "X-Atlassian-Token": "no-check",
      },
      body: form,
    }
  );
  if (!response.ok) {
    const raw = await response.text();
    let data: Record<string, unknown> | null = null;
    if (raw) {
      try {
        data = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        data = null;
      }
    }
    throw new JiraApiError(extractErrorMessage(raw, data), response.status);
  }
}

export async function executeActionJob(jobId: number, requestId: number) {
  updateJobStatus({ id: jobId, status: "running" });
  updateActionRequestExecutionStatus({ id: requestId, status: "running" });
  const targetRequest = getActionRequestById(requestId);
  if (!targetRequest) {
    updateJobStatus({ id: jobId, status: "frozen", errorMessage: "Solicitação não encontrada." });
    updateActionRequestExecutionStatus({
      id: requestId,
      status: "frozen",
      errorMessage: "Solicitação não encontrada.",
      errorStatusCode: 404,
    });
    await startQueuedJobs();
    return;
  }

  const jiraConfig = getJiraConfig(targetRequest.requester_id);
  if (!jiraConfig.url || !jiraConfig.token) {
    updateJobStatus({
      id: jobId,
      status: "frozen",
      errorMessage: "Integração Jira não configurada para o solicitante.",
      errorStatusCode: 400,
    });
    updateActionRequestExecutionStatus({
      id: requestId,
      status: "frozen",
      errorMessage: "Integração Jira não configurada para o solicitante.",
      errorStatusCode: 400,
    });
    await startQueuedJobs();
    return;
  }

  let issueKeys: string[] = [];
  let bulkFieldsByIssue: Map<string, Record<string, unknown>> | null = null;
  try {
    if (targetRequest.action_type === "assignee" && targetRequest.filter_mode === "bulk") {
      const payload = parsePayload(targetRequest.payload);
      const entries = parseAssigneeBulkCsv(payload?.assigneeCsvData ?? "");
      bulkFieldsByIssue = new Map(
    entries.map((entry) => [entry.issueKey, entry.fields])
  );
      issueKeys = Array.from(bulkFieldsByIssue.keys());
    } else {
      issueKeys = await getIssueKeys(
        jiraConfig,
        targetRequest.filter_mode,
        targetRequest.filter_value
      );
    }
  } catch (err) {
    if (err instanceof JiraApiError) {
      updateJobStatus({
        id: jobId,
        status: "frozen",
        errorMessage: err.message,
        errorStatusCode: err.status,
      });
      updateActionRequestExecutionStatus({
        id: requestId,
        status: "frozen",
        errorMessage: err.message,
        errorStatusCode: err.status,
      });
      await startQueuedJobs();
      return;
    }
    updateJobStatus({ id: jobId, status: "frozen", errorMessage: "Falha ao preparar execução." });
    updateActionRequestExecutionStatus({
      id: requestId,
      status: "frozen",
      errorMessage: "Falha ao preparar execução.",
    });
    await startQueuedJobs();
    return;
  }

  if (!issueKeys.length) {
    updateJobStatus({ id: jobId, status: "frozen", errorMessage: "Nenhuma issue encontrada." });
    updateActionRequestExecutionStatus({
      id: requestId,
      status: "frozen",
      errorMessage: "Nenhuma issue encontrada.",
      errorStatusCode: 404,
    });
    await startQueuedJobs();
    return;
  }

  const jobSnapshot = getActionExecutionJobById(jobId);
  let processedCount = jobSnapshot?.processed_issues ?? 0;
  const totalIssues = issueKeys.length;
  updateJobProgress({
    id: jobId,
    totalIssues,
    processedIssues: processedCount,
  });
  const pendingKeys =
    processedCount > 0 && processedCount < issueKeys.length
      ? issueKeys.slice(processedCount)
      : issueKeys;

  const shouldPause = () => {
    const current = getActionExecutionJobById(jobId);
    return current?.status === "paused";
  };

  for (const key of pendingKeys) {
    if (shouldPause()) {
      updateJobStatus({ id: jobId, status: "paused" });
      updateActionRequestExecutionStatus({ id: requestId, status: "paused" });
      return;
    }
    try {
      if (targetRequest.action_type === "status") {
        const targetStatus = targetRequest.requested_status?.trim();
        if (!targetStatus) {
          throw new JiraApiError("", 400);
        }
        await transitionIssue(jiraConfig, key, targetStatus);
      } else if (targetRequest.action_type === "assignee") {
        if (targetRequest.filter_mode === "bulk") {
          const rawFields = bulkFieldsByIssue?.get(key) ?? {};
          if (!Object.keys(rawFields).length) {
            processedCount += 1;
            updateJobProgress({ id: jobId, processedIssues: processedCount });
            continue;
          }
          const normalizedFields: Record<string, unknown> = {};
          Object.entries(rawFields).forEach(([fieldId, value]) => {
            if (value === null) {
              normalizedFields[fieldId] = null;
              return;
            }
            if (ASSIGNEE_LABEL_FIELDS.has(fieldId) && typeof value === "string") {
              normalizedFields[fieldId] = toLabelValues(value);
              return;
            }
            normalizedFields[fieldId] = value;
          });
          if (!Object.keys(normalizedFields).length) {
            processedCount += 1;
            updateJobProgress({ id: jobId, processedIssues: processedCount });
            continue;
          }
          await updateIssueFields(jiraConfig, key, normalizedFields);
        } else {
          const payload = parsePayload(targetRequest.payload);
          const fields: Record<string, unknown> = {};
          (payload?.customFields ?? []).forEach((field) => {
            const fieldId = field.id?.trim();
            if (!fieldId) return;
            if (field.mode === "clear") {
              fields[fieldId] = null;
              return;
            }
            if (field.value !== undefined) {
              if (ASSIGNEE_LABEL_FIELDS.has(fieldId)) {
                fields[fieldId] = toLabelValues(String(field.value));
              } else {
                fields[fieldId] = field.value;
              }
            }
          });
          if (!Object.keys(fields).length) {
            throw new JiraApiError("", 400);
          }
          await updateIssueFields(jiraConfig, key, fields);
        }
      } else if (targetRequest.action_type === "comment") {
        const payload = parsePayload(targetRequest.payload);
        const comment = payload?.comment?.trim();
        const attachment = payload?.commentAttachment;
        if (!comment) {
          throw new JiraApiError("", 400);
        }
        await addIssueComment(jiraConfig, key, comment);
        if (attachment?.data && attachment?.name) {
          await addIssueAttachment(jiraConfig, key, {
            name: attachment.name,
            type: attachment.type ?? "application/octet-stream",
            data: attachment.data,
          });
        }
      } else if (targetRequest.action_type === "labels") {
        const payload = parsePayload(targetRequest.payload);
        const incomingLabels = Array.isArray(payload?.labels) ? payload?.labels : [];
        if (!incomingLabels.length) {
          throw new JiraApiError("", 400);
        }
        const existing = await getIssueLabels(jiraConfig, key);
        const merged = mergeLabels(existing, incomingLabels);
        await updateIssueFields(jiraConfig, key, { labels: merged });
      } else if (targetRequest.action_type === "delete") {
        await deleteIssue(jiraConfig, key);
      } else if (targetRequest.action_type === "fields") {
        const payload = parsePayload(targetRequest.payload);
        const fieldEntries = Array.isArray(payload?.fields) ? payload?.fields : [];
        if (!fieldEntries.length) {
          throw new JiraApiError("", 400);
        }
        const editMeta = await fetchIssueEditMeta(jiraConfig, key);
        const fieldsPayload: Record<string, unknown> = {};
        fieldEntries.forEach((entry) => {
          const fieldKey = entry.key?.trim();
          const value = entry.value?.trim() ?? "";
          if (!fieldKey || !value) return;
          const meta = editMeta[fieldKey];
          const mappedValue = buildFieldValue(fieldKey, value, meta);
          if (mappedValue !== null) {
            fieldsPayload[fieldKey] = mappedValue;
          }
        });
        if (!Object.keys(fieldsPayload).length) {
          throw new JiraApiError("", 400);
        }
        await updateIssueFields(jiraConfig, key, fieldsPayload);
      } else {
        throw new JiraApiError("", 400);
      }
      processedCount += 1;
      updateJobProgress({ id: jobId, processedIssues: processedCount });
    } catch (err) {
      if (err instanceof JiraApiError) {
        updateJobStatus({
          id: jobId,
          status: "frozen",
          errorMessage: err.message,
          errorStatusCode: err.status,
        });
        updateActionRequestExecutionStatus({
          id: requestId,
          status: "frozen",
          errorMessage: err.message,
          errorStatusCode: err.status,
        });
        await startQueuedJobs();
        return;
      }
      updateJobStatus({ id: jobId, status: "frozen", errorMessage: "Falha ao executar automação." });
      updateActionRequestExecutionStatus({
        id: requestId,
        status: "frozen",
        errorMessage: "Falha ao executar automação.",
      });
      await startQueuedJobs();
      return;
    }
  }

  updateJobStatus({ id: jobId, status: "completed" });
  updateActionRequestExecutionStatus({ id: requestId, status: "completed" });
  await startQueuedJobs();
}

export async function startQueuedJobs() {
  if (getIntegrationSetting("action_jobs_paused") === "true") {
    return;
  }
  const maxParallelSetting = Number(
    getIntegrationSetting("action_jobs_max_parallel") ?? DEFAULT_MAX_PARALLEL_JOBS
  );
  const maxParallel = Number.isFinite(maxParallelSetting)
    ? Math.max(1, Math.floor(maxParallelSetting))
    : DEFAULT_MAX_PARALLEL_JOBS;
  const runningCount = getRunningJobsCount();
  const available = maxParallel - runningCount;
  if (available <= 0) {
    return;
  }
  const queued = listQueuedActionExecutionJobs(available);
  queued.forEach((job) => {
    updateJobStatus({ id: job.id, status: "running" });
    setTimeout(() => {
      void executeActionJob(job.id, job.request_id);
    }, 0);
  });
}
