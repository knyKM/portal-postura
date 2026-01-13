import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/auth/database";
import { listActionExecutionJobs } from "@/lib/actions/action-job-service";
import { setIntegrationSetting, getIntegrationSetting } from "@/lib/settings/integration-settings";
import { startQueuedJobs } from "@/lib/actions/jira-action-runner";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get("settings") === "1") {
    return NextResponse.json({
      paused: getIntegrationSetting("action_jobs_paused") === "true",
      maxParallel: Number(getIntegrationSetting("action_jobs_max_parallel") ?? 3),
    });
  }
  const status = searchParams.get("status") ?? "running";
  const limitParam = Number(searchParams.get("limit") ?? 50);
  const limit = Number.isNaN(limitParam) ? 50 : Math.max(1, Math.min(200, limitParam));

  const jobs =
    status === "all" ? listActionExecutionJobs(undefined, limit) : listActionExecutionJobs(status, limit);
  const stmt = db.prepare(
    `SELECT action_requests.id, action_requests.action_type, action_requests.requested_status
     FROM action_requests
     WHERE action_requests.id = ?`
  );

  const enriched = jobs.map((job) => {
    const request = stmt.get(job.request_id) as
      | { id: number; action_type: string; requested_status: string | null }
      | undefined;
    return {
      ...job,
      action_type: request?.action_type ?? null,
      requested_status: request?.requested_status ?? null,
    };
  });

  return NextResponse.json({ jobs: enriched });
}

export async function PATCH(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as
    | { paused?: boolean; resume?: boolean; maxParallel?: number }
    | null;
  const paused = body?.paused;
  const resume = body?.resume;
  const maxParallel = body?.maxParallel;

  if (typeof paused !== "boolean" && !resume && typeof maxParallel !== "number") {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  if (typeof paused === "boolean") {
    setIntegrationSetting("action_jobs_paused", paused ? "true" : "false");
  }

  if (typeof maxParallel === "number") {
    const normalized = Number.isFinite(maxParallel)
      ? Math.max(1, Math.floor(maxParallel))
      : 3;
    setIntegrationSetting("action_jobs_max_parallel", String(normalized));
  }

  if (resume) {
    setIntegrationSetting("action_jobs_paused", "false");
    setTimeout(() => {
      void startQueuedJobs();
    }, 0);
    return NextResponse.json({ resumed: true });
  }

  return NextResponse.json({
    paused: getIntegrationSetting("action_jobs_paused") === "true",
    maxParallel: Number(getIntegrationSetting("action_jobs_max_parallel") ?? 3),
  });
}
