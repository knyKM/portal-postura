"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [selectedServerByVuln, setSelectedServerByVuln] = useState<
    Record<string, string>
  >({});
  const [query, setQuery] = useState("");
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

  async function fetchData() {
    setDataLoading(true);
    setDataError(null);
    try {
      const response = await fetch("/api/vulnerabilidades");
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
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Falha ao carregar vulnerabilidades.");
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    if (!authorized) return;
    void fetchData();
  }, [authorized]);

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

  const filteredVulnerabilities = useMemo(() => {
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
  }, [parsedQuery, vulnerabilities, links, serverById]);

  const filteredServers = useMemo(() => {
    if (!parsedQuery.terms.length && !parsedQuery.filters.length) {
      return servers;
    }
    return servers.filter((server) => {
      const baseText = `${server.id} ${server.name} ${server.ip} ${server.environment}`.toLowerCase();
      const termMatches = parsedQuery.terms.every((term) => baseText.includes(term));
      if (!termMatches) return false;

      return parsedQuery.filters.every((filter) => {
        switch (filter.field) {
          case "server":
          case "id":
            return server.id.toLowerCase().includes(filter.value.toLowerCase());
          case "ip":
            return server.ip.toLowerCase().includes(filter.value.toLowerCase());
          case "env":
          case "environment":
            return server.environment.toLowerCase().includes(filter.value.toLowerCase());
          case "name":
            return server.name.toLowerCase().includes(filter.value.toLowerCase());
          default:
            return true;
        }
      });
    });
  }, [parsedQuery, servers]);

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
              {filteredVulnerabilities.length} resultado
              {filteredVulnerabilities.length === 1 ? "" : "s"}
            </div>
          </div>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Ex: severity:Alta status:open server:"SRV-01" score>=7'
            className={cn(
              "h-11 rounded-2xl text-sm",
              isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200 bg-white"
            )}
          />
          <div className="flex flex-wrap gap-2 text-[11px] text-zinc-500">
            <span>Campos: id, title, severity, status, server, ip, env, score, occurrences.</span>
            <span>Exemplos: id:VULN-001, status:corrigida, env:Produção, score&gt;=8.</span>
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
          ) : (
            filteredVulnerabilities.map((vuln) => {
            const entries = links[vuln.id] ?? {};
            const activeServers = Object.entries(entries).filter(
              ([, entry]) => entry.status === "active"
            );
            const resolvedServers = Object.entries(entries).filter(
              ([, entry]) => entry.status === "resolved"
            );
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
                          severityBadgeClasses[vuln.severity]
                        )}
                      >
                        {vuln.severity}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold">{vuln.title}</h3>
                      <p className="mt-1 text-sm text-zinc-400 max-w-2xl">
                        {vuln.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-zinc-500">
                        <span>Score {vuln.score.toFixed(1)}</span>
                        <span>•</span>
                        <span>{vuln.affected}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={selectedServerByVuln[vuln.id] ?? ""}
                          onChange={(event) =>
                            setSelectedServerByVuln((prev) => ({
                              ...prev,
                              [vuln.id]: event.target.value,
                            }))
                          }
                        className={cn(
                          "rounded-xl border px-3 py-2 text-xs",
                          isDark
                            ? "border-white/10 bg-[#050816] text-white"
                            : "border-slate-200 bg-white text-slate-700"
                        )}
                      >
                        <option value="">Selecionar servidor</option>
                        {servers.map((server) => (
                          <option key={server.id} value={server.id}>
                            {server.name} · {server.ip}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => {
                          const serverId = selectedServerByVuln[vuln.id];
                          if (!serverId) return;
                          ensureEntry(vuln.id, serverId);
                        }}
                      >
                        Vincular ativo
                      </Button>
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

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                        Ativos vulneráveis
                      </p>
                      {activeServers.length === 0 ? (
                        <p className="mt-2 text-xs text-zinc-500">
                          Nenhum ativo vulnerável no momento.
                        </p>
                      ) : (
                        <div className="mt-2 space-y-2">
                          {activeServers.map(([serverId, entry]) => {
                            const server = serverById[serverId];
                            if (!server) return null;
                            const retestHistory = getRetestHistory(vuln.id, serverId);
                            const latestRetest = retestHistory.at(-1);
                            return (
                              <div
                                key={`${vuln.id}-${serverId}`}
                                className={cn(
                                  "rounded-3xl border px-4 py-4 text-xs shadow-lg",
                                  isDark
                                    ? "border-white/10 bg-gradient-to-br from-[#0b1024] via-[#070b18] to-[#050814] text-zinc-200"
                                    : "border-slate-200 bg-white text-slate-700"
                                )}
                              >
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                  <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-sm font-semibold text-white">
                                        {server.name}
                                      </p>
                                      <span
                                        className={cn(
                                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
                                          isDark
                                            ? "border-white/10 text-zinc-300"
                                            : "border-slate-200 text-slate-600"
                                        )}
                                      >
                                        {server.ip}
                                      </span>
                                      {latestRetest && (
                                        <span
                                          className={cn(
                                            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
                                            latestRetest.status === "passed"
                                              ? "bg-emerald-500/15 text-emerald-200"
                                              : latestRetest.status === "requested"
                                              ? "bg-amber-500/15 text-amber-200"
                                              : "bg-rose-500/15 text-rose-200"
                                          )}
                                        >
                                          Reteste {latestRetest.status === "requested"
                                            ? "Solicitado"
                                            : latestRetest.status === "passed"
                                            ? "OK"
                                            : "Falhou"}
                                        </span>
                                      )}
                                    </div>
                                    <div className="grid gap-1 text-[11px] text-zinc-500">
                                      <p>
                                        {server.environment} · {entry.occurrences} ocorrência
                                        {entry.occurrences > 1 ? "s" : ""}
                                      </p>
                                      <p>
                                        Última ocorrência: {formatDate(entry.occurrenceDates.at(-1))}
                                      </p>
                                      {latestRetest && (
                                        <p>
                                          Reteste em{" "}
                                          {formatDate(
                                            latestRetest.retested_at ?? latestRetest.requested_at
                                          )}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="rounded-xl text-[11px]"
                                      onClick={() => resolveEntry(vuln.id, serverId)}
                                    >
                                      Marcar corrigida
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="rounded-xl text-[11px]"
                                      onClick={() => requestRetest(vuln.id, serverId)}
                                    >
                                      Enviar para reteste
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="rounded-xl text-[11px]"
                                      onClick={() => completeRetest(vuln.id, serverId, "passed")}
                                    >
                                      Reteste OK
                                    </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl text-[11px]"
                                    onClick={() => completeRetest(vuln.id, serverId, "failed")}
                                  >
                                    Reteste falhou
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-xl text-[11px]"
                                    onClick={() =>
                                      setHistoryModal({
                                        vulnerabilityId: vuln.id,
                                        serverId,
                                      })
                                    }
                                  >
                                    Ver ocorrências
                                  </Button>
                                  <Link
                                    href={`/vulnerabilidades/ativos/${serverId}`}
                                    className={cn(
                                      "flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-semibold",
                                        isDark
                                          ? "border-white/10 text-zinc-200"
                                          : "border-slate-200 text-slate-700"
                                      )}
                                    >
                                    Ver ativo
                                  </Link>
                                </div>
                              </div>
                            </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                        Histórico corrigido
                      </p>
                      {resolvedServers.length === 0 ? (
                        <p className="mt-2 text-xs text-zinc-500">
                          Nenhuma correção registrada.
                        </p>
                      ) : (
                        <div className="mt-2 space-y-2">
                          {resolvedServers.map(([serverId, entry]) => {
                            const server = serverById[serverId];
                            if (!server) return null;
                            return (
                              <div
                                key={`${vuln.id}-${serverId}-resolved`}
                                className={cn(
                                  "rounded-2xl border px-3 py-2 text-xs",
                                  isDark
                                    ? "border-white/10 bg-white/5 text-zinc-200"
                                    : "border-slate-200 bg-slate-50 text-slate-700"
                                )}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <p className="font-semibold">
                                      {server.name} · {server.ip}
                                    </p>
                                    <p className="text-[11px] text-zinc-500">
                                      Corrigida {entry.resolvedCount} vez
                                      {entry.resolvedCount > 1 ? "es" : ""} ·{" "}
                                      {entry.occurrences} ocorrência
                                      {entry.occurrences > 1 ? "s" : ""}
                                    </p>
                                    <p className="text-[11px] text-zinc-500">
                                      Última correção: {formatDate(entry.resolvedDates.at(-1))}
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="rounded-xl text-[11px]"
                                      onClick={() =>
                                        setHistoryModal({
                                          vulnerabilityId: vuln.id,
                                          serverId,
                                        })
                                      }
                                    >
                                      Ver ocorrências
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="rounded-xl text-[11px]"
                                      onClick={() => ensureEntry(vuln.id, serverId)}
                                    >
                                      Reabrir
                                    </Button>
                                    <Link
                                      href={`/vulnerabilidades/ativos/${serverId}`}
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
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
          )}
        </div>

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
              Servidores de teste
            </p>
            <h3 className="text-lg font-semibold">
              Catálogo de ativos ({filteredServers.length})
            </h3>
            <p className="text-sm text-zinc-400">
              Use estes servidores para simular vínculo, correção e reabertura.
            </p>
            <div className="mt-3 space-y-2">
              {filteredServers.map((server) => (
                <div
                  key={server.id}
                  className={cn(
                    "rounded-2xl border px-3 py-2 text-xs",
                    isDark
                      ? "border-white/10 bg-white/5 text-zinc-200"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  )}
                >
                  <p className="font-semibold">
                    {server.name} · {server.ip}
                  </p>
                  <p className="text-[11px] text-zinc-500">{server.environment}</p>
                  <div className="mt-2 flex items-center gap-2">
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
              ))}
            </div>
          </CardContent>
        </Card>
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
