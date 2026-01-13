import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getActionRequestById,
  updateActionRequestByRequester,
} from "@/lib/actions/action-request-service";

type ResubmitPayload = {
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

const ALLOWED_STATUS = ["Done", "Cancelado"];
const SUPPORTED_ACTIONS = [
  "status",
  "assignee",
  "comment",
  "fields",
  "escalate",
  "delete",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const { id } = await params;
  const requestId = Number(id);
  if (!requestId) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const record = getActionRequestById(requestId);
  if (!record) {
    return NextResponse.json({ error: "Solicitação não encontrada." }, { status: 404 });
  }

  if (record.requester_id !== session.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  if (record.status !== "returned") {
    return NextResponse.json(
      { error: "Apenas solicitações devolvidas podem ser reenviadas." },
      { status: 400 }
    );
  }

  const body = (await request.json().catch(() => null)) as ResubmitPayload | null;
  const actionType = body?.actionType ?? record.action_type;
  const filterMode = body?.filterMode ?? record.filter_mode;
  const filterValue = body?.filterValue?.trim() ?? record.filter_value;
  const requestedStatus = body?.requestedStatus ?? record.requested_status ?? undefined;

  if (!SUPPORTED_ACTIONS.includes(actionType)) {
    return NextResponse.json({ error: "Tipo de ação não suportado." }, { status: 400 });
  }

  if (actionType === "escalate") {
    if (!body?.projectKey?.trim()) {
      return NextResponse.json(
        { error: "Selecione o projeto destino." },
        { status: 400 }
      );
    }
  } else {
    if (!filterMode || !["jql", "ids"].includes(filterMode)) {
      return NextResponse.json({ error: "Filtro inválido." }, { status: 400 });
    }

    if (!filterValue) {
      return NextResponse.json(
        { error: "Informe o conjunto de issues." },
        { status: 400 }
      );
    }
  }

  let payload: Record<string, unknown> | null = null;
  let nextRequestedStatus: string | undefined = requestedStatus;

  if (actionType === "status") {
    if (!requestedStatus || !ALLOWED_STATUS.includes(requestedStatus)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }
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
      return NextResponse.json({ error: "Digite o comentário da ação." }, { status: 400 });
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
      return NextResponse.json({ error: "Informe ao menos um campo com valor." }, { status: 400 });
    }
    payload = { fields };
  } else if (actionType === "escalate") {
    const fields = (body?.fields ?? []).map((field) => ({
      key: field?.key?.trim() ?? "",
      value: field?.value?.trim() ?? "",
    }));
    const validFields = fields.filter((field) => field.key && field.value);
    if (validFields.length === 0 && !body?.csvData?.trim()) {
      return NextResponse.json(
        { error: "Envie o CSV ou preencha campos personalizados." },
        { status: 400 }
      );
    }
    payload = {
      fields: validFields.length ? validFields : undefined,
      csvData: body?.csvData?.trim() || undefined,
      csvFileName: body?.csvFileName?.trim() || undefined,
      projectKey: body?.projectKey?.trim() || undefined,
    };
    nextRequestedStatus = undefined;
  } else if (actionType === "delete") {
    nextRequestedStatus = undefined;
  }

  const updated = updateActionRequestByRequester({
    id: requestId,
    requesterId: session.id,
    actionType,
    filterMode: actionType === "escalate" ? "project" : filterMode,
    filterValue: actionType === "escalate" ? body?.projectKey?.trim() || "" : filterValue,
    requestedStatus: nextRequestedStatus,
    payload,
  });

  if (!updated) {
    return NextResponse.json({ error: "Não foi possível atualizar." }, { status: 400 });
  }

  return NextResponse.json({ request: updated });
}
