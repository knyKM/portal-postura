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
import { Target } from "lucide-react";

type Goal = {
  id: number;
  name: string;
  front: string;
  owner: string;
  description: string | null;
  target_type: "percent" | "value";
  target_value: number;
  target_unit: string | null;
  created_at: string;
  updated_at: string;
};

type GoalUpdate = {
  id: number;
  goal_id: number;
  progress_type: "percent" | "value";
  progress_value: number;
  progress_unit: string | null;
  progress_percent: number | null;
  note: string | null;
  progress_date: string;
  created_at: string;
};

export default function MetasPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [updates, setUpdates] = useState<GoalUpdate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [front, setFront] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [targetType, setTargetType] = useState<"percent" | "value">("percent");
  const [targetValue, setTargetValue] = useState("100");
  const [targetUnit, setTargetUnit] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);

  const [updateGoalId, setUpdateGoalId] = useState<number | null>(null);
  const [progressType, setProgressType] = useState<"percent" | "value">("percent");
  const [progressValue, setProgressValue] = useState("");
  const [progressUnit, setProgressUnit] = useState("");
  const [progressDate, setProgressDate] = useState("");
  const [progressNote, setProgressNote] = useState("");
  const [savingUpdate, setSavingUpdate] = useState(false);

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

  async function fetchGoals() {
    setError(null);
    try {
      const response = await fetch("/api/goals");
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao carregar metas.");
      }
      setGoals(Array.isArray(data?.goals) ? data.goals : []);
      setUpdates(Array.isArray(data?.updates) ? data.updates : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar metas.");
    }
  }

  useEffect(() => {
    if (loading) return;
    void fetchGoals();
  }, [loading]);

  const updatesByGoal = useMemo(() => {
    return updates.reduce<Record<number, GoalUpdate[]>>((acc, update) => {
      if (!acc[update.goal_id]) {
        acc[update.goal_id] = [];
      }
      acc[update.goal_id].push(update);
      return acc;
    }, {});
  }, [updates]);

  function getLatestProgress(goal: Goal) {
    const goalUpdates = updatesByGoal[goal.id] ?? [];
    if (goalUpdates.length === 0) return 0;
    const latest = [...goalUpdates].sort((a, b) =>
      a.progress_date.localeCompare(b.progress_date)
    )[goalUpdates.length - 1];
    if (latest.progress_percent !== null) {
      return latest.progress_percent;
    }
    if (goal.target_type === "value" && goal.target_value > 0) {
      return Math.min(100, (latest.progress_value / goal.target_value) * 100);
    }
    return 0;
  }

  async function handleCreateGoal() {
    setError(null);
    const trimmedName = name.trim();
    const trimmedFront = front.trim();
    const trimmedOwner = owner.trim();
    if (!trimmedName || !trimmedFront || !trimmedOwner) {
      setError("Preencha nome, frente responsável e owner.");
      return;
    }
    setSavingGoal(true);
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          front: trimmedFront,
          owner: trimmedOwner,
          description: description.trim(),
          targetType,
          targetValue: Number(targetValue || "0"),
          targetUnit: targetUnit.trim(),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível criar a meta.");
      }
      if (data?.goal) {
        setGoals((prev) => [data.goal, ...prev]);
      }
      setName("");
      setFront("");
      setOwner("");
      setDescription("");
      setTargetType("percent");
      setTargetValue("100");
      setTargetUnit("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar meta.");
    } finally {
      setSavingGoal(false);
    }
  }

  async function handleCreateUpdate(goalId: number) {
    setError(null);
    if (!progressValue.trim()) {
      setError("Informe o valor do andamento.");
      return;
    }
    setSavingUpdate(true);
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId,
          progressType,
          progressValue: Number(progressValue),
          progressUnit: progressUnit.trim(),
          progressDate: progressDate || new Date().toISOString(),
          note: progressNote.trim(),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível registrar o andamento.");
      }
      if (data?.update) {
        setUpdates((prev) => [data.update, ...prev]);
      }
      setProgressValue("");
      setProgressUnit("");
      setProgressDate("");
      setProgressNote("");
      setUpdateGoalId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao registrar andamento."
      );
    } finally {
      setSavingUpdate(false);
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
      pageTitle="Cadastro de Metas"
      pageSubtitle="Defina metas, metas-alvo e acompanhe a evolução."
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
                  Nova meta
                </p>
                <h3 className="mt-2 text-lg font-semibold">Cadastro do time</h3>
              </div>
              <span
                className={cn(
                  "rounded-2xl border p-2",
                  isDark
                    ? "border-white/10 bg-white/10 text-purple-200"
                    : "border-purple-200 bg-purple-50 text-purple-600"
                )}
              >
                <Target className="h-4 w-4" />
              </span>
            </div>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nome da meta"
              className={cn(
                "rounded-xl",
                isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200 bg-white"
              )}
            />
            <Input
              value={front}
              onChange={(event) => setFront(event.target.value)}
              placeholder="Frente responsável"
              className={cn(
                "rounded-xl",
                isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200 bg-white"
              )}
            />
            <Input
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              placeholder="Owner da atividade"
              className={cn(
                "rounded-xl",
                isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200 bg-white"
              )}
            />
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descrição da meta"
              className={cn(
                "rounded-xl min-h-[120px]",
                isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200 bg-white"
              )}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                  Tipo de meta
                </label>
                <select
                  className={cn(
                    "mt-1 w-full rounded-xl border px-2 py-2 text-sm",
                    isDark
                      ? "border-white/10 bg-black/40 text-zinc-100"
                      : "border-slate-200 bg-white text-slate-700"
                  )}
                  value={targetType}
                  onChange={(event) =>
                    setTargetType(event.target.value === "value" ? "value" : "percent")
                  }
                >
                  <option value="percent">Percentual</option>
                  <option value="value">Valor absoluto</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                  Meta alvo
                </label>
                <Input
                  value={targetValue}
                  onChange={(event) => setTargetValue(event.target.value)}
                  placeholder={targetType === "percent" ? "100" : "Total esperado"}
                  className={cn(
                    "mt-1 rounded-xl",
                    isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200 bg-white"
                  )}
                />
              </div>
            </div>
            <Input
              value={targetUnit}
              onChange={(event) => setTargetUnit(event.target.value)}
              placeholder="Métrica (ex.: entregas, servidores, %)"
              className={cn(
                "rounded-xl",
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
              onClick={handleCreateGoal}
              disabled={savingGoal}
            >
              {savingGoal ? "Salvando..." : "Cadastrar meta"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {goals.length === 0 ? (
            <Card
              className={cn(
                "rounded-3xl border p-6",
                isDark
                  ? "border-white/10 bg-white/5 text-zinc-100"
                  : "border-slate-200 bg-white text-slate-700"
              )}
            >
              <CardContent className="p-0">
                Nenhuma meta cadastrada.
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => {
              const goalUpdates = updatesByGoal[goal.id] ?? [];
              const latestProgress = getLatestProgress(goal);
              const progressLabel =
                goal.target_type === "percent"
                  ? `${latestProgress.toFixed(0)}%`
                  : `${goalUpdates[0]?.progress_value ?? 0} ${goal.target_unit ?? ""}`.trim();

              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "rounded-3xl border p-5",
                    isDark
                      ? "border-white/10 bg-[#050816]/80 text-zinc-100"
                      : "border-slate-200 bg-white text-slate-800"
                  )}
                >
                  <CardContent className="p-0 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                          {goal.front}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold">
                          {goal.name}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          Owner: {goal.owner}
                        </p>
                      </div>
                      <div className="text-right text-xs text-zinc-500">
                        Meta alvo: {goal.target_value} {goal.target_unit ?? ""}
                      </div>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-zinc-400">{goal.description}</p>
                    )}
                    <div>
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>Evolução</span>
                        <span>{progressLabel}</span>
                      </div>
                      <div
                        className={cn(
                          "mt-2 h-2 w-full overflow-hidden rounded-full",
                          isDark ? "bg-white/10" : "bg-slate-100"
                        )}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                          style={{ width: `${Math.min(100, latestProgress)}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-dashed border-purple-500/40 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                          Registrar andamento
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-full text-[11px]"
                          onClick={() =>
                            setUpdateGoalId(updateGoalId === goal.id ? null : goal.id)
                          }
                        >
                          {updateGoalId === goal.id ? "Cancelar" : "Adicionar"}
                        </Button>
                      </div>
                      {updateGoalId === goal.id && (
                        <div className="mt-3 grid gap-3">
                          <div className="grid gap-3 md:grid-cols-2">
                            <div>
                              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                                Tipo de andamento
                              </label>
                              <select
                                className={cn(
                                  "mt-1 w-full rounded-xl border px-2 py-2 text-sm",
                                  isDark
                                    ? "border-white/10 bg-black/40 text-zinc-100"
                                    : "border-slate-200 bg-white text-slate-700"
                                )}
                                value={progressType}
                                onChange={(event) =>
                                  setProgressType(
                                    event.target.value === "value" ? "value" : "percent"
                                  )
                                }
                              >
                                <option value="percent">Percentual</option>
                                <option value="value">Valor absoluto</option>
                              </select>
                            </div>
                            <Input
                              value={progressValue}
                              onChange={(event) => setProgressValue(event.target.value)}
                              placeholder={progressType === "percent" ? "0-100" : "Valor total"}
                              className={cn(
                                "rounded-xl",
                                isDark
                                  ? "border-white/10 bg-black/40 text-white"
                                  : "border-slate-200 bg-white"
                              )}
                            />
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <Input
                              value={progressUnit}
                              onChange={(event) => setProgressUnit(event.target.value)}
                              placeholder="Métrica (ex.: servidores, tarefas)"
                              className={cn(
                                "rounded-xl",
                                isDark
                                  ? "border-white/10 bg-black/40 text-white"
                                  : "border-slate-200 bg-white"
                              )}
                            />
                            <Input
                              value={progressDate}
                              onChange={(event) => setProgressDate(event.target.value)}
                              placeholder="Data (YYYY-MM-DD)"
                              className={cn(
                                "rounded-xl",
                                isDark
                                  ? "border-white/10 bg-black/40 text-white"
                                  : "border-slate-200 bg-white"
                              )}
                            />
                          </div>
                          <Textarea
                            value={progressNote}
                            onChange={(event) => setProgressNote(event.target.value)}
                            placeholder="Observação da evolução (ou ausência)."
                            className={cn(
                              "min-h-[80px] rounded-xl",
                              isDark
                                ? "border-white/10 bg-black/40 text-white"
                                : "border-slate-200 bg-white"
                            )}
                          />
                          <Button
                            type="button"
                            className="rounded-xl"
                            onClick={() => handleCreateUpdate(goal.id)}
                            disabled={savingUpdate}
                          >
                            {savingUpdate ? "Salvando..." : "Registrar andamento"}
                          </Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                        Histórico
                      </p>
                      <div className="mt-2 space-y-2 text-xs">
                        {goalUpdates.length === 0 ? (
                          <p className="text-zinc-500">
                            Nenhum andamento registrado.
                          </p>
                        ) : (
                          goalUpdates.map((update) => (
                            <div
                              key={update.id}
                              className={cn(
                                "rounded-2xl border px-3 py-2",
                                isDark
                                  ? "border-white/10 bg-black/30 text-zinc-200"
                                  : "border-slate-200 bg-slate-50 text-slate-700"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-semibold">
                                  {update.progress_type === "percent"
                                    ? `${update.progress_value}%`
                                    : `${update.progress_value} ${update.progress_unit ?? ""}`.trim()}
                                </p>
                                <span className="text-[11px] text-zinc-500">
                                  {new Date(update.progress_date).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                              {update.note && (
                                <p className="mt-1 text-[11px] text-zinc-500">
                                  {update.note}
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
