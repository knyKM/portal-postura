import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createJiraExportTemplate,
  listJiraExportTemplates,
} from "@/lib/jira-export/template-service";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }
  const templates = listJiraExportTemplates(session.id);
  return NextResponse.json({ templates });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { name?: string; fields?: string[] }
    | null;
  const name = payload?.name?.trim() ?? "";
  const fields = Array.isArray(payload?.fields) ? payload?.fields : [];

  if (!name) {
    return NextResponse.json({ error: "Informe o nome do template." }, { status: 400 });
  }
  if (!fields.length) {
    return NextResponse.json(
      { error: "Selecione ao menos um campo para salvar o template." },
      { status: 400 }
    );
  }

  const template = createJiraExportTemplate({
    userId: session.id,
    name,
    fields,
  });

  return NextResponse.json({ template }, { status: 201 });
}
