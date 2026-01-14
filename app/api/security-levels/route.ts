"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createSecurityLevel,
  deleteSecurityLevel,
  listSecurityLevels,
  updateSecurityLevel,
} from "@/lib/security/security-level-service";
import { countUsersBySecurityLevel } from "@/lib/auth/user-service";

type CreatePayload = {
  name?: string;
  description?: string;
  allowedRoutes?: string[];
};

type UpdatePayload = {
  key?: string;
  name?: string;
  description?: string;
  allowedRoutes?: string[];
};

type DeletePayload = {
  key?: string;
};

export async function GET(request: Request) {
  const sessionUser = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!sessionUser) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Permissão insuficiente." }, { status: 403 });
  }
  return NextResponse.json({ levels: listSecurityLevels() });
}

export async function POST(request: Request) {
  const sessionUser = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!sessionUser) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Permissão insuficiente." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as CreatePayload | null;
  const name = payload?.name?.trim() ?? "";
  const description = payload?.description?.trim() ?? "";
  const allowedRoutes = Array.isArray(payload?.allowedRoutes)
    ? payload?.allowedRoutes.filter((route) => typeof route === "string" && route.trim())
    : [];
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Nome inválido." }, { status: 400 });
  }
  if (allowedRoutes.length === 0) {
    return NextResponse.json(
      { error: "Selecione ao menos um módulo para o nível." },
      { status: 400 }
    );
  }

  try {
    const level = createSecurityLevel({
      name,
      description: description || null,
      allowedRoutes,
    });
    return NextResponse.json({ level }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar nível." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  const sessionUser = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!sessionUser) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Permissão insuficiente." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as UpdatePayload | null;
  const key = payload?.key?.trim() ?? "";
  const name = payload?.name?.trim() ?? "";
  const description = payload?.description?.trim() ?? "";
  const allowedRoutes = Array.isArray(payload?.allowedRoutes)
    ? payload?.allowedRoutes.filter((route) => typeof route === "string" && route.trim())
    : [];

  if (!key || !name || name.length < 2) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
  if (allowedRoutes.length === 0) {
    return NextResponse.json(
      { error: "Selecione ao menos um módulo para o nível." },
      { status: 400 }
    );
  }

  try {
    const level = updateSecurityLevel({
      key,
      name,
      description: description || null,
      allowedRoutes,
    });
    return NextResponse.json({ level });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao atualizar nível." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const sessionUser = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!sessionUser) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Permissão insuficiente." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as DeletePayload | null;
  const key = payload?.key?.trim() ?? "";
  if (!key) {
    return NextResponse.json({ error: "Informe o nível." }, { status: 400 });
  }

  const inUse = countUsersBySecurityLevel(key);
  if (inUse > 0) {
    return NextResponse.json(
      { error: "Não é possível excluir um nível em uso por usuários." },
      { status: 400 }
    );
  }

  const deleted = deleteSecurityLevel(key);
  if (!deleted) {
    return NextResponse.json({ error: "Nível não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
