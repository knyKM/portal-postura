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
import { createPortal } from "react-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

type Goal = {
  id: number;
  name: string;
  front: string;
  owner: string;
  description: string | null;
  due_date: string | null;
  start_month: string | null;
  end_month: string | null;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [name, setName] = useState("");
  const [front, setFront] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [targetType, setTargetType] = useState<"percent" | "value">("percent");
  const [targetValue, setTargetValue] = useState("100");
  const [targetUnit, setTargetUnit] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  const [isRiskConfigOpen, setIsRiskConfigOpen] = useState(false);
  const [riskDaysThreshold, setRiskDaysThreshold] = useState("14");
  const [riskMinProgressPercent, setRiskMinProgressPercent] = useState("60");
  const [riskConfigError, setRiskConfigError] = useState<string | null>(null);
  const [savingRiskConfig, setSavingRiskConfig] = useState(false);
  const portalTarget = typeof window !== "undefined" ? document.body : null;

  const [updateGoalId, setUpdateGoalId] = useState<number | null>(null);
  const [progressType, setProgressType] = useState<"percent" | "value">("percent");
  const [progressValue, setProgressValue] = useState("");
  const [progressUnit, setProgressUnit] = useState("");
  const [progressDate, setProgressDate] = useState("");
  const [progressNote, setProgressNote] = useState("");
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [openHistoryGoalId, setOpenHistoryGoalId] = useState<number | null>(null);
  const [isVelocityOpen, setIsVelocityOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
      const parsed = JSON.parse(raw) as { role?: string };
      setIsAdmin(parsed?.role === "admin");
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

  async function fetchRiskConfig() {
    setRiskConfigError(null);
    try {
      const response = await fetch("/api/goals/config");
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao carregar configuração.");
      }
      const config = data?.config ?? {};
      const days = Number(config?.riskDaysThreshold ?? 14);
      const minProgress = Number(config?.riskMinProgressPercent ?? 60);
      setRiskDaysThreshold(String(Number.isFinite(days) ? days : 14));
      setRiskMinProgressPercent(
        String(Number.isFinite(minProgress) ? minProgress : 60)
      );
    } catch (err) {
      setRiskConfigError(
        err instanceof Error ? err.message : "Falha ao carregar configuração."
      );
    }
  }

  useEffect(() => {
    if (loading) return;
    void fetchGoals();
    void fetchRiskConfig();
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

  const filteredGoals = useMemo(() => {
    if (!searchTerm.trim()) return goals;
    const normalized = searchTerm.toLowerCase();
    return goals.filter((goal) =>
      [goal.name, goal.front, goal.owner]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [goals, searchTerm]);

  function parseMonthString(value: string | null) {
    if (!value) return null;
    const [year, month] = value.split("-").map((entry) => Number(entry));
    if (!year || !month) return null;
    return new Date(year, month - 1, 1);
  }

  function formatMonth(value: string | null) {
    const date = parseMonthString(value);
    if (!date) return "-";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${month}/${date.getFullYear()}`;
  }

  function toEndOfMonth(value: string | null) {
    const date = parseMonthString(value);
    if (!date) return null;
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  }

  function formatMonthLabel(value: string) {
    const [year, month] = value.split("-");
    if (!year || !month) return value;
    return `${month}/${year.slice(-2)}`;
  }

  function getUpdateContribution(goal: Goal, update: GoalUpdate) {
    const value = Number(update.progress_value ?? 0);
    if (goal.target_type === "percent") {
      return Math.max(0, Math.min(100, value));
    }
    if (goal.target_type === "value" && goal.target_value > 0) {
      return Math.max(0, Math.min(100, (value / goal.target_value) * 100));
    }
    return 0;
  }

  const monthBuckets = useMemo(() => {
    const now = new Date();
    const months: string[] = [];
    for (let i = 11; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      months.push(key);
    }
    return months;
  }, []);

  const charts = useMemo(() => {
    const goalMap = new Map(goals.map((goal) => [goal.id, goal]));
    const updatesByMonth = new Map<string, number>();
    const updatesCountByMonth = new Map<string, number>();
    const monthlyFrontTotals = new Map<string, Record<string, number>>();
    const velocityData: Array<{ name: string; value: number }> = [];
    const fronts = Array.from(new Set(goals.map((goal) => goal.front))).filter(Boolean);
    const goalFrontCounts = goals.reduce<Record<string, number>>((acc, goal) => {
      if (!goal.front) return acc;
      acc[goal.front] = (acc[goal.front] ?? 0) + 1;
      return acc;
    }, {});

    goals.forEach((goal) => {
      const goalUpdates = updatesByGoal[goal.id] ?? [];
      if (!goalUpdates.length) {
        velocityData.push({ name: goal.name, value: 0 });
        return;
      }
      const sorted = [...goalUpdates].sort((a, b) =>
        a.progress_date.localeCompare(b.progress_date)
      );
      const totalContribution = sorted.reduce(
        (sum, update) => sum + getUpdateContribution(goal, update),
        0
      );
      const firstDate = new Date(sorted[0].progress_date);
      const lastDate = new Date(sorted[sorted.length - 1].progress_date);
      const daysSpan = Math.max(
        1,
        (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weeklyVelocity = totalContribution / Math.max(1, daysSpan / 7);
      velocityData.push({ name: goal.name, value: weeklyVelocity });

    });

    updates.forEach((update) => {
      const goal = goalMap.get(update.goal_id);
      if (!goal) return;
      const date = new Date(update.progress_date);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const contribution = getUpdateContribution(goal, update);
      updatesByMonth.set(key, (updatesByMonth.get(key) ?? 0) + contribution);
      updatesCountByMonth.set(key, (updatesCountByMonth.get(key) ?? 0) + 1);
      const entry = monthlyFrontTotals.get(key) ?? {};
      entry[goal.front] = (entry[goal.front] ?? 0) + contribution;
      monthlyFrontTotals.set(key, entry);
    });

    const heatmapData = monthBuckets.map((key) => ({
      month: key,
      value: updatesCountByMonth.get(key) ?? 0,
    }));
    const maxHeat = Math.max(1, ...heatmapData.map((item) => item.value));

    const goalCumulativeByMonth = new Map<number, Record<string, number>>();
    goals.forEach((goal) => {
      const sorted = [...(updatesByGoal[goal.id] ?? [])].sort((a, b) =>
        a.progress_date.localeCompare(b.progress_date)
      );
      const perMonth: Record<string, number> = {};
      let cumulative = 0;
      monthBuckets.forEach((key) => {
        const monthTotal = sorted.reduce((sum, update) => {
          const date = new Date(update.progress_date);
          if (Number.isNaN(date.getTime())) return sum;
          const updateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (updateKey !== key) return sum;
          return sum + getUpdateContribution(goal, update);
        }, 0);
        cumulative = Math.min(100, Math.max(0, cumulative + monthTotal));
        perMonth[key] = cumulative;
      });
      goalCumulativeByMonth.set(goal.id, perMonth);
    });

    const evolutionData = monthBuckets.map((key) => {
      const row: Record<string, number | string> = { month: formatMonthLabel(key) };
      fronts.forEach((front) => {
        const frontGoals = goals.filter((goal) => goal.front === front);
        if (frontGoals.length === 0) {
          row[front] = 0;
          return;
        }
        const sum = frontGoals.reduce((acc, goal) => {
          const perMonth = goalCumulativeByMonth.get(goal.id);
          return acc + (perMonth?.[key] ?? 0);
        }, 0);
        row[front] = sum / (goalFrontCounts[front] ?? 1);
      });
      return row;
    });

    velocityData.sort((a, b) => b.value - a.value);

    return {
      heatmapData,
      maxHeat,
      velocityData: velocityData.slice(0, 8),
      evolutionData,
      fronts,
    };
  }, [goals, updates, updatesByGoal, monthBuckets]);

  const frontPalette = [
    "#a855f7",
    "#38bdf8",
    "#34d399",
    "#fbbf24",
    "#f97316",
    "#f472b6",
  ];

  function getLatestUpdate(goal: Goal) {
    const goalUpdates = updatesByGoal[goal.id] ?? [];
    if (goalUpdates.length === 0) return null;
    return [...goalUpdates].sort((a, b) =>
      a.progress_date.localeCompare(b.progress_date)
    )[goalUpdates.length - 1];
  }

  const summary = useMemo(() => {
    if (goals.length === 0) {
      return { total: 0, avg: 0, completed: 0 };
    }
    const progressList = goals.map((goal) => getLatestProgress(goal));
    const avg =
      progressList.reduce((sum, value) => sum + value, 0) / progressList.length;
    const completed = progressList.filter((value) => value >= 100).length;
    return { total: goals.length, avg, completed };
  }, [goals, updatesByGoal, riskDaysThreshold, riskMinProgressPercent]);

  const timelineSummary = useMemo(() => {
    const now = new Date();
    const riskDays = Math.max(1, Number(riskDaysThreshold) || 14);
    const riskMinProgress = Math.max(0, Number(riskMinProgressPercent) || 60);
    let onTime = 0;
    let late = 0;
    let atRisk = 0;
    let inProgress = 0;
    let notStarted = 0;
    let noDeadline = 0;

    goals.forEach((goal) => {
      const progress = getLatestProgress(goal);
      const latest = getLatestUpdate(goal);
      const started = Boolean(latest);
      const due = toEndOfMonth(goal.end_month);

      if (!due || Number.isNaN(due.getTime())) {
        noDeadline += 1;
      }

      if (progress >= 100) {
        if (due && latest?.progress_date) {
          const deliveredAt = new Date(latest.progress_date);
          if (deliveredAt <= due) {
            onTime += 1;
          } else {
            late += 1;
          }
        } else {
          onTime += 1;
        }
        return;
      }

      if (!started) {
        notStarted += 1;
      } else {
        inProgress += 1;
      }

      if (due) {
        const daysRemaining =
          (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (daysRemaining <= 0 && progress < 100) {
          atRisk += 1;
          return;
        }
        if (daysRemaining <= riskDays && progress < riskMinProgress) {
          atRisk += 1;
        }
      }
    });

    return {
      onTime,
      late,
      atRisk,
      inProgress,
      notStarted,
      noDeadline,
    };
  }, [goals, updatesByGoal]);

  function getLatestProgress(goal: Goal) {
    const goalUpdates = updatesByGoal[goal.id] ?? [];
    if (goalUpdates.length === 0) return 0;
    const totalValue = goalUpdates.reduce(
      (sum, update) => sum + (update.progress_value ?? 0),
      0
    );
    if (goal.target_type === "percent") {
      return Math.min(100, Math.max(0, totalValue));
    }
    if (goal.target_type === "value" && goal.target_value > 0) {
      return Math.min(100, Math.max(0, (totalValue / goal.target_value) * 100));
    }
    return 0;
  }

  async function handleCreateGoal() {
    setError(null);
    const trimmedName = name.trim();
    const trimmedFront = front.trim();
    const trimmedOwner = owner.trim();
    const trimmedDescription = description.trim();
    const trimmedTargetUnit = targetUnit.trim();
    const parsedTargetValue = Number(targetValue || "0");
    if (
      !trimmedName ||
      !trimmedFront ||
      !trimmedOwner ||
      !trimmedDescription ||
      !startMonth ||
      !endMonth ||
      !trimmedTargetUnit ||
      !Number.isFinite(parsedTargetValue) ||
      parsedTargetValue <= 0
    ) {
      setError("Preencha todos os campos obrigatórios da meta.");
      return;
    }
    if (startMonth > endMonth) {
      setError("A data de início não pode ser superior à data de fim.");
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
          description: trimmedDescription,
          startMonth,
          endMonth,
          targetType,
          targetValue: parsedTargetValue,
          targetUnit: trimmedTargetUnit,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível criar a meta.");
      }
      if (data?.goal) {
        setGoals((prev) => [data.goal, ...prev]);
      }
      setEditingGoalId(null);
      setIsNewGoalOpen(false);
      setName("");
      setFront("");
      setOwner("");
      setDescription("");
      setStartMonth("");
      setEndMonth("");
      setTargetType("percent");
      setTargetValue("100");
      setTargetUnit("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar meta.");
    } finally {
      setSavingGoal(false);
    }
  }

  async function handleUpdateGoal() {
    if (!editingGoalId) return;
    setError(null);
    const trimmedName = name.trim();
    const trimmedFront = front.trim();
    const trimmedOwner = owner.trim();
    const trimmedDescription = description.trim();
    const trimmedTargetUnit = targetUnit.trim();
    const parsedTargetValue = Number(targetValue || "0");
    if (
      !trimmedName ||
      !trimmedFront ||
      !trimmedOwner ||
      !trimmedDescription ||
      !startMonth ||
      !endMonth ||
      !trimmedTargetUnit ||
      !Number.isFinite(parsedTargetValue) ||
      parsedTargetValue <= 0
    ) {
      setError("Preencha todos os campos obrigatórios da meta.");
      return;
    }
    if (startMonth > endMonth) {
      setError("A data de início não pode ser superior à data de fim.");
      return;
    }
    setSavingGoal(true);
    try {
      const response = await fetch("/api/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingGoalId,
          name: trimmedName,
          front: trimmedFront,
          owner: trimmedOwner,
          description: trimmedDescription,
          startMonth,
          endMonth,
          targetType,
          targetValue: parsedTargetValue,
          targetUnit: trimmedTargetUnit,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível atualizar a meta.");
      }
      const updated = data?.goal as Goal | undefined;
      if (updated) {
        setGoals((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      }
      setEditingGoalId(null);
      setIsNewGoalOpen(false);
      setName("");
      setFront("");
      setOwner("");
      setDescription("");
      setStartMonth("");
      setEndMonth("");
      setTargetType("percent");
      setTargetValue("100");
      setTargetUnit("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar a meta.");
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

  async function handleSaveRiskConfig() {
    setRiskConfigError(null);
    const days = Number(riskDaysThreshold);
    const minProgress = Number(riskMinProgressPercent);
    if (!Number.isFinite(days) || days <= 0 || !Number.isFinite(minProgress)) {
      setRiskConfigError("Informe valores válidos para a configuração.");
      return;
    }
    setSavingRiskConfig(true);
    try {
      const response = await fetch("/api/goals/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riskDaysThreshold: days,
          riskMinProgressPercent: minProgress,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível salvar a configuração.");
      }
      await fetchRiskConfig();
      setIsRiskConfigOpen(false);
    } catch (err) {
      setRiskConfigError(
        err instanceof Error ? err.message : "Erro ao salvar configuração."
      );
    } finally {
      setSavingRiskConfig(false);
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
      <div className="flex w-full flex-col gap-6 px-4 lg:px-10">
        <section
          className={cn(
            "relative overflow-hidden rounded-4xl border px-6 py-8 shadow-[0_25px_90px_rgba(0,0,0,0.25)]",
            isDark
              ? "border-white/5 bg-gradient-to-br from-[#0c122b] via-[#080d1f] to-[#050816]"
              : "border-slate-200 bg-gradient-to-br from-white to-slate-100"
          )}
        >
          <div className="absolute inset-0 flex justify-end opacity-60">
            <div className="h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
          </div>
          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                    Central de metas
                  </p>
                  <h2 className={cn("text-3xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    Acompanhe evolução e metas-alvo
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Estruture objetivos e registre avanços com métricas claras.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Metas ativas",
                    value: summary.total,
                    tone: isDark
                      ? "from-purple-500/20 to-indigo-500/10 text-purple-200"
                      : "from-purple-50 to-indigo-50 text-purple-700",
                  },
                  {
                    label: "Média de evolução",
                    value: `${summary.avg.toFixed(0)}%`,
                    tone: isDark
                      ? "from-emerald-500/20 to-teal-500/10 text-emerald-200"
                      : "from-emerald-50 to-teal-50 text-emerald-700",
                  },
                  {
                    label: "Concluídas",
                    value: summary.completed,
                    tone: isDark
                      ? "from-amber-500/20 to-rose-500/10 text-amber-200"
                      : "from-amber-50 to-rose-50 text-amber-700",
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
                        item.tone
                      )}
                    >
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                        {item.label}
                      </p>
                      <p className="text-xl font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1fr,2fr]">
        <div className="space-y-4">
          <Card
            className={cn(
              "rounded-3xl border p-4",
              isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
            )}
          >
            <CardContent className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                    Painel de metas
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">
                    Acompanhamento consolidado
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Visualize a saúde geral e encontre metas rapidamente.
                  </p>
                </div>
                <div className="flex w-full flex-wrap items-center justify-end gap-3 md:w-auto">
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar por meta, frente ou owner"
                    className={cn(
                      "h-10 w-full max-w-[320px] rounded-xl",
                      isDark
                        ? "border-white/10 bg-black/40 text-white"
                        : "border-slate-200 bg-white"
                    )}
                  />
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {isAdmin && (
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => setIsRiskConfigOpen(true)}
                      >
                        Configurar indicadores
                      </Button>
                    )}
                    <Button
                      type="button"
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      onClick={() => {
                        setError(null);
                        setEditingGoalId(null);
                        setIsNewGoalOpen(true);
                      }}
                    >
                      Cadastrar nova meta
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-4",
                    isDark
                      ? "border-white/10 bg-black/30 text-zinc-100"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    Cascata de metas
                  </p>
                  <div className="mt-4">
                    {(() => {
                      const total = Math.max(1, summary.total);
                      const cascade = [
                        {
                          label: "Nao iniciadas",
                          value: timelineSummary.notStarted,
                          tone: isDark
                            ? "bg-amber-500/30 text-amber-200"
                            : "bg-amber-100 text-amber-700",
                        },
                        {
                          label: "Em andamento",
                          value: timelineSummary.inProgress,
                          tone: isDark
                            ? "bg-indigo-500/30 text-indigo-200"
                            : "bg-indigo-100 text-indigo-700",
                        },
                        {
                          label: "Ameaca",
                          value: timelineSummary.atRisk,
                          tone: isDark
                            ? "bg-rose-500/30 text-rose-200"
                            : "bg-rose-100 text-rose-700",
                        },
                        {
                          label: "Concluidas",
                          value: timelineSummary.onTime + timelineSummary.late,
                          tone: isDark
                            ? "bg-emerald-500/30 text-emerald-200"
                            : "bg-emerald-100 text-emerald-700",
                        },
                      ];
                      return (
                        <div className="space-y-3">
                          {cascade.map((item, index) => (
                            <div key={item.label} className="relative">
                              <div className="flex items-center justify-between text-xs text-zinc-400">
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                              </div>
                              <div
                                className={cn(
                                  "mt-2 h-2 rounded-full",
                                  isDark ? "bg-white/10" : "bg-slate-200"
                                )}
                              >
                                <div
                                  className={cn("h-full rounded-full", item.tone)}
                                  style={{ width: `${Math.min(100, (item.value / total) * 100)}%` }}
                                />
                              </div>
                              {index < cascade.length - 1 && (
                                <div
                                  className={cn(
                                    "absolute -bottom-3 left-0 right-0 h-px",
                                    isDark ? "bg-white/10" : "bg-slate-200"
                                  )}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-4",
                    isDark
                      ? "border-white/10 bg-black/30 text-zinc-100"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    Indicadores de entrega
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        label: "Conclusao geral",
                        value: `${summary.avg.toFixed(0)}%`,
                        tone: isDark
                          ? "from-purple-500/30 to-indigo-500/20 text-purple-200"
                          : "from-purple-50 to-indigo-50 text-purple-700",
                      },
                      {
                        label: "No prazo",
                        value: timelineSummary.onTime,
                        tone: isDark
                          ? "from-emerald-500/30 to-teal-500/20 text-emerald-200"
                          : "from-emerald-50 to-teal-50 text-emerald-700",
                      },
                      {
                        label: "Fora do prazo",
                        value: timelineSummary.late,
                        tone: isDark
                          ? "from-rose-500/30 to-orange-500/20 text-rose-200"
                          : "from-rose-50 to-orange-50 text-rose-700",
                      },
                      {
                        label: "Ameaca ao prazo",
                        value: timelineSummary.atRisk,
                        tone: isDark
                          ? "from-amber-500/30 to-rose-500/20 text-amber-200"
                          : "from-amber-50 to-rose-50 text-amber-700",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-sm",
                          isDark
                            ? "border-white/10 bg-gradient-to-br text-zinc-100"
                            : "border-slate-200 bg-gradient-to-br text-slate-700",
                          item.tone
                        )}
                      >
                        <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                          {item.label}
                        </p>
                        <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-4",
                    isDark
                      ? "border-white/10 bg-black/30 text-zinc-100"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                      Velocidade média por meta
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-full text-[11px]"
                      onClick={() => setIsVelocityOpen((prev) => !prev)}
                    >
                      {isVelocityOpen ? "Recolher" : "Mostrar"}
                    </Button>
                  </div>
                  {isVelocityOpen && (
                    <div className="mt-4 h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.velocityData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                          <XAxis type="number" tick={{ fontSize: 10 }} />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} />
                          <RechartsTooltip
                            contentStyle={{
                              background: isDark ? "#0f111a" : "#fff",
                              borderRadius: 12,
                              border: isDark
                                ? "1px solid rgba(255,255,255,0.05)"
                                : "1px solid rgba(0,0,0,0.05)",
                            }}
                            formatter={(value: number) => [
                              `${value.toFixed(1)}%/semana`,
                              "Velocidade",
                            ]}
                          />
                          <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 8, 8]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    "rounded-2xl border px-4 py-4",
                    isDark
                      ? "border-white/10 bg-black/30 text-zinc-100"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    Evolução acumulada por frente
                  </p>
                  <div className="mt-4 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={charts.evolutionData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} unit="%" />
                        <Legend />
                        <RechartsTooltip
                          contentStyle={{
                            background: isDark ? "#0f111a" : "#fff",
                            borderRadius: 12,
                            border: isDark
                              ? "1px solid rgba(255,255,255,0.05)"
                              : "1px solid rgba(0,0,0,0.05)",
                          }}
                        />
                        {charts.fronts.map((front, index) => (
                          <Area
                            key={front}
                            type="monotone"
                            dataKey={front}
                            stackId="1"
                            stroke={frontPalette[index % frontPalette.length]}
                            fill={frontPalette[index % frontPalette.length]}
                            fillOpacity={0.25}
                          />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr]">
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-4",
                    isDark
                      ? "border-white/10 bg-black/30 text-zinc-100"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    Heatmap de progresso
                  </p>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {charts.heatmapData.map((item) => {
                      const intensity = item.value / charts.maxHeat;
                      const background = isDark
                        ? `rgba(168, 85, 247, ${0.2 + intensity * 0.7})`
                        : `rgba(124, 58, 237, ${0.15 + intensity * 0.6})`;
                      return (
                        <div
                          key={item.month}
                          className={cn(
                            "rounded-xl border px-2 py-2 text-center text-[11px]",
                            isDark
                              ? "border-white/10 text-zinc-200"
                              : "border-slate-200 text-slate-600"
                          )}
                          style={{ background }}
                        >
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                            {formatMonthLabel(item.month)}
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {item.value.toFixed(0)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
          ) : filteredGoals.length === 0 ? (
            <Card
              className={cn(
                "rounded-3xl border p-6",
                isDark
                  ? "border-white/10 bg-white/5 text-zinc-100"
                  : "border-slate-200 bg-white text-slate-700"
              )}
            >
              <CardContent className="p-0">
                Nenhuma meta encontrada para essa busca.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredGoals.map((goal) => {
              const goalUpdates = updatesByGoal[goal.id] ?? [];
              const latestProgress = getLatestProgress(goal);
              const cumulativeValue = goalUpdates.reduce(
                (sum, update) => sum + (update.progress_value ?? 0),
                0
              );
              const progressLabel =
                goal.target_type === "percent"
                  ? `${Math.min(100, Math.max(0, cumulativeValue)).toFixed(0)}%`
                  : `${cumulativeValue} ${goal.target_unit ?? ""}`.trim();

              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "rounded-3xl border p-4",
                    isDark
                      ? "border-white/10 bg-[#050816]/80 text-zinc-100"
                      : "border-slate-200 bg-white text-slate-800"
                  )}
                >
                  <CardContent className="space-y-4 p-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                          {goal.front}
                        </p>
                        <h3 className="mt-2 text-base font-semibold">
                          {goal.name}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          Owner: {goal.owner}
                        </p>
                      </div>
                      <div className="space-y-2 text-right text-xs text-zinc-500">
                        <div>
                          Meta alvo: {goal.target_value} {goal.target_unit ?? ""}
                        </div>
                        <div className="mt-1">
                          Início: {formatMonth(goal.start_month)}
                        </div>
                        <div className="mt-1">
                          Fim: {formatMonth(goal.end_month)}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-full text-[11px]"
                          onClick={() => {
                            setEditingGoalId(goal.id);
                            setName(goal.name ?? "");
                            setFront(goal.front ?? "");
                            setOwner(goal.owner ?? "");
                            setDescription(goal.description ?? "");
                            setStartMonth(goal.start_month ?? "");
                            setEndMonth(goal.end_month ?? "");
                            setTargetType(goal.target_type === "value" ? "value" : "percent");
                            setTargetValue(String(goal.target_value ?? ""));
                            setTargetUnit(goal.target_unit ?? "");
                            setError(null);
                            setIsNewGoalOpen(true);
                          }}
                        >
                          Editar meta
                        </Button>
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

                    <div
                      className={cn(
                        "rounded-2xl border border-dashed p-4",
                        isDark ? "border-purple-500/40" : "border-purple-300"
                      )}
                    >
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
                            setUpdateGoalId((current) => {
                              if (current === goal.id) return null;
                              setProgressType(
                                goal.target_type === "value" ? "value" : "percent"
                              );
                              setProgressUnit(goal.target_unit ?? "");
                              return goal.id;
                            })
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
                                disabled
                              >
                                <option value="percent">Percentual</option>
                                <option value="value">Valor absoluto</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                                Valor total
                              </label>
                              <Input
                                value={progressValue}
                                onChange={(event) => setProgressValue(event.target.value)}
                                type="number"
                                placeholder={progressType === "percent" ? "0-100" : "Valor total"}
                                className={cn(
                                  "mt-1 rounded-xl",
                                  isDark
                                    ? "border-white/10 bg-black/40 text-white"
                                    : "border-slate-200 bg-white"
                                )}
                              />
                            </div>
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
                              type="date"
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
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                          Histórico
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-full text-[11px]"
                          onClick={() =>
                            setOpenHistoryGoalId(
                              openHistoryGoalId === goal.id ? null : goal.id
                            )
                          }
                        >
                          {openHistoryGoalId === goal.id ? "Fechar" : "Ver histórico"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>
          )}
        </div>
      </div>
      {portalTarget && isNewGoalOpen
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div
                className={cn(
                  "w-full max-w-3xl rounded-3xl border p-6",
                  isDark ? "border-zinc-800 bg-[#050816]" : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                      Nova meta
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {editingGoalId ? "Editar meta" : "Cadastro do time"}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Centralize o objetivo, o responsável e o alvo para acompanhamento.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsNewGoalOpen(false);
                      setEditingGoalId(null);
                      setError(null);
                    }}
                  >
                    Fechar
                  </Button>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Nome da meta"
                      required
                      className={cn(
                        "h-9 rounded-xl text-sm",
                        isDark
                          ? "border-white/10 bg-black/40 text-white"
                          : "border-slate-200 bg-white"
                      )}
                    />
                    <select
                      value={front}
                      onChange={(event) => setFront(event.target.value)}
                      required
                      className={cn(
                        "h-9 w-full rounded-xl border px-2 text-sm",
                        isDark
                          ? "border-white/10 bg-black/40 text-zinc-100"
                          : "border-slate-200 bg-white text-slate-700"
                      )}
                    >
                      <option value="">Selecione a frente</option>
                      <option value="Discovery Engine">Discovery Engine</option>
                      <option value="Visibility Engine">Visibility Engine</option>
                      <option value="Ownership & Accountability">
                        Ownership & Accountability
                      </option>
                      <option value="Risk Intelligence & Results">
                        Risk Intelligence & Results
                      </option>
                      <option value="Plataform Engine">Plataform Engine</option>
                    </select>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      value={owner}
                      onChange={(event) => setOwner(event.target.value)}
                      placeholder="Owner da atividade"
                      required
                      className={cn(
                        "h-9 rounded-xl text-sm",
                        isDark
                          ? "border-white/10 bg-black/40 text-white"
                          : "border-slate-200 bg-white"
                      )}
                    />
                    <Input
                      value={startMonth}
                      onChange={(event) => setStartMonth(event.target.value)}
                      type="month"
                      placeholder="Início (MM/AAAA)"
                      required
                      className={cn(
                        "h-9 rounded-xl text-sm",
                        isDark
                          ? "border-white/10 bg-black/40 text-white"
                          : "border-slate-200 bg-white"
                      )}
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      value={endMonth}
                      onChange={(event) => setEndMonth(event.target.value)}
                      type="month"
                      placeholder="Fim (MM/AAAA)"
                      required
                      className={cn(
                        "h-9 rounded-xl text-sm",
                        isDark
                          ? "border-white/10 bg-black/40 text-white"
                          : "border-slate-200 bg-white"
                      )}
                    />
                    <div />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                        Tipo de meta
                      </label>
                      <select
                        className={cn(
                          "mt-1 h-9 w-full rounded-xl border px-2 text-sm",
                          isDark
                            ? "border-white/10 bg-black/40 text-zinc-100"
                            : "border-slate-200 bg-white text-slate-700"
                        )}
                        value={targetType}
                        required
                        onChange={(event) =>
                          setTargetType(
                            event.target.value === "value" ? "value" : "percent"
                          )
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
                        type="number"
                        placeholder={targetType === "percent" ? "100" : "Total esperado"}
                        required
                        className={cn(
                          "mt-1 h-9 rounded-xl text-sm",
                          isDark
                            ? "border-white/10 bg-black/40 text-white"
                            : "border-slate-200 bg-white"
                        )}
                      />
                    </div>
                  </div>
                  <Input
                    value={targetUnit}
                    onChange={(event) => setTargetUnit(event.target.value)}
                    placeholder="Métrica (ex.: entregas, servidores, %)"
                    required
                    className={cn(
                      "h-9 rounded-xl text-sm",
                      isDark
                        ? "border-white/10 bg-black/40 text-white"
                        : "border-slate-200 bg-white"
                    )}
                  />
                  <Textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Descrição da meta"
                    required
                    className={cn(
                      "min-h-[90px] rounded-xl text-sm",
                      isDark
                        ? "border-white/10 bg-black/40 text-white"
                        : "border-slate-200 bg-white"
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
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsNewGoalOpen(false);
                        setEditingGoalId(null);
                        setError(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      onClick={editingGoalId ? handleUpdateGoal : handleCreateGoal}
                      disabled={savingGoal}
                    >
                      {savingGoal
                        ? "Salvando..."
                        : editingGoalId
                        ? "Salvar alterações"
                        : "Cadastrar meta"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>,
            portalTarget
          )
        : null}
      {portalTarget && openHistoryGoalId
        ? (() => {
            const selectedHistoryGoal = goals.find(
              (goal) => goal.id === openHistoryGoalId
            );
            const selectedHistoryUpdates = selectedHistoryGoal
              ? updatesByGoal[selectedHistoryGoal.id] ?? []
              : [];
            return createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div
                className={cn(
                  "w-full max-w-3xl rounded-3xl border p-6",
                  isDark ? "border-zinc-800 bg-[#050816]" : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                      Histórico da meta
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {selectedHistoryGoal?.name ?? "Meta"}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      {selectedHistoryGoal?.front ?? ""}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setOpenHistoryGoalId(null)}
                  >
                    Fechar
                  </Button>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  {selectedHistoryUpdates.length === 0 ? (
                    <p className="text-zinc-500">Nenhum andamento registrado.</p>
                  ) : (
                    selectedHistoryUpdates.map((update) => (
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
            </div>,
            portalTarget
          );
        })()
        : null}
      {portalTarget && isRiskConfigOpen
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div
                className={cn(
                  "w-full max-w-xl rounded-3xl border p-6",
                  isDark ? "border-zinc-800 bg-[#050816]" : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                      Configuração
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      Ameaça ao prazo
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Defina a janela de risco e o percentual mínimo esperado.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsRiskConfigOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>

                <div className="mt-4 grid gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                      Dias para considerar ameaça
                    </label>
                    <Input
                      value={riskDaysThreshold}
                      onChange={(event) => setRiskDaysThreshold(event.target.value)}
                      type="number"
                      min={1}
                      className={cn(
                        "mt-1 h-9 rounded-xl text-sm",
                        isDark
                          ? "border-white/10 bg-black/40 text-white"
                          : "border-slate-200 bg-white"
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                      % mínimo para não estar em ameaça
                    </label>
                    <Input
                      value={riskMinProgressPercent}
                      onChange={(event) => setRiskMinProgressPercent(event.target.value)}
                      type="number"
                      min={0}
                      max={100}
                      className={cn(
                        "mt-1 h-9 rounded-xl text-sm",
                        isDark
                          ? "border-white/10 bg-black/40 text-white"
                          : "border-slate-200 bg-white"
                      )}
                    />
                  </div>
                  {riskConfigError && (
                    <div
                      className={cn(
                        "rounded-2xl border px-3 py-2 text-sm",
                        isDark
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      )}
                    >
                      {riskConfigError}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsRiskConfigOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      onClick={handleSaveRiskConfig}
                      disabled={savingRiskConfig}
                    >
                      {savingRiskConfig ? "Salvando..." : "Salvar configuração"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>,
            portalTarget
          )
        : null}
      </div>
    </DashboardShell>
  );
}
