"use server";

import { NextResponse } from "next/server";
import { createAutomationJob } from "@/lib/auditoria/automation-service";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const name = typeof payload?.name === "string" ? payload.name.trim() : "";
    const owner = typeof payload?.owner === "string" ? payload.owner.trim() : "";
    const description =
      typeof payload?.description === "string" ? payload.description.trim() : undefined;
    const queueSeconds = Number(payload?.queueSeconds);
    const pendingIssues = Number(payload?.pendingIssues);

    if (!name || !owner) {
      return NextResponse.json(
        { error: "Informe nome do job e responsável/owner." },
        { status: 400 }
      );
    }

    const job = await createAutomationJob({
      name,
      owner,
      description,
      queueSeconds: Number.isFinite(queueSeconds) ? Math.max(0, queueSeconds) : 0,
      pendingIssues: Number.isFinite(pendingIssues) ? Math.max(0, pendingIssues) : 0,
    });

    return NextResponse.json(
      {
        job,
        endpoint: `/api/auditoria/jobs/${job.id}/status`,
        instructions:
          "Envie POST com { status: 0 | 1 | 2 } para atualizar (0=falhou, 1=sucesso, 2=em execução).",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[auditoria:create-job]", error);
    return NextResponse.json(
      { error: "Não foi possível criar um novo job monitorado." },
      { status: 500 }
    );
  }
}
