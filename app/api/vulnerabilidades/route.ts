import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  countVulnerabilities,
  listVulnerabilities,
  listVulnerabilitiesByIds,
  listVulnerabilityServers,
  listVulnerabilityLinks,
  countVulnerabilityLinks,
  listVulnerabilityLinksPaginated,
  listVulnerabilityEvents,
  listVulnerabilityRetests,
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
  const query = (url.searchParams.get("q") ?? "").trim();
  const mode = (url.searchParams.get("mode") ?? "unique").toLowerCase();

  let vulnerabilities = [] as ReturnType<typeof listVulnerabilities>;
  let links = [] as ReturnType<typeof listVulnerabilityLinks>;
  let events = [] as ReturnType<typeof listVulnerabilityEvents>;
  let retests = [] as ReturnType<typeof listVulnerabilityRetests>;
  let servers = [] as ReturnType<typeof listVulnerabilityServers>;
  let total = 0;

  if (mode === "by-asset") {
    if (!query) {
      total = countVulnerabilityLinks();
      links = listVulnerabilityLinksPaginated(limit, offset);
      const vulnerabilityIds = Array.from(
        new Set(links.map((link) => link.vulnerability_id))
      );
      const serverIds = Array.from(new Set(links.map((link) => link.server_id)));
      vulnerabilities = listVulnerabilitiesByIds(vulnerabilityIds);
      events = listVulnerabilityEvents(vulnerabilityIds);
      retests = listVulnerabilityRetests(vulnerabilityIds);
      servers = listVulnerabilityServers(serverIds);
    } else {
      const allVulnerabilities = listVulnerabilities();
      const allLinks = listVulnerabilityLinks();
      const allServers = listVulnerabilityServers();
      const serverById = Object.fromEntries(allServers.map((s) => [s.id, s]));
      const parsedQuery = parseQuery(query);
      const sortFilter = parsedQuery.filters.find((filter) =>
        ["sort", "order"].includes(filter.field)
      );
      const effectiveFilters = parsedQuery.filters.filter(
        (filter) => !["sort", "order"].includes(filter.field)
      );

      const enriched = allVulnerabilities.map((vuln) => {
        const entries = allLinks.filter((link) => link.vulnerability_id === vuln.id);
        const linkedServers = entries
          .map((entry) => {
            const server = serverById[entry.server_id];
            if (!server) return null;
            return { server, entry };
          })
          .filter(Boolean) as Array<{ server: (typeof allServers)[number]; entry: (typeof allLinks)[number] }>;

        const activeCount = linkedServers.filter(
          ({ entry }) => entry.status === "active"
        ).length;
        const resolvedCount = linkedServers.filter(
          ({ entry }) => entry.status === "resolved"
        ).length;
        const totalOccurrences = linkedServers.reduce(
          (sum, { entry }) => sum + entry.occurrences,
          0
        );
        const baseText = [
          vuln.id,
          vuln.title,
          vuln.description,
          vuln.observations,
          vuln.remediation,
          vuln.affected,
        ]
          .join(" ")
          .toLowerCase();

        const serverText = linkedServers
          .map(
            ({ server }) =>
              `${server.id} ${server.name} ${server.ip} ${server.environment ?? ""}`
          )
          .join(" ")
          .toLowerCase();

        return {
          vuln,
          linkedServers,
          metrics: {
            activeCount,
            resolvedCount,
            totalOccurrences,
            serverCount: linkedServers.length,
          },
          baseText,
          serverText,
        };
      });

      const filtered = enriched.filter((item) => {
        const termMatches = parsedQuery.terms.every(
          (term) => item.baseText.includes(term) || item.serverText.includes(term)
        );
        if (!termMatches) return false;

        return effectiveFilters.every((filter) => {
          switch (filter.field) {
            case "id":
            case "vuln":
              return matchesText(item.vuln.id, filter.value);
            case "title":
              return matchesText(item.vuln.title, filter.value);
            case "severity":
              return matchesText(item.vuln.severity, normalizeSeverityValue(filter.value));
            case "status": {
              const normalized = filter.value.toLowerCase();
              if (["open", "aberta", "ativo"].includes(normalized)) {
                return item.metrics.activeCount > 0;
              }
              if (["resolved", "corrigida"].includes(normalized)) {
                return item.metrics.resolvedCount > 0;
              }
              return true;
            }
            case "server": {
              return item.linkedServers.some(
                ({ server }) =>
                  matchesText(server.id, filter.value) ||
                  matchesText(server.name, filter.value)
              );
            }
            case "ip": {
              return item.linkedServers.some(({ server }) =>
                matchesText(server.ip, filter.value)
              );
            }
            case "env":
            case "environment": {
              return item.linkedServers.some(({ server }) =>
                matchesText(server.environment ?? "", filter.value)
              );
            }
            case "score":
              return matchesNumeric(item.vuln.score, filter);
            case "occurrences":
              return matchesNumeric(item.metrics.totalOccurrences, filter);
            case "open":
              return matchesNumeric(item.metrics.activeCount, filter);
            case "resolved":
              return matchesNumeric(item.metrics.resolvedCount, filter);
            case "servers":
              return matchesNumeric(item.metrics.serverCount, filter);
            default:
              return true;
          }
        });
      });

      if (sortFilter?.value) {
        const sortKey = sortFilter.value.toLowerCase();
        filtered.sort((a, b) => {
          switch (sortKey) {
            case "open":
            case "active":
              return b.metrics.activeCount - a.metrics.activeCount;
            case "resolved":
              return b.metrics.resolvedCount - a.metrics.resolvedCount;
            case "occurrences":
              return b.metrics.totalOccurrences - a.metrics.totalOccurrences;
            case "servers":
            case "assets":
              return b.metrics.serverCount - a.metrics.serverCount;
            case "score":
              return b.vuln.score - a.vuln.score;
            default:
              return 0;
          }
        });
      }

      const filteredIds = filtered.map((item) => item.vuln.id);
      const filteredLinks = allLinks.filter((link) =>
        filteredIds.includes(link.vulnerability_id)
      );

      total = filteredLinks.length;
      links = filteredLinks.slice(offset, offset + limit);
      const vulnerabilityIds = Array.from(
        new Set(links.map((link) => link.vulnerability_id))
      );
      const serverIds = Array.from(new Set(links.map((link) => link.server_id)));
      vulnerabilities = listVulnerabilitiesByIds(vulnerabilityIds);
      events = listVulnerabilityEvents(vulnerabilityIds);
      retests = listVulnerabilityRetests(vulnerabilityIds);
      servers = listVulnerabilityServers(serverIds);
    }
  } else if (!query) {
    total = countVulnerabilities();
    vulnerabilities = listVulnerabilities(limit, offset);
    const vulnerabilityIds = vulnerabilities.map((item) => item.id);
    links = listVulnerabilityLinks(vulnerabilityIds);
    events = listVulnerabilityEvents(vulnerabilityIds);
    retests = listVulnerabilityRetests(vulnerabilityIds);
    const serverIds = Array.from(new Set(links.map((link) => link.server_id)));
    servers = listVulnerabilityServers(serverIds);
  } else {
    const allVulnerabilities = listVulnerabilities();
    const allLinks = listVulnerabilityLinks();
    const allServers = listVulnerabilityServers();
    const serverById = Object.fromEntries(allServers.map((s) => [s.id, s]));
    const parsedQuery = parseQuery(query);
    const sortFilter = parsedQuery.filters.find((filter) =>
      ["sort", "order"].includes(filter.field)
    );
    const effectiveFilters = parsedQuery.filters.filter(
      (filter) => !["sort", "order"].includes(filter.field)
    );

    const enriched = allVulnerabilities.map((vuln) => {
      const entries = allLinks.filter((link) => link.vulnerability_id === vuln.id);
      const linkedServers = entries
        .map((entry) => {
          const server = serverById[entry.server_id];
          if (!server) return null;
          return { server, entry };
        })
        .filter(Boolean) as Array<{ server: (typeof allServers)[number]; entry: (typeof allLinks)[number] }>;

      const activeCount = linkedServers.filter(
        ({ entry }) => entry.status === "active"
      ).length;
      const resolvedCount = linkedServers.filter(
        ({ entry }) => entry.status === "resolved"
      ).length;
      const totalOccurrences = linkedServers.reduce(
        (sum, { entry }) => sum + entry.occurrences,
        0
      );
      const baseText = [
        vuln.id,
        vuln.title,
        vuln.description,
        vuln.observations,
        vuln.remediation,
        vuln.affected,
      ]
        .join(" ")
        .toLowerCase();

      const serverText = linkedServers
        .map(
          ({ server }) =>
            `${server.id} ${server.name} ${server.ip} ${server.environment ?? ""}`
        )
        .join(" ")
        .toLowerCase();

      return {
        vuln,
        linkedServers,
        metrics: {
          activeCount,
          resolvedCount,
          totalOccurrences,
          serverCount: linkedServers.length,
        },
        baseText,
        serverText,
      };
    });

    const filtered = enriched.filter((item) => {
      const termMatches = parsedQuery.terms.every(
        (term) => item.baseText.includes(term) || item.serverText.includes(term)
      );
      if (!termMatches) return false;

      return effectiveFilters.every((filter) => {
        switch (filter.field) {
          case "id":
          case "vuln":
            return matchesText(item.vuln.id, filter.value);
          case "title":
            return matchesText(item.vuln.title, filter.value);
          case "severity":
            return matchesText(item.vuln.severity, normalizeSeverityValue(filter.value));
          case "status": {
            const normalized = filter.value.toLowerCase();
            if (["open", "aberta", "ativo"].includes(normalized)) {
              return item.metrics.activeCount > 0;
            }
            if (["resolved", "corrigida"].includes(normalized)) {
              return item.metrics.resolvedCount > 0;
            }
            return true;
          }
          case "server": {
            return item.linkedServers.some(
              ({ server }) =>
                matchesText(server.id, filter.value) ||
                matchesText(server.name, filter.value)
            );
          }
          case "ip": {
            return item.linkedServers.some(({ server }) =>
              matchesText(server.ip, filter.value)
            );
          }
          case "env":
          case "environment": {
            return item.linkedServers.some(({ server }) =>
              matchesText(server.environment ?? "", filter.value)
            );
          }
          case "score":
            return matchesNumeric(item.vuln.score, filter);
          case "occurrences":
            return matchesNumeric(item.metrics.totalOccurrences, filter);
          case "open":
            return matchesNumeric(item.metrics.activeCount, filter);
          case "resolved":
            return matchesNumeric(item.metrics.resolvedCount, filter);
          case "servers":
            return matchesNumeric(item.metrics.serverCount, filter);
          default:
            return true;
        }
      });
    });

    if (sortFilter?.value) {
      const sortKey = sortFilter.value.toLowerCase();
      filtered.sort((a, b) => {
        switch (sortKey) {
          case "open":
          case "active":
            return b.metrics.activeCount - a.metrics.activeCount;
          case "resolved":
            return b.metrics.resolvedCount - a.metrics.resolvedCount;
          case "occurrences":
            return b.metrics.totalOccurrences - a.metrics.totalOccurrences;
          case "servers":
          case "assets":
            return b.metrics.serverCount - a.metrics.serverCount;
          case "score":
            return b.vuln.score - a.vuln.score;
          default:
            return 0;
        }
      });
    }

    total = filtered.length;
    vulnerabilities = filtered.slice(offset, offset + limit).map((item) => item.vuln);
    const vulnerabilityIds = vulnerabilities.map((item) => item.id);
    links = allLinks.filter((link) => vulnerabilityIds.includes(link.vulnerability_id));
    events = listVulnerabilityEvents(vulnerabilityIds);
    retests = listVulnerabilityRetests(vulnerabilityIds);
    const serverIds = Array.from(new Set(links.map((link) => link.server_id)));
    servers = listVulnerabilityServers(serverIds);
  }

  return NextResponse.json({
    vulnerabilities,
    servers,
    links,
    events,
    retests,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}

type QueryFilter = {
  field: string;
  op: ":" | "=" | ">" | "<" | ">=" | "<=";
  value: string;
};

type ParsedQuery = {
  terms: string[];
  filters: QueryFilter[];
};

function splitQuery(input: string) {
  const tokens: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === "\"") {
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && /\s/.test(char)) {
      if (current.trim()) {
        tokens.push(current.trim());
      }
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) {
    tokens.push(current.trim());
  }
  return tokens;
}

function parseQuery(input: string): ParsedQuery {
  const tokens = splitQuery(input);
  const filters: QueryFilter[] = [];
  const terms: string[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const lowerToken = token.toLowerCase();
    if (lowerToken === "and" || lowerToken === "&&") {
      continue;
    }
    const match = token.match(/^([a-zA-Z_]+)(:|>=|<=|=|>|<)(.*)$/);
    if (match) {
      const [, rawField, op, rawValue] = match;
      let value = rawValue.trim();
      if (!value && i + 1 < tokens.length) {
        value = tokens[i + 1].trim();
        if (value) {
          i += 1;
        }
      }
      filters.push({
        field: rawField.toLowerCase(),
        op: op as QueryFilter["op"],
        value,
      });
    } else {
      terms.push(token.toLowerCase());
    }
  }
  return { terms, filters };
}

function matchesNumeric(value: number, filter: QueryFilter) {
  const target = Number(filter.value.replace(",", "."));
  if (Number.isNaN(target)) return true;
  switch (filter.op) {
    case ">":
      return value > target;
    case "<":
      return value < target;
    case ">=":
      return value >= target;
    case "<=":
      return value <= target;
    case "=":
    case ":":
    default:
      return value === target;
  }
}

function normalizeSearchValue(value: string) {
  const trimmed = value.trim();
  const withoutQuotes = trimmed.replace(/^"(.*)"$/, "$1");
  return withoutQuotes;
}

function matchesText(target: string, rawValue: string) {
  const value = normalizeSearchValue(rawValue).toLowerCase();
  if (!value) return true;
  const text = target.toLowerCase();
  if (value.includes("*")) {
    const pattern = value.replace(/\*/g, "");
    if (!pattern) return true;
    return text.includes(pattern);
  }
  return text.includes(value);
}

function normalizeSeverityValue(value: string) {
  const raw = normalizeSearchValue(value).toLowerCase();
  if (raw === "critical") return "crítica";
  if (raw === "critica") return "crítica";
  if (raw === "high") return "alta";
  if (raw === "medium") return "média";
  if (raw === "media") return "média";
  if (raw === "low") return "baixa";
  return raw;
}
