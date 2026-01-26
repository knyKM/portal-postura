import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getActionExecutionJobById,
  updateJobStatus,
} from "@/lib/actions/action-job-service";
import {
  updateActionRequestExecutionStatus,
  updateActionRequestStatus,
} from "@/lib/actions/action-request-service";
import { startQueuedJobs } from "@/lib/actions/jira-action-runner";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { id } = await params;
  const jobId = Number(id);
  if (!jobId) {
    return NextResponse.json({ error: "Job inválido." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { paused?: boolean; resume?: boolean; retry?: boolean; action?: "return" | "cancel"; notes?: string }
    | null;

  if (
    !payload ||
    (typeof payload.paused !== "boolean" &&
      !payload.resume &&
      !payload.retry &&
      payload.action !== "return" &&
      payload.action !== "cancel")
  ) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const job = getActionExecutionJobById(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job não encontrado." }, { status: 404 });
  }

  if (payload.resume) {
    if (job.status !== "paused") {
      return NextResponse.json({ error: "Job não está pausado." }, { status: 400 });
    }
    updateJobStatus({ id: jobId, status: "queued" });
    updateActionRequestExecutionStatus({ id: job.request_id, status: "queued" });
    setTimeout(() => {
      void startQueuedJobs();
    }, 0);
    return NextResponse.json({ job: getActionExecutionJobById(jobId) });
  }

  if (payload.retry) {
    if (job.status !== "frozen") {
      return NextResponse.json({ error: "Job não está congelado." }, { status: 400 });
    }
    updateJobStatus({ id: jobId, status: "queued", errorMessage: null, errorStatusCode: null });
    updateActionRequestExecutionStatus({
      id: job.request_id,
      status: "queued",
      errorMessage: null,
      errorStatusCode: null,
    });
    setTimeout(() => {
      void startQueuedJobs();
    }, 0);
    return NextResponse.json({ job: getActionExecutionJobById(jobId) });
  }

  if (payload.action === "return") {
    const notes = payload.notes?.trim();
    if (!notes) {
      return NextResponse.json({ error: "Informe a justificativa da devolução." }, { status: 400 });
    }
    updateJobStatus({ id: jobId, status: "returned", errorMessage: notes });
    updateActionRequestStatus({
      id: job.request_id,
      status: "returned",
      approverName: session.name,
      auditNotes: notes,
      eventType: "returned",
    });
    return NextResponse.json({ job: getActionExecutionJobById(jobId) });
  }

  if (payload.action === "cancel") {
    const notes = payload.notes?.trim();
    if (!notes) {
      return NextResponse.json({ error: "Informe a justificativa do cancelamento." }, { status: 400 });
    }
    updateJobStatus({ id: jobId, status: "cancelled", errorMessage: notes });
    updateActionRequestStatus({
      id: job.request_id,
      status: "cancelled",
      approverName: session.name,
      auditNotes: notes,
      eventType: "cancelled",
    });
    return NextResponse.json({ job: getActionExecutionJobById(jobId) });
  }

  if (payload.paused) {
    if (job.status !== "running") {
      return NextResponse.json(
        { error: "Apenas jobs em execução podem ser pausados." },
        { status: 400 }
      );
    }
    updateJobStatus({ id: jobId, status: "paused" });
    updateActionRequestExecutionStatus({ id: job.request_id, status: "paused" });
    return NextResponse.json({ job: getActionExecutionJobById(jobId) });
  }

  return NextResponse.json({ job: getActionExecutionJobById(jobId) });
}
