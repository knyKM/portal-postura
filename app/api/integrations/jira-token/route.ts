import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getIntegrationSetting,
  setIntegrationSetting,
} from "@/lib/settings/integration-settings";

const DEFAULT_JIRA_MAX_RESULTS = 200;

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const token = getIntegrationSetting("jira_token");
  const url = getIntegrationSetting("jira_url");
  const verifySsl = getIntegrationSetting("jira_verify_ssl");
  const maxResultsRaw = getIntegrationSetting("jira_max_results");
  const maxResults = Number(maxResultsRaw ?? DEFAULT_JIRA_MAX_RESULTS);
  return NextResponse.json({
    token: token ?? "",
    url: url ?? "",
    verifySsl: verifySsl !== "false",
    maxResults: Number.isFinite(maxResults) ? maxResults : DEFAULT_JIRA_MAX_RESULTS,
  });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as
    | { token?: string; url?: string; verifySsl?: boolean; maxResults?: number }
    | null;

  const token = body?.token?.trim() ?? "";
  const url = body?.url?.trim() ?? "";
  const verifySsl = body?.verifySsl ?? true;
  const maxResultsValue =
    typeof body?.maxResults === "number" ? body.maxResults : DEFAULT_JIRA_MAX_RESULTS;
  const normalizedMaxResults = Number.isFinite(maxResultsValue)
    ? Math.max(1, Math.floor(maxResultsValue))
    : DEFAULT_JIRA_MAX_RESULTS;

  if (!url) {
    return NextResponse.json(
      { error: "Informe a URL base do Jira." },
      { status: 400 }
    );
  }

  if (!token) {
    setIntegrationSetting("jira_token", null);
    setIntegrationSetting("jira_url", url);
    setIntegrationSetting("jira_verify_ssl", verifySsl ? "true" : "false");
    setIntegrationSetting("jira_max_results", String(normalizedMaxResults));
    return NextResponse.json({
      token: "",
      url,
      verifySsl,
      maxResults: normalizedMaxResults,
    });
  }

  setIntegrationSetting("jira_token", token);
  setIntegrationSetting("jira_url", url);
  setIntegrationSetting("jira_verify_ssl", verifySsl ? "true" : "false");
  setIntegrationSetting("jira_max_results", String(normalizedMaxResults));
  return NextResponse.json({
    token,
    url,
    verifySsl,
    maxResults: normalizedMaxResults,
  });
}
