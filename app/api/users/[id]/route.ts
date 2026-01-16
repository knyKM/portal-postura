"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getSecurityLevelByKey } from "@/lib/security/security-level-service";
import { deleteUser, updateUserRole, updateUserSecurityLevel } from "@/lib/auth/user-service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateUserRequest = {
  securityLevel?: string;
  role?: string;
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
  const role = payload?.role;
  if (!securityLevel && !role) {
    return NextResponse.json(
      { error: "Informe o nível de segurança ou perfil." },
      { status: 400 }
    );
  }

  if (securityLevel) {
    const level = getSecurityLevelByKey(securityLevel);
    if (!level) {
      return NextResponse.json(
        { error: "Nível de segurança inválido." },
        { status: 400 }
      );
    }
  }

  if (role && !["admin", "analista", "leitor"].includes(role)) {
    return NextResponse.json({ error: "Perfil inválido." }, { status: 400 });
  }

  let updated = null;
  if (securityLevel && role) {
    const first = updateUserSecurityLevel(userId, securityLevel);
    updated = first ? updateUserRole(userId, role) : null;
  } else if (securityLevel) {
    updated = updateUserSecurityLevel(userId, securityLevel);
  } else if (role) {
    updated = updateUserRole(userId, role);
  }
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

export async function DELETE(request: Request, context: RouteContext) {
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

  if (sessionUser.id === userId) {
    return NextResponse.json(
      { error: "Você não pode excluir o próprio usuário conectado." },
      { status: 400 }
    );
  }

  const deleted = deleteUser(userId);
  if (!deleted) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
