import { NextResponse } from "next/server";
import {
  getAutomationJobById,
  listAutomationLogsForJob,
  listAutomationSnapshot,
} from "@/lib/auditoria/automation-service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const jobId = url.searchParams.get("jobId");
    if (jobId) {
      const job = await getAutomationJobById(jobId);
      const logs = await listAutomationLogsForJob(jobId);
      return NextResponse.json(
        {
          job,
          logs,
          generatedAt: new Date().toISOString(),
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }
    const snapshot = await listAutomationSnapshot();
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[auditoria:snapshot]", error);
    return NextResponse.json(
      { error: "Não foi possível consultar os jobs monitorados." },
      { status: 500 }
    );
  }
}
