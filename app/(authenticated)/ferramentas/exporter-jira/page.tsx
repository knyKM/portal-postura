"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { Download, Filter, Search } from "lucide-react";
import jiraFieldsJson from "@/data/jira-fields.json";

type JiraField = {
  id: string;
  name: string;
  custom: boolean;
  clauseNames?: string[];
};

type LinkedIssueSubfield = {
  id: string;
  name: string;
  description: string;
};

type ExportJob = {
  id: number;
  jql: string;
  fields_json: string;
  status: "queued" | "running" | "completed" | "failed";
  file_name: string | null;
  error_message: string | null;
  expires_at: string | null;
  total_issues: number | null;
  processed_issues: number | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
};

function getExpirationLabel(expiresAt: string | null) {
  if (!expiresAt) return null;
  const expires = new Date(expiresAt);
  if (Number.isNaN(expires.getTime())) return null;
  const diffMs = expires.getTime() - Date.now();
  if (diffMs <= 0) return "Expirado";
  const totalMinutes = Math.ceil(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getProgressPercent(job: ExportJob) {
  if (!job.total_issues || !job.processed_issues) return 0;
  return Math.min(100, Math.round((job.processed_issues / job.total_issues) * 100));
}

function getEtaLabel(job: ExportJob) {
  if (!job.started_at || !job.processed_issues || !job.total_issues) return "—";
  if (job.processed_issues <= 0) return "—";
  const start = new Date(job.started_at);
  if (Number.isNaN(start.getTime())) return "—";
  const elapsedMs = Date.now() - start.getTime();
  if (elapsedMs <= 0) return "—";
  const rateMsPerIssue = elapsedMs / job.processed_issues;
  const remainingIssues = Math.max(0, job.total_issues - job.processed_issues);
  const remainingMs = remainingIssues * rateMsPerIssue;
  if (remainingMs <= 0) return "—";
  const totalMinutes = Math.ceil(remainingMs / 60000);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

const baseFieldCatalog = jiraFieldsJson as JiraField[];
const fieldCatalog: JiraField[] = [
  { id: "key", name: "Issue Key", custom: false },
  ...baseFieldCatalog,
];

const linkedIssueSubfields: LinkedIssueSubfield[] = [
  { id: "issuelinks.issueKey", name: "Issue Key", description: "Chave da issue ligada." },
  { id: "issuelinks.summary", name: "Summary", description: "Resumo da issue ligada." },
  { id: "issuelinks.status", name: "Status", description: "Status atual da issue ligada." },
  { id: "issuelinks.type", name: "Issue Type", description: "Tipo da issue ligada." },
  { id: "issuelinks.priority", name: "Priority", description: "Prioridade da issue ligada." },
  { id: "issuelinks.linkType", name: "Link Type", description: "Tipo do vínculo." },
  {
    id: "issuelinks.direction",
    name: "Direção",
    description: "Direção do vínculo (inward/outward).",
  },
];

function normalizeSelectedFields(fields: string[]) {
  const hasLinkedSubfields = fields.some((field) => field.startsWith("issuelinks."));
  if (!hasLinkedSubfields) return fields;
  return fields.filter((field) => field !== "issuelinks");
}

export default function ExporterJiraPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [jql, setJql] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>(["key", "summary"]);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
    } catch {
      router.replace("/login");
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  async function fetchJobs() {
    setJobsLoading(true);
    try {
      const response = await fetch("/api/jira-export/jobs");
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível carregar as exportações.");
      }
      setJobs(data?.jobs ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar exportações.");
    } finally {
      setJobsLoading(false);
    }
  }

  useEffect(() => {
    if (!loading) {
      fetchJobs();
    }
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    const interval = window.setInterval(() => {
      fetchJobs();
    }, 5000);
    return () => window.clearInterval(interval);
  }, [loading]);

  const filteredFields = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return fieldCatalog;
    return fieldCatalog.filter((field) => {
      const haystack = [
        field.name,
        field.id,
        ...(field.clauseNames ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [search]);

  function toggleField(fieldId: string) {
    setSelectedFields((prev) => {
      if (prev.includes(fieldId)) {
        const next = prev.filter((item) => item !== fieldId);
        if (fieldId === "issuelinks") {
          return next.filter((item) => !item.startsWith("issuelinks."));
        }
        if (fieldId.startsWith("issuelinks.")) {
          const remainingLinked = next.some((item) => item.startsWith("issuelinks."));
          return remainingLinked ? next : next.filter((item) => item !== "issuelinks");
        }
        return next;
      }
      if (fieldId.startsWith("issuelinks.")) {
        return prev.includes("issuelinks")
          ? [...prev, fieldId]
          : [...prev, "issuelinks", fieldId];
      }
      return [...prev, fieldId];
    });
  }

  function handleSelectAll() {
    setSelectedFields([
      ...fieldCatalog.map((field) => field.id),
      ...linkedIssueSubfields.map((field) => field.id),
    ]);
  }

  function handleClearAll() {
    setSelectedFields([]);
  }

  async function handleExport() {
    setExporting(true);
    setError(null);
    setMessage(null);
    try {
      const hasLinkedIssues = selectedFields.includes("issuelinks");
      const hasLinkedSubfields = selectedFields.some((field) =>
        field.startsWith("issuelinks.")
      );
      if (hasLinkedIssues && !hasLinkedSubfields) {
        throw new Error(
          "Selecione pelo menos um subcampo em Linked Issues para exportar."
        );
      }
      const fieldsForExport = normalizeSelectedFields(selectedFields);
      const response = await fetch("/api/jira-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jql, fields: fieldsForExport }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "Falha ao exportar.");
      }
      setMessage("Solicitação enviada. A exportação está sendo processada.");
      await fetchJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao exportar.");
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-sm text-zinc-400">
        Carregando...
      </div>
    );
  }

  return (
    <DashboardShell
      pageTitle="Exporter Jira"
      pageSubtitle="Extraia relatórios em CSV a partir de uma JQL."
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        <section
          className={cn(
            "rounded-3xl border px-6 py-6",
            isDark
              ? "border-white/10 bg-[#050816] text-zinc-100"
              : "border-slate-200 bg-white text-slate-800"
          )}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge
                variant="outline"
                className={cn(
                  "border-purple-500/60 bg-purple-500/10 text-[11px] uppercase tracking-[0.3em]",
                  isDark ? "text-purple-200" : "text-purple-700"
                )}
              >
                Exportação Jira
              </Badge>
              <h2 className="mt-2 text-2xl font-semibold">
                Relatórios sob demanda
              </h2>
              <p className="text-sm text-zinc-400">
                Informe a JQL e selecione os campos que deseja incluir no CSV.
              </p>
            </div>
            <Button
              type="button"
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? "Exportando..." : "Exportar CSV"}
            </Button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card
            className={cn(
              "border",
              isDark
                ? "border-white/10 bg-[#050816] text-zinc-100"
                : "border-slate-200 bg-white text-slate-800"
            )}
          >
            <CardHeader>
              <CardTitle className="text-base">JQL da extração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  value={jql}
                  onChange={(event) => setJql(event.target.value)}
                  placeholder="project = ASSETN AND status = 'In Analysis'"
                  className={cn(
                    "pl-9 text-sm",
                    isDark
                      ? "border-white/10 bg-black/40 text-white"
                      : "border-slate-200 bg-white"
                  )}
                />
              </div>
              <p className="text-xs text-zinc-500">
                A consulta seguirá o padrão do Jira Data Center (/rest/api/2/search).
              </p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border",
              isDark
                ? "border-white/10 bg-[#050816] text-zinc-100"
                : "border-slate-200 bg-white text-slate-800"
            )}
          >
            <CardHeader>
              <CardTitle className="text-base">Campos da exportação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar campo pelo nome ou ID"
                  className={cn(
                    "pl-9 text-sm",
                    isDark
                      ? "border-white/10 bg-black/40 text-white"
                      : "border-slate-200 bg-white"
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Button type="button" variant="secondary" onClick={handleSelectAll}>
                  Selecionar todos
                </Button>
                <Button type="button" variant="secondary" onClick={handleClearAll}>
                  Limpar seleção
                </Button>
                <span className="text-zinc-500">
                  {selectedFields.length} selecionado(s)
                </span>
              </div>
              <ScrollArea className="h-[360px] rounded-2xl border border-white/10 p-3">
                <div className="space-y-2">
                  {filteredFields.map((field) => {
                    const checked = selectedFields.includes(field.id);
                    const isLinkedIssues = field.id === "issuelinks";
                    const linkedSubfieldsSelected = selectedFields.some((item) =>
                      item.startsWith("issuelinks.")
                    );
                    return (
                      <div key={field.id} className="space-y-2">
                        <label
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-xs",
                            checked
                              ? isDark
                                ? "border-purple-500/50 bg-purple-500/10 text-purple-100"
                                : "border-purple-300 bg-purple-50 text-purple-700"
                              : isDark
                              ? "border-white/10 bg-black/20 text-zinc-200"
                              : "border-slate-200 bg-white text-slate-700"
                          )}
                        >
                          <div>
                            <p className="font-semibold">{field.name}</p>
                            <p className="text-[11px] text-zinc-500">{field.id}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleField(field.id)}
                          />
                        </label>
                        {isLinkedIssues && checked && (
                          <div
                            className={cn(
                              "rounded-xl border border-dashed px-3 py-2 text-[11px]",
                              isDark
                                ? "border-white/10 bg-black/30 text-zinc-300"
                                : "border-slate-200 bg-slate-50 text-slate-600"
                            )}
                          >
                            <p className="text-xs font-semibold text-zinc-400">
                              Subcampos de Linked Issues
                            </p>
                            <p className="mt-1 text-[11px] text-zinc-500">
                              Escolha quais informações das issues vinculadas deseja
                              exportar.
                            </p>
                            <div className="mt-3 grid gap-2 md:grid-cols-2">
                              {linkedIssueSubfields.map((subfield) => {
                                const subChecked = selectedFields.includes(subfield.id);
                                return (
                                  <label
                                    key={subfield.id}
                                    className={cn(
                                      "flex items-start justify-between gap-2 rounded-lg border px-3 py-2 text-[11px]",
                                      subChecked
                                        ? isDark
                                          ? "border-purple-400/40 bg-purple-500/10 text-purple-100"
                                          : "border-purple-200 bg-purple-50 text-purple-700"
                                        : isDark
                                        ? "border-white/10 bg-black/20 text-zinc-200"
                                        : "border-slate-200 bg-white text-slate-700"
                                    )}
                                  >
                                    <div>
                                      <p className="font-semibold">{subfield.name}</p>
                                      <p className="text-[10px] text-zinc-500">
                                        {subfield.description}
                                      </p>
                                    </div>
                                    <input
                                      type="checkbox"
                                      checked={subChecked}
                                      onChange={() => toggleField(subfield.id)}
                                    />
                                  </label>
                                );
                              })}
                            </div>
                            {!linkedSubfieldsSelected && (
                              <p className="mt-2 text-[11px] text-amber-300">
                                Selecione pelo menos um subcampo para exportar.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card
            className={cn(
              "border",
              isDark
                ? "border-white/10 bg-[#050816] text-zinc-100"
                : "border-slate-200 bg-white text-slate-800"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Minhas exportações</CardTitle>
              <Button type="button" variant="secondary" onClick={fetchJobs}>
                Atualizar
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {jobsLoading ? (
                <p className="text-zinc-400">Carregando exportações...</p>
              ) : jobs.length === 0 ? (
                <p className="text-zinc-400">Nenhuma exportação solicitada.</p>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className={cn(
                      "flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
                      isDark
                        ? "border-white/10 bg-black/20 text-zinc-200"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">#{job.id}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "border-white/10 text-[11px]",
                            isDark ? "text-zinc-300" : "text-slate-600"
                          )}
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {new Date(job.created_at).toLocaleString("pt-BR")}
                      </p>
                      {job.expires_at && job.status === "completed" && (
                        <p className="mt-1 text-xs text-zinc-500">
                          Expira em {getExpirationLabel(job.expires_at)}
                        </p>
                      )}
                      {job.error_message && (
                        <p className="mt-1 text-xs text-rose-300">
                          {job.error_message}
                        </p>
                      )}
                      {job.status !== "completed" && job.status !== "failed" ? (
                        <div className="mt-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
                            <span>
                              {job.processed_issues ?? 0}/{job.total_issues ?? 0} issues
                            </span>
                            <span>ETA: {getEtaLabel(job)}</span>
                            <span>{getProgressPercent(job)}%</span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                              style={{ width: `${getProgressPercent(job)}%` }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === "completed" ? (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            window.location.href = `/api/jira-export/jobs/${job.id}/download`;
                          }}
                        >
                          Baixar CSV
                        </Button>
                      ) : (
                        <span className="text-xs text-zinc-500">
                          {job.status === "running"
                            ? "Processando..."
                            : job.status === "queued"
                            ? "Na fila"
                            : "Erro"}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        {error && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isDark
                ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            {error}
          </div>
        )}
        {message && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isDark
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}
          >
            {message}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
