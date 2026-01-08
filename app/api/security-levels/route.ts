"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createSecurityLevel,
  listSecurityLevels,
} from "@/lib/security/security-level-service";

type CreatePayload = {
  name?: string;
  description?: string;
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
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Nome inválido." }, { status: 400 });
  }

  try {
    const level = createSecurityLevel({
      name,
      description: description || null,
    });
    return NextResponse.json({ level }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar nível." },
      { status: 400 }
    );
  }
}
