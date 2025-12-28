"use server";

import { NextResponse } from "next/server";
import {
  updateAutomationJobMetadata,
  updateAutomationJobStatus,
} from "@/lib/auditoria/automation-service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const jobId = params?.id;
    if (!jobId) {
      return NextResponse.json({ error: "ID do job não informado." }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const statusCode = Number(body?.status);
    if (!Number.isFinite(statusCode)) {
      return NextResponse.json(
        { error: "Informe o status (0=falhou, 1=sucesso, 2=em execução)." },
        { status: 400 }
      );
    }

    const queueSeconds = Number(body?.queueSeconds);
    const pendingIssues = Number(body?.pendingIssues);
    const durationSeconds = Number(body?.durationSeconds);
    const lastRunAt =
      typeof body?.lastRunAt === "string" && body.lastRunAt.trim().length > 0
        ? body.lastRunAt
        : undefined;
    const logMessage =
      typeof body?.logMessage === "string" && body.logMessage.trim().length > 0
        ? body.logMessage.trim()
        : undefined;
    const logLevel =
      typeof body?.logLevel === "string" && body.logLevel.trim().length > 0
        ? body.logLevel.trim()
        : undefined;

    const job = await updateAutomationJobStatus(jobId, {
      statusCode,
      queueSeconds: Number.isFinite(queueSeconds) ? queueSeconds : undefined,
      pendingIssues: Number.isFinite(pendingIssues) ? pendingIssues : undefined,
      durationSeconds: Number.isFinite(durationSeconds) ? durationSeconds : undefined,
      lastRunAt,
      logMessage,
      logLevel,
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error("[auditoria:update-job]", error);
    const message =
      error instanceof Error ? error.message : "Falha ao atualizar status do job.";
    const status = /não encontrado/i.test(message)
      ? 404
      : /status inválido/i.test(message)
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const jobId = params?.id;
    if (!jobId) {
      return NextResponse.json({ error: "ID do job não informado." }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Informe dados para atualizar o job." }, { status: 400 });
    }

    const updates = {
      name:
        typeof body.name === "string" && body.name.trim().length > 0
          ? body.name
          : undefined,
      owner:
        typeof body.owner === "string" && body.owner.trim().length > 0
          ? body.owner
          : undefined,
      description:
        typeof body.description === "string" ? body.description : undefined,
      queueSeconds: Number.isFinite(Number(body.queueSeconds))
        ? Number(body.queueSeconds)
        : undefined,
      pendingIssues: Number.isFinite(Number(body.pendingIssues))
        ? Number(body.pendingIssues)
        : undefined,
    };

    const job = await updateAutomationJobMetadata(jobId, updates);
    return NextResponse.json({ job });
  } catch (error) {
    console.error("[auditoria:update-job-metadata]", error);
    const message =
      error instanceof Error ? error.message : "Não foi possível atualizar o job.";
    const status = /não encontrado/i.test(message) ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
