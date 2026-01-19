import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/auth/database";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const scans = db
    .prepare(
      `SELECT scan_id, name, status, scan_type, last_modification_date, updated_at
       FROM tenable_scans
       ORDER BY last_modification_date DESC`
    )
    .all();

  return NextResponse.json({ scans });
}
