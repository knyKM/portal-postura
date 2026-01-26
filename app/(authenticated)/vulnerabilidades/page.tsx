"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { ASSIGNEE_CUSTOM_FIELDS } from "@/lib/actions/assignee-fields";

type Vulnerability = {
  id: string;
  title: string;
  severity: "Crítica" | "Alta" | "Média" | "Baixa";
  description: string;
  observations: string;
  remediation: string;
  affected: string;
  score: number;
  cve?: string | null;
  cpe?: string | null;
  cvss4_base_score?: number | null;
  cvss4_temporal_score?: number | null;
  cvss3_base_score?: number | null;
  cvss3_temporal_score?: number | null;
  cvss_temporal_score?: number | null;
};

type Server = {
  id: string;
  name: string;
  ip: string;
  environment: string;
};

type LinkEntry = {
  status: "active" | "resolved";
  occurrences: number;
  resolvedCount: number;
  lastChangedAt: string;
  occurrenceDates: string[];
  resolvedDates: string[];
};

type QueryFilter = {
  field: string;
  op: ":" | "=" | ">" | "<" | ">=" | "<=";
  value: string;
};

type ParsedQuery = {
  terms: string[];
  filters: QueryFilter[];
};

type LinkRecord = {
  vulnerability_id: string;
  server_id: string;
  status: "active" | "resolved";
  occurrences: number;
  resolved_count: number;
  first_detected_at: string | null;
  last_changed_at: string | null;
};

type LinkEventRecord = {
  vulnerability_id: string;
  server_id: string;
  event_type: "detected" | "resolved" | "reopened";
  event_at: string;
};

type RetestRecord = {
  id: number;
  vulnerability_id: string;
  server_id: string;
  status: "requested" | "passed" | "failed";
  requested_at: string;
  retested_at: string | null;
};

export default function VulnerabilidadesPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [links, setLinks] = useState<Record<string, Record<string, LinkEntry>>>(
    {}
  );
  const [retests, setRetests] = useState<RetestRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [queryDraft, setQueryDraft] = useState("");
  const [showQuerySuggestions, setShowQuerySuggestions] = useState(false);
  const queryInputRef = useRef<HTMLInputElement | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"unique" | "by-asset">("unique");
  const [historyModal, setHistoryModal] = useState<{
    vulnerabilityId: string;
    serverId: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
      setAuthorized(true);
    } catch {
      router.replace("/login");
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const serverById = useMemo(
    () =>
      servers.reduce<Record<string, Server>>((acc, server) => {
        acc[server.id] = server;
        return acc;
      }, {}),
    [servers]
  );

  const demoServerOwners: Record<string, Record<string, string>> = useMemo(
    () =>
      servers.reduce((acc, server, index) => {
        const ownerSuffix = String(index + 1).padStart(2, "0");
        const values: Record<string, string> = {};
        ASSIGNEE_CUSTOM_FIELDS.forEach((field, fieldIndex) => {
          values[field.id] = `Responsável ${fieldIndex + 1}-${ownerSuffix}`;
        });
        acc[server.id] = values;
        return acc;
      }, {} as Record<string, Record<string, string>>),
    [servers]
  );
  const severityBadgeClasses: Record<Vulnerability["severity"], string> = {
    Crítica: "bg-rose-500/15 text-rose-300 border-rose-500/40",
    Alta: "bg-orange-500/15 text-orange-300 border-orange-500/40",
    Média: "bg-amber-500/15 text-amber-200 border-amber-500/40",
    Baixa: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
  };

  function normalizeSeverityLabel(value: string) {
    const normalized = value.toLowerCase();
    if (normalized === "critical") return "Crítica";
    if (normalized === "high") return "Alta";
    if (normalized === "medium") return "Média";
    if (normalized === "low") return "Baixa";
    if (normalized === "crítica") return "Crítica";
    if (normalized === "alta") return "Alta";
    if (normalized === "média" || normalized === "media") return "Média";
    if (normalized === "baixa") return "Baixa";
    return value as Vulnerability["severity"];
  }

  function formatScore(value?: number | null) {
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    return value.toFixed(1);
  }

  function getServerCounters(serverId: string) {
    let open = 0;
    let resolved = 0;
    Object.values(links).forEach((entries) => {
      const entry = entries?.[serverId];
      if (!entry) return;
      if (entry.status === "active") {
        open += 1;
      } else {
        resolved += 1;
      }
    });
    return { open, resolved };
  }

  function ensureEntry(vulnId: string, serverId: string) {
    void (async () => {
      setDataError(null);
      try {
        const response = await fetch("/api/vulnerabilidades/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vulnerabilityId: vulnId, serverId }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Falha ao vincular ativo.");
        }
        await fetchData();
      } catch (err) {
        setDataError(err instanceof Error ? err.message : "Falha ao vincular ativo.");
      }
    })();
  }

  function resolveEntry(vulnId: string, serverId: string) {
    void (async () => {
      setDataError(null);
      try {
        const response = await fetch("/api/vulnerabilidades/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vulnerabilityId: vulnId, serverId }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Falha ao marcar correção.");
        }
        await fetchData();
      } catch (err) {
        setDataError(err instanceof Error ? err.message : "Falha ao marcar correção.");
      }
    })();
  }

  function requestRetest(vulnId: string, serverId: string) {
    void (async () => {
      setDataError(null);
      try {
        const response = await fetch("/api/vulnerabilidades/retest/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vulnerabilityId: vulnId, serverId }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Falha ao solicitar reteste.");
        }
        await fetchData();
      } catch (err) {
        setDataError(err instanceof Error ? err.message : "Falha ao solicitar reteste.");
      }
    })();
  }

  function completeRetest(vulnId: string, serverId: string, result: "passed" | "failed") {
    void (async () => {
      setDataError(null);
      try {
        const response = await fetch("/api/vulnerabilidades/retest/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vulnerabilityId: vulnId, serverId, result }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Falha ao registrar reteste.");
        }
        await fetchData();
      } catch (err) {
        setDataError(err instanceof Error ? err.message : "Falha ao registrar reteste.");
      }
    })();
  }

  function formatDate(value?: string | null) {
    if (!value) return "-";
    return new Date(value).toLocaleString("pt-BR");
  }

  function buildLinkMap(linkRecords: LinkRecord[], eventRecords: LinkEventRecord[]) {
    const eventMap = new Map<
      string,
      { occurrenceDates: string[]; resolvedDates: string[] }
    >();
    eventRecords.forEach((event) => {
      const key = `${event.vulnerability_id}::${event.server_id}`;
      const entry = eventMap.get(key) ?? {
        occurrenceDates: [],
        resolvedDates: [],
      };
      if (event.event_type === "resolved") {
        entry.resolvedDates.push(event.event_at);
      } else {
        entry.occurrenceDates.push(event.event_at);
      }
      eventMap.set(key, entry);
    });

    return linkRecords.reduce<Record<string, Record<string, LinkEntry>>>(
      (acc, record) => {
        const key = `${record.vulnerability_id}::${record.server_id}`;
        const events = eventMap.get(key) ?? {
          occurrenceDates: [],
          resolvedDates: [],
        };
        const entry: LinkEntry = {
          status: record.status,
          occurrences: record.occurrences,
          resolvedCount: record.resolved_count,
          lastChangedAt: record.last_changed_at ?? record.first_detected_at ?? "",
          occurrenceDates: events.occurrenceDates,
          resolvedDates: events.resolvedDates,
        };
        const current = acc[record.vulnerability_id] ?? {};
        current[record.server_id] = entry;
        acc[record.vulnerability_id] = current;
        return acc;
      },
      {}
    );
  }

  async function fetchData(
    nextPage = page,
    nextPageSize = pageSize,
    nextQuery = query,
    nextMode = viewMode
  ) {
    setDataLoading(true);
    setDataError(null);
    try {
      const response = await fetch(
        `/api/vulnerabilidades?page=${nextPage}&limit=${nextPageSize}&mode=${encodeURIComponent(
          nextMode
        )}&q=${encodeURIComponent(nextQuery)}`
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao carregar vulnerabilidades.");
      }
      setVulnerabilities(Array.isArray(data?.vulnerabilities) ? data.vulnerabilities : []);
      setServers(Array.isArray(data?.servers) ? data.servers : []);
      const linkRecords = Array.isArray(data?.links) ? (data.links as LinkRecord[]) : [];
      const eventRecords = Array.isArray(data?.events) ? (data.events as LinkEventRecord[]) : [];
      setRetests(Array.isArray(data?.retests) ? (data.retests as RetestRecord[]) : []);
      setLinks(buildLinkMap(linkRecords, eventRecords));
      setPage(data?.pagination?.page ?? nextPage);
      setPageSize(data?.pagination?.limit ?? nextPageSize);
      setTotalCount(data?.pagination?.total ?? 0);
      setTotalPages(data?.pagination?.totalPages ?? 1);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Falha ao carregar vulnerabilidades.");
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    if (!authorized) return;
    void fetchData(1, pageSize, query, viewMode);
  }, [authorized, viewMode]);

  function getRetestHistory(vulnId: string, serverId: string) {
    return retests
      .filter((item) => item.vulnerability_id === vulnId && item.server_id === serverId)
      .sort((a, b) => a.requested_at.localeCompare(b.requested_at));
  }

  const historyModalData = useMemo(() => {
    if (!historyModal) return null;
    const vulnerability = vulnerabilities.find(
      (item) => item.id === historyModal.vulnerabilityId
    );
    const server = serverById[historyModal.serverId];
    const link = links[historyModal.vulnerabilityId]?.[historyModal.serverId];
    if (!vulnerability || !server || !link) return null;
    return {
      vulnerability,
      server,
      link,
      retestHistory: getRetestHistory(
        historyModal.vulnerabilityId,
        historyModal.serverId
      ),
    };
  }, [historyModal, vulnerabilities, serverById, links, retests]);

  const historyOccurrenceDates = historyModalData?.link.occurrenceDates ?? [];
  const historyResolvedDates = historyModalData?.link.resolvedDates ?? [];
  const historyRetestRecords = historyModalData?.retestHistory ?? [];

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
    tokens.forEach((token) => {
      const match = token.match(/^([a-zA-Z_]+)(:|>=|<=|=|>|<)(.+)$/);
      if (match) {
        const [, rawField, op, rawValue] = match;
        filters.push({
          field: rawField.toLowerCase(),
          op: op as QueryFilter["op"],
          value: rawValue.trim(),
        });
      } else {
        terms.push(token.toLowerCase());
      }
    });
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

  const parsedQuery = useMemo(() => parseQuery(query), [query]);

  const queryFields = useMemo(
    () => [
      "id",
      "title",
      "severity",
      "status",
      "server",
      "ip",
      "env",
      "score",
      "occurrences",
      "open",
      "resolved",
      "servers",
      "sort",
    ],
    []
  );

  function getLastToken(input: string) {
    const tokens = splitQuery(input);
    if (tokens.length === 0) return "";
    return tokens[tokens.length - 1];
  }

  const querySuggestions = useMemo(() => {
    const token = getLastToken(queryDraft);
    if (!token) {
      return queryFields.map((field) => `${field}:`);
    }
    if (token.includes(":") || token.includes(">") || token.includes("<") || token.includes("=")) {
      return [];
    }
    const lower = token.toLowerCase();
    return queryFields
      .filter((field) => field.startsWith(lower))
      .map((field) => `${field}:`);
  }, [queryDraft, queryFields]);

  const filteredVulnerabilities = useMemo(() => {
    if (query.trim()) {
      return vulnerabilities;
    }
    if (!parsedQuery.terms.length && !parsedQuery.filters.length) {
      return vulnerabilities;
    }

    return vulnerabilities.filter((vuln) => {
      const entries = links[vuln.id] ?? {};
      const linkedServers = Object.entries(entries)
        .map(([serverId, entry]) => {
          const server = serverById[serverId];
          if (!server) return null;
          return { server, entry };
        })
        .filter(Boolean) as Array<{ server: Server; entry: LinkEntry }>;
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
        .map(({ server }) => `${server.id} ${server.name} ${server.ip} ${server.environment}`)
        .join(" ")
        .toLowerCase();

      const termMatches = parsedQuery.terms.every(
        (term) => baseText.includes(term) || serverText.includes(term)
      );
      if (!termMatches) return false;

      return parsedQuery.filters.every((filter) => {
        switch (filter.field) {
          case "id":
          case "vuln":
            return vuln.id.toLowerCase().includes(filter.value.toLowerCase());
          case "title":
            return vuln.title.toLowerCase().includes(filter.value.toLowerCase());
          case "severity":
            return vuln.severity.toLowerCase().startsWith(filter.value.toLowerCase());
          case "status": {
            const normalized = filter.value.toLowerCase();
            if (normalized === "open" || normalized === "aberta" || normalized === "ativo") {
              return activeCount > 0;
            }
            if (normalized === "resolved" || normalized === "corrigida") {
              return resolvedCount > 0;
            }
            return true;
          }
          case "server": {
            const target = filter.value.toLowerCase();
            return linkedServers.some(
              ({ server }) =>
                server.id.toLowerCase().includes(target) ||
                server.name.toLowerCase().includes(target)
            );
          }
          case "ip": {
            const target = filter.value.toLowerCase();
            return linkedServers.some(({ server }) => server.ip.toLowerCase().includes(target));
          }
          case "env":
          case "environment": {
            const target = filter.value.toLowerCase();
            return linkedServers.some(({ server }) =>
              server.environment.toLowerCase().includes(target)
            );
          }
          case "score":
            return matchesNumeric(vuln.score, filter);
          case "occurrences":
            return matchesNumeric(totalOccurrences, filter);
          case "open":
            return matchesNumeric(activeCount, filter);
          case "resolved":
            return matchesNumeric(resolvedCount, filter);
          default:
            return true;
        }
      });
    });
  }, [parsedQuery, vulnerabilities, links, serverById, query]);

  const vulnerabilitiesByAsset = useMemo(() => {
    return filteredVulnerabilities
      .flatMap((vuln) => {
        const entries = links[vuln.id] ?? {};
        return Object.entries(entries)
          .map(([serverId, entry]) => {
            const server = serverById[serverId];
            if (!server) return null;
            return { vuln, server, entry, key: `${vuln.id}::${serverId}` };
          })
          .filter(Boolean) as Array<{
          vuln: Vulnerability;
          server: Server;
          entry: LinkEntry;
          key: string;
        }>;
      })
      .filter(Boolean);
  }, [filteredVulnerabilities, links, serverById]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-sm text-zinc-400">
        Carregando...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <DashboardShell
      pageTitle="Vulnerabilidades"
      pageSubtitle="Catálogo único com vínculos de ativos e histórico de correções."
    >
      <Card
        className={cn(
          "mb-5 rounded-3xl border p-4",
          isDark
            ? "border-white/5 bg-[#050816]/80 text-white"
            : "border-slate-200 bg-white text-slate-900"
        )}
      >
        <CardContent className="p-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                Consulta
              </p>
              <h3 className="mt-1 text-lg font-semibold">
                Busque por ID, texto ou filtros avançados
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                Use uma linguagem simples para filtrar vulnerabilidades e ativos.
              </p>
            </div>
            <div className="text-xs text-zinc-500">
              {filteredVulnerabilities.length} de {totalCount} resultado
              {totalCount === 1 ? "" : "s"}
            </div>
          </div>
          <form
            className="flex flex-col gap-2 md:flex-row md:items-start"
            onSubmit={(event) => {
              event.preventDefault();
              const nextQuery = queryDraft.trim();
              setQuery(nextQuery);
              setPage(1);
                          void fetchData(1, pageSize, nextQuery, viewMode);
              setShowQuerySuggestions(false);
            }}
          >
            <div className="relative flex-1">
              <Input
                ref={queryInputRef}
                value={queryDraft}
                onChange={(event) => {
                  setQueryDraft(event.target.value);
                  setShowQuerySuggestions(true);
                }}
                onFocus={() => setShowQuerySuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowQuerySuggestions(false), 120);
                }}
                placeholder='Ex: severity:Alta status:open server:"SRV-01" score>=7'
                className={cn(
                  "h-11 rounded-2xl text-sm",
                  isDark
                    ? "border-white/10 bg-black/40 text-white"
                    : "border-slate-200 bg-white"
                )}
              />
              {showQuerySuggestions && querySuggestions.length > 0 && (
                <div
                  className={cn(
                    "absolute left-0 right-0 z-20 mt-2 rounded-2xl border p-2 text-xs shadow-lg",
                    isDark
                      ? "border-white/10 bg-[#050816] text-zinc-200"
                      : "border-slate-200 bg-white text-slate-700"
                  )}
                >
                  <p className="px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                    Autocomplete
                  </p>
                  <div className="space-y-1">
                    {querySuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[11px] font-semibold",
                          isDark
                            ? "hover:bg-white/5"
                            : "hover:bg-slate-100"
                        )}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          const lastToken = getLastToken(queryDraft);
                          const prefix = queryDraft.slice(
                            0,
                            queryDraft.length - lastToken.length
                          );
                          const nextDraft = `${prefix}${suggestion}`;
                          setQueryDraft(nextDraft);
                          setShowQuerySuggestions(false);
                          requestAnimationFrame(() => {
                            queryInputRef.current?.focus();
                          });
                        }}
                      >
                        <span>{suggestion}</span>
                        <span className="text-[10px] text-zinc-400">Campo</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="h-11 rounded-2xl px-5"
              variant="outline"
            >
              Buscar
            </Button>
          </form>
          
          <div className="flex flex-wrap gap-2 text-[11px] text-zinc-500">
            <span>Campos: id, title, severity, status, server, ip, env, score, occurrences.</span>
            <span>
              Exemplos: id:VULN-001, status:corrigida, env:Produção, score&gt;=8,
              sort:open.
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-zinc-400">
            <span className="uppercase tracking-[0.3em] text-[10px] text-zinc-500">
              Filtros rápidos
            </span>
            <Button
              type="button"
              variant="outline"
              className="h-8 rounded-xl px-3 text-[11px]"
              onClick={() => setQueryDraft("sort:open")}
            >
              Maior nº ativos vulneráveis
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-8 rounded-xl px-3 text-[11px]"
              onClick={() => setQueryDraft("sort:servers")}
            >
              Maior nº ativos (total)
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-8 rounded-xl px-3 text-[11px]"
              onClick={() => setQueryDraft("sort:occurrences")}
            >
              Maior nº ocorrências
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
            <span className="uppercase tracking-[0.3em] text-[10px] text-zinc-500">
              Visão
            </span>
            <Button
              type="button"
              variant={viewMode === "unique" ? "default" : "outline"}
              className="h-8 rounded-xl px-3 text-[11px]"
              onClick={() => setViewMode("unique")}
            >
              Vulnerabilidades únicas
            </Button>
            <Button
              type="button"
              variant={viewMode === "by-asset" ? "default" : "outline"}
              className="h-8 rounded-xl px-3 text-[11px]"
              onClick={() => setViewMode("by-asset")}
            >
              Por ativo
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          {dataError && (
            <div
              className={cn(
                "rounded-2xl border px-4 py-3 text-sm",
                isDark
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              )}
            >
              {dataError}
            </div>
          )}
          {dataLoading ? (
            <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
              Carregando vulnerabilidades...
            </p>
          ) : filteredVulnerabilities.length === 0 ? (
            <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
              Nenhuma vulnerabilidade encontrada.
            </p>
          ) : viewMode === "by-asset" ? (
            vulnerabilitiesByAsset.length === 0 ? (
              <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
                Nenhuma vulnerabilidade encontrada.
              </p>
            ) : (
              vulnerabilitiesByAsset.map(({ vuln, server, entry, key }) => (
                <Card
                  key={key}
                  className={cn(
                    "rounded-3xl border p-4 shadow-[0_20px_60px_rgba(88,28,135,0.15)]",
                    isDark
                      ? "border-white/5 bg-[#050816]/80 text-white"
                      : "border-slate-200 bg-white text-slate-900"
                  )}
                >
                  <CardContent className="space-y-4 p-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em]",
                            severityBadgeClasses[
                              normalizeSeverityLabel(vuln.severity)
                            ]
                          )}
                        >
                          {normalizeSeverityLabel(vuln.severity)}
                        </span>
                        <h3 className="mt-2 text-lg font-semibold">{vuln.title}</h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          {server.name} · {server.environment} · {server.ip}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-zinc-500">
                          <span>
                            Status: {entry.status === "active" ? "Aberta" : "Corrigida"}
                          </span>
                          <span>•</span>
                          <span>Ocorrências {entry.occurrences}</span>
                          <span>•</span>
                          <span>Correções {entry.resolvedCount}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/vulnerabilidades/${vuln.id}`}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-[11px] font-semibold",
                            isDark
                              ? "border-white/10 text-zinc-200"
                              : "border-slate-200 text-slate-700"
                          )}
                        >
                          Ver vulnerabilidade
                        </Link>
                        <Link
                          href={`/vulnerabilidades/ativos/${server.id}`}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-[11px] font-semibold",
                            isDark
                              ? "border-white/10 text-zinc-200"
                              : "border-slate-200 text-slate-700"
                          )}
                        >
                          Ver ativo
                        </Link>
                      </div>
                    </div>
                    <div className="rounded-2xl border px-4 py-3 text-xs">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400">
                        Primeira detecção
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        {formatDate(entry.firstDetectedAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          ) : (
            filteredVulnerabilities.map((vuln) => {
            const entries = links[vuln.id] ?? {};
            const linkedServers = Object.entries(entries)
              .map(([serverId, entry]) => {
                const server = serverById[serverId];
                if (!server) return null;
                return { serverId, server, entry };
              })
              .filter(Boolean) as Array<{
              serverId: string;
              server: Server;
              entry: LinkEntry;
            }>;
            const activeCount = linkedServers.filter(
              ({ entry }) => entry.status === "active"
            ).length;
            const resolvedCount = linkedServers.filter(
              ({ entry }) => entry.status === "resolved"
            ).length;
            const retestRequestedCount = linkedServers.reduce((acc, item) => {
              const latest = getRetestHistory(vuln.id, item.serverId).at(-1);
              return latest?.status === "requested" ? acc + 1 : acc;
            }, 0);
            const retestFailedCount = linkedServers.reduce((acc, item) => {
              const latest = getRetestHistory(vuln.id, item.serverId).at(-1);
              return latest?.status === "failed" ? acc + 1 : acc;
            }, 0);
            return (
              <Card
                key={vuln.id}
                className={cn(
                  "rounded-3xl border p-4 shadow-[0_20px_60px_rgba(88,28,135,0.15)]",
                  isDark
                    ? "border-white/5 bg-[#050816]/80 text-white"
                    : "border-slate-200 bg-white text-slate-900"
                )}
              >
                <CardContent className="p-0 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em]",
                          severityBadgeClasses[
                            normalizeSeverityLabel(vuln.severity)
                          ]
                        )}
                      >
                        {normalizeSeverityLabel(vuln.severity)}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold">{vuln.title}</h3>
                      <p className="mt-1 max-w-2xl text-sm text-zinc-400 line-clamp-1">
                        {vuln.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-zinc-500">
                        <span>Score {vuln.score.toFixed(1)}</span>
                        <span>•</span>
                        <span>{vuln.affected}</span>
                        {formatScore(vuln.cvss4_base_score) && (
                          <>
                            <span>•</span>
                            <span>CVSS4 {formatScore(vuln.cvss4_base_score)}</span>
                          </>
                        )}
                        {formatScore(vuln.cvss3_base_score) && (
                          <>
                            <span>•</span>
                            <span>CVSS3 {formatScore(vuln.cvss3_base_score)}</span>
                          </>
                        )}
                        {formatScore(vuln.cvss_temporal_score) && (
                          <>
                            <span>•</span>
                            <span>Temporal {formatScore(vuln.cvss_temporal_score)}</span>
                          </>
                        )}
                      </div>
                      {(vuln.cve || vuln.cpe) && (
                        <div className="mt-2 space-y-1 text-[11px] text-zinc-500">
                          {vuln.cve && (
                            <p className="line-clamp-1">CVE: {vuln.cve}</p>
                          )}
                          {vuln.cpe && (
                            <p className="line-clamp-1">CPE: {vuln.cpe}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/vulnerabilidades/${vuln.id}`}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-[11px] font-semibold",
                          isDark
                            ? "border-white/10 text-zinc-200"
                            : "border-slate-200 text-slate-700"
                        )}
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-xs",
                        isDark
                          ? "border-white/10 bg-white/5 text-zinc-200"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      )}
                    >
                      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400">
                        Ativos vulneráveis
                      </p>
                      <p className="mt-2 text-2xl font-semibold">{activeCount}</p>
                    </div>
                    <div
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-xs",
                        isDark
                          ? "border-white/10 bg-white/5 text-zinc-200"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      )}
                    >
                      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400">
                        Ativos corrigidos
                      </p>
                      <p className="mt-2 text-2xl font-semibold">{resolvedCount}</p>
                    </div>
                    <div
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-xs",
                        isDark
                          ? "border-white/10 bg-white/5 text-zinc-200"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      )}
                    >
                      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400">
                        Em reteste
                      </p>
                      <p className="mt-2 text-2xl font-semibold">{retestRequestedCount}</p>
                    </div>
                    <div
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-xs",
                        isDark
                          ? "border-white/10 bg-white/5 text-zinc-200"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      )}
                    >
                      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400">
                        Reteste falhou
                      </p>
                      <p className="mt-2 text-2xl font-semibold">{retestFailedCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
          )}
        </div>

        <div className="space-y-4">
          <Card
            className={cn(
              "rounded-3xl border p-4",
              isDark
                ? "border-white/5 bg-[#050816]/80 text-white"
                : "border-slate-200 bg-white text-slate-900"
            )}
          >
            <CardContent className="p-0 space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                Paginação
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span>Itens por página</span>
                <select
                  value={pageSize}
                  onChange={(event) => {
                    const nextSize = Number(event.target.value);
                    setPage(1);
                    setPageSize(nextSize);
                    void fetchData(1, nextSize, query, viewMode);
                  }}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs",
                    isDark
                      ? "border-white/10 bg-[#050816] text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  )}
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span>
                  Página {page} de {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 rounded-xl px-3"
                    onClick={() => {
                      const nextPage = Math.max(1, page - 1);
                      setPage(nextPage);
                      void fetchData(nextPage, pageSize, query, viewMode);
                    }}
                    disabled={page <= 1 || dataLoading}
                  >
                    Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 rounded-xl px-3"
                    onClick={() => {
                      const nextPage = Math.min(totalPages, page + 1);
                      setPage(nextPage);
                      void fetchData(nextPage, pageSize, query, viewMode);
                    }}
                    disabled={page >= totalPages || dataLoading}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {historyModalData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
          onClick={() => setHistoryModal(null)}
        >
          <div
            className={cn(
              "w-full max-w-3xl rounded-3xl border p-6 shadow-2xl",
              isDark
                ? "border-white/10 bg-[#050816] text-white"
                : "border-slate-200 bg-white text-slate-900"
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                  Ocorrências do ativo
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  {historyModalData.server.name} · {historyModalData.server.ip}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  {historyModalData.vulnerability.title}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-xl text-[11px]"
                onClick={() => setHistoryModal(null)}
              >
                Fechar
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div
                className={cn(
                  "rounded-2xl border p-4 text-xs",
                  isDark
                    ? "border-white/10 bg-white/5 text-zinc-200"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                )}
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                  Ocorrências registradas
                </p>
                <div className="mt-3 space-y-1 text-[11px] text-zinc-500">
                  <p>
                    Primeira ocorrência: {formatDate(historyOccurrenceDates[0])}
                  </p>
                  <p>
                    Última ocorrência:{" "}
                    {formatDate(historyOccurrenceDates.at(-1))}
                  </p>
                  <p>
                    Total: {historyOccurrenceDates.length} ocorrência
                    {historyOccurrenceDates.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {historyOccurrenceDates.length === 0 ? (
                    <span className="text-[11px] text-zinc-500">
                      Sem ocorrências registradas.
                    </span>
                  ) : (
                    historyOccurrenceDates.map((date) => (
                      <span
                        key={date}
                        className={cn(
                          "rounded-full border px-2 py-1 text-[10px] font-semibold",
                          isDark
                            ? "border-white/10 text-zinc-200"
                            : "border-slate-200 text-slate-600"
                        )}
                      >
                        {formatDate(date)}
                      </span>
                    ))
                  )}
                </div>
                {historyResolvedDates.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                      Correções registradas
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {historyResolvedDates.map((date) => (
                        <span
                          key={date}
                          className={cn(
                            "rounded-full px-2 py-1 text-[10px] font-semibold",
                            isDark
                              ? "bg-emerald-500/15 text-emerald-200"
                              : "bg-emerald-50 text-emerald-700"
                          )}
                        >
                          {formatDate(date)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className={cn(
                  "rounded-2xl border p-4 text-xs",
                  isDark
                    ? "border-white/10 bg-white/5 text-zinc-200"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                )}
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                  Retestes e validações
                </p>
                {historyRetestRecords.length === 0 ? (
                  <p className="mt-3 text-[11px] text-zinc-500">
                    Nenhum reteste solicitado.
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {historyRetestRecords.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-[11px]",
                          isDark
                            ? "border-white/10 bg-[#050816]"
                            : "border-slate-200 bg-white"
                        )}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
                              item.status === "passed"
                                ? "bg-emerald-500/15 text-emerald-200"
                                : item.status === "requested"
                                ? "bg-amber-500/15 text-amber-200"
                                : "bg-rose-500/15 text-rose-200"
                            )}
                          >
                            {item.status === "requested"
                              ? "Solicitado"
                              : item.status === "passed"
                              ? "Corrigido"
                              : "Falhou"}
                          </span>
                          <span className="text-zinc-500">
                            Solicitado em {formatDate(item.requested_at)}
                          </span>
                        </div>
                        {item.retested_at && (
                          <p className="mt-1 text-zinc-500">
                            Resultado em {formatDate(item.retested_at)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
