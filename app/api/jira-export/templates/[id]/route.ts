import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { deleteJiraExportTemplate } from "@/lib/jira-export/template-service";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const { id } = await params;
  const templateId = Number(id);
  if (!templateId) {
    return NextResponse.json({ error: "Template inválido." }, { status: 400 });
  }

  const deleted = deleteJiraExportTemplate(templateId, session.id);
  if (!deleted) {
    return NextResponse.json({ error: "Template não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
