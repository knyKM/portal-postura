"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

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

export default function VulnerabilidadeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
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
  const [expandedTimeline, setExpandedTimeline] = useState<Record<string, boolean>>({});
  const [dataError, setDataError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [resolvedPage, setResolvedPage] = useState(1);
  const [serversPerPage, setServersPerPage] = useState(10);

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

  const vulnerability = vulnerabilities.find((item) => item.id === params.id);

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

  useEffect(() => {
    if (!authorized) return;
    void fetchData();
  }, [authorized]);

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

  if (!vulnerability && dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-sm text-zinc-400">
        Carregando...
      </div>
    );
  }

  if (!vulnerability) {
    return null;
  }

  const entries = links[vulnerability.id] ?? {};
  const activeServers = Object.entries(entries).filter(
    ([, entry]) => entry.status === "active"
  );
  const resolvedServers = Object.entries(entries).filter(
    ([, entry]) => entry.status === "resolved"
  );
  const activeTotalPages = Math.max(
    1,
    Math.ceil(activeServers.length / serversPerPage)
  );
  const resolvedTotalPages = Math.max(
    1,
    Math.ceil(resolvedServers.length / serversPerPage)
  );
  const activePageSafe = Math.min(activePage, activeTotalPages);
  const resolvedPageSafe = Math.min(resolvedPage, resolvedTotalPages);
  const activeSliceStart = (activePageSafe - 1) * serversPerPage;
  const resolvedSliceStart = (resolvedPageSafe - 1) * serversPerPage;
  const activePageItems = activeServers.slice(
    activeSliceStart,
    activeSliceStart + serversPerPage
  );
  const resolvedPageItems = resolvedServers.slice(
    resolvedSliceStart,
    resolvedSliceStart + serversPerPage
  );

  function renderServerEntry(serverId: string, entry: LinkEntry) {
    const server = serverById[serverId];
    if (!server) return null;
    const retestHistory = getRetestHistory(vulnerability.id, serverId);
    const latestRetest = retestHistory.at(-1);
    const timelineItems = buildTimeline(entry, retestHistory);
    const timelineKey = `${vulnerability.id}-${serverId}`;
    return (
      <div
        key={`${vulnerability.id}-${serverId}`}
        className={cn(
          "rounded-2xl border px-3 py-2 text-xs",
          isDark
            ? "border-white/10 bg-black/20 text-zinc-200"
            : "border-slate-200 bg-white text-slate-700"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold">
              {server.name} · {server.ip}
            </p>
            <p className="text-[11px] text-zinc-500">
              Ocorrências ({entry.occurrences}):{" "}
              {entry.occurrenceDates.length
                ? entry.occurrenceDates.map((date) => formatDate(date)).join(" · ")
                : "-"}
            </p>
            <p className="text-[11px] text-zinc-500">
              Correções ({entry.resolvedCount}):{" "}
              {entry.resolvedDates.length
                ? entry.resolvedDates.map((date) => formatDate(date)).join(" · ")
                : "-"}
            </p>
            {latestRetest && (
              <p className="text-[11px] text-zinc-500">
                Reteste:{" "}
                {latestRetest.status === "requested"
                  ? "Solicitado"
                  : latestRetest.status === "passed"
                  ? "Corrigido"
                  : "Falha"}{" "}
                · {formatDate(latestRetest.retested_at ?? latestRetest.requested_at)}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-xl text-[11px]"
              onClick={() => requestRetest(vulnerability.id, serverId)}
            >
              Enviar para reteste
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-xl text-[11px]"
              onClick={() => completeRetest(vulnerability.id, serverId, "passed")}
            >
              Reteste OK
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-xl text-[11px]"
              onClick={() => completeRetest(vulnerability.id, serverId, "failed")}
            >
              Reteste falhou
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
        {retestHistory.length > 0 && (
          <div className="mt-2 space-y-1 text-[11px] text-zinc-500">
            {retestHistory.slice(-3).map((item) => (
              <div key={item.id}>
                Reteste{" "}
                {item.status === "requested"
                  ? "solicitado"
                  : item.status === "passed"
                  ? "corrigido"
                  : "falhou"}{" "}
                em {formatDate(item.requested_at)}
                {item.retested_at
                  ? ` · Resultado em ${formatDate(item.retested_at)}`
                  : ""}
              </div>
            ))}
          </div>
        )}
        {timelineItems.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                Linha do tempo
              </p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-[11px] text-zinc-400 hover:text-white"
                onClick={() =>
                  setExpandedTimeline((prev) => ({
                    ...prev,
                    [timelineKey]: !prev[timelineKey],
                  }))
                }
              >
                {expandedTimeline[timelineKey] ? "Recolher" : "Expandir"}
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(expandedTimeline[timelineKey] ? timelineItems : timelineItems.slice(0, 4)).map(
                (item, index) => (
                  <span
                    key={`${timelineKey}-${index}`}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]",
                      item.type === "resolved"
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                        : item.type === "retest"
                        ? "border-indigo-400/40 bg-indigo-500/10 text-indigo-200"
                        : "border-rose-400/40 bg-rose-500/10 text-rose-200"
                    )}
                  >
                    {item.label}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
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
      const response = await fetch(
        `/api/vulnerabilidades?page=1&limit=1&q=${encodeURIComponent(`id:${params.id}`)}`
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
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Falha ao carregar vulnerabilidades.");
    } finally {
      setDataLoading(false);
    }
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

  function getRetestHistory(vulnId: string, serverId: string) {
    return retests
      .filter((item) => item.vulnerability_id === vulnId && item.server_id === serverId)
      .sort((a, b) => a.requested_at.localeCompare(b.requested_at));
  }

  function buildTimeline(entry: LinkEntry, retestHistory: RetestRecord[]) {
    const items: Array<{ label: string; date: string; tone: "info" | "success" | "danger" }> = [];
    const occurrenceDates = [...entry.occurrenceDates].sort();
    const resolvedDates = [...entry.resolvedDates].sort();

    occurrenceDates.forEach((date, index) => {
      items.push({
        label: index === 0 ? "Detectada" : "Reaberta",
        date,
        tone: "info",
      });
    });
    resolvedDates.forEach((date) => {
      items.push({ label: "Corrigida", date, tone: "success" });
    });
    retestHistory.forEach((retest) => {
      if (retest.status === "requested") {
        items.push({
          label: "Reteste solicitado",
          date: retest.requested_at,
          tone: "info",
        });
        return;
      }
      items.push({
        label: retest.status === "passed" ? "Reteste aprovado" : "Reteste falhou",
        date: retest.retested_at ?? retest.requested_at,
        tone: retest.status === "passed" ? "success" : "danger",
      });
    });

    return items
      .filter((item) => item.date)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  function timelineTone(tone: "info" | "success" | "danger") {
    if (tone === "success") {
      return isDark
        ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-200"
        : "border-emerald-300 bg-emerald-50 text-emerald-700";
    }
    if (tone === "danger") {
      return isDark
        ? "border-rose-500/40 bg-rose-500/20 text-rose-200"
        : "border-rose-300 bg-rose-50 text-rose-700";
    }
    return isDark
      ? "border-purple-500/40 bg-purple-500/10 text-purple-200"
      : "border-purple-200 bg-purple-50 text-purple-700";
  }

  function toggleTimeline(key: string) {
    setExpandedTimeline((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <DashboardShell
      pageTitle="Detalhes da vulnerabilidade"
      pageSubtitle="Descrição completa, recomendações e histórico por ativo."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em]",
              severityBadgeClasses[
                normalizeSeverityLabel(vulnerability.severity)
              ]
            )}
          >
            {normalizeSeverityLabel(vulnerability.severity)}
          </span>
          <h2 className="mt-2 text-2xl font-semibold">{vulnerability.title}</h2>
          <p className="mt-2 text-sm text-zinc-400">{vulnerability.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-500">
            <span>Score {vulnerability.score.toFixed(1)}</span>
            <span>•</span>
            <span>{vulnerability.affected}</span>
            {formatScore(vulnerability.cvss4_base_score) && (
              <>
                <span>•</span>
                <span>CVSS4 {formatScore(vulnerability.cvss4_base_score)}</span>
              </>
            )}
            {formatScore(vulnerability.cvss3_base_score) && (
              <>
                <span>•</span>
                <span>CVSS3 {formatScore(vulnerability.cvss3_base_score)}</span>
              </>
            )}
            {formatScore(vulnerability.cvss_temporal_score) && (
              <>
                <span>•</span>
                <span>Temporal {formatScore(vulnerability.cvss_temporal_score)}</span>
              </>
            )}
          </div>
        </div>
        <Link
          href="/vulnerabilidades"
          className={cn(
            "rounded-xl border px-4 py-2 text-sm font-semibold",
            isDark ? "border-white/10 text-zinc-200" : "border-slate-200 text-slate-700"
          )}
        >
          Voltar
        </Link>
      </div>

      {dataError && (
        <div
          className={cn(
            "mt-4 rounded-2xl border px-4 py-3 text-sm",
            isDark
              ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
              : "border-rose-200 bg-rose-50 text-rose-700"
          )}
        >
          {dataError}
        </div>
      )}
      {dataLoading && (
        <p className={cn("mt-4 text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
          Carregando histórico...
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card
          className={cn(
            "rounded-3xl border p-4 md:col-span-2",
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}
        >
          <CardContent className="p-0">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Observações
            </p>
            <div className="mt-3 space-y-4 text-sm text-zinc-200">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Descrição
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {vulnerability.description || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Remediação
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {vulnerability.remediation || "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {(vulnerability.cve ||
        vulnerability.cpe ||
        formatScore(vulnerability.cvss4_base_score) ||
        formatScore(vulnerability.cvss4_temporal_score) ||
        formatScore(vulnerability.cvss3_base_score) ||
        formatScore(vulnerability.cvss3_temporal_score) ||
        formatScore(vulnerability.cvss_temporal_score)) && (
        <Card
          className={cn(
            "mt-6 rounded-3xl border p-4",
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}
        >
          <CardContent className="space-y-3 p-0 text-sm text-zinc-200">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Indicadores e referências
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1 text-[11px] text-zinc-400">
                <p>CVSS4 base: {formatScore(vulnerability.cvss4_base_score) ?? "-"}</p>
                <p>
                  CVSS4 temporal: {formatScore(vulnerability.cvss4_temporal_score) ?? "-"}
                </p>
                <p>CVSS3 base: {formatScore(vulnerability.cvss3_base_score) ?? "-"}</p>
                <p>
                  CVSS3 temporal: {formatScore(vulnerability.cvss3_temporal_score) ?? "-"}
                </p>
                <p>CVSS temporal: {formatScore(vulnerability.cvss_temporal_score) ?? "-"}</p>
              </div>
              <div className="space-y-2 text-[11px] text-zinc-400">
                <p className="line-clamp-4">CVE: {vulnerability.cve ?? "-"}</p>
                <p className="line-clamp-4">CPE: {vulnerability.cpe ?? "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card
        className={cn(
          "mt-6 rounded-3xl border p-4",
          isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
        )}
      >
        <CardContent className="p-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Ativos vinculados
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <span>Itens por página</span>
              <select
                value={serversPerPage}
                onChange={(event) => {
                  const nextSize = Number(event.target.value);
                  setServersPerPage(nextSize);
                  setActivePage(1);
                  setResolvedPage(1);
                }}
                className={cn(
                  "rounded-xl border px-2 py-1 text-[11px]",
                  isDark
                    ? "border-white/10 bg-[#050816] text-white"
                    : "border-slate-200 bg-white text-slate-700"
                )}
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Ativos vulneráveis ({activeServers.length})
              </p>
              {activeServers.length > serversPerPage && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 rounded-xl px-3 text-[11px]"
                    onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}
                    disabled={activePageSafe <= 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 rounded-xl px-3 text-[11px]"
                    onClick={() =>
                      setActivePage((prev) => Math.min(activeTotalPages, prev + 1))
                    }
                    disabled={activePageSafe >= activeTotalPages}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
            {activeServers.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Nenhum ativo vulnerável registrado.
              </p>
            ) : (
              <div className="space-y-3">
                {activePageItems.map(([serverId, entry]) =>
                  renderServerEntry(serverId, entry)
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Ativos corrigidos ({resolvedServers.length})
              </p>
              {resolvedServers.length > serversPerPage && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 rounded-xl px-3 text-[11px]"
                    onClick={() => setResolvedPage((prev) => Math.max(1, prev - 1))}
                    disabled={resolvedPageSafe <= 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 rounded-xl px-3 text-[11px]"
                    onClick={() =>
                      setResolvedPage((prev) =>
                        Math.min(resolvedTotalPages, prev + 1)
                      )
                    }
                    disabled={resolvedPageSafe >= resolvedTotalPages}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
            {resolvedServers.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Nenhum ativo corrigido registrado.
              </p>
            ) : (
              <div className="space-y-3">
                {resolvedPageItems.map(([serverId, entry]) =>
                  renderServerEntry(serverId, entry)
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
