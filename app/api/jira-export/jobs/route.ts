import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { listJiraExportJobsByUser } from "@/lib/jira-export/export-service";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    const jobs = listJiraExportJobsByUser(session.id);
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("[jira-export:GET]", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as exportações." },
      { status: 500 }
    );
  }
}
