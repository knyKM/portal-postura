"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getSecurityLevelByKey } from "@/lib/security/security-level-service";
import { updateUserSecurityLevel } from "@/lib/auth/user-service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateUserRequest = {
  securityLevel?: string;
};

export async function PATCH(request: Request, context: RouteContext) {
  const sessionUser = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!sessionUser) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (sessionUser.role !== "admin") {
    return NextResponse.json({ error: "Permissão insuficiente." }, { status: 403 });
  }

  const params = await context.params;
  const userId = Number(params?.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json({ error: "Usuário inválido." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as UpdateUserRequest | null;
  const securityLevel = payload?.securityLevel;
  if (!securityLevel) {
    return NextResponse.json(
      { error: "Informe o nível de segurança." },
      { status: 400 }
    );
  }

  const level = getSecurityLevelByKey(securityLevel);
  if (!level) {
    return NextResponse.json(
      { error: "Nível de segurança inválido." },
      { status: 400 }
    );
  }

  const updated = updateUserSecurityLevel(userId, securityLevel);
  if (!updated) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      security_level: updated.security_level,
      is_active: Boolean(updated.is_active),
    },
  });
}
