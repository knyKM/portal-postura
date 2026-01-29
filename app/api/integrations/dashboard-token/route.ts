import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getIntegrationSetting, setIntegrationSetting } from "@/lib/settings/integration-settings";

const KEY = "dashboard_jira_token";
const URL_KEY = "dashboard_jira_url";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }
  try {
    const token = getIntegrationSetting(KEY) ?? "";
    const url = getIntegrationSetting(URL_KEY) ?? "";
    return NextResponse.json({ token, url });
  } catch (error) {
    console.error("[dashboard-token:GET]", error);
    return NextResponse.json(
      { error: "Não foi possível carregar o token." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Apenas administradores podem alterar." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as
    | { token?: string; url?: string }
    | null;
  if (!body) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  try {
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const url = typeof body.url === "string" ? body.url.trim() : "";
    setIntegrationSetting(KEY, token || null);
    setIntegrationSetting(URL_KEY, url || null);
    return NextResponse.json({ token, url });
  } catch (error) {
    console.error("[dashboard-token:POST]", error);
    return NextResponse.json(
      { error: "Não foi possível salvar o token." },
      { status: 500 }
    );
  }
}
