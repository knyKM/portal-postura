import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getIntegrationSetting,
  setIntegrationSetting,
} from "@/lib/settings/integration-settings";

type Payload = {
  target?: "plugins" | "scans";
  paused?: boolean;
};

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as Payload | null;
  if (!payload || typeof payload.paused !== "boolean") {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const target = payload.target === "scans" ? "scans" : "plugins";
  const key =
    target === "scans" ? "tenable_scans_paused" : "tenable_plugins_paused";
  setIntegrationSetting(key, payload.paused ? "true" : "false");

  return NextResponse.json({
    target,
    paused: payload.paused,
  });
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  const url = new URL(request.url);
  const target = url.searchParams.get("target") === "scans" ? "scans" : "plugins";
  const key =
    target === "scans" ? "tenable_scans_paused" : "tenable_plugins_paused";
  const paused = getIntegrationSetting(key) === "true";

  return NextResponse.json({
    target,
    paused,
  });
}
