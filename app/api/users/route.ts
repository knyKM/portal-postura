import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createUser,
  findUserByEmail,
  listUsers,
} from "@/lib/auth/user-service";
import { getSecurityLevelByKey } from "@/lib/security/security-level-service";
import { createPasswordResetToken } from "@/lib/auth/password-reset-service";
import { getLocalTimestamp } from "@/lib/utils/time";

const ALLOWED_ROLES = ["admin", "analista", "leitor"] as const;

type CreateUserRequest = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  securityLevel?: string;
};

export async function GET(request: Request) {
  const sessionUser = await getSessionUser(request.headers.get("cookie") ?? undefined);

  if (!sessionUser) {
    return NextResponse.json(
      { error: "Não autorizado." },
      { status: 401 }
    );
  }

  if (sessionUser.role !== "admin") {
    return NextResponse.json(
      { error: "Permissão insuficiente." },
      { status: 403 }
    );
  }

  const users = listUsers().map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    security_level: user.security_level,
    created_at: user.created_at,
    is_active: Boolean(user.is_active),
  }));

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const sessionUser = await getSessionUser(request.headers.get("cookie") ?? undefined);

  if (!sessionUser) {
    return NextResponse.json(
      { error: "Não autorizado." },
      { status: 401 }
    );
  }

  if (sessionUser.role !== "admin") {
    return NextResponse.json(
      { error: "Permissão insuficiente." },
      { status: 403 }
    );
  }

  const payload = (await request.json()) as CreateUserRequest | null;
  const name = payload?.name?.trim();
  const email = payload?.email?.trim().toLowerCase();
  const password = payload?.password ?? "";
  const role = payload?.role ?? "analista";
  const securityLevel = payload?.securityLevel ?? "padrao";

  if (!name || name.length < 3) {
    return NextResponse.json(
      { error: "Nome inválido." },
      { status: 400 }
    );
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "E-mail inválido." },
      { status: 400 }
    );
  }

  const usePassword =
    typeof password === "string" && password.trim().length >= 8
      ? password.trim()
      : `Temp#${Math.random().toString(36).slice(2, 12)}!`;

  if (!ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number])) {
    return NextResponse.json(
      { error: "Perfil inválido." },
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

  const existing = findUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "Já existe um usuário com este e-mail." },
      { status: 409 }
    );
  }

  try {
    const user = createUser({
      name,
      email,
      password: usePassword,
      role,
      securityLevel,
    });
    const expiresAt = getLocalTimestamp(new Date(Date.now() + 24 * 60 * 60 * 1000));
    const token = createPasswordResetToken(user.id, expiresAt);
    const baseUrl = process.env.APP_BASE_URL?.replace(/\/+$/, "");
    const resetLink = baseUrl
      ? `${baseUrl}/setup-senha?token=${token}`
      : `/setup-senha?token=${token}`;

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          security_level: user.security_level,
          is_active: Boolean(user.is_active),
          created_at: user.created_at,
        },
        resetLink,
        resetExpiresAt: expiresAt,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar usuário." },
      { status: 500 }
    );
  }
}
