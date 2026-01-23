import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getJiraExportJobById,
  updateJiraExportJobStatus,
} from "@/lib/jira-export/export-service";

export async function PATCH(
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
  if (job.status === "completed") {
    return NextResponse.json(
      { error: "Exportação já foi concluída." },
      { status: 400 }
    );
  }
  if (job.status === "failed") {
    return NextResponse.json(
      { error: "Exportação já falhou." },
      { status: 400 }
    );
  }
  if (job.status === "canceled") {
    return NextResponse.json(
      { error: "Exportação já foi cancelada." },
      { status: 400 }
    );
  }

  const updated = updateJiraExportJobStatus({
    id: jobId,
    status: "canceled",
    errorMessage: "Cancelado pelo usuário.",
  });

  return NextResponse.json({ job: updated });
}
