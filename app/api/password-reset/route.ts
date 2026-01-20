import { NextResponse } from "next/server";
import { getPasswordResetToken, markPasswordResetUsed, updateUserPassword } from "@/lib/auth/password-reset-service";

type ResetPayload = {
  token?: string;
  password?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as ResetPayload | null;
  const token = payload?.token?.trim() ?? "";
  const password = payload?.password ?? "";

  if (!token) {
    return NextResponse.json({ error: "Token inválido." }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "A senha deve ter pelo menos 8 caracteres." },
      { status: 400 }
    );
  }

  const record = getPasswordResetToken(token);
  if (!record) {
    return NextResponse.json({ error: "Token não encontrado." }, { status: 404 });
  }
  if (record.used_at) {
    return NextResponse.json({ error: "Token já utilizado." }, { status: 400 });
  }

  const expiresAt = new Date(record.expires_at);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Token expirado." }, { status: 410 });
  }

  updateUserPassword(record.user_id, password);
  markPasswordResetUsed(token);

  return NextResponse.json({ ok: true });
}
