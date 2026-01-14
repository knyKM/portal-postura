import { NextResponse } from "next/server";
import { createMfaToken } from "@/lib/auth/tokens";
import {
  findUserByEmail,
  validateUserCredentials,
} from "@/lib/auth/user-service";
import { getSecurityLevelByKey } from "@/lib/security/security-level-service";

type LoginRequest = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginRequest | null;

  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Credenciais inválidas." },
      { status: 400 }
    );
  }

  const existingUser = findUserByEmail(email);

  if (!existingUser) {
    return NextResponse.json(
      { error: "E-mail ou senha incorretos." },
      { status: 401 }
    );
  }

  if (!existingUser.is_active) {
    return NextResponse.json(
      { error: "Usuário inativo. Solicite a um administrador para reativar." },
      { status: 403 }
    );
  }

  const user = validateUserCredentials(email, password);

  if (!user) {
    return NextResponse.json(
      { error: "E-mail ou senha incorretos." },
      { status: 401 }
    );
  }

  const level = getSecurityLevelByKey(existingUser.security_level);
  const baseUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    security_level: user.security_level,
    allowed_routes: level?.allowedRoutes ?? [],
    is_active: Boolean(user.is_active),
  };

  if (!user.mfa_secret || !user.mfa_enabled) {
    const setupToken = createMfaToken({
      sub: user.id,
      email: user.email,
      purpose: "setup",
    });
    return NextResponse.json({
      mfaSetupRequired: true,
      token: setupToken,
      user: baseUser,
    });
  }

  const mfaToken = createMfaToken({
    sub: user.id,
    email: user.email,
    purpose: "verify",
  });

  return NextResponse.json({
    mfaRequired: true,
    token: mfaToken,
    user: baseUser,
  });
}
