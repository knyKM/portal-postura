"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { Bug, Sparkles, RefreshCcw } from "lucide-react";

type JiraSuggestion = {
  id: number;
  type: "sugestao" | "problema";
  title: string;
  description: string;
  status: "aberto" | "em_analise" | "em_execucao" | "concluido";
  requesterName?: string | null;
  requesterEmail?: string | null;
  createdAt: string;
  updatedAt: string;
};

const columns: Array<{
  key: JiraSuggestion["status"];
  label: string;
}> = [
  { key: "aberto", label: "Aberto" },
  { key: "em_analise", label: "Em análise" },
  { key: "em_execucao", label: "Em execução" },
];

export default function SugestoesJiraPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<JiraSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"sugestao" | "problema">("sugestao");
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const grouped = useMemo(() => {
    const map: Record<JiraSuggestion["status"], JiraSuggestion[]> = {
      aberto: [],
      em_analise: [],
      em_execucao: [],
      concluido: [],
    };
    items.forEach((item) => {
      map[item.status]?.push(item);
    });
    return map;
  }, [items]);

  const activeItems = useMemo(
    () => items.filter((item) => item.status !== "concluido"),
    [items]
  );
  const completedItems = useMemo(
    () => items.filter((item) => item.status === "concluido"),
    [items]
  );

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

  async function fetchItems() {
    setError(null);
    try {
      const response = await fetch("/api/jira-suggestions");
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao carregar solicitações Jira.");
      }
      setItems(Array.isArray(data?.suggestions) ? data.suggestions : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar solicitações Jira.");
    }
  }

  useEffect(() => {
    if (loading) return;
    void fetchItems();
  }, [loading]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  }

  async function handleSubmit() {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    setError(null);

    if (!trimmedTitle || !trimmedDescription) {
      setError("Preencha o título e a descrição.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/jira-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title: trimmedTitle,
          description: trimmedDescription,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível registrar.");
      }
      if (data?.suggestion) {
        setItems((prev) => [data.suggestion, ...prev]);
      }
      setTitle("");
      setDescription("");
      setType("sugestao");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar solicitação.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id: number, status: JiraSuggestion["status"]) {
    setUpdatingId(id);
    setError(null);
    try {
      const response = await fetch("/api/jira-suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao atualizar status.");
      }
      if (data?.suggestion) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? data.suggestion : item))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao atualizar status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleComplete(id: number) {
    const confirmed = window.confirm("Confirmar conclusão desta solicitação?");
    if (!confirmed) return;
    await handleStatusChange(id, "concluido");
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Tem certeza que deseja remover a solicitação?");
    if (!confirmed) return;
    setUpdatingId(id);
    setError(null);
    try {
      const response = await fetch("/api/jira-suggestions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao remover solicitação.");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao remover solicitação.");
    } finally {
      setUpdatingId(null);
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
      pageTitle="Sugestões/Problemas Jira"
      pageSubtitle="Registre solicitações e acompanhe o fluxo de atendimento."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr,2fr]">
        <Card
          className={cn(
            "rounded-3xl border p-5",
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}
        >
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                  Nova solicitação
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  Jira
                </h3>
              </div>
              <div
                className={cn(
                  "rounded-2xl border p-2",
                  isDark
                    ? "border-white/10 bg-white/10 text-purple-200"
                    : "border-purple-200 bg-purple-50 text-purple-600"
                )}
              >
                {type === "problema" ? <Bug className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </div>
            </div>
            <div className="grid gap-3">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                Tipo
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={type === "sugestao" ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setType("sugestao")}
                >
                  Sugestão
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={type === "problema" ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setType("problema")}
                >
                  Problema
                </Button>
              </div>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Título da solicitação"
                className={cn(
                  "rounded-xl",
                  isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200 bg-white"
                )}
              />
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descreva o problema ou sugestão."
                className={cn(
                  "min-h-[140px] rounded-xl",
                  isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200 bg-white"
                )}
              />
              {error && (
                <div
                  className={cn(
                    "rounded-2xl border px-3 py-2 text-sm",
                    isDark
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  )}
                >
                  {error}
                </div>
              )}
              <Button
                type="button"
                className="rounded-xl"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Enviando..." : "Registrar solicitação"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "rounded-3xl border p-5",
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}
        >
          <CardContent className="p-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Kanban
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  Acompanhamento de atendimento
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Atualizar
              </Button>
            </div>
            <div className="grid gap-3 lg:grid-cols-4">
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={cn(
                    "rounded-2xl border p-3",
                    isDark ? "border-white/10 bg-black/30" : "border-slate-200 bg-slate-50"
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    {column.label}
                  </p>
                  <div className="mt-3 space-y-3">
                    {grouped[column.key].length === 0 ? (
                      <p className="text-xs text-zinc-500">
                        Nenhuma solicitação.
                      </p>
                    ) : (
                      grouped[column.key].map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "rounded-2xl border px-3 py-3 text-xs shadow-sm",
                            isDark
                              ? "border-white/10 bg-[#0b1224] text-zinc-100"
                              : "border-slate-200 bg-white text-slate-800"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.3em]",
                                item.type === "problema"
                                  ? isDark
                                    ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                                    : "border-rose-200 bg-rose-50 text-rose-700"
                                  : isDark
                                  ? "border-purple-500/40 bg-purple-500/10 text-purple-200"
                                  : "border-purple-200 bg-purple-50 text-purple-700"
                              )}
                            >
                              {item.type === "problema" ? "Problema" : "Sugestão"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-semibold">{item.title}</p>
                          <p className="mt-1 text-[11px] text-zinc-500">
                            {item.description}
                          </p>
                          <div className="mt-2 text-[11px] text-zinc-500">
                            {item.requesterName ?? "Solicitante"} •{" "}
                            {new Date(item.createdAt).toLocaleString("pt-BR")}
                          </div>
                          <div className="mt-2">
                            <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                              Status
                            </label>
                            <select
                              className={cn(
                                "mt-1 w-full rounded-xl border px-2 py-1 text-xs",
                                isDark
                                  ? "border-white/10 bg-black/40 text-zinc-100"
                                  : "border-slate-200 bg-white text-slate-700"
                              )}
                              value={item.status}
                              onChange={(event) =>
                                handleStatusChange(
                                  item.id,
                                  event.target.value as JiraSuggestion["status"]
                                )
                              }
                              disabled={updatingId === item.id}
                            >
                              {columns.map((col) => (
                                <option key={col.key} value={col.key}>
                                  {col.label}
                                </option>
                              ))}
                            </select>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Button
                                type="button"
                                size="sm"
                                className="rounded-full"
                                onClick={() => handleComplete(item.id)}
                                disabled={updatingId === item.id}
                              >
                                Concluir
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="rounded-full"
                                onClick={() => handleDelete(item.id)}
                                disabled={updatingId === item.id}
                              >
                                Remover
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 space-y-3">
        <div
          className={cn(
            "flex items-center justify-between rounded-3xl border px-6 py-4",
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          )}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Histórico
            </p>
            <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-600")}>
              Solicitações concluídas.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => setShowHistory((prev) => !prev)}
          >
            {showHistory ? "Recolher" : "Expandir"}
          </Button>
        </div>
        {showHistory && (
          <div className="grid gap-3">
            {completedItems.length === 0 ? (
              <div
                className={cn(
                  "rounded-3xl border px-6 py-6 text-center text-sm",
                  isDark
                    ? "border-white/10 bg-black/20 text-zinc-400"
                    : "border-slate-200 bg-white text-slate-600"
                )}
              >
                Nenhuma solicitação concluída.
              </div>
            ) : (
              completedItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-3xl border p-4 text-sm",
                    isDark
                      ? "border-white/10 bg-black/30 text-zinc-100"
                      : "border-slate-200 bg-white text-slate-800"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                      #{item.id.toString().padStart(3, "0")} •{" "}
                      {new Date(item.createdAt).toLocaleString("pt-BR")}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => handleDelete(item.id)}
                      disabled={updatingId === item.id}
                    >
                      Remover
                    </Button>
                  </div>
                  <p className="mt-2 font-semibold">{item.title}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{item.description}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
