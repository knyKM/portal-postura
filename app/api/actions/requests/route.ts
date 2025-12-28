import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createActionRequest,
  listPendingRequests,
  listRecentRequests,
  listCompletedRequests,
  listUserRequests,
  updateActionRequestStatus,
  ActionRequestRecord,
} from "@/lib/actions/action-request-service";
import { listAdmins } from "@/lib/auth/user-service";
import { createNotification } from "@/lib/notifications/notification-service";

type ActionRequestPayload = {
  actionType?: string;
  filterMode?: string;
  filterValue?: string;
  requestedStatus?: string;
  assignee?: string;
  comment?: string;
  fields?: Array<{ key: string; value: string }>;
  projectKey?: string;
  csvData?: string;
  csvFileName?: string;
};

const ALLOWED_STATUS = ["DONE", "Cancelado"];
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
      return payload?.assignee
        ? `${ACTION_LABELS.assignee} para ${payload.assignee}`
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
  decision: "approved" | "declined";
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
        : "Solicitação declinada",
    message: `Sua solicitação #${record.id} para ${summary} foi ${
      decision === "approved" ? "aprovada" : "declinada"
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
      statusFilter === "completed"
        ? statusFilter
        : undefined;
    const userRequests = listUserRequests({
      userId: session.id,
      status: normalizedStatus as
        | "pending"
        | "approved"
        | "declined"
        | "completed"
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
    const assignee = body?.assignee?.trim();
    if (!assignee) {
      return NextResponse.json(
        { error: "Informe o novo responsável." },
        { status: 400 }
      );
    }
    payload = { assignee };
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
  decision?: "approve" | "decline";
  notes?: string;
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
  const notes = body?.notes?.trim();

  if (!id || (decision !== "approve" && decision !== "decline")) {
    return NextResponse.json(
      { error: "Requisição inválida." },
      { status: 400 }
    );
  }

  if (!notes) {
    return NextResponse.json(
      { error: "Informe o motivo da aprovação ou declínio." },
      { status: 400 }
    );
  }

  const newStatus = decision === "approve" ? "approved" : "declined";
  const updated = updateActionRequestStatus({
    id,
    status: newStatus,
    approverName: session.name,
    auditNotes: notes,
  });

  if (!updated) {
    return NextResponse.json(
      { error: "Solicitação não encontrada." },
      { status: 404 }
    );
  }

  notifyRequesterDecision({
    record: updated,
    decision: newStatus,
    approverName: session.name,
  });

  return NextResponse.json({
    request: updated ? serializeRequest(updated) : null,
  });
}
