import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { listApprovalHistory } from "@/lib/actions/action-request-service";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? 100);
  const limit = Number.isNaN(limitParam)
    ? 100
    : Math.max(1, Math.min(500, limitParam));

  const history = listApprovalHistory(limit);

  return NextResponse.json({ history });
}
