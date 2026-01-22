import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getIntegrationSetting, setIntegrationSetting } from "@/lib/settings/integration-settings";

function parseExpiringDays(value: string | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 30;
  return Math.min(365, Math.floor(parsed));
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }
  const raw = getIntegrationSetting("contracts_expiring_days");
  return NextResponse.json({ expiringDays: parseExpiringDays(raw) });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Permissão insuficiente." }, { status: 403 });
  }
  const body = (await request.json().catch(() => null)) as
    | { expiringDays?: number }
    | null;
  const expiringDays = Number(body?.expiringDays);
  if (!Number.isFinite(expiringDays) || expiringDays <= 0) {
    return NextResponse.json(
      { error: "Informe um prazo válido em dias." },
      { status: 400 }
    );
  }
  const normalized = Math.min(365, Math.floor(expiringDays));
  setIntegrationSetting("contracts_expiring_days", String(normalized));
  return NextResponse.json({ expiringDays: normalized });
}
