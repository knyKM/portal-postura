import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createActionRequestMessage,
  getActionRequestById,
  listActionRequestMessages,
} from "@/lib/actions/action-request-service";

export async function GET(
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

  if (session.role !== "admin" && record.requester_id !== session.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const messages = listActionRequestMessages(requestId);
  return NextResponse.json({ messages });
}

export async function POST(
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

  if (session.role !== "admin" && record.requester_id !== session.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  if (["completed", "failed", "declined", "cancelled"].includes(record.status)) {
    return NextResponse.json(
      { error: "Chat encerrado para este chamado." },
      { status: 400 }
    );
  }

  const body = (await request.json().catch(() => null)) as { message?: string } | null;
  const message = body?.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Mensagem inválida." }, { status: 400 });
  }

  const created = createActionRequestMessage({
    requestId,
    senderId: session.id,
    senderName: session.name,
    senderRole: session.role,
    message,
  });

  return NextResponse.json({ message: created });
}
