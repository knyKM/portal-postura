"use client";

import { useMemo } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Activity,
  AlertTriangle,
  PauseCircle,
  Clock4,
  RefreshCcw,
  Sparkles,
  Gauge,
  Cpu,
} from "lucide-react";
import { useAutomationMonitor } from "@/hooks/use-automation-monitor";
import type { AutomationJobStatus } from "@/data/automation-monitor";

function getJobStatus(jobStatus: AutomationJobStatus) {
  switch (jobStatus) {
    case "running":
      return { icon: Activity, label: "Em execução", className: "text-emerald-400" };
    case "pending":
      return { icon: PauseCircle, label: "Na fila", className: "text-amber-400" };
    case "failed":
      return { icon: AlertTriangle, label: "Falhou", className: "text-rose-400" };
    default:
      return { icon: Clock4, label: "Última execução", className: "text-zinc-400" };
  }
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildCsv(rows: string[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const normalized = String(cell ?? "");
          if (normalized.includes('"') || normalized.includes(",") || normalized.includes("\n")) {
            return `"${normalized.replace(/"/g, '""')}"`;
          }
          return normalized;
        })
        .join(",")
    )
    .join("\n");
}

export default function AuditoriaAutomacoesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { jobs, logs, lastUpdated, isLoading, error, refetch } = useAutomationMonitor(15000);
  const jobStatusCounters = useMemo(
    () =>
      jobs.reduce<Record<AutomationJobStatus, number>>(
        (acc, job) => {
          acc[job.status] = (acc[job.status] ?? 0) + 1;
          return acc;
        },
        { running: 0, pending: 0, failed: 0, success: 0 }
      ),
    [jobs]
  );
  const pendingJobs = useMemo(() => jobs.filter((job) => job.status === "pending"), [jobs]);
  const pendingAverageQueue = pendingJobs.length
    ? Math.round(
        pendingJobs.reduce((acc, job) => acc + job.queueSeconds, 0) / pendingJobs.length
      )
    : 0;
  const totalJobs = jobs.length;
  const healthyJobs = jobStatusCounters.running + jobStatusCounters.success;
  const successRate = totalJobs ? Math.round((healthyJobs / totalJobs) * 100) : 0;
  const highlightCards = useMemo(
    () => [
      {
        id: "stack",
        label: "Plataforma de automação",
        value: `${successRate}%`,
        helper: "Jobs com telemetria saudável",
        icon: Sparkles,
        accent: "from-indigo-500/30 via-sky-500/20 to-purple-500/20",
      },
      {
        id: "queue",
        label: "Fila inteligente",
        value: pendingJobs.length ? `${pendingAverageQueue}s` : "Sem fila",
        helper: pendingJobs.length ? `${pendingJobs.length} jobs aguardando` : "Tudo sincronizado",
        icon: PauseCircle,
        accent: "from-amber-500/20 via-orange-500/10 to-yellow-500/10",
      },
      {
        id: "saude",
        label: "Observabilidade",
        value: `${healthyJobs}/${totalJobs || 1}`,
        helper: `${jobStatusCounters.running} em execução · ${jobStatusCounters.failed} falhas`,
        icon: Gauge,
        accent: "from-emerald-500/20 via-lime-500/10 to-cyan-500/10",
      },
      {
        id: "compute",
        label: "Jobs automatizados",
        value: totalJobs || "Sem jobs",
        helper: "Powered by React 19 + Vite realtime",
        icon: Cpu,
        accent: "from-pink-500/20 via-purple-500/20 to-slate-500/10",
      },
    ],
    [
      healthyJobs,
      jobStatusCounters.failed,
      jobStatusCounters.running,
      pendingAverageQueue,
      pendingJobs.length,
      successRate,
      totalJobs,
    ]
  );
  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  function exportJobs(format: "csv" | "xlsx") {
    const rows = [
      ["id", "nome", "status", "fila_s", "ultima_execucao", "duracao", "pendencias", "owner"],
      ...jobs.map((job) => [
        job.id,
        job.name,
        job.status,
        String(job.queueSeconds ?? ""),
        job.lastRun,
        job.duration,
        String(job.pendingIssues ?? ""),
        job.owner,
      ]),
    ];
    const content = buildCsv(rows);
    downloadFile(
      content,
      `auditoria-automacoes-jobs.${format}`,
      format === "csv"
        ? "text/csv;charset=utf-8"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  }

  function exportLogs(format: "csv" | "xlsx") {
    const rows = [
      ["job_id", "timestamp", "nivel", "mensagem"],
      ...logs.map((log) => [
        log.jobId,
        log.timestamp,
        log.level ?? "",
        log.message,
      ]),
    ];
    const content = buildCsv(rows);
    downloadFile(
      content,
      `auditoria-automacoes-logs.${format}`,
      format === "csv"
        ? "text/csv;charset=utf-8"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  }

  return (
    <DashboardShell
      pageTitle="Auditoria de Automação"
      pageSubtitle="Status em tempo real dos jobs utilizados para sincronizar o Jira"
    >
      <div className="flex w-full flex-col gap-6 px-4 lg:px-10">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border px-6 py-6",
            isDark
              ? "border-white/5 bg-gradient-to-br from-[#090f1f] via-[#050816] to-[#05060f] text-zinc-100"
              : "border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white text-slate-800"
          )}
        >
          <div className="absolute inset-y-0 right-6 hidden w-48 rounded-full bg-gradient-to-b from-sky-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl md:block" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "border-purple-500/60 bg-purple-500/10 text-[11px] uppercase tracking-[0.3em]",
                    isDark ? "text-purple-200" : "text-purple-700"
                  )}
                >
                  Orquestração automática
                </Badge>
                <Badge
                  variant="success"
                  className={cn(
                    "text-[11px]",
                    isDark
                      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  )}
                >
                  Streaming 15s
                </Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                  Observabilidade
                </p>
                <h2 className="text-2xl font-semibold">Auditoria Jira com visual premium</h2>
                <p className="text-sm text-zinc-400">
                  Monitoramento contínuo das automações, inspirado no painel de Ações com a mesma
                  estética React 19 + Vite.
                </p>
              </div>
            </div>
            <div
              className={cn(
                "flex flex-col gap-2 rounded-2xl border p-4 text-xs backdrop-blur lg:w-72",
                isDark
                  ? "border-white/10 bg-white/5 text-zinc-200"
                  : "border-slate-200 bg-white/70 text-slate-600"
              )}
            >
              <div className="flex items-center justify-between text-[11px] uppercase text-zinc-400">
                <span>Refresh inteligente</span>
                <span>{isLoading ? "Atualizando..." : "15s"}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Última captura</span>
                <span>{lastUpdatedLabel}</span>
              </div>
              <div className="flex flex-col gap-2 text-xs text-zinc-400">
                <span
                  className={cn(
                    "inline-flex items-center gap-2",
                    isDark ? "text-zinc-200" : "text-slate-700"
                  )}
                >
                  <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                  {isLoading ? "Atualizando auditoria..." : "Streaming estável"}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={refetch}
                  disabled={isLoading}
                  className={cn(
                    "rounded-full border text-[11px]",
                    isDark
                      ? "border-purple-500/40 text-purple-200 hover:bg-purple-500/10"
                      : "border-purple-200 text-purple-700 hover:bg-purple-50"
                  )}
                >
                  Forçar atualização
                </Button>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "rounded-full border text-[11px]",
                      isDark
                        ? "border-white/10 text-zinc-200 hover:bg-white/10"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={() => exportJobs("csv")}
                  >
                    Exportar jobs CSV
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "rounded-full border text-[11px]",
                      isDark
                        ? "border-white/10 text-zinc-200 hover:bg-white/10"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={() => exportJobs("xlsx")}
                  >
                    Exportar jobs XLSX
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "rounded-full border text-[11px]",
                      isDark
                        ? "border-white/10 text-zinc-200 hover:bg-white/10"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={() => exportLogs("csv")}
                  >
                    Exportar logs CSV
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "rounded-full border text-[11px]",
                      isDark
                        ? "border-white/10 text-zinc-200 hover:bg-white/10"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={() => exportLogs("xlsx")}
                  >
                    Exportar logs XLSX
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
              Falha ao consultar jobs do Jira: {error}
            </div>
          )}
        </div>

        <div className="grid gap-4 pt-2 md:grid-cols-2 xl:grid-cols-4">
          {highlightCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={cn(
                  "relative overflow-hidden rounded-3xl border px-5 py-4",
                  isDark ? "border-zinc-800/80 bg-[#050816]/90" : "border-slate-200 bg-white"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 opacity-60 blur-3xl",
                    `bg-gradient-to-br ${card.accent}`
                  )}
                />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p
                      className={cn(
                        "text-[11px] uppercase tracking-[0.3em]",
                        isDark ? "text-zinc-500" : "text-slate-500"
                      )}
                    >
                      {card.label}
                    </p>
                    <p
                      className={cn(
                        "text-2xl font-semibold",
                        isDark ? "text-zinc-100" : "text-slate-900"
                      )}
                    >
                      {card.value}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-zinc-400" : "text-slate-500")}>
                      {card.helper}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl border p-2",
                      isDark ? "border-white/10 bg-white/10 text-white" : "border-slate-200 bg-slate-50 text-slate-600"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Card
          className={cn(
            "rounded-3xl border",
            isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
          )}
        >
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Jobs monitorados</CardTitle>
              <p className="text-xs text-zinc-500">
                Cada linha exibe status atual, tempo na fila, duração do último run e pendências.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-white/20 text-xs text-white hover:bg-white/10"
              asChild
            >
              <Link href="/auditoria/jobs">Gerenciar jobs</Link>
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className={cn(isDark ? "bg-[#080c1a] text-zinc-400" : "bg-slate-100 text-slate-600")}> 
                <tr>
                  <th className="px-4 py-3">Job</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Na fila</th>
                  <th className="px-4 py-3">Última execução</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3 text-right">Pendências</th>
                </tr>
              </thead>
              <tbody className={isDark ? "bg-[#050816] text-zinc-300" : "bg-white text-slate-600"}>
                {jobs.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-xs text-zinc-500" colSpan={6}>
                      Nenhuma automação ativa foi encontrada.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => {
                    const statusInfo = getJobStatus(job.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr
                        key={job.id}
                        className={cn("border-t", isDark ? "border-zinc-800/60" : "border-slate-200")}
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold">{job.name}</p>
                          <p className="font-mono text-[11px] text-zinc-500">{job.id}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center gap-1", statusInfo.className)}>
                            <StatusIcon className="h-4 w-4" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {job.queueSeconds ? `${job.queueSeconds}s` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <p>{job.lastRun}</p>
                          <p className="text-[11px] text-zinc-500">Duração {job.duration}</p>
                        </td>
                        <td className="px-4 py-3 text-xs">{job.owner}</td>
                        <td className="px-4 py-3 text-right">
                          {job.pendingIssues ? `${job.pendingIssues} issues` : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className={cn("rounded-3xl border", isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white")}>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Últimos logs e alertas</CardTitle>
            <p className="text-xs text-zinc-500">
              Utilize para identificar rapidamente falhas ou filas represadas.
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {logs.length === 0 ? (
              <div
                className={cn(
                  "rounded-2xl border px-4 py-3 text-xs",
                  isDark
                    ? "border-zinc-800 bg-[#081022] text-zinc-300"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                )}
              >
                Sem logs recentes. Assim que uma automação gerar alertas, eles aparecerão aqui.
              </div>
            ) : (
              logs.map((log) => {
                const job = jobs.find((job) => job.id === log.jobId);
                const levelAccent =
                  log.level === "error"
                    ? isDark
                      ? "text-rose-300"
                      : "text-rose-600"
                    : log.level === "warning"
                      ? isDark
                        ? "text-amber-200"
                        : "text-amber-600"
                      : isDark
                        ? "text-zinc-200"
                        : "text-slate-600";
                const badgeClass =
                  log.level === "error"
                    ? isDark
                      ? "border border-rose-500/40 bg-rose-500/5 text-rose-200"
                      : "border border-rose-200 bg-rose-50 text-rose-700"
                    : log.level === "warning"
                      ? isDark
                        ? "border border-amber-400/40 bg-amber-500/5 text-amber-100"
                        : "border border-amber-200 bg-amber-50 text-amber-700"
                      : isDark
                        ? "border border-zinc-700 bg-zinc-800 text-zinc-200"
                        : "border border-slate-200 bg-white text-slate-600";
                return (
                  <div
                    key={`${log.jobId}-${log.timestamp}`}
                    className={cn(
                      "rounded-2xl border px-4 py-3",
                      isDark
                        ? "border-zinc-800 bg-[#081022] text-zinc-200"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                        <span>{job?.name ?? log.jobId}</span>
                        <div className="flex items-center gap-2">
                          {log.level && (
                            <span className={cn("rounded-full px-2 py-0.5 text-[10px]", badgeClass)}>
                              {log.level === "error"
                                ? "Falha"
                                : log.level === "warning"
                                  ? "Alerta"
                                  : "Info"}
                          </span>
                        )}
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                    <p className={cn("mt-1 text-sm", levelAccent)}>{log.message}</p>
                  </div>
                );
              })
            )}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
              Jobs com falha são reexecutados automaticamente em 5 minutos. Se persistir, abra um ticket no Jira para revisão manual.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
