import { NextResponse } from "next/server";
import { createAuthToken, verifyMfaToken } from "@/lib/auth/tokens";
import { findUserById, updateUserLastSeen } from "@/lib/auth/user-service";
import { getSecurityLevelByKey } from "@/lib/security/security-level-service";
import { checkMfaCode } from "@/lib/auth/mfa-utils";

type VerifyRequest = {
  token?: string;
  code?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as VerifyRequest | null;
  const token = body?.token;
  const code = body?.code?.trim();

  if (!token || !code) {
    return NextResponse.json(
      { error: "Token e código são obrigatórios." },
      { status: 400 }
    );
  }

  let payload;
  try {
    payload = verifyMfaToken(token, "verify");
  } catch {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  const user = findUserById(payload.sub);

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  if (!user.mfa_secret || !user.mfa_enabled) {
    return NextResponse.json(
      { error: "MFA não configurado. Reinicie o processo de login." },
      { status: 400 }
    );
  }

  const isValid = checkMfaCode(user.mfa_secret, code);

  if (!isValid) {
    return NextResponse.json({ error: "Código inválido." }, { status: 400 });
  }

  const authToken = createAuthToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const level = getSecurityLevelByKey(user.security_level);
  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      security_level: user.security_level,
      allowed_routes: level?.allowedRoutes ?? [],
      is_active: Boolean(user.is_active),
    },
  });
  updateUserLastSeen(user.id);

  response.cookies.set({
    name: "postura_auth",
    value: authToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
  });

  return response;
}
