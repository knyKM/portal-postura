import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  linkVulnerabilityToServer,
  listEventsForLink,
} from "@/lib/vulnerabilities/vulnerability-service";

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    vulnerabilityId?: string;
    serverId?: string;
  } | null;

  const vulnerabilityId = body?.vulnerabilityId?.trim();
  const serverId = body?.serverId?.trim();

  if (!vulnerabilityId || !serverId) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const link = linkVulnerabilityToServer(vulnerabilityId, serverId);
  if (!link) {
    return NextResponse.json({ error: "Vínculo inválido." }, { status: 400 });
  }

  return NextResponse.json({
    link,
    events: listEventsForLink(vulnerabilityId, serverId),
  });
}
