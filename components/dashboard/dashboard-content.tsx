"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Flame,
  Clock3,
  MonitorSmartphone,
  BarChart3,
  Target,
  PieChart,
  Table,
  Activity,
  PauseCircle,
  Clock4,
  LineChart,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { useAutomationMonitor } from "@/hooks/use-automation-monitor";
import type { AutomationJobStatus } from "@/data/automation-monitor";

// Dados mockados
const monthlyVulns = [
  { month: "Jan", total: 42 },
  { month: "Fev", total: 38 },
  { month: "Mar", total: 55 },
  { month: "Abr", total: 47 },
  { month: "Mai", total: 63 },
  { month: "Jun", total: 58 },
];

const v0PerMonth = [
  { month: "Jan", v0: 3 },
  { month: "Fev", v0: 2 },
  { month: "Mar", v0: 4 },
  { month: "Abr", v0: 3 },
  { month: "Mai", v0: 5 },
  { month: "Jun", v0: 4 },
];

const severityDistribution = [
  { severity: "Crítica", count: 12 },
  { severity: "Alta", count: 34 },
  { severity: "Média", count: 51 },
  { severity: "Baixa", count: 19 },
];

type WidgetTemplate = {
  id: string;
  title: string;
  description: string;
  jqlExample: string;
  icon: React.ComponentType<{ className?: string }>;
  supportsSingle: boolean;
  supportsMulti: boolean;
  defaultMulti?: boolean;
};

const widgetTemplates: WidgetTemplate[] = [
  {
    id: "counter",
    title: "Contador",
    description: "Total de resultados para uma JQL.",
    jqlExample: 'project = "SEC" AND status != Done',
    icon: Target,
    supportsSingle: true,
    supportsMulti: false,
  },
  {
    id: "pie",
    title: "Pizza",
    description: "Comparação de totais entre várias JQLs.",
    jqlExample: 'project = "SEC" AND priority = High',
    icon: PieChart,
    supportsSingle: false,
    supportsMulti: true,
  },
  {
    id: "bar",
    title: "Barra",
    description: "Comparação de totais entre JQLs.",
    jqlExample: 'project = "SEC" AND status = \"Em análise\"',
    icon: BarChart3,
    supportsSingle: false,
    supportsMulti: true,
  },
  {
    id: "table",
    title: "Tabela",
    description: "Mostra o total por cada JQL configurada.",
    jqlExample: 'project = "SEC" AND labels = monitorar',
    icon: Table,
    supportsSingle: false,
    supportsMulti: true,
  },
  {
    id: "line",
    title: "Linha",
    description: "Tendência baseada em uma ou mais JQLs.",
    jqlExample: 'project = "SEC" AND created >= -30d',
    icon: LineChart,
    supportsSingle: true,
    supportsMulti: true,
  },
  {
    id: "radial",
    title: "Radial",
    description: "Progresso ou cobertura de uma ou mais JQLs.",
    jqlExample: 'project = "SEC" AND statusCategory != Done',
    icon: Sparkles,
    supportsSingle: true,
    supportsMulti: true,
  },
];

type DashboardWidgetConfig = {
  name: string;
  templateId: string;
  design: string;
  mode: "single" | "multi";
  jqlEntries: Array<{ name: string; jql: string; color: string }>;
};

type DashboardWidget = {
  id: number;
  name: string;
  templateId: string;
  config: DashboardWidgetConfig;
};

type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon: React.ComponentType<{ className?: string }>;
  rightInfo?: string;
};

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  rightInfo,
}: MetricCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card
      className={cn(
        "border rounded-2xl",
        isDark
          ? "border-zinc-800 bg-[#050816]/80"
          : "border-slate-200 bg-white"
      )}
    >
      {/* cabeçalho bem colado na borda */}
      <CardHeader className="pt-1 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* pill roxa compacta */}
            <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-2.5 py-1.5 shadow-md">
              <Icon className="h-4 w-4 text-white" />
            </div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
              {label}
            </p>
          </div>

          {rightInfo && (
            <span className="text-[11px] text-zinc-500">{rightInfo}</span>
          )}
        </div>
      </CardHeader>

      {/* conteúdo bem próximo da borda inferior */}
      <CardContent className="flex items-baseline justify-between pt-1 pb-1.5">
        <div className="space-y-0.5">
          <p className="text-xl font-semibold">{value}</p>
          {helper && (
            <p className="text-xs text-zinc-500">{helper}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedTemplate, setSelectedTemplate] = useState(widgetTemplates[0].id);
  const [creationMessage, setCreationMessage] = useState<string | null>(null);
  const selected = widgetTemplates.find((template) => template.id === selectedTemplate);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [widgetsLoading, setWidgetsLoading] = useState(false);
  const [widgetsError, setWidgetsError] = useState<string | null>(null);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [widgetName, setWidgetName] = useState("");
  const [widgetDesign, setWidgetDesign] = useState("standard");
  const [widgetMode, setWidgetMode] = useState<"single" | "multi">("single");
  const [jqlEntries, setJqlEntries] = useState<
    Array<{ name: string; jql: string; color: string }>
  >([{ name: "", jql: "", color: "#8b5cf6" }]);
  const [widgetSaveError, setWidgetSaveError] = useState<string | null>(null);
  const [widgetSaving, setWidgetSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchWidgets() {
      setWidgetsLoading(true);
      setWidgetsError(null);
      try {
        const response = await fetch("/api/dashboard-widgets");
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível carregar widgets.");
        }
        if (active) {
          const list = Array.isArray(data?.widgets) ? data.widgets : [];
          const normalized = list.map((item: DashboardWidget) => ({
            ...item,
            config: item.config as DashboardWidgetConfig,
          }));
          setWidgets(normalized);
        }
      } catch (error) {
        if (active) {
          setWidgetsError(
            error instanceof Error ? error.message : "Falha ao carregar widgets."
          );
        }
      } finally {
        if (active) setWidgetsLoading(false);
      }
    }
    fetchWidgets();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (widgetMode === "single" && jqlEntries.length > 1) {
      setJqlEntries((prev) => prev.slice(0, 1));
    }
  }, [jqlEntries.length, widgetMode]);

  function getJobStatus(jobStatus: AutomationJobStatus) {
    switch (jobStatus) {
      case "running":
        return {
          icon: Activity,
          label: "Em execução",
          className: "text-emerald-400",
        };
      case "pending":
        return {
          icon: PauseCircle,
          label: "Na fila",
          className: "text-amber-400",
        };
      case "failed":
        return {
          icon: AlertTriangle,
          label: "Falhou",
          className: "text-rose-400",
        };
      default:
        return {
          icon: Clock4,
          label: "Última execução",
          className: "text-zinc-400",
        };
    }
  }

  function handleCreateWidget(templateId?: string) {
    const template = widgetTemplates.find((item) => item.id === (templateId ?? selectedTemplate));
    if (!template) return;
    setWidgetName(template.title);
    setWidgetDesign("standard");
    if (template.supportsMulti && !template.supportsSingle) {
      setWidgetMode("multi");
    } else if (template.supportsSingle && !template.supportsMulti) {
      setWidgetMode("single");
    } else {
      setWidgetMode(template.defaultMulti ? "multi" : "single");
    }
    setJqlEntries([{ name: "", jql: "", color: "#8b5cf6" }]);
    setWidgetSaveError(null);
    setIsWidgetModalOpen(true);
    setCreationMessage(null);
  }

  const modalTarget = typeof document !== "undefined" ? document.body : null;

  const widgetList = useMemo(() => {
    return widgets.map((widget) => ({
      ...widget,
      template: widgetTemplates.find((item) => item.id === widget.templateId),
    }));
  }, [widgets]);

  async function handleSaveWidget() {
    if (!selected) return;
    const trimmedName = widgetName.trim();
    if (!trimmedName) {
      setWidgetSaveError("Informe o nome do widget.");
      return;
    }
    const entries = jqlEntries.filter(
      (entry) => entry.jql.trim().length > 0 && entry.name.trim().length > 0
    );
    if (entries.length === 0) {
      setWidgetSaveError("Informe ao menos uma JQL com nome.");
      return;
    }
    if (widgetMode === "single" && entries.length > 1) {
      setWidgetSaveError("Este widget aceita apenas uma JQL.");
      return;
    }
    setWidgetSaving(true);
    setWidgetSaveError(null);
    try {
      const payload: DashboardWidgetConfig = {
        name: trimmedName,
        templateId: selected.id,
        design: widgetDesign,
        mode: widgetMode,
        jqlEntries: entries,
      };
      const response = await fetch("/api/dashboard-widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          templateId: selected.id,
          config: payload,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível salvar widget.");
      }
      const widget = data?.widget as DashboardWidget | undefined;
      if (widget) {
        setWidgets((prev) => [widget, ...prev]);
      }
      setIsWidgetModalOpen(false);
      setCreationMessage(`Widget "${trimmedName}" criado e salvo.`);
    } catch (error) {
      setWidgetSaveError(
        error instanceof Error ? error.message : "Falha ao salvar widget."
      );
    } finally {
      setWidgetSaving(false);
    }
  }

  const cardClass = cn(
    "border rounded-3xl",
    isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
  );

  const {
    jobs: automationJobs,
    logs: automationLogs,
    lastUpdated: automationLastUpdated,
    isLoading: automationLoading,
    error: automationError,
  } = useAutomationMonitor(20000);

  const jobStatusCounters = automationJobs.reduce<Record<AutomationJobStatus, number>>(
    (acc, job) => {
      acc[job.status] = (acc[job.status] ?? 0) + 1;
      return acc;
    },
    { running: 0, pending: 0, failed: 0, success: 0 }
  );

  const lastUpdatedLabel = automationLastUpdated
    ? automationLastUpdated.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  return (
    <div className="space-y-4">
      {/* AÇÕES DE WIDGET */}
      <Card className={cardClass}>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Widgets alimentados por JQL
            </CardTitle>
            <p className="text-xs text-zinc-500">
              Selecione um layout e cole a consulta do Jira para trazer contadores em tempo real.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => handleCreateWidget()}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white"
          >
            Criar widget JQL
          </Button>
        </CardHeader>
        {creationMessage && (
          <div
            className={cn(
              "mx-6 rounded-2xl border px-4 py-3 text-xs",
              isDark
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}
          >
            {creationMessage}
          </div>
        )}
        <CardContent className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {widgetTemplates.map((template) => {
            const Icon = template.icon;
            const active = selectedTemplate === template.id;
            return (
              <button
                key={template.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setCreationMessage(null);
                }}
                className={cn(
                  "flex h-full flex-col gap-2 rounded-2xl border px-4 py-4 text-left transition",
                  active
                    ? "border-purple-500 bg-purple-500/10 text-white shadow-lg shadow-purple-900/20"
                    : isDark
                    ? "border-white/10 bg-white/5 text-zinc-200 hover:border-purple-500/40"
                    : "border-slate-200 bg-white text-slate-600 hover:border-purple-300"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-2xl",
                    active
                      ? "bg-white/20 text-white"
                      : isDark
                      ? "bg-white/10 text-purple-200"
                      : "bg-purple-50 text-purple-600"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{template.title}</p>
                  <p className="text-xs text-zinc-400">{template.description}</p>
                </div>
                <p className="text-[11px] font-mono text-purple-300">
                  Exemplo: {template.jqlExample}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-auto w-full rounded-2xl"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedTemplate(template.id);
                    handleCreateWidget(template.id);
                  }}
                >
                  Adicionar
                </Button>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className="flex flex-col gap-2">
          <CardTitle className="text-base font-semibold">Widgets configurados</CardTitle>
          <p className="text-xs text-zinc-500">
            Aqui ficam os widgets JQL que serão consultados pelo job horário.
          </p>
          {widgetsError && <p className="text-xs text-rose-400">{widgetsError}</p>}
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {widgetsLoading ? (
            <div className="text-xs text-zinc-500">Carregando widgets...</div>
          ) : widgetList.length === 0 ? (
            <div className="text-xs text-zinc-500">Nenhum widget configurado.</div>
          ) : (
            widgetList.map((widget) => (
              <div
                key={widget.id}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-xs",
                  isDark
                    ? "border-white/10 bg-[#050816] text-zinc-300"
                    : "border-slate-200 bg-white text-slate-600"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{widget.name}</p>
                  <span className="text-[11px] text-zinc-500">
                    {widget.template?.title ?? widget.templateId}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">
                  {widget.config?.jqlEntries?.length ?? 0} JQL(s)
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {modalTarget && isWidgetModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div
                className={cn(
                  "w-full max-w-3xl rounded-3xl border p-6",
                  isDark ? "border-white/10 bg-[#050816]" : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                      Configurar widget
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {selected?.title ?? "Widget"}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Defina nome, estilo e JQLs para alimentar este widget.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsWidgetModalOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>

                <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                  <input
                    value={widgetName}
                    onChange={(event) => setWidgetName(event.target.value)}
                    placeholder="Nome do widget"
                    className={cn(
                      "h-10 rounded-xl border px-3 text-sm",
                      isDark
                        ? "border-white/10 bg-black/40 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    )}
                  />
                  <select
                    value={widgetDesign}
                    onChange={(event) => setWidgetDesign(event.target.value)}
                    className={cn(
                      "h-10 rounded-xl border px-3 text-sm",
                      isDark
                        ? "border-white/10 bg-black/40 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    <option value="standard">Standard</option>
                    <option value="compact">Compacto</option>
                    <option value="highlight">Destaque</option>
                  </select>
                  {selected?.supportsMulti && selected?.supportsSingle && (
                    <select
                      value={widgetMode}
                      onChange={(event) =>
                        setWidgetMode(event.target.value as "single" | "multi")
                      }
                      className={cn(
                        "h-10 rounded-xl border px-3 text-sm md:col-span-2",
                        isDark
                          ? "border-white/10 bg-black/40 text-white"
                          : "border-slate-200 bg-white text-slate-700"
                      )}
                    >
                      <option value="single">Uma JQL</option>
                      <option value="multi">Múltiplas JQLs</option>
                    </select>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  {jqlEntries.map((entry, index) => (
                    <div
                      key={`${index}-${entry.color}`}
                      className={cn(
                        "rounded-2xl border px-4 py-3",
                        isDark
                          ? "border-white/10 bg-black/30 text-zinc-200"
                          : "border-slate-200 bg-white text-slate-700"
                      )}
                    >
                      <div className="grid gap-3 md:grid-cols-[1fr,2fr,120px]">
                        <input
                          value={entry.name}
                          onChange={(event) =>
                            setJqlEntries((prev) =>
                              prev.map((item, idx) =>
                                idx === index
                                  ? { ...item, name: event.target.value }
                                  : item
                              )
                            )
                          }
                          placeholder="Nome do dado"
                          className={cn(
                            "h-10 rounded-xl border px-3 text-sm",
                            isDark
                              ? "border-white/10 bg-black/40 text-white"
                              : "border-slate-200 bg-white text-slate-700"
                          )}
                        />
                        <input
                          value={entry.jql}
                          onChange={(event) =>
                            setJqlEntries((prev) =>
                              prev.map((item, idx) =>
                                idx === index
                                  ? { ...item, jql: event.target.value }
                                  : item
                              )
                            )
                          }
                          placeholder="JQL"
                          className={cn(
                            "h-10 rounded-xl border px-3 text-sm",
                            isDark
                              ? "border-white/10 bg-black/40 text-white"
                              : "border-slate-200 bg-white text-slate-700"
                          )}
                        />
                        <input
                          type="color"
                          value={entry.color}
                          onChange={(event) =>
                            setJqlEntries((prev) =>
                              prev.map((item, idx) =>
                                idx === index
                                  ? { ...item, color: event.target.value }
                                  : item
                              )
                            )
                          }
                          className="h-10 w-full rounded-xl border border-white/10 bg-transparent"
                        />
                      </div>
                      {widgetMode === "multi" && jqlEntries.length > 1 && (
                        <div className="mt-3 flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setJqlEntries((prev) => prev.filter((_, idx) => idx !== index))
                            }
                          >
                            Remover
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {widgetMode === "multi" && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setJqlEntries((prev) => [
                          ...prev,
                          { name: "", jql: "", color: "#8b5cf6" },
                        ])
                      }
                    >
                      Adicionar JQL
                    </Button>
                  )}
                </div>

                {widgetSaveError && (
                  <p className="mt-3 text-xs text-rose-400">{widgetSaveError}</p>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsWidgetModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    disabled={widgetSaving}
                    onClick={handleSaveWidget}
                  >
                    {widgetSaving ? "Salvando..." : "Salvar widget"}
                  </Button>
                </div>
              </div>
            </div>,
            modalTarget
          )
        : null}

      {/* AUDITORIA DE JOBS */}
      <Card className={cardClass}>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Auditoria em tempo real · Automação Jira
            </CardTitle>
            <p className="text-xs text-zinc-500">
              Acompanhe jobs que mantêm o backlog sincronizado, com status, fila e logs mais recentes.
            </p>
          </div>
          <div className="grid gap-1 text-[11px] text-zinc-500 sm:grid-cols-2">
            <span>
              {jobStatusCounters.running + jobStatusCounters.pending} jobs ativos ·{" "}
              {jobStatusCounters.failed} falhando
            </span>
            <span>
              {automationLoading
                ? "Atualizando auditoria..."
                : `Atualizado às ${lastUpdatedLabel}`}
            </span>
          </div>
          {automationError && (
            <p className="text-xs text-rose-400">Falha ao consultar auditoria: {automationError}</p>
          )}
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div className="overflow-x-auto rounded-2xl border border-dashed border-zinc-700">
            <table className="min-w-full text-left text-sm">
              <thead
                className={cn(
                  "text-xs uppercase tracking-[0.2em]",
                  isDark ? "bg-[#070b1c] text-zinc-500" : "bg-slate-100 text-slate-600"
                )}
              >
                <tr>
                  <th className="px-4 py-3">Job</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Na fila</th>
                  <th className="px-4 py-3">Última execução</th>
                  <th className="px-4 py-3 text-right">Pendências</th>
                </tr>
              </thead>
              <tbody className={isDark ? "bg-[#050816]" : "bg-white"}>
                {automationJobs.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-xs text-zinc-500"
                      colSpan={5}
                    >
                      Nenhum job monitorado no momento.
                    </td>
                  </tr>
                ) : (
                  automationJobs.map((job) => {
                    const statusInfo = getJobStatus(job.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr
                        key={job.id}
                        className={cn(
                          "border-t text-xs",
                          isDark
                            ? "border-zinc-800/60 text-zinc-300"
                            : "border-slate-200 text-slate-600"
                        )}
                      >
                        <td className="px-4 py-3 font-medium">{job.name}</td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center gap-1", statusInfo.className)}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {job.status === "running" ? "—" : `${job.queueSeconds}s`}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span>{job.lastRun}</span>
                            <span className="text-[11px] text-zinc-500">Duração {job.duration}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {job.pendingIssues > 0 ? `${job.pendingIssues} issues` : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isDark ? "border-zinc-800 bg-[#060818]" : "border-slate-200 bg-slate-50"
            )}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Últimos logs
            </p>
              <div className="mt-2 space-y-3">
                {automationLogs.length === 0 ? (
                  <p className="text-xs text-zinc-500">Sem logs coletados nos últimos minutos.</p>
                ) : (
                  automationLogs.map((log) => {
                    const job = automationJobs.find((job) => job.id === log.jobId);
                    return (
                      <div
                        key={`${log.jobId}-${log.timestamp}`}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-xs",
                          isDark
                            ? "border-zinc-700/70 bg-[#050713]"
                            : "border-slate-200 bg-white"
                        )}
                      >
                        <p className="flex items-center justify-between text-[11px] text-zinc-500">
                          <span>{job?.name ?? log.jobId}</span>
                          <span>{log.timestamp}</span>
                        </p>
                        <p className="mt-1 text-sm text-zinc-300">{log.message}</p>
                      </div>
                    );
                  })
                )}
              </div>
            <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Jobs com status falha são reexecutados automaticamente em 5 minutos ou podem ser abertos na fila de aprovações.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MÉTRICAS INICIAIS – cards mais baixos e compactos */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="VULNERABILIDADES ABERTAS"
          value="116"
          helper="Última sincronização há 12 minutos"
          icon={AlertTriangle}
          rightInfo="100%"
        />
        <MetricCard
          label="CRÍTICAS (V0)"
          value="12"
          helper="5 descobertas neste mês"
          icon={Flame}
          rightInfo="10.3%"
        />
        <MetricCard
          label="TEMPO MÉDIO DE CORREÇÃO"
          value="9 dias"
          helper="Janela dos últimos 90 dias"
          icon={Clock3}
          rightInfo="−2 dias"
        />
        <MetricCard
          label="SISTEMAS MONITORADOS"
          value="34"
          helper="Inclui cloud e on-prem"
          icon={MonitorSmartphone}
          rightInfo="+4 este mês"
        />
      </div>

      {/* GRÁFICOS */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className={cn(cardClass, "lg:col-span-2")}>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Novas vulnerabilidades por mês
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVulns}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#27272f" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="month"
                  stroke={isDark ? "#71717a" : "#6b7280"}
                />
                <YAxis
                  stroke={isDark ? "#71717a" : "#6b7280"}
                />
                <RechartsTooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: isDark ? "#020617" : "#ffffff",
                    border: `1px solid ${isDark ? "#27272f" : "#e5e7eb"}`,
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#a855f7"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Vulnerabilidades V0 por mês
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={v0PerMonth}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#27272f" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="month"
                  stroke={isDark ? "#71717a" : "#6b7280"}
                />
                <YAxis
                  stroke={isDark ? "#71717a" : "#6b7280"}
                />
                <RechartsTooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: isDark ? "#020617" : "#ffffff",
                    border: `1px solid ${isDark ? "#27272f" : "#e5e7eb"}`,
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="v0" name="V0 abertas" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Distribuição de vulnerabilidades por severidade
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#27272f" : "#e5e7eb"}
              />
              <XAxis
                dataKey="severity"
                stroke={isDark ? "#71717a" : "#6b7280"}
              />
              <YAxis
                stroke={isDark ? "#71717a" : "#6b7280"}
              />
              <Legend />
              <RechartsTooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: isDark ? "#020617" : "#ffffff",
                  border: `1px solid ${isDark ? "#27272f" : "#e5e7eb"}`,
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="count" name="Quantidade" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
