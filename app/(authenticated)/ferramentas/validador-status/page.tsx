"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { CheckCircle2, Filter, RefreshCcw, ShieldAlert } from "lucide-react";

type ActionRequest = {
  id: number;
  action_type: string;
  filter_mode: string;
  filter_value: string;
  requested_status: string | null;
  requester_name: string | null;
  requester_email: string | null;
  status: string;
  created_at: string;
};

type StatusCheckResult = {
  total: number;
  cancelled: Array<{ key: string; status: string }>;
  errors: Array<{ key: string; message: string; status?: number }>;
  filterMode: string;
};

function parseIssueIds(raw: string) {
  return raw
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ValidadorStatusPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ActionRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<StatusCheckResult | null>(null);
  const [removing, setRemoving] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

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

  async function fetchRequests() {
    setError(null);
    setActionMessage(null);
    try {
      const response = await fetch("/api/actions/requests?status=open");
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível carregar as solicitações.");
      }
      const items = (data?.requests ?? []) as ActionRequest[];
      const statusRequests = items.filter((item) => item.action_type === "status");
      setRequests(statusRequests);
      if (statusRequests.length && !selectedId) {
        setSelectedId(statusRequests[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar solicitações.");
    }
  }

  useEffect(() => {
    if (!loading) {
      fetchRequests();
    }
  }, [loading]);

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId]
  );

  async function handleCheck() {
    if (!selectedRequest) return;
    setChecking(true);
    setResult(null);
    setError(null);
    setActionMessage(null);
    try {
      const response = await fetch(
        `/api/actions/requests/${selectedRequest.id}/status-check`
      );
      const data = (await response.json().catch(() => null)) as StatusCheckResult & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao validar os IDs.");
      }
      setResult(data);
      if (!data.cancelled.length) {
        setActionMessage("Nenhum ID com status cancelado foi encontrado.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao validar os IDs.");
    } finally {
      setChecking(false);
    }
  }

  async function handleRemoveCancelled() {
    if (!selectedRequest || !result?.cancelled.length) return;
    setRemoving(true);
    setError(null);
    setActionMessage(null);
    try {
      const response = await fetch(
        `/api/actions/requests/${selectedRequest.id}/prune-cancelled`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            removeIds: result.cancelled.map((item) => item.key),
          }),
        }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível remover os IDs.");
      }
      setRequests((prev) =>
        prev.map((item) =>
          item.id === selectedRequest.id
            ? { ...item, filter_value: data?.request?.filter_value ?? item.filter_value }
            : item
        )
      );
      setActionMessage("IDs cancelados removidos do chamado.");
      setResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao remover IDs.");
    } finally {
      setRemoving(false);
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
      pageTitle="Validador de Status"
      pageSubtitle="Peneire chamados de alteração de status antes da aprovação."
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
              <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                Pré-checagem de chamados
              </p>
              <h2 className="text-2xl font-semibold">
                Chamados de alteração de status
              </h2>
              <p className="text-sm text-zinc-400">
                Verifique se existe algum ID com status cancelado antes de aprovar.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              onClick={fetchRequests}
            >
              <RefreshCcw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card
            className={cn(
              "border",
              isDark
                ? "border-white/10 bg-[#050816] text-zinc-100"
                : "border-slate-200 bg-white text-slate-800"
            )}
          >
            <CardHeader>
              <CardTitle className="text-base">Chamados em aberto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {requests.length === 0 ? (
                <p className="text-sm text-zinc-400">
                  Nenhuma solicitação de alteração de status aberta.
                </p>
              ) : (
                requests.map((request) => (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(request.id);
                      setResult(null);
                      setActionMessage(null);
                    }}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left text-sm transition",
                      request.id === selectedId
                        ? isDark
                          ? "border-purple-500/50 bg-purple-500/10 text-purple-100"
                          : "border-purple-300 bg-purple-50 text-purple-700"
                        : isDark
                        ? "border-white/10 bg-black/20 text-zinc-200 hover:border-white/30"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">#{request.id}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-white/10 text-[11px]",
                          isDark ? "text-zinc-300" : "text-slate-600"
                        )}
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                      {request.requester_name ?? "Solicitante"} ·{" "}
                      {new Date(request.created_at).toLocaleString("pt-BR")}
                    </p>
                  </button>
                ))
              )}
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
              <CardTitle className="text-base">Detalhes do chamado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {!selectedRequest ? (
                <p className="text-zinc-400">
                  Selecione um chamado para iniciar a verificação.
                </p>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                        Solicitante
                      </p>
                      <p className="text-sm text-zinc-200">
                        {selectedRequest.requester_name ?? "—"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {selectedRequest.requester_email ?? ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                        Status alvo
                      </p>
                      <p className="text-sm text-zinc-200">
                        {selectedRequest.requested_status ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                        Conjunto (IDs/JQL)
                      </p>
                      <p className="text-xs text-zinc-500">
                        {selectedRequest.filter_mode === "ids"
                          ? parseIssueIds(selectedRequest.filter_value)
                              .slice(0, 5)
                              .join(", ") +
                            (parseIssueIds(selectedRequest.filter_value).length > 5
                              ? "..."
                              : "")
                          : selectedRequest.filter_value}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                        Tipo de filtro
                      </p>
                      <p className="text-sm text-zinc-200">
                        {selectedRequest.filter_mode.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      onClick={handleCheck}
                      disabled={checking}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      {checking ? "Verificando..." : "Verificar IDs cancelados"}
                    </Button>
                    {result?.cancelled?.length ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleRemoveCancelled}
                        disabled={removing || result.filterMode !== "ids"}
                      >
                        {removing ? "Removendo..." : "Remover IDs cancelados"}
                      </Button>
                    ) : null}
                    {result?.filterMode === "jql" ? (
                      <span className="text-xs text-zinc-500">
                        Chamados por JQL não podem ser filtrados automaticamente.
                      </span>
                    ) : null}
                  </div>

                  {error && (
                    <div
                      className={cn(
                        "rounded-2xl border px-3 py-2 text-xs",
                        isDark
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      )}
                    >
                      {error}
                    </div>
                  )}

                  {actionMessage && (
                    <div
                      className={cn(
                        "rounded-2xl border px-3 py-2 text-xs",
                        isDark
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      )}
                    >
                      {actionMessage}
                    </div>
                  )}

                  {result ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        Total analisado: {result.total}
                      </div>
                      {result.cancelled.length ? (
                        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs">
                          <div className="flex items-center gap-2 text-amber-200">
                            <ShieldAlert className="h-4 w-4" />
                            IDs com status cancelado
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {result.cancelled.map((item) => (
                              <span
                                key={item.key}
                                className={cn(
                                  "rounded-full border px-3 py-1 text-[11px]",
                                  isDark
                                    ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
                                    : "border-amber-200 bg-amber-50 text-amber-700"
                                )}
                              >
                                {item.key} · {item.status}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
                          Nenhum ID cancelado foi encontrado.
                        </div>
                      )}
                      {result.errors.length ? (
                        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
                          <p className="font-semibold">
                            IDs com erro de consulta
                          </p>
                          <ul className="mt-2 space-y-1">
                            {result.errors.map((item) => (
                              <li key={item.key}>
                                {item.key}: {item.message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardShell>
  );
}
