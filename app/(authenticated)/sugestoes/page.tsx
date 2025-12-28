"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { Sparkles, User, Mail, RefreshCcw, Clock3, PenSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type SuggestionItem = {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  content: string;
  status: "pending" | "approved" | string;
  implementationStage: string | null;
  createdAt: string;
};

export default function SuggestionsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
const [actioningId, setActioningId] = useState<number | null>(null);
const [stageUpdatingId, setStageUpdatingId] = useState<number | null>(null);
const [ideaContent, setIdeaContent] = useState("");
const [ideaError, setIdeaError] = useState<string | null>(null);
const [ideaSuccess, setIdeaSuccess] = useState<string | null>(null);
const [submittingIdea, setSubmittingIdea] = useState(false);
const [isAdmin, setIsAdmin] = useState(false);

  async function fetchSuggestions(signal?: AbortSignal) {
    setError(null);
    try {
      const response = await fetch("/api/suggestions", { signal });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível carregar sugestões.");
      }
      setSuggestions(data?.suggestions ?? []);
    } catch (err) {
      if (signal?.aborted) return;
      setError(
        err instanceof Error
          ? err.message
          : "Falha inesperada ao carregar sugestões."
      );
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const controller = new AbortController();
    let isMounted = true;

    async function bootstrap() {
      try {
        const raw = localStorage.getItem("postura_user");
        if (!raw) {
          router.replace("/login");
          return;
        }
        const parsed = JSON.parse(raw) as { role?: string };
        if (isMounted) {
          setIsAdmin(parsed?.role === "admin");
        }
      } catch {
        router.replace("/login");
        return;
      }

      setLoading(true);
      await fetchSuggestions(controller.signal);
      if (isMounted) {
        setLoading(false);
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [router]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchSuggestions();
    setRefreshing(false);
  }

  const totalSuggestions = suggestions.length;
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "America/Sao_Paulo",
      }),
    []
  );

  function formatDate(value: string) {
    try {
      return dateFormatter.format(new Date(value));
    } catch {
      return value;
    }
  }

  const pendingSuggestions = suggestions.filter(
    (item) => item.status !== "approved"
  );
  const approvedSuggestions = suggestions.filter(
    (item) => item.status === "approved"
  );

  const pipelineStages = [
    "Descoberta",
    "Planejamento",
    "Desenvolvimento",
    "QA",
    "Go-live",
  ];

  async function handleSubmitIdea() {
    const trimmed = ideaContent.trim();
    setIdeaError(null);
    setIdeaSuccess(null);

    if (!trimmed) {
      setIdeaError("Descreva a ideia antes de enviar.");
      return;
    }

    if (trimmed.length > 2000) {
      setIdeaError("Resuma sua ideia em até 2000 caracteres.");
      return;
    }

    setSubmittingIdea(true);
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível registrar sua ideia.");
      }
      if (data?.suggestion) {
        setSuggestions((prev) => [data.suggestion, ...prev]);
      }
      setIdeaContent("");
      setIdeaSuccess("Recebemos sua sugestão! Ela aparece abaixo para revisão.");
    } catch (err) {
      setIdeaError(
        err instanceof Error
          ? err.message
          : "Erro inesperado ao registrar sugestão."
      );
    } finally {
      setSubmittingIdea(false);
    }
  }

  async function handleApproveSuggestion(id: number) {
    if (!isAdmin) {
      setError("Apenas administradores podem aprovar sugestões.");
      return;
    }
    setActioningId(id);
    setError(null);
    try {
      const response = await fetch("/api/suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: "approved",
          implementationStage: "Descoberta",
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao aprovar sugestão.");
      }
      setSuggestions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...data.suggestion } : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao aprovar a sugestão."
      );
    } finally {
      setActioningId(null);
    }
  }

  async function handleRejectSuggestion(id: number) {
    if (!isAdmin) {
      setError("Apenas administradores podem descartar sugestões.");
      return;
    }
    setActioningId(id);
    setError(null);
    try {
      const response = await fetch("/api/suggestions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao remover sugestão.");
      }
      setSuggestions((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao remover a sugestão."
      );
    } finally {
      setActioningId(null);
    }
  }

  async function handleStageChange(id: number, stage: string) {
    if (!isAdmin) return;
    setStageUpdatingId(id);
    setError(null);
    try {
      const response = await fetch("/api/suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, implementationStage: stage }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao atualizar etapa.");
      }
      setSuggestions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...data.suggestion } : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar etapa.");
    } finally {
      setStageUpdatingId(null);
    }
  }

  return (
    <DashboardShell
      pageTitle="Sugestões e Ideias"
      pageSubtitle="Feedback de automações, ferramentas e indicadores enviados pela comunidade"
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border px-6 py-6",
            isDark
              ? "border-white/5 bg-gradient-to-br from-[#0a0f25] via-[#050816] to-[#05060f] text-zinc-100"
              : "border-slate-200 bg-white text-slate-800"
          )}
        >
          <div className="absolute inset-y-0 right-10 hidden w-60 rounded-full bg-gradient-to-b from-purple-500/30 via-pink-500/20 to-orange-400/30 blur-3xl md:block" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
                <Sparkles className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-200">
                  Radar de Inovação
                </p>
                <h2 className="text-2xl font-semibold">
                  Laboratório de sugestões do Postura SM
                </h2>
                <p
                  className={cn(
                    "text-sm",
                    isDark ? "text-zinc-400" : "text-slate-500"
                  )}
                >
                  Cada ideia registrada aqui vira subsídio para priorizar novas automações e integrações.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-sm md:items-end">
              <div
                className={cn(
                  "rounded-2xl border px-4 py-3 text-xs uppercase tracking-[0.3em]",
                  isDark
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                )}
              >
                {totalSuggestions} sugestões ativas
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                  refreshing || loading
                    ? isDark
                      ? "cursor-not-allowed bg-zinc-700/50 text-zinc-400"
                      : "cursor-not-allowed bg-slate-200 text-slate-500"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:scale-[1.02]"
                )}
              >
                <RefreshCcw
                  className={cn(
                    "h-4 w-4",
                    refreshing ? "animate-spin" : undefined
                  )}
                />
                Atualizar feed
              </button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "rounded-3xl border px-6 py-5",
            isDark
              ? "border-white/5 bg-gradient-to-br from-[#090f1f] via-[#070b18] to-[#05060f]"
              : "border-slate-200 bg-white"
          )}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                Sugerir nova ideia
              </p>
              <h3
                className={cn(
                  "text-xl font-semibold",
                  isDark ? "text-white" : "text-slate-900"
                )}
              >
                Compartilhe oportunidades para novos recursos
              </h3>
              <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
                Explique o problema, qual impacto vê nos times e o que deveríamos automatizar.
              </p>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]",
                isDark
                  ? "bg-white/10 text-white"
                  : "bg-slate-100 text-slate-700"
              )}
            >
              <PenSquare className="h-4 w-4" />
              Ideias frescas
            </span>
          </div>
          <div className="mt-4 space-y-3">
            <Textarea
              placeholder="Descreva aqui sua sugestão..."
              value={ideaContent}
              onChange={(event) => setIdeaContent(event.target.value)}
              className={cn(
                "min-h-[140px]",
                isDark
                  ? "border-white/10 bg-black/30 text-white"
                  : "border-slate-300 bg-white text-slate-800"
              )}
            />
            <div className="flex flex-col gap-2 text-sm md:flex-row md:items-center md:justify-between">
              <span className={cn("text-xs", isDark ? "text-zinc-500" : "text-slate-500")}>
                {ideaContent.length} / 2000 caracteres
              </span>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                {ideaError && (
                  <span className="text-xs text-rose-400">{ideaError}</span>
                )}
                {ideaSuccess && (
                  <span className="text-xs text-emerald-400">{ideaSuccess}</span>
                )}
                <button
                  type="button"
                  onClick={handleSubmitIdea}
                  disabled={submittingIdea}
                  className={cn(
                    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
                    submittingIdea
                      ? "cursor-not-allowed bg-purple-400/30 text-purple-100"
                      : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:scale-[1.01]"
                  )}
                >
                  {submittingIdea ? "Enviando..." : "Registrar sugestão"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {!isAdmin && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isDark
                ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
                : "border-amber-200 bg-amber-50 text-amber-700"
            )}
          >
            Você está visualizando o mural de ideias. Apenas administradores podem aprovar ou descartar sugestões.
          </div>
        )}

        {error && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isDark
                ? "border-rose-500/60 bg-rose-500/10 text-rose-100"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            className={cn(
              "rounded-3xl border px-6 py-10 text-center text-sm",
              isDark
                ? "border-white/5 bg-black/30 text-zinc-400"
                : "border-slate-200 bg-white text-slate-600"
            )}
          >
            Carregando sugestões em tempo real...
          </div>
        ) : suggestions.length === 0 ? (
          <div
            className={cn(
              "rounded-3xl border px-6 py-10 text-center",
              isDark
                ? "border-white/5 bg-black/20 text-zinc-300"
                : "border-slate-200 bg-white text-slate-600"
            )}
          >
            Nenhuma sugestão foi enviada ainda. Incentive os times a registrar ideias pelo painel do changelog.
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {pendingSuggestions.length === 0 ? (
                <div
                  className={cn(
                    "rounded-3xl border px-6 py-6 text-center text-sm",
                    isDark
                      ? "border-white/5 bg-black/20 text-zinc-400"
                      : "border-slate-200 bg-white text-slate-600"
                  )}
                >
                  Não há sugestões pendentes de revisão. Aguarde novos envios da
                  comunidade.
                </div>
              ) : (
                pendingSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={cn(
                      "rounded-3xl border p-5 transition",
                      isDark
                        ? "border-white/5 bg-gradient-to-br from-[#10142a]/70 to-[#0a0f1f]/90 text-zinc-100"
                        : "border-slate-200 bg-white text-slate-900"
                    )}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-1">
                        <div
                          className={cn(
                            "flex items-center gap-2 text-sm",
                            isDark ? "text-zinc-400" : "text-slate-500"
                          )}
                        >
                          <User className="h-4 w-4 text-purple-300" />
                          <span
                            className={cn(
                              "font-semibold",
                              isDark ? "text-zinc-100" : "text-slate-900"
                            )}
                          >
                            {suggestion.userName}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em]",
                            isDark ? "text-zinc-500" : "text-slate-500"
                          )}
                        >
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {suggestion.userEmail}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" />
                            {formatDate(suggestion.createdAt)}
                          </span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          isDark
                            ? "bg-purple-500/10 text-purple-200"
                            : "bg-purple-50 text-purple-700"
                        )}
                      >
                        #{suggestion.id.toString().padStart(3, "0")}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-4 text-sm leading-relaxed",
                        isDark ? "text-zinc-200" : "text-slate-700"
                      )}
                    >
                      {suggestion.content}
                    </p>
                    {isAdmin ? (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleApproveSuggestion(suggestion.id)}
                          disabled={actioningId === suggestion.id}
                          className={cn(
                            "inline-flex flex-1 items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
                            actioningId === suggestion.id
                              ? "cursor-not-allowed bg-emerald-500/30 text-emerald-100"
                              : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:scale-[1.01]"
                          )}
                        >
                          {actioningId === suggestion.id
                            ? "Processando..."
                            : "Aprovar e iniciar esteira"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectSuggestion(suggestion.id)}
                          disabled={actioningId === suggestion.id}
                          className={cn(
                            "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
                            actioningId === suggestion.id
                              ? "cursor-not-allowed border border-rose-500/30 text-rose-200"
                              : "border border-rose-500/50 text-rose-400 hover:bg-rose-500/10"
                          )}
                        >
                          Descartar
                        </button>
                      </div>
                    ) : (
                      <p
                        className={cn(
                          "mt-4 text-xs",
                          isDark ? "text-zinc-500" : "text-slate-500"
                        )}
                      >
                        Somente administradores podem aprovar ou descartar sugestões.
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4">
              <div
                className={cn(
                  "mt-8 rounded-3xl border px-6 py-5",
                  isDark
                    ? "border-white/5 bg-gradient-to-br from-[#090f1f] to-[#05060f]"
                    : "border-slate-200 bg-white"
                )}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                      Esteira de implantação
                    </p>
                    <h3
                      className={cn(
                        "text-xl font-semibold",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      Ideias aprovadas em andamento
                    </h3>
                    <p
                      className={cn(
                        "text-sm",
                        isDark ? "text-zinc-400" : "text-slate-500"
                      )}
                    >
                      Gerencie o estágio atual e avance os entregáveis diretamente por aqui.
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-4 py-2 text-xs font-semibold",
                      isDark
                        ? "bg-emerald-500/10 text-emerald-200"
                        : "bg-emerald-50 text-emerald-700"
                    )}
                  >
                    {approvedSuggestions.length} iniciativas
                  </span>
                </div>
              </div>

              {approvedSuggestions.length === 0 ? (
                <div
                  className={cn(
                    "rounded-3xl border px-6 py-8 text-center text-sm",
                    isDark
                      ? "border-white/5 bg-black/20 text-zinc-300"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  )}
                >
                  Aprove sugestões para iniciar o fluxo de implantação.
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-5">
                  {pipelineStages.map((stage) => {
                    const stageItems = approvedSuggestions.filter(
                      (item) =>
                        (item.implementationStage ?? "Descoberta") === stage
                    );
                    return (
                      <div
                        key={stage}
                        className={cn(
                          "rounded-3xl border p-4",
                          isDark
                            ? "border-white/5 bg-[#0b1122]"
                            : "border-slate-200 bg-white"
                        )}
                      >
                        <h4
                          className={cn(
                            "text-sm font-semibold",
                            isDark ? "text-purple-200" : "text-purple-700"
                          )}
                        >
                          {stage}
                        </h4>
                        <div className="mt-3 space-y-3">
                          {stageItems.length === 0 ? (
                            <p className="text-xs text-zinc-500">
                              Nenhuma ideia aqui ainda.
                            </p>
                          ) : (
                            stageItems.map((item) => (
                              <div
                                key={item.id}
                                className={cn(
                                  "rounded-2xl border px-3 py-2 text-xs",
                                  isDark
                                    ? "border-white/10 bg-white/5 text-white"
                                    : "border-slate-200 bg-slate-50 text-slate-800"
                                )}
                              >
                                <p className="font-semibold">
                                  #{item.id.toString().padStart(3, "0")}
                                </p>
                                <p className="mt-1 text-[11px] text-zinc-400">
                                  {item.content}
                                </p>
                                <select
                                  value={item.implementationStage ?? "Descoberta"}
                                  onChange={(event) =>
                                    isAdmin &&
                                    handleStageChange(item.id, event.target.value)
                                  }
                                  disabled={!isAdmin || stageUpdatingId === item.id}
                                  className={cn(
                                    "mt-3 w-full rounded-xl border px-2 py-1 text-[11px]",
                                    isDark
                                      ? "border-white/10 bg-black/40 text-white"
                                      : "border-slate-300 bg-white text-slate-700",
                                    !isAdmin && "opacity-70"
                                  )}
                                  title={
                                    isAdmin
                                      ? "Atualizar estágio"
                                      : "Somente administradores atualizam o estágio"
                                  }
                                >
                                  {pipelineStages.map((optionStage) => (
                                    <option key={optionStage} value={optionStage}>
                                      {optionStage}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
