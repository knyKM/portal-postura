import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getIntegrationSetting } from "@/lib/settings/integration-settings";
import { syncDashboardJqlResults } from "@/lib/dashboards/jira-dashboard-sync";

const TOKEN_KEY = "dashboard_jira_token";
const URL_KEY = "dashboard_jira_url";

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Apenas administradores podem executar." }, { status: 403 });
  }

  try {
    const token = getIntegrationSetting(TOKEN_KEY) ?? "";
    const jiraUrl = getIntegrationSetting(URL_KEY) ?? "";

    const result = await syncDashboardJqlResults({ jiraUrl, token });
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.status ?? 500 });
    }

    return NextResponse.json({
      message: result.message,
      totals: result.totals,
    });
  } catch (error) {
    console.error("[dashboards:sync-jira]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao sincronizar." },
      { status: 500 }
    );
  }
}
