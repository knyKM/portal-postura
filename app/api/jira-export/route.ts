import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { createJiraExportJob } from "@/lib/jira-export/export-service";
import { runJiraExportJob } from "@/lib/jira-export/jira-export-runner";

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { jql?: string; fields?: string[] }
    | null;
  const jql = payload?.jql?.trim() ?? "";
  const fields = Array.isArray(payload?.fields) ? payload?.fields : [];

  if (!jql) {
    return NextResponse.json({ error: "Informe a JQL para exportar." }, { status: 400 });
  }
  if (!fields.length) {
    return NextResponse.json(
      { error: "Selecione ao menos um campo para exportação." },
      { status: 400 }
    );
  }

  const job = createJiraExportJob({
    requesterId: session.id,
    jql,
    fields,
  });

  if (job?.id) {
    setTimeout(() => {
      void runJiraExportJob(job.id);
    }, 0);
  }

  return NextResponse.json({ job });
}
