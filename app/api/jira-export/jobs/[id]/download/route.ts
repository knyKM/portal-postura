import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import { getSessionUser } from "@/lib/auth/session";
import { getJiraExportJobById } from "@/lib/jira-export/export-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const { id } = await params;
  const jobId = Number(id);
  if (!jobId) {
    return NextResponse.json({ error: "Exportação inválida." }, { status: 400 });
  }

  const job = getJiraExportJobById(jobId);
  if (!job || job.requester_id !== session.id) {
    return NextResponse.json({ error: "Exportação não encontrada." }, { status: 404 });
  }
  if (job.status !== "completed" || !job.file_path) {
    return NextResponse.json(
      { error: "Exportação ainda não está pronta." },
      { status: 400 }
    );
  }

  if (job.expires_at) {
    const expiresAt = new Date(job.expires_at);
    if (!Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Exportação expirada. Gere um novo relatório." },
        { status: 410 }
      );
    }
  }

  try {
    const buffer = await fs.readFile(job.file_path);
    const filename = job.file_name ?? `jira-export-${job.id}.xlsx`;
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Não foi possível baixar o arquivo." },
      { status: 500 }
    );
  }
}
