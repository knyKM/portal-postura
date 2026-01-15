import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { requestVulnerabilityRetest } from "@/lib/vulnerabilities/vulnerability-service";

type RequestBody = {
  vulnerabilityId?: string;
  serverId?: string;
};

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as RequestBody | null;
  if (!payload?.vulnerabilityId || !payload?.serverId) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const retest = requestVulnerabilityRetest(payload.vulnerabilityId, payload.serverId);
  if (!retest) {
    return NextResponse.json({ error: "Vínculo não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ retest });
}
