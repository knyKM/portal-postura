import { Agent } from "undici";
import { getIntegrationSetting } from "@/lib/settings/integration-settings";
import {
  getActionRequestById,
  updateActionRequestExecutionStatus,
} from "@/lib/actions/action-request-service";
import {
  updateJobStatus,
  updateJobProgress,
  listQueuedActionExecutionJobs,
  getRunningJobsCount,
} from "@/lib/actions/action-job-service";

const DEFAULT_MAX_JIRA_RESULTS = 200;
const DEFAULT_MAX_PARALLEL_JOBS = 3;

type JiraConfig = {
  url: string;
  token: string;
  verifySsl: boolean;
};

type ActionPayload = {
  comment?: string;
  customFields?: Array<{ id?: string; value?: string; mode?: string }>;
};

class JiraApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getJiraConfig(): JiraConfig {
  const url = getIntegrationSetting("jira_url") ?? "";
  const token = getIntegrationSetting("jira_token") ?? "";
  const verifySetting = getIntegrationSetting("jira_verify_ssl");
  return { url, token, verifySsl: verifySetting !== "false" };
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
  filterValue: string,
  maxResultsLimit: number
) {
  if (filterMode === "ids") {
    return parseIssueIds(filterValue);
  }
  if (filterMode === "jql") {
    const issues = await fetchIssuesByJql(config, filterValue, maxResultsLimit);
    return issues.map((issue) => issue.key);
  }
  return [];
}

async function fetchIssuesByJql(config: JiraConfig, jql: string, maxResultsLimit: number) {
  const issues: Array<{ key: string }> = [];
  let startAt = 0;
  const maxResults = 100;

  while (issues.length < maxResultsLimit) {
    const response = await jiraFetch(
      config,
      `/rest/api/2/search?jql=${encodeURIComponent(
        jql
      )}&startAt=${startAt}&maxResults=${maxResults}&fields=key`
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
    const total = typeof data?.total === "number" ? data.total : issues.length;
    startAt += maxResults;
    if (issues.length >= total || issues.length >= maxResultsLimit) {
      break;
    }
  }

  if (issues.length >= maxResultsLimit) {
    throw new JiraApiError("", 400);
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

export async function executeActionJob(jobId: number, requestId: number) {
  updateJobStatus({ id: jobId, status: "running" });
  updateActionRequestExecutionStatus({ id: requestId, status: "running" });
  const targetRequest = getActionRequestById(requestId);
  if (!targetRequest) {
    updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
    updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
    return;
  }

  const jiraConfig = getJiraConfig();
  if (!jiraConfig.url || !jiraConfig.token) {
    updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
    updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
    return;
  }

  const maxResultsSetting = Number(
    getIntegrationSetting("jira_max_results") ?? DEFAULT_MAX_JIRA_RESULTS
  );
  const maxResultsLimit = Number.isFinite(maxResultsSetting)
    ? Math.max(1, Math.floor(maxResultsSetting))
    : DEFAULT_MAX_JIRA_RESULTS;
  let issueKeys: string[] = [];
  try {
    issueKeys = await getIssueKeys(
      jiraConfig,
      targetRequest.filter_mode,
      targetRequest.filter_value,
      maxResultsLimit
    );
  } catch (err) {
    if (err instanceof JiraApiError) {
      updateJobStatus({ id: jobId, status: "failed", errorMessage: err.message });
      updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: err.message });
      return;
    }
    updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
    updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
    return;
  }

  if (!issueKeys.length) {
    updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
    updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
    return;
  }

  let processedCount = 0;
  updateJobProgress({ id: jobId, totalIssues: issueKeys.length, processedIssues: 0 });
  for (const key of issueKeys) {
    try {
      if (targetRequest.action_type === "status") {
        const targetStatus = targetRequest.requested_status?.trim();
        if (!targetStatus) {
          throw new JiraApiError("", 400);
        }
        await transitionIssue(jiraConfig, key, targetStatus);
      } else if (targetRequest.action_type === "assignee") {
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
            fields[fieldId] = field.value;
          }
        });
        if (!Object.keys(fields).length) {
          throw new JiraApiError("", 400);
        }
        await updateIssueFields(jiraConfig, key, fields);
      } else if (targetRequest.action_type === "comment") {
        const payload = parsePayload(targetRequest.payload);
        const comment = payload?.comment?.trim();
        if (!comment) {
          throw new JiraApiError("", 400);
        }
        await addIssueComment(jiraConfig, key, comment);
      } else {
        throw new JiraApiError("", 400);
      }
      processedCount += 1;
      updateJobProgress({ id: jobId, processedIssues: processedCount });
    } catch (err) {
      if (err instanceof JiraApiError) {
        updateJobStatus({ id: jobId, status: "failed", errorMessage: err.message });
        updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: err.message });
        return;
      }
      updateJobStatus({ id: jobId, status: "failed", errorMessage: "" });
      updateActionRequestExecutionStatus({ id: requestId, status: "failed", errorMessage: "" });
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
