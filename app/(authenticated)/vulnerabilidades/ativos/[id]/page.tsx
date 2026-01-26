"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { ASSIGNEE_CUSTOM_FIELDS } from "@/lib/actions/assignee-fields";

type Vulnerability = {
  id: string;
  title: string;
  severity: "Crítica" | "Alta" | "Média" | "Baixa";
  description?: string;
  observations?: string;
  remediation?: string;
  affected?: string;
  score?: number;
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
  asset_class?: string | null;
};

type LinkEntry = {
  status: "active" | "resolved";
  occurrences: number;
  resolvedCount: number;
  firstDetectedAt: string;
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

export default function VulnerabilidadeAtivoPage() {
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
  const [assetClass, setAssetClass] = useState("");
  const [customClass, setCustomClass] = useState("");
  const [savingClass, setSavingClass] = useState(false);
  const [classMessage, setClassMessage] = useState<string | null>(null);
  const [classError, setClassError] = useState<string | null>(null);

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

  const server = servers.find((item) => item.id === params.id);
  const assetClassOptions = useMemo(
    () => [
      "Servidor",
      "Workstation",
      "Banco de dados",
      "Switch",
      "Firewall",
      "Roteador",
      "Impressora",
      "Storage",
      "Load Balancer",
      "Hypervisor",
      "Appliance",
      "IoT",
      "Outro",
    ],
    []
  );

  const demoServerOwners: Record<string, Record<string, string>> = useMemo(
    () =>
      servers.reduce((acc, item, index) => {
        const ownerSuffix = String(index + 1).padStart(2, "0");
        const values: Record<string, string> = {};
        ASSIGNEE_CUSTOM_FIELDS.forEach((field, fieldIndex) => {
          values[field.id] = `Responsável ${fieldIndex + 1}-${ownerSuffix}`;
        });
        acc[item.id] = values;
        return acc;
      }, {} as Record<string, Record<string, string>>),
    [servers]
  );

  const ownerMap = server ? demoServerOwners[server.id] ?? {} : {};
  const ownerGroups = useMemo(
    () => [
      {
        title: "Área Proprietária",
        ids: [
          "customfield_11702",
          "customfield_11703",
          "customfield_11704",
          "customfield_10407",
        ],
      },
      {
        title: "Área Solucionadora",
        ids: ["customfield_11705", "customfield_11706", "customfield_11707", "customfield_10663"],
      },
      {
        title: "Owners e Negócio",
        ids: [
          "customfield_10647",
          "customfield_13200",
          "customfield_13201",
          "customfield_13202",
          "customfield_13203",
          "customfield_13205",
          "customfield_13204",
          "customfield_12301",
          "customfield_12302",
        ],
      },
    ],
    []
  );

  const relatedVulns = useMemo(() => {
    if (!server) return [];
    return vulnerabilities
      .map((vuln) => {
        const entry = links[vuln.id]?.[server.id];
        if (!entry) return null;
        return { vuln, entry };
      })
      .filter(Boolean) as Array<{ vuln: Vulnerability; entry: LinkEntry }>;
  }, [server, vulnerabilities, links]);

  const counters = relatedVulns.reduce(
    (acc, item) => {
      if (item.entry.status === "active") {
        acc.open += 1;
      } else {
        acc.resolved += 1;
      }
      return acc;
    },
    { open: 0, resolved: 0 }
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

  useEffect(() => {
    if (!authorized) return;
    void fetchData();
  }, [authorized]);

  useEffect(() => {
    if (!server) return;
    const current = server.asset_class ?? "Servidor";
    if (assetClassOptions.includes(current)) {
      setAssetClass(current);
      setCustomClass("");
    } else {
      setAssetClass("Outro");
      setCustomClass(current);
    }
  }, [server, assetClassOptions]);

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

  if (!server && dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-sm text-zinc-400">
        Carregando...
      </div>
    );
  }

  if (!server) {
    return null;
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
          firstDetectedAt: record.first_detected_at ?? "",
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

  async function handleSaveClass() {
    if (!server) return;
    setSavingClass(true);
    setClassError(null);
    setClassMessage(null);
    try {
      const value = assetClass === "Outro" ? customClass.trim() : assetClass.trim();
      if (!value) {
        throw new Error("Informe a classe do ativo.");
      }
      const response = await fetch(`/api/ativos/${server.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetClass: value }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao salvar classe.");
      }
      setClassMessage("Classe atualizada com sucesso.");
      await fetchData();
    } catch (err) {
      setClassError(err instanceof Error ? err.message : "Falha ao salvar classe.");
    } finally {
      setSavingClass(false);
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
      pageTitle="Detalhes do ativo"
      pageSubtitle="Responsáveis e vulnerabilidades associadas."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
            Ativo
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {server.name} · {server.ip}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{server.environment}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-500">
            <span>Abertas: {counters.open}</span>
            <span>•</span>
            <span>Corrigidas: {counters.resolved}</span>
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

      <Card
        className={cn(
          "mt-4 rounded-3xl border p-4",
          isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
        )}
      >
        <CardContent className="p-0 space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            Classe do ativo
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={assetClass}
              onChange={(event) => setAssetClass(event.target.value)}
              className={cn(
                "rounded-xl border px-3 py-2 text-sm",
                isDark
                  ? "border-white/10 bg-[#050816] text-white"
                  : "border-slate-200 bg-white text-slate-700"
              )}
            >
              {assetClassOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {assetClass === "Outro" && (
              <input
                value={customClass}
                onChange={(event) => setCustomClass(event.target.value)}
                placeholder="Informe a classe do ativo"
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm",
                  isDark
                    ? "border-white/10 bg-black/40 text-white"
                    : "border-slate-200 bg-white"
                )}
              />
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-xl text-[11px]"
              onClick={handleSaveClass}
              disabled={savingClass}
            >
              {savingClass ? "Salvando..." : "Salvar classe"}
            </Button>
            {classMessage && (
              <span className="text-xs text-emerald-300">{classMessage}</span>
            )}
            {classError && (
              <span className="text-xs text-rose-300">{classError}</span>
            )}
          </div>
        </CardContent>
      </Card>

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
          Carregando vulnerabilidades...
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card
          className={cn(
            "rounded-3xl border p-4",
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}
        >
          <CardContent className="p-0">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Responsáveis
            </p>
            <div className="mt-3 space-y-4 text-xs">
              {ownerGroups.map((group) => {
                const fields = ASSIGNEE_CUSTOM_FIELDS.filter((field) =>
                  group.ids.includes(field.id)
                );
                return (
                  <div
                    key={group.title}
                    className={cn(
                      "rounded-2xl border px-3 py-3",
                      isDark
                        ? "border-white/10 bg-black/20 text-zinc-200"
                        : "border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                      {group.title}
                    </p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {fields.map((field) => (
                        <div
                          key={`${server.id}-${field.id}`}
                          className={cn(
                            "rounded-xl border px-3 py-2",
                            isDark
                              ? "border-white/10 bg-white/5 text-zinc-200"
                              : "border-slate-200 bg-slate-50 text-slate-700"
                          )}
                        >
                          <p className="text-[11px] text-zinc-500">{field.label}</p>
                          <p className="mt-1 font-semibold">{ownerMap[field.id] ?? "-"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "rounded-3xl border p-4",
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}
        >
          <CardContent className="p-0">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Vulnerabilidades do ativo
            </p>
            <div className="mt-3 space-y-2 text-xs">
              {relatedVulns.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Nenhuma vulnerabilidade registrada para este ativo.
                </p>
              ) : (
                relatedVulns.map(({ vuln, entry }) => (
                  <div
                    key={`${server.id}-${vuln.id}`}
                    className={cn(
                      "rounded-xl border px-3 py-2",
                      isDark
                        ? "border-white/10 bg-black/20 text-zinc-200"
                        : "border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{vuln.title}</p>
                        <p className="mt-1 text-[11px] text-zinc-500">
                          Status: {entry.status === "active" ? "Aberta" : "Corrigida"}
                          {" · "}Ocorrências: {entry.occurrences}
                          {" · "}Correções: {entry.resolvedCount}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.3em]",
                          severityBadgeClasses[
                            normalizeSeverityLabel(vuln.severity)
                          ]
                        )}
                      >
                        {normalizeSeverityLabel(vuln.severity)}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-zinc-500">
                      Primeira detecção: {formatDate(entry.firstDetectedAt)}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      Ocorrências:{" "}
                      {entry.occurrenceDates.length
                        ? entry.occurrenceDates.map((date) => formatDate(date)).join(" · ")
                        : "-"}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      Correções:{" "}
                      {entry.resolvedDates.length
                        ? entry.resolvedDates.map((date) => formatDate(date)).join(" · ")
                        : "-"}
                    </div>
                    {(() => {
                      const retestHistory = getRetestHistory(vuln.id, server.id);
                      const latestRetest = retestHistory.at(-1);
                      if (!latestRetest) return null;
                      return (
                        <div className="mt-1 text-[11px] text-zinc-500">
                          Reteste:{" "}
                          {latestRetest.status === "requested"
                            ? "Solicitado"
                            : latestRetest.status === "passed"
                            ? "Corrigido"
                            : "Falha"}{" "}
                          · {formatDate(latestRetest.retested_at ?? latestRetest.requested_at)}
                        </div>
                      );
                    })()}
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-[11px]"
                          onClick={() => requestRetest(vuln.id, server.id)}
                        >
                          Enviar para reteste
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-[11px]"
                          onClick={() => completeRetest(vuln.id, server.id, "passed")}
                        >
                          Reteste OK
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-[11px]"
                          onClick={() => completeRetest(vuln.id, server.id, "failed")}
                        >
                          Reteste falhou
                        </Button>
                        <Link
                          href={`/vulnerabilidades/${vuln.id}`}
                          className={cn(
                            "inline-flex rounded-xl border px-3 py-1 text-[11px] font-semibold",
                            isDark
                              ? "border-white/10 text-zinc-200"
                              : "border-slate-200 text-slate-700"
                          )}
                        >
                          Ver vulnerabilidade
                        </Link>
                      </div>
                    </div>
                    {(() => {
                      const retestHistory = getRetestHistory(vuln.id, server.id);
                      const timelineItems = buildTimeline(entry, retestHistory);
                      const timelineKey = `${server.id}-${vuln.id}`;
                      if (timelineItems.length === 0) return null;
                      return (
                        <div className="mt-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                              Linha do tempo
                            </p>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="rounded-full px-3 py-1 text-[10px]"
                              onClick={() => toggleTimeline(timelineKey)}
                            >
                              {expandedTimeline[timelineKey] ? "Recolher" : "Ver"}
                            </Button>
                          </div>
                          {expandedTimeline[timelineKey] && (
                            <div className="mt-3">
                              <div className="relative">
                                <div
                                  className={cn(
                                    "absolute left-3 right-3 top-3 h-px",
                                    isDark ? "bg-white/10" : "bg-slate-200"
                                  )}
                                />
                                <div className="flex flex-wrap gap-4">
                                  {timelineItems.map((item, index) => (
                                    <div
                                      key={`${server.id}-${vuln.id}-${item.label}-${item.date}-${index}`}
                                      className="relative w-[160px] pb-2 text-xs"
                                    >
                                      <span
                                        className={cn(
                                          "absolute left-2 top-2 h-3 w-3 -translate-y-1/2 rounded-full border",
                                          timelineTone(item.tone)
                                        )}
                                      />
                                      <div className="pt-4">
                                        <p className="text-[11px] text-zinc-500">
                                          {formatDate(item.date)}
                                        </p>
                                        <p className="font-semibold">{item.label}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
