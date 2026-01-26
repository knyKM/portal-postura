import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getIntegrationSetting, setIntegrationSetting } from "@/lib/settings/integration-settings";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  return NextResponse.json({
    host: getIntegrationSetting("tenable_proxy_host") ?? "",
    port: getIntegrationSetting("tenable_proxy_port") ?? "",
  });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { host?: string; port?: string | number }
    | null;
  const host = payload?.host?.trim() ?? "";
  const portRaw = payload?.port ?? "";
  const portValue = String(portRaw).trim();
  const portNumber = Number(portValue);

  if (!host || !portValue || !Number.isFinite(portNumber) || portNumber <= 0) {
    return NextResponse.json(
      { error: "Informe host e porta válidos para o proxy." },
      { status: 400 }
    );
  }

  setIntegrationSetting("tenable_proxy_host", host);
  setIntegrationSetting("tenable_proxy_port", String(Math.trunc(portNumber)));

  return NextResponse.json({ host, port: String(Math.trunc(portNumber)) });
}
