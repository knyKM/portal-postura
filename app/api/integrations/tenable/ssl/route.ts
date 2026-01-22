import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getIntegrationSetting, setIntegrationSetting } from "@/lib/settings/integration-settings";

function parseBool(value: string | null) {
  if (!value) return true;
  return !["false", "0", "no"].includes(value.toLowerCase());
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const raw = getIntegrationSetting("tenable_verify_ssl");
  return NextResponse.json({ verifySsl: parseBool(raw) });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Permissão insuficiente." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { verifySsl?: boolean } | null;
  if (typeof body?.verifySsl !== "boolean") {
    return NextResponse.json(
      { error: "Informe o valor de verificação SSL." },
      { status: 400 }
    );
  }
  setIntegrationSetting("tenable_verify_ssl", String(body.verifySsl));
  return NextResponse.json({ verifySsl: body.verifySsl });
}
