import { NextResponse } from "next/server";
import { Agent } from "undici";
import { getSessionUser } from "@/lib/auth/session";
import {
  createActionRequest,
  getActionRequestById,
  listPendingRequests,
  listRecentRequests,
  listCompletedRequests,
  listActionRequestsByStatuses,
  listUserRequests,
  deleteActionRequest,
  updateActionRequestStatus,
  updateActionRequestExecutionStatus,
  ActionRequestRecord,
} from "@/lib/actions/action-request-service";
import { listAdmins } from "@/lib/auth/user-service";
import { createNotification } from "@/lib/notifications/notification-service";
import { getIntegrationSetting } from "@/lib/settings/integration-settings";
import { createActionExecutionJob } from "@/lib/actions/action-job-service";
import { startQueuedJobs } from "@/lib/actions/jira-action-runner";

type ActionRequestPayload = {
  actionType?: string;
  filterMode?: string;
  filterValue?: string;
  requestedStatus?: string;
  assigneeFields?: Array<{ id?: string; label?: string; value?: string; mode?: string }>;
  comment?: string;
  fields?: Array<{ key: string; value: string }>;
  projectKey?: string;
  csvData?: string;
  csvFileName?: string;
};

const ALLOWED_STATUS = [
  "In Analysis",
  "Request For Risk Acceptance",
  "Risk Accepted",
  "In Progress",
  "Retest Fail",
  "Ready For Retest",
  "In Retest",
  "Erro",
  "Done",
  "Containment measure fail",
  "Containment measure OK",
  "Containment measure ready for retest",
  "Containment Measure In Retest",
  "Cancelado",
  "Reabrir",
];
const SUPPORTED_ACTIONS = [
  "status",
  "assignee",
  "comment",
  "fields",
  "escalate",
  "delete",
];
const ACTION_LABELS: Record<string, string> = {
  status: "alterar status",
  assignee: "mudar responsável",
  comment: "adicionar comentário",
  fields: "atualizar campos",
  escalate: "subir issue",
  delete: "deletar issue",
};

const DEFAULT_MAX_JIRA_RESULTS = 200;

type JiraConfig = {
  url: string;
  token: string;
  verifySsl: boolean;
};

class JiraApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function serializeRequest(record: ActionRequestRecord) {
  return {
    id: record.id,
    action_type: record.action_type,
    filter_mode: record.filter_mode,
    filter_value: record.filter_value,
    requested_status: record.requested_status,
    payload: record.payload ? safeParsePayload(record.payload) : null,
    requester_name: record.requester_name,
    requester_email: record.requester_email,
    status: record.status,
    created_at: record.created_at,
    approved_at: record.approved_at,
    approved_by: record.approved_by,
    audit_notes: record.audit_notes,
  };
}

function safeParsePayload(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
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

async function fetchIssuesByJql(
  config: JiraConfig,
  jql: string,
  maxResultsLimit: number
) {
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
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new JiraApiError(
        data?.errorMessages?.[0] ||
          `Falha ao consultar issues (status ${response.status}).`,
        response.status
      );
    }
    const fetched = Array.isArray(data?.issues) ? data.issues : [];
    issues.push(
      ...fetched
        .map((item: { key?: string }) => item?.key)
        .filter((key: string | undefined) => typeof key === "string")
        .map((key: string) => ({ key }))
    );
    const total = typeof data?.total === "number" ? data.total : issues.length;
    startAt += maxResults;
    if (issues.length >= total) {
      break;
    }
    if (issues.length >= maxResultsLimit) {
      break;
    }
  }

  if (issues.length >= maxResultsLimit) {
    throw new Error(
      `A consulta retornou mais de ${maxResultsLimit} issues. Refine a JQL antes de aprovar.`
    );
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
  const transitionsData = await transitionsResponse.json().catch(() => null);
  if (!transitionsResponse.ok) {
    throw new JiraApiError(
      transitionsData?.errorMessages?.[0] ||
        `Falha ao buscar transições da issue ${issueKey}.`,
      transitionsResponse.status
    );
  }
  const transitions = Array.isArray(transitionsData?.transitions)
    ? transitionsData.transitions
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
    throw new Error(
      `Transição "${targetStatus}" não encontrada para a issue ${issueKey}.`
    );
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
    const transitionError = await transitionResponse.json().catch(() => null);
    throw new JiraApiError(
      transitionError?.errorMessages?.[0] ||
        `Falha ao aplicar a transição na issue ${issueKey}.`,
      transitionResponse.status
    );
  }
}


function describeActionSummary(
  actionType: string,
  requestedStatus?: string | null,
  payload?: Record<string, unknown> | null
) {
  switch (actionType) {
    case "status":
      return requestedStatus
        ? `${ACTION_LABELS.status} para ${requestedStatus}`
        : ACTION_LABELS.status;
    case "assignee":
      return payload?.customFields?.length
        ? `${ACTION_LABELS.assignee} (${payload.customFields.length} campo${
            payload.customFields.length > 1 ? "s" : ""
          })`
        : ACTION_LABELS.assignee;
    case "comment":
      return ACTION_LABELS.comment;
    case "fields": {
      const total = Array.isArray((payload as { fields?: unknown })?.fields)
        ? (payload as { fields?: unknown[] }).fields?.length ?? 0
        : 0;
      return total
        ? `${ACTION_LABELS.fields} (${total} campo${
            total > 1 ? "s" : ""
          })`
        : ACTION_LABELS.fields;
    }
    case "escalate":
      return ACTION_LABELS.escalate;
    case "delete":
      return ACTION_LABELS.delete;
    default:
      return "executar ação";
  }
}

function buildNotificationPayload(
  record: ActionRequestRecord,
  actionType: string,
  requestedStatus?: string,
  payload?: Record<string, unknown> | null,
  extra?: Record<string, unknown>
) {
  return {
    requestId: record.id,
    actionType,
    filterMode: record.filter_mode,
    filterValue: record.filter_value,
    requestedStatus: requestedStatus ?? record.requested_status ?? null,
    ...(payload ?? {}),
    ...(extra ?? {}),
  };
}

function notifyAdminsOfRequest({
  record,
  requesterName,
  actionType,
  requestedStatus,
  payload,
}: {
  record: ActionRequestRecord;
  requesterName: string;
  actionType: string;
  requestedStatus?: string;
  payload?: Record<string, unknown> | null;
}) {
  const admins = listAdmins();
  const summary = describeActionSummary(actionType, requestedStatus, payload);

  admins.forEach((admin) => {
    createNotification({
      userId: admin.id,
      type: "action_request_received",
      title: "Nova solicitação de ação",
      message: `${requesterName} solicitou ${summary}.`,
      payload: buildNotificationPayload(record, actionType, requestedStatus, payload),
    });
  });
}

function notifyRequesterDecision({
  record,
  decision,
  approverName,
}: {
  record: ActionRequestRecord;
  decision: "approved" | "declined" | "returned";
  approverName: string;
}) {
  if (!record.requester_id) return;
  const payload = record.payload ? safeParsePayload(record.payload) : null;
  const summary = describeActionSummary(
    record.action_type,
    record.requested_status,
    payload
  );
  createNotification({
    userId: record.requester_id,
    type: "action_request_decision",
    title:
      decision === "approved"
        ? "Solicitação aprovada"
        : decision === "returned"
        ? "Solicitação devolvida"
        : "Solicitação declinada",
    message: `Sua solicitação #${record.id} para ${summary} foi ${
      decision === "approved"
        ? "aprovada"
        : decision === "returned"
        ? "devolvida"
        : "declinada"
    } por ${approverName}.`,
    payload: buildNotificationPayload(record, record.action_type, record.requested_status ?? undefined, payload, {
      decision,
    }),
  });
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json(
      { error: "Sessão inválida." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const scope = searchParams.get("scope");
  const limitParam = Number(searchParams.get("limit") ?? (scope === "self" ? 25 : 50));
  const limit = Number.isNaN(limitParam)
    ? scope === "self"
      ? 25
      : 50
    : Math.max(1, Math.min(100, limitParam));

  if (scope === "self") {
    const normalizedStatus =
      statusFilter === "pending" ||
      statusFilter === "approved" ||
      statusFilter === "declined" ||
      statusFilter === "returned" ||
      statusFilter === "completed" ||
      statusFilter === "queued" ||
      statusFilter === "running" ||
      statusFilter === "failed" ||
      statusFilter === "cancelled"
        ? statusFilter
        : undefined;
    const userRequests = listUserRequests({
      userId: session.id,
      status: normalizedStatus as
        | "pending"
        | "approved"
        | "declined"
        | "completed"
        | "queued"
        | "running"
        | "failed"
        | "cancelled"
        | undefined,
      limit,
    });

    return NextResponse.json({
      requests: userRequests.map((record) => serializeRequest(record)),
    });
  }

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  if (statusFilter === "open") {
    const openRequests = listActionRequestsByStatuses(
      ["pending", "returned", "queued", "running", "approved"],
      limit
    );
    return NextResponse.json({
      requests: openRequests.map((record) => serializeRequest(record)),
    });
  }

  if (statusFilter === "closed") {
    const closedRequests = listActionRequestsByStatuses(
      ["completed", "failed", "declined", "cancelled"],
      limit
    );
    return NextResponse.json({
      requests: closedRequests.map((record) => serializeRequest(record)),
    });
  }

  const rawRequests =
    statusFilter === "pending"
      ? listPendingRequests(limit)
      : statusFilter === "completed"
      ? listCompletedRequests(limit)
      : listRecentRequests(limit);

  return NextResponse.json({
    requests: rawRequests.map((record) => serializeRequest(record)),
  });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json(
      { error: "Sessão inválida. Autentique-se novamente." },
      { status: 401 }
    );
  }

  const body = (await request.json()) as ActionRequestPayload | null;
  const actionType = body?.actionType ?? "status";
  const filterMode = body?.filterMode;
  const filterValue = body?.filterValue?.trim();
  const requestedStatus = body?.requestedStatus;
  const projectKey = body?.projectKey?.trim();
  const csvData = body?.csvData?.trim();
  const csvFileName = body?.csvFileName?.trim();

  if (!SUPPORTED_ACTIONS.includes(actionType)) {
    return NextResponse.json(
      { error: "Tipo de ação não suportado." },
      { status: 400 }
    );
  }

  let normalizedFilterMode = filterMode;
  let normalizedFilterValue = filterValue;

  if (actionType === "escalate") {
    normalizedFilterMode = "project";
    normalizedFilterValue = projectKey ?? "";
  }

  if (actionType !== "escalate") {
    if (!normalizedFilterMode || !["jql", "ids"].includes(normalizedFilterMode)) {
      return NextResponse.json(
        { error: "Filtro inválido. Escolha entre JQL ou IDs." },
        { status: 400 }
      );
    }

    if (!normalizedFilterValue) {
      return NextResponse.json(
        { error: "Informe o conjunto de issues para a ação." },
        { status: 400 }
      );
    }
  } else if (!projectKey) {
    return NextResponse.json(
      { error: "Selecione o projeto destino para escalar as issues." },
      { status: 400 }
    );
  }

  let payload: Record<string, unknown> | null = null;
  let nextRequestedStatus: string | undefined = undefined;

  if (actionType === "status") {
    if (!requestedStatus || !ALLOWED_STATUS.includes(requestedStatus)) {
      return NextResponse.json(
        { error: "Status inválido." },
        { status: 400 }
      );
    }
    nextRequestedStatus = requestedStatus;
  } else if (actionType === "assignee") {
    const customFields = (body?.assigneeFields ?? [])
      .map((field) => ({
        id: field?.id?.trim() ?? "",
        label: field?.label?.trim() ?? "",
        value: field?.value?.trim() ?? "",
        mode: field?.mode?.trim() ?? "set",
      }))
      .filter((field) => field.id && (field.value || field.mode === "clear"));
    payload = customFields.length ? { customFields } : null;
  } else if (actionType === "comment") {
    const comment = body?.comment?.trim();
    if (!comment) {
      return NextResponse.json(
        { error: "Digite o comentário da ação." },
        { status: 400 }
      );
    }
    payload = { comment };
  } else if (actionType === "fields") {
    const fields = (body?.fields ?? []).map((field) => ({
      key: field?.key?.trim() ?? "",
      value: field?.value?.trim() ?? "",
    }));
    const hasValidFields =
      Array.isArray(body?.fields) &&
      fields.length > 0 &&
      fields.every((field) => field.key && field.value);
    if (!hasValidFields) {
      return NextResponse.json(
        { error: "Informe ao menos um campo com valor." },
        { status: 400 }
      );
    }
    payload = { fields };
  } else if (actionType === "escalate") {
    const fields = (body?.fields ?? []).map((field) => ({
      key: field?.key?.trim() ?? "",
      value: field?.value?.trim() ?? "",
    }));
    const validFields = fields.filter((field) => field.key && field.value);
    if (!projectKey) {
      return NextResponse.json(
        { error: "Selecione o projeto destino antes de enviar." },
        { status: 400 }
      );
    }
    if (validFields.length === 0 && !csvData) {
      return NextResponse.json(
        {
          error: "Envie o arquivo CSV de template ou preencha ao menos um campo personalizado.",
        },
        { status: 400 }
      );
    }
    payload = {
      projectKey,
      fields: validFields.length ? validFields : undefined,
      csvData: csvData || undefined,
      csvFileName: csvFileName || undefined,
    };
  }

  const record = createActionRequest({
    actionType,
    filterMode: normalizedFilterMode ?? "jql",
    filterValue: normalizedFilterValue ?? "",
    requestedStatus: nextRequestedStatus,
    payload,
    requester: {
      id: session.id,
      email: session.email,
      name: session.name,
    },
  });
  notifyAdminsOfRequest({
    record,
    requesterName: session.name,
    actionType,
    requestedStatus: nextRequestedStatus,
    payload,
  });

  return NextResponse.json(
    {
      request: serializeRequest(record),
    },
    { status: 201 }
  );
}

type UpdateRequestPayload = {
  id?: number;
  decision?: "approve" | "decline" | "return";
  notes?: string;
  action?: "delete";
};

export async function PATCH(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Apenas administradores podem aprovar ações." },
      { status: 403 }
    );
  }

  const body = (await request.json()) as UpdateRequestPayload | null;
  const id = body?.id;
  const decision = body?.decision;
  const action = body?.action;
  const notes = body?.notes?.trim();

  if (
    !id ||
    (!action && decision !== "approve" && decision !== "decline" && decision !== "return")
  ) {
    return NextResponse.json(
      { error: "Requisição inválida." },
      { status: 400 }
    );
  }

  if (action === "delete") {
    const deleted = deleteActionRequest(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Solicitação não encontrada." },
        { status: 404 }
      );
    }
    return NextResponse.json({ deleted: true });
  }

  if (!notes) {
    return NextResponse.json(
      { error: "Informe o motivo da aprovação ou declínio." },
      { status: 400 }
    );
  }

  const targetRequest = getActionRequestById(id);
  if (!targetRequest) {
    return NextResponse.json(
      { error: "Solicitação não encontrada." },
      { status: 404 }
    );
  }

  if (
    decision === "approve" &&
    ["status", "assignee", "comment"].includes(targetRequest.action_type)
  ) {
    const jiraConfig = getJiraConfig();
    if (!jiraConfig.url || !jiraConfig.token) {
      return NextResponse.json(
        { error: "Integração Jira não configurada." },
        { status: 400 }
      );
    }
    const isPaused = getIntegrationSetting("action_jobs_paused") === "true";
    const job = createActionExecutionJob(targetRequest.id);
    if (job?.id) {
      updateActionRequestExecutionStatus({ id: targetRequest.id, status: "queued" });
      if (!isPaused) {
        setTimeout(() => {
          void startQueuedJobs();
        }, 0);
      }
    }
  }

  const decisionStatus =
    decision === "approve"
      ? "approved"
      : decision === "return"
      ? "returned"
      : "declined";
  const newStatus =
    decision === "approve"
      ? "queued"
      : decision === "return"
      ? "returned"
      : "declined";
  const updated = updateActionRequestStatus({
    id,
    status: newStatus,
    approverName: session.name,
    auditNotes: notes,
    eventType: decisionStatus,
  });

  if (!updated) {
    return NextResponse.json(
      { error: "Solicitação não encontrada." },
      { status: 404 }
    );
  }

  notifyRequesterDecision({
    record: updated,
    decision: decisionStatus,
    approverName: session.name,
  });

  return NextResponse.json({
    request: updated ? serializeRequest(updated) : null,
  });
}
