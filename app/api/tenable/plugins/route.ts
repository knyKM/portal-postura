import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/auth/database";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const records = db
    .prepare(
      `SELECT id, title, severity, description, remediation, score, external_id, last_synced_at
       FROM vulnerabilities
       WHERE source = 'tenable'
       ORDER BY id`
    )
    .all();

  return NextResponse.json({ plugins: records });
}
