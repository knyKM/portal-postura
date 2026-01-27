import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getIntegrationSetting, setIntegrationSetting } from "@/lib/settings/integration-settings";

function parsePrefixes(value?: string | null) {
  if (!value) return [];
  return value
    .split(/[\n,;]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }
  const raw = getIntegrationSetting("tenable_scan_prefixes") ?? "";
  return NextResponse.json({ prefixes: parsePrefixes(raw).join(", ") });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as
    | { prefixes?: string }
    | null;
  const prefixes = typeof body?.prefixes === "string" ? body.prefixes.trim() : "";
  setIntegrationSetting("tenable_scan_prefixes", prefixes);
  return NextResponse.json({ prefixes });
}
