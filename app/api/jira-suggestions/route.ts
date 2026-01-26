import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createJiraSuggestion,
  listJiraSuggestions,
  updateJiraSuggestionStatus,
  deleteJiraSuggestion,
  JiraSuggestionRecord,
} from "@/lib/suggestions/jira-suggestion-service";

function serialize(record: JiraSuggestionRecord) {
  return {
    id: record.id,
    type: record.type,
    title: record.title,
    description: record.description,
    status: record.status,
    requesterId: record.requester_id,
    requesterName: record.requester_name,
    requesterEmail: record.requester_email,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  try {
    const records = listJiraSuggestions().map(serialize);
    return NextResponse.json({ suggestions: records });
  } catch (error) {
    console.error("[jira-suggestions:GET]", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as solicitações Jira." },
      { status: 500 }
    );
  }
}

type CreatePayload = {
  type?: "sugestao" | "problema";
  title?: string;
  description?: string;
};

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as CreatePayload | null;
  const type = payload?.type === "problema" ? "problema" : "sugestao";
  const title = typeof payload?.title === "string" ? payload.title.trim() : "";
  const description =
    typeof payload?.description === "string" ? payload.description.trim() : "";

  if (!title || !description) {
    return NextResponse.json(
      { error: "Informe título e descrição." },
      { status: 400 }
    );
  }

  if (title.length > 120) {
    return NextResponse.json(
      { error: "O título deve ter até 120 caracteres." },
      { status: 400 }
    );
  }

  if (description.length > 2000) {
    return NextResponse.json(
      { error: "A descrição deve ter até 2000 caracteres." },
      { status: 400 }
    );
  }

  try {
    const record = createJiraSuggestion({
      type,
      title,
      description,
      requesterId: session.id,
      requesterName: session.name,
      requesterEmail: session.email,
    });
    return NextResponse.json({ suggestion: serialize(record) }, { status: 201 });
  } catch (error) {
    console.error("[jira-suggestions:POST]", error);
    return NextResponse.json(
      { error: "Não foi possível registrar a solicitação." },
      { status: 500 }
    );
  }
}

type UpdatePayload = {
  id?: number;
  status?: JiraSuggestionRecord["status"];
};

export async function PATCH(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as UpdatePayload | null;
  const id = Number(payload?.id);
  const status = payload?.status;
  const allowedStatuses = ["aberto", "em_analise", "em_execucao", "concluido"];

  if (!Number.isInteger(id) || id <= 0 || !status) {
    return NextResponse.json(
      { error: "Informe id e status válidos." },
      { status: 400 }
    );
  }

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Status inválido." },
      { status: 400 }
    );
  }

  try {
    const record = updateJiraSuggestionStatus(id, status);
    if (!record) {
      return NextResponse.json({ error: "Solicitação não encontrada." }, { status: 404 });
    }
    return NextResponse.json({ suggestion: serialize(record) });
  } catch (error) {
    console.error("[jira-suggestions:PATCH]", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar a solicitação." },
      { status: 500 }
    );
  }
}

type DeletePayload = {
  id?: number;
};

export async function DELETE(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as DeletePayload | null;
  const idParam = payload?.id ?? Number(new URL(request.url).searchParams.get("id"));
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Informe um id válido." }, { status: 400 });
  }

  try {
    deleteJiraSuggestion(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[jira-suggestions:DELETE]", error);
    return NextResponse.json(
      { error: "Não foi possível remover a solicitação." },
      { status: 500 }
    );
  }
}
