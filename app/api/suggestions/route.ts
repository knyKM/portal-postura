import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createSuggestion,
  listSuggestions,
  SuggestionRecord,
  updateSuggestionStatus,
  deleteSuggestion,
  updateSuggestionStage,
} from "@/lib/suggestions/suggestion-service";

function serialize(record: SuggestionRecord) {
  return {
    id: record.id,
    userId: record.user_id,
    userEmail: record.user_email,
    userName: record.user_name,
    content: record.content,
    status: record.status,
    implementationStage: record.implementation_stage,
    createdAt: record.created_at,
  };
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json(
      { error: "Sessão expirada. Faça login novamente." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const rawContent =
    typeof body?.content === "string" ? body.content.trim() : "";

  if (!rawContent) {
    return NextResponse.json(
      { error: "Descreva a sugestão antes de enviar." },
      { status: 400 }
    );
  }

  if (rawContent.length > 2000) {
    return NextResponse.json(
      {
        error: "Resuma sua ideia em até 2000 caracteres para conseguirmos avaliar.",
      },
      { status: 400 }
    );
  }

  try {
    const record = createSuggestion({
      userId: session.id,
      userEmail: session.email,
      userName: session.name,
      content: rawContent,
    });

    return NextResponse.json(
      { success: true, suggestion: serialize(record) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[suggestions:POST]", error);
    return NextResponse.json(
      { error: "Falha ao registrar a sugestão. Tente novamente." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json(
      { error: "Sessão expirada. Faça login novamente." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? 100);
  const limit = Number.isNaN(limitParam)
    ? 100
    : Math.max(1, Math.min(200, limitParam));
  const statusParam = searchParams.get("status");
  const normalizedStatus =
    statusParam === "pending" ||
    statusParam === "approved" ||
    statusParam === "completed"
      ? statusParam
      : undefined;

  try {
    let records = listSuggestions({ limit, status: normalizedStatus }).map(serialize);
    if (session.role !== "admin") {
      records = records.filter(
        (suggestion) =>
          suggestion.status === "approved" ||
          suggestion.status === "pending" ||
          suggestion.status === "completed"
      );
    }
    return NextResponse.json({ suggestions: records });
  } catch (error) {
    console.error("[suggestions:GET]", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as sugestões." },
      { status: 500 }
    );
  }
}

  type UpdateSuggestionPayload = {
  id?: number;
  status?: "approved" | "pending" | "completed";
  implementationStage?: string;
};

export async function PATCH(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json(
      { error: "Sessão expirada. Faça login novamente." },
      { status: 401 }
    );
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Apenas administradores podem atualizar sugestões." },
      { status: 403 }
    );
  }

  const payload = (await request.json().catch(() => null)) as
    | UpdateSuggestionPayload
    | null;

  const id = Number(payload?.id);
  if (!payload || !Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { error: "Informe um identificador de sugestão válido." },
      { status: 400 }
    );
  }

  try {
    let record: SuggestionRecord | null = null;
    if (payload.status) {
      if (
        payload.status !== "approved" &&
        payload.status !== "pending" &&
        payload.status !== "completed"
      ) {
        return NextResponse.json(
          { error: "Status inválido informado." },
          { status: 400 }
        );
      }
      record = updateSuggestionStatus(
        id,
        payload.status,
        payload.implementationStage
      );
    } else if (payload.implementationStage) {
      record = updateSuggestionStage(id, payload.implementationStage);
    } else {
      return NextResponse.json(
        { error: "Nenhuma alteração foi solicitada." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, suggestion: serialize(record) });
  } catch (error) {
    console.error("[suggestions:PATCH]", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar a sugestão." },
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
    return NextResponse.json(
      { error: "Sessão expirada. Faça login novamente." },
      { status: 401 }
    );
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Apenas administradores podem remover sugestões." },
      { status: 403 }
    );
  }

  const payload = (await request.json().catch(() => null)) as DeletePayload | null;
  const idParam = payload?.id ?? Number(new URL(request.url).searchParams.get("id"));
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { error: "Informe um identificador válido para exclusão." },
      { status: 400 }
    );
  }

  try {
    deleteSuggestion(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[suggestions:DELETE]", error);
    return NextResponse.json(
      { error: "Não foi possível remover a sugestão." },
      { status: 500 }
    );
  }
}
