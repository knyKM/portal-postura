import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getActionRequestById,
  updateActionRequestFilterValue,
} from "@/lib/actions/action-request-service";

function parseIssueIds(raw: string) {
  return raw
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
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
  if (record.action_type !== "status") {
    return NextResponse.json(
      { error: "Apenas solicitações de alterar status são suportadas." },
      { status: 400 }
    );
  }
  if (record.filter_mode !== "ids") {
    return NextResponse.json(
      { error: "Apenas solicitações por IDs podem ser ajustadas." },
      { status: 400 }
    );
  }

  const payload = (await request.json().catch(() => null)) as
    | { removeIds?: string[] }
    | null;
  const removeIds = Array.isArray(payload?.removeIds) ? payload?.removeIds : [];
  if (!removeIds.length) {
    return NextResponse.json(
      { error: "Informe os IDs que devem ser removidos." },
      { status: 400 }
    );
  }

  const existingIds = parseIssueIds(record.filter_value);
  const removeSet = new Set(removeIds.map((item) => item.trim()));
  const remaining = existingIds.filter((item) => !removeSet.has(item));
  if (!remaining.length) {
    return NextResponse.json(
      { error: "Não é possível remover todos os IDs do chamado." },
      { status: 400 }
    );
  }

  const updated = updateActionRequestFilterValue({
    id: record.id,
    filterMode: "ids",
    filterValue: remaining.join(", "),
    actorName: session.name,
    message: `Removidos ${removeIds.length} IDs cancelados.`,
  });

  return NextResponse.json({ request: updated });
}
