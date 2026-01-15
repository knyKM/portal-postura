import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  listVulnerabilities,
  listVulnerabilityServers,
  listVulnerabilityLinks,
  listVulnerabilityEvents,
  listVulnerabilityRetests,
} from "@/lib/vulnerabilities/vulnerability-service";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  return NextResponse.json({
    vulnerabilities: listVulnerabilities(),
    servers: listVulnerabilityServers(),
    links: listVulnerabilityLinks(),
    events: listVulnerabilityEvents(),
    retests: listVulnerabilityRetests(),
  });
}
