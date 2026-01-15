"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

type JobItem = {
  id: number;
  request_id: number;
  status: string;
  error_message: string | null;
  total_issues: number | null;
  processed_issues: number | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  action_type: string | null;
  requested_status: string | null;
};

export default function AcoesExecutandoPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobsPaused, setJobsPaused] = useState(false);
  const [jobsMessage, setJobsMessage] = useState<string | null>(null);
  const [jobsActionError, setJobsActionError] = useState<string | null>(null);
  const [jobsActionLoading, setJobsActionLoading] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "failed">("all");
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
      const parsed = JSON.parse(raw) as { role?: string };
      if (parsed?.role !== "admin") {
        router.replace("/dashboard");
        return;
      }
    } catch {
      router.replace("/login");
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const jobsFetch = fetch("/api/actions/jobs?status=all", {
      method: "GET",
      signal: controller.signal,
    }).then((res) => res.json().catch(() => null));

    const settingsFetch = fetch("/api/actions/jobs?settings=1", {
      method: "GET",
      signal: controller.signal,
    }).then((res) => res.json().catch(() => null));

    Promise.all([jobsFetch, settingsFetch])
      .then(([jobsData, settingsData]) => {
        if (jobsData?.error) {
          throw new Error(jobsData.error);
        }
        if (settingsData?.error) {
          throw new Error(settingsData.error);
        }
        setJobs(jobsData?.jobs ?? []);
        if (typeof settingsData?.paused === "boolean") {
          setJobsPaused(settingsData.paused);
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Falha ao carregar.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [router]);

  return (
    <DashboardShell
      pageTitle="Execuções em andamento"
      pageSubtitle="Monitoramento das ações em processamento"
    >
      <div className="flex w-full flex-col gap-4 px-4 lg:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => router.push("/fila-aprovacoes")}
          >
            Voltar para aprovações
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className={cn(
                "rounded-xl",
                filterMode === "failed"
                  ? isDark
                    ? "border-rose-500/50 text-rose-200"
                    : "border-rose-300 text-rose-700"
                  : undefined
              )}
              onClick={() =>
                setFilterMode((prev) => (prev === "failed" ? "all" : "failed"))
              }
            >
              {filterMode === "failed" ? "Mostrar tudo" : "Somente erros"}
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={jobsActionLoading}
              onClick={async () => {
                setJobsActionLoading(true);
                setJobsActionError(null);
                setJobsMessage(null);
                try {
                  const response = await fetch("/api/actions/jobs", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ paused: true }),
                  });
                  const data = await response.json().catch(() => null);
                  if (!response.ok) {
                    throw new Error(data?.error || "");
                  }
                  setJobsPaused(true);
                  setJobsMessage("Fila pausada. Novas execuções não serão iniciadas.");
                } catch (err) {
                  setJobsActionError(err instanceof Error ? err.message : "");
                } finally {
                  setJobsActionLoading(false);
                }
              }}
            >
              Pausar fila
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={jobsActionLoading}
              onClick={async () => {
                setJobsActionLoading(true);
                setJobsActionError(null);
                setJobsMessage(null);
                try {
                  const response = await fetch("/api/actions/jobs", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resume: true }),
                  });
                  const data = await response.json().catch(() => null);
                  if (!response.ok) {
                    throw new Error(data?.error || "");
                  }
                  setJobsPaused(false);
                  setJobsMessage(
                    `Execuções retomadas (${data?.resumed ?? 0} em fila).`
                  );
                } catch (err) {
                  setJobsActionError(err instanceof Error ? err.message : "");
                } finally {
                  setJobsActionLoading(false);
                }
              }}
            >
              Retomar fila
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => router.refresh()}
            >
              Atualizar
            </Button>
          </div>
        </div>

        {jobsPaused && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-xs",
              isDark
                ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                : "border-amber-200 bg-amber-50 text-amber-700"
            )}
          >
            Fila pausada: novas execuções ficam em espera. Jobs já em execução
            continuam até finalizar.
          </div>
        )}
        {jobsActionError && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-xs",
              isDark
                ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            {jobsActionError}
          </div>
        )}
        {jobsMessage && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-xs",
              isDark
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}
          >
            {jobsMessage}
          </div>
        )}

        {error && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isDark
                ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
            Carregando execuções...
          </p>
        ) : jobs.filter((job) => (filterMode === "failed" ? job.status === "failed" : true))
            .length === 0 ? (
          <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
            {filterMode === "failed"
              ? "Nenhuma execução com erro."
              : "Nenhuma execução registrada."}
          </p>
        ) : (
          <div className="space-y-3">
            {jobs
              .filter((job) =>
                filterMode === "failed" ? job.status === "failed" : true
              )
              .map((job) => (
              <div
                key={job.id}
                className={cn(
                  "rounded-3xl border px-5 py-4",
                  isDark
                    ? "border-white/5 bg-[#050816] text-white"
                    : "border-slate-200 bg-white text-slate-900"
                )}
                onClick={() => {
                  if (job.status === "running") {
                    setExpandedJobId((prev) => (prev === job.id ? null : job.id));
                  }
                }}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Execução #{job.id} · Solicitação #{job.request_id}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-zinc-400" : "text-slate-500")}>
                      {job.action_type ?? "-"} · {job.requested_status ?? "-"}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]",
                      job.status === "running"
                        ? "bg-amber-500/10 text-amber-300"
                        : job.status === "queued"
                        ? "bg-sky-500/10 text-sky-300"
                        : "bg-slate-500/10 text-slate-400"
                    )}
                  >
                    {job.status}
                  </span>
                </div>
                {job.status === "running" && (
                  <div className="mt-3 space-y-2">
                    <p className={cn("text-xs", isDark ? "text-zinc-400" : "text-slate-500")}>
                      Progresso{" "}
                      {typeof job.processed_issues === "number" &&
                      typeof job.total_issues === "number" &&
                      job.total_issues > 0
                        ? `(${job.processed_issues}/${job.total_issues})`
                        : "(calculando...)"
                      }
                    </p>
                    <div className={cn("h-2 w-full rounded-full", isDark ? "bg-white/10" : "bg-slate-200")}>
                      <div
                        className={cn(
                          "h-2 rounded-full",
                          isDark ? "bg-purple-500" : "bg-purple-600"
                        )}
                        style={{
                          width:
                            typeof job.processed_issues === "number" &&
                            typeof job.total_issues === "number" &&
                            job.total_issues > 0
                              ? `${Math.min(
                                  100,
                                  Math.round(
                                    (job.processed_issues / job.total_issues) * 100
                                  )
                                )}%`
                              : "8%",
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="mt-2 text-xs">
                  <p>Início: {job.started_at ?? "-"}</p>
                  <p>Fim: {job.finished_at ?? "-"}</p>
                  {job.error_message && <p>Erro: {job.error_message}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
