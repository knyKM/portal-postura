"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ApprovalQueue } from "@/components/actions/approval-queue";
import { ClipboardCheck, ShieldCheck, TimerReset, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

type ActionField = { key: string; value: string };

type ActionPayload = {
  assignee?: string;
  comment?: string;
  labels?: string[];
  fields?: ActionField[];
};

type ApprovalRequest = {
  id: number;
  action_type: "status" | "assignee" | "comment" | "labels" | "fields";
  filter_mode: string;
  filter_value: string;
  requested_status: string | null;
  payload: ActionPayload | null;
  requester_name: string | null;
  requester_email: string | null;
  created_at: string;
  status?: string;
  audit_notes?: string | null;
};

type OnlineApprover = {
  id: number;
  name: string;
  email: string;
  last_seen_at: string | null;
};

export default function FilaAprovacoesPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [pendingRequests, setPendingRequests] = useState<ApprovalRequest[]>([]);
  const [completedRequests, setCompletedRequests] = useState<ApprovalRequest[]>([]);
  const [onlineApprovers, setOnlineApprovers] = useState<OnlineApprover[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusRequestId, setFocusRequestId] = useState<number | null>(null);
  const pendingCount = pendingRequests.length;
  const completedCount = completedRequests.length;
  const onlineCount = onlineApprovers.length;

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
    const pendingFetch = fetch("/api/actions/requests?status=pending", {
      method: "GET",
      signal: controller.signal,
    }).then((res) => res.json().catch(() => null));

    const historyFetch = fetch("/api/actions/requests?status=completed", {
      method: "GET",
      signal: controller.signal,
    }).then((res) => res.json().catch(() => null));

    const onlineFetch = fetch("/api/users/online", {
      method: "GET",
      signal: controller.signal,
    }).then((res) => res.json().catch(() => null));

    Promise.all([pendingFetch, historyFetch, onlineFetch])
      .then(([pendingData, historyData, onlineData]) => {
        if (pendingData?.error) {
          throw new Error(pendingData.error);
        }
        if (historyData?.error) {
          throw new Error(historyData.error);
        }
        if (onlineData?.error) {
          throw new Error(onlineData.error);
        }
        setPendingRequests(pendingData?.requests ?? []);
        setCompletedRequests(historyData?.requests ?? []);
        setOnlineApprovers(onlineData?.users ?? []);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : "Não foi possível carregar a fila."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    const match = hash.match(/request-(\d+)/);
    if (match) {
      setFocusRequestId(Number(match[1]));
    }
  }, []);

  return (
    <DashboardShell
      pageTitle="Fila de Aprovações"
      pageSubtitle="Análise e auditoria de ações em massa"
    >
      <div className="flex w-full flex-col gap-6 px-4 lg:px-10">
        <section
          className={cn(
            "relative overflow-hidden rounded-4xl border px-6 py-8 shadow-[0_25px_90px_rgba(0,0,0,0.25)]",
            isDark
              ? "border-white/5 bg-gradient-to-br from-[#060818] via-[#050818] to-[#020208]"
              : "border-slate-200 bg-gradient-to-br from-white to-slate-100"
          )}
        >
          <div className="absolute inset-0 flex justify-end opacity-50">
            <div className="h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
          </div>
          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                    Auditoria operacional
                  </p>
                  <h2 className="text-3xl font-semibold text-white">
                    Aprovações críticas em tempo real
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Cards com tudo o que você precisa para liberar ou barrar ações em massa com segurança.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "rounded-2xl text-xs font-semibold uppercase tracking-[0.2em]",
                    isDark
                      ? "border-white/10 text-zinc-200 hover:border-white/30"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  )}
                  onClick={() => router.push("/fila-aprovacoes/executando")}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Execuções em andamento
                </Button>
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em]",
                    isDark
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  )}
                >
                  Auditoria ativa · 24/7
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Pendentes",
                  value: pendingCount,
                  icon: TimerReset,
                  accent: isDark
                    ? "from-amber-500/30 to-rose-500/20 text-amber-200"
                    : "from-amber-100 to-orange-100 text-amber-600",
                },
                {
                  label: "Decididas",
                  value: completedCount,
                  icon: ShieldCheck,
                  accent: isDark
                    ? "from-emerald-500/20 to-teal-500/10 text-emerald-200"
                    : "from-emerald-50 to-teal-50 text-emerald-600",
                },
                {
                  label: "Aprovadores online",
                  value: onlineCount,
                  icon: Users,
                  accent: isDark
                    ? "from-indigo-500/20 to-purple-500/20 text-indigo-200"
                    : "from-indigo-50 to-purple-50 text-indigo-600",
                  detail: (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {onlineApprovers.length === 0 ? (
                        <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                          Nenhum administrador ativo
                        </span>
                      ) : (
                        onlineApprovers.map((admin) => (
                          <span
                            key={admin.id}
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-[0.3em]",
                              isDark
                                ? "border-white/10 text-white"
                                : "border-slate-200 text-slate-700"
                            )}
                          >
                            {admin.name.split(" ")[0]}
                          </span>
                        ))
                      )}
                    </div>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 rounded-3xl border px-4 py-4",
                    isDark
                      ? "border-white/5 bg-white/5 text-white"
                      : "border-slate-200 bg-white text-slate-900"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
                      item.accent
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                      {item.label}
                    </p>
                    <p className="text-xl font-semibold">
                      {typeof item.value === "number"
                        ? item.value.toString().padStart(2, "0")
                        : item.value}
                    </p>
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {error && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isDark
                ? "border-rose-500/50 bg-rose-500/10 text-rose-100"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            className={cn(
              "rounded-3xl border px-4 py-6 text-center text-sm",
              isDark
                ? "border-zinc-800 bg-[#050816]/80 text-zinc-400"
                : "border-slate-200 bg-white text-slate-600"
            )}
          >
            Carregando fila de aprovações...
          </div>
        ) : (
          <div
            className={cn(
              "rounded-4xl border p-2 sm:p-4 lg:p-6",
              isDark
                ? "border-white/5 bg-[#050714]"
                : "border-slate-200 bg-white"
            )}
          >
            <ApprovalQueue
              pending={pendingRequests}
              completed={completedRequests}
              focusRequestId={focusRequestId}
            />
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
