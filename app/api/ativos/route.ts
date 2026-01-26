import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  countVulnerabilityServers,
  listVulnerabilityLinksByServerIds,
  listVulnerabilityServers,
  listVulnerabilityServersPaginated,
} from "@/lib/vulnerabilities/vulnerability-service";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = Math.max(1, Number(url.searchParams.get("limit") ?? 10));
  const offset = (page - 1) * limit;
  const query = (url.searchParams.get("q") ?? "").trim().toLowerCase();

  let servers = [] as ReturnType<typeof listVulnerabilityServers>;
  let total = 0;

  if (query) {
    const allServers = listVulnerabilityServers();
    const filtered = allServers.filter((server) => {
      const text = `${server.id} ${server.name} ${server.ip} ${server.environment ?? ""}`.toLowerCase();
      return text.includes(query);
    });
    total = filtered.length;
    servers = filtered.slice(offset, offset + limit);
  } else {
    total = countVulnerabilityServers();
    servers = listVulnerabilityServersPaginated(limit, offset);
  }

  const serverIds = servers.map((server) => server.id);
  const links = listVulnerabilityLinksByServerIds(serverIds);
  const linksByServer = links.reduce<Record<string, typeof links>>((acc, link) => {
    const current = acc[link.server_id] ?? [];
    current.push(link);
    acc[link.server_id] = current;
    return acc;
  }, {});

  const serversWithCounts = servers.map((server) => {
    const entries = linksByServer[server.id] ?? [];
    const activeCount = entries.filter((item) => item.status === "active").length;
    const resolvedCount = entries.filter((item) => item.status === "resolved").length;
    return {
      ...server,
      counts: {
        active: activeCount,
        resolved: resolvedCount,
        total: entries.length,
      },
    };
  });

  return NextResponse.json({
    servers: serversWithCounts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}
