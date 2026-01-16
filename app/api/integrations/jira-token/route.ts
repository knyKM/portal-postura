import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getUserJiraSettings,
  updateUserJiraSettings,
} from "@/lib/auth/user-service";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const settings = getUserJiraSettings(session.id);
  return NextResponse.json({
    token: settings?.jira_token ?? "",
    url: settings?.jira_url ?? "",
    verifySsl: settings?.jira_verify_ssl !== "false",
  });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { token?: string; url?: string; verifySsl?: boolean }
    | null;

  const token = body?.token?.trim() ?? "";
  const url = body?.url?.trim() ?? "";
  const verifySsl = body?.verifySsl ?? true;
  if (!url) {
    return NextResponse.json(
      { error: "Informe a URL base do Jira." },
      { status: 400 }
    );
  }

  const updated = updateUserJiraSettings(session.id, {
    url,
    token: token || null,
    verifySsl,
  });
  if (!updated) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }
  return NextResponse.json({
    token: updated.jira_token ?? "",
    url: updated.jira_url ?? "",
    verifySsl: updated.jira_verify_ssl !== "false",
  });
}
