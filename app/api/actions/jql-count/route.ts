import { NextResponse } from "next/server";
import { Agent } from "undici";
import { getSessionUser } from "@/lib/auth/session";
import { getIntegrationSetting } from "@/lib/settings/integration-settings";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const jql = searchParams.get("jql")?.trim() ?? "";
  if (!jql) {
    return NextResponse.json({ error: "Informe a JQL." }, { status: 400 });
  }

  const url = getIntegrationSetting("jira_url") ?? "";
  const token = getIntegrationSetting("jira_token") ?? "";
  const verifySetting = getIntegrationSetting("jira_verify_ssl");
  const verifySsl = verifySetting !== "false";

  if (!url || !token) {
    return NextResponse.json(
      { error: "Integração Jira não configurada." },
      { status: 400 }
    );
  }

  const baseUrl = url.replace(/\/+$/, "");
  const dispatcher = verifySsl
    ? undefined
    : new Agent({ connect: { rejectUnauthorized: false } });
  const response = await fetch(
    `${baseUrl}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=0`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      dispatcher,
    }
  );

  const raw = await response.text();
  let data: Record<string, unknown> | null = null;
  if (raw) {
    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      (data?.errorMessages as string[] | undefined)?.[0] ||
      (data?.error as string | undefined) ||
      (data?.message as string | undefined) ||
      raw ||
      "";
    return NextResponse.json(
      { error: message, status: response.status },
      { status: response.status }
    );
  }

  const total =
    typeof (data as { total?: unknown })?.total === "number"
      ? (data as { total: number }).total
      : 0;

  return NextResponse.json({ total, status: response.status });
}
