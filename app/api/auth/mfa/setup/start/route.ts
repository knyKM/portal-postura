import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { verifyMfaToken } from "@/lib/auth/tokens";
import {
  findUserById,
  upsertUserMfaSecret,
} from "@/lib/auth/user-service";
import { createMfaSecret, getMfaOtpauthUrl } from "@/lib/auth/mfa-utils";

type StartSetupRequest = {
  token?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as StartSetupRequest | null;
  const token = body?.token;

  if (!token) {
    return NextResponse.json({ error: "Token ausente." }, { status: 400 });
  }

  let payload;
  try {
    payload = verifyMfaToken(token, "setup");
  } catch {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  const user = findUserById(payload.sub);

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  if (user.mfa_enabled) {
    return NextResponse.json(
      { error: "MFA já configurado para este usuário." },
      { status: 400 }
    );
  }

  let secret = user.mfa_secret;
  let otpauthUrl: string;

  if (!secret) {
    const generated = createMfaSecret(user.email);
    secret = generated.secret;
    otpauthUrl = generated.otpauthUrl;
    upsertUserMfaSecret(user.id, secret);
  } else {
    otpauthUrl = getMfaOtpauthUrl(user.email, secret);
  }

  const qrCode = await QRCode.toDataURL(otpauthUrl, {
    margin: 1,
    width: 240,
  });

  return NextResponse.json({
    secret,
    otpauthUrl,
    qrCode,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}
