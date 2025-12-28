import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getIntegrationSetting,
  setIntegrationSetting,
} from "@/lib/settings/integration-settings";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const token = getIntegrationSetting("jira_token");
  const url = getIntegrationSetting("jira_url");
  return NextResponse.json({ token: token ?? "", url: url ?? "" });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as
    | { token?: string; url?: string }
    | null;

  const token = body?.token?.trim() ?? "";
  const url = body?.url?.trim() ?? "";

  if (!url) {
    return NextResponse.json(
      { error: "Informe a URL base do Jira." },
      { status: 400 }
    );
  }

  if (!token) {
    setIntegrationSetting("jira_token", null);
    setIntegrationSetting("jira_url", url);
    return NextResponse.json({ token: "", url });
  }

  setIntegrationSetting("jira_token", token);
  setIntegrationSetting("jira_url", url);
  return NextResponse.json({ token, url });
}
