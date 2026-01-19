import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getIntegrationSetting, setIntegrationSetting } from "@/lib/settings/integration-settings";

function parseBool(value: string | null) {
  return value === "true";
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  const pluginsAuto = parseBool(getIntegrationSetting("tenable_plugins_auto"));
  const scansAuto = parseBool(getIntegrationSetting("tenable_scans_auto"));

  return NextResponse.json({ pluginsAuto, scansAuto });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { pluginsAuto, scansAuto } = body as {
    pluginsAuto?: boolean;
    scansAuto?: boolean;
  };

  if (typeof pluginsAuto === "boolean") {
    setIntegrationSetting("tenable_plugins_auto", String(pluginsAuto));
  }
  if (typeof scansAuto === "boolean") {
    setIntegrationSetting("tenable_scans_auto", String(scansAuto));
  }

  return NextResponse.json({
    pluginsAuto: parseBool(getIntegrationSetting("tenable_plugins_auto")),
    scansAuto: parseBool(getIntegrationSetting("tenable_scans_auto")),
  });
}
