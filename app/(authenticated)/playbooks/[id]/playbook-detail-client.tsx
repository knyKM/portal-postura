"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layers, Workflow, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { ScriptPickerModal } from "@/components/playbooks/script-picker-modal";

type PlaybookCondition = {
  label: string;
  action: string;
};

type PlaybookStep = {
  title: string;
  detail: string;
  conditions?: PlaybookCondition[];
};

type Playbook = {
  id: number;
  name: string;
  description: string | null;
  squads: string[];
  automations: string[];
  status: string;
  lastRun: string | null;
  steps: PlaybookStep[];
  scriptPath: string | null;
  createdAt: string;
  updatedAt: string;
};

const statusOptions = ["pronto", "em validação", "em construção"];

type Props = {
  playbookId: string;
};

export default function PlaybookDetailClient({ playbookId }: Props) {
  const router = useRouter();
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [status, setStatus] = useState("pronto");
  const [steps, setSteps] = useState<PlaybookStep[]>([]);
  const [lastRun, setLastRun] = useState("");
  const [scriptPath, setScriptPath] = useState("");
  const [squadsInput, setSquadsInput] = useState("");
  const [automationsInput, setAutomationsInput] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptModalOpen, setScriptModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!playbookId) return;
    const controller = new AbortController();
    async function fetchPlaybook() {
      try {
        const response = await fetch(`/api/playbooks/${playbookId}`, {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível carregar o playbook.");
        }
        setPlaybook(data.playbook);
        setStatus(data.playbook.status);
        setSteps(
          (data.playbook.steps ?? []).map((step) => ({
            ...step,
            conditions: Array.isArray(step.conditions) ? step.conditions : [],
          }))
        );
        setLastRun(data.playbook.lastRun ?? "");
        setScriptPath(data.playbook.scriptPath ?? "");
        setSquadsInput(data.playbook.squads.join(", "));
        setAutomationsInput(data.playbook.automations.join(", "));
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : "Falha inesperada ao carregar."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    fetchPlaybook();
    return () => controller.abort();
  }, [playbookId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { role?: string };
      setIsAdmin(parsed?.role === "admin");
    } catch {
      // ignore parse errors
    }
  }, []);

type StepField = "title" | "detail";

function updateStep(index: number, field: StepField, value: string) {
  setSteps((prev) => {
    const clone = [...prev];
    clone[index] = { ...clone[index], [field]: value };
    return clone;
  });
  }

function addStep() {
  setSteps((prev) => [
    ...prev,
    { title: "Nova etapa", detail: "Descreva o que deve acontecer.", conditions: [] },
  ]);
}

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

function moveStep(index: number, direction: -1 | 1) {
    setSteps((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) {
        return prev;
      }
      const clone = [...prev];
      [clone[index], clone[target]] = [clone[target], clone[index]];
      return clone;
    });
  }

  function parseList(value: string) {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  const squadsPreview = useMemo(() => parseList(squadsInput), [squadsInput]);
  const automationsPreview = useMemo(
    () => parseList(automationsInput),
    [automationsInput]
  );

  async function handleSave() {
    if (!playbook) return false;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/playbooks/${playbook.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          steps,
          lastRun: lastRun || null,
          scriptPath: scriptPath || null,
          squads: parseList(squadsInput),
          automations: parseList(automationsInput),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível atualizar o playbook.");
      }
      setPlaybook(data.playbook);
      setSteps(
        (data.playbook.steps ?? []).map((step: PlaybookStep) => ({
          ...step,
          conditions: Array.isArray(step.conditions) ? step.conditions : [],
        }))
      );
      setStatus(data.playbook.status);
      setLastRun(data.playbook.lastRun ?? "");
      setScriptPath(data.playbook.scriptPath ?? "");
      setSquadsInput(data.playbook.squads.join(", "));
      setAutomationsInput(data.playbook.automations.join(", "));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar alterações.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!playbook || !isAdmin) return;
    const confirmed =
      typeof window === "undefined"
        ? false
        : window.confirm(
            "Excluir este playbook? Esta ação não pode ser desfeita."
          );
    if (!confirmed) return;
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/playbooks/${playbook.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível remover o playbook.");
      }
      router.replace("/playbooks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir playbook.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="px-4 py-10 text-sm text-zinc-400">Carregando...</div>
      </DashboardShell>
    );
  }

  if (!playbook) {
    return (
      <DashboardShell>
        <div className="px-4 py-10 text-sm text-rose-300">
          Playbook não encontrado.
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      pageTitle={`Playbook · ${playbook.name}`}
      pageSubtitle="Ajuste status, etapas e acompanhe execuções React + Vite."
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#090f21] via-[#050514] to-[#04000c] p-6 text-zinc-100 shadow-[0_20px_100px_rgba(88,28,135,0.35)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
                Playbook detalhado
              </p>
              <h1 className="text-3xl font-semibold">{playbook.name}</h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                {playbook.description}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 text-sm md:flex-row md:items-center">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Script
                </label>
                <div className="mt-1 flex gap-2">
                  <Input
                    value={scriptPath}
                    onChange={(event) => setScriptPath(event.target.value)}
                    className="w-60 border-white/20 bg-black/40 text-sm text-white"
                    placeholder="scripts/playbook.sh"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-white/30 text-xs text-white hover:bg-white/10"
                    onClick={() => setScriptModalOpen(true)}
                  >
                    Selecionar
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="ml-auto mt-1 rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white outline-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Última execução
                </label>
                <Input
                  value={lastRun}
                  onChange={(event) => setLastRun(event.target.value)}
                  className="mt-1 border-white/20 bg-black/40 text-sm text-white"
                  placeholder="Ex: Há 2 horas"
                />
              </div>
              {isAdmin && (
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-100 hover:bg-rose-500/20"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Excluindo..." : "Excluir playbook"}
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="border border-white/10 bg-[#040414]/80 text-zinc-100">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">
                  Squads e automations
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-white/20 text-xs text-white hover:bg-white/10"
                  onClick={() => setEditModalOpen(true)}
                >
                  Editar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Layers className="h-4 w-4 text-purple-300" />
                  <span>Squads</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400">
                  {playbook.squads.length === 0 && (
                    <span className="text-[11px] lowercase normal-case">
                      Nenhuma squad definida
                    </span>
                  )}
                  {playbook.squads.map((squad) => (
                    <span
                      key={squad}
                      className="rounded-full border border-white/10 px-3 py-1 text-zinc-200"
                    >
                      {squad}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Workflow className="h-4 w-4 text-sky-300" />
                  <span>Automations</span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-zinc-400">
                  {playbook.automations.length === 0 && (
                    <li className="text-[11px] lowercase normal-case">
                      Nenhuma automação configurada
                    </li>
                  )}
                  {playbook.automations.map((automation) => (
                    <li key={automation}>{automation}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-[#040414]/80 text-zinc-100">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Metadados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-400">
              <p>
                Script:{" "}
                <span className="text-zinc-200">
                  {playbook.scriptPath ?? "Não definido"}
                </span>
              </p>
              <p>
                Criado em:{" "}
                <span className="text-zinc-200">
                  {new Date(playbook.createdAt).toLocaleString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                  })}
                </span>
              </p>
              <p>
                Atualizado em:{" "}
                <span className="text-zinc-200">
                  {new Date(playbook.updatedAt).toLocaleString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                  })}
                </span>
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-zinc-100 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
                Passos do playbook
              </p>
              <h2 className="text-2xl font-semibold">Etapas de execução</h2>
              <p className="text-sm text-zinc-400">
                Organize a narrativa do playbook, ajuste a ordem e refine o texto de cada etapa.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-zinc-200">
                {steps.length} etapa{steps.length === 1 ? "" : "s"}
              </div>
              <Button
                variant="outline"
                className="rounded-2xl border-white/30 text-white hover:bg-white/10"
                onClick={addStep}
              >
                Adicionar etapa
              </Button>
            </div>
          </div>
          <div className="relative mt-8">
            <div className="space-y-6">
              {steps.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-zinc-400">
                  Nenhuma etapa cadastrada. Utilize “Adicionar etapa” para iniciar o roteiro.
                </div>
              )}
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative rounded-3xl border border-white/15 bg-black/30/80 p-5 text-sm text-zinc-200 shadow-[0_10px_40px_rgba(3,4,18,0.45)] md:pl-16"
                >
                  <span className="absolute -left-3 top-5 hidden h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-lg font-semibold md:flex">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-purple-200">
                        Etapa {index + 1}
                      </p>
                      <Input
                        value={step.title}
                        onChange={(event) => updateStep(index, "title", event.target.value)}
                        className="mt-2 border-white/20 bg-black/40 text-white"
                        placeholder="Título da etapa"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full border border-white/10 text-white hover:bg-white/10"
                        onClick={() => moveStep(index, -1)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full border border-white/10 text-white hover:bg-white/10"
                        onClick={() => moveStep(index, 1)}
                        disabled={index === steps.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      {steps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full border border-rose-500/40 text-rose-200 hover:bg-rose-500/10"
                          onClick={() => removeStep(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Textarea
                    value={step.detail}
                    onChange={(event) => updateStep(index, "detail", event.target.value)}
                    className="mt-3 border-white/20 bg-black/40 text-white"
                    placeholder="Detalhe da execução, responsáveis e dependências"
                  />
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400">
                      <span>Condicionais</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white hover:bg-white/10"
                        onClick={() => addCondition(index)}
                      >
                        Adicionar condicional
                      </Button>
                    </div>
                    {(!step.conditions || step.conditions.length === 0) && (
                      <p className="mt-3 text-xs text-zinc-500">
                        Nenhuma condicional cadastrada. Use o botão acima para mapear ramificações.
                      </p>
                    )}
                    {Array.isArray(step.conditions) && step.conditions.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {step.conditions.map((condition, conditionIndex) => (
                          <div
                            key={`${index}-${conditionIndex}`}
                            className="rounded-2xl border border-white/15 bg-black/30 p-3 text-xs text-zinc-300"
                          >
                            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-purple-200">
                              <span>Condição {conditionIndex + 1}</span>
                              <button
                                type="button"
                                className="text-rose-300 hover:text-rose-200"
                                onClick={() => removeCondition(index, conditionIndex)}
                              >
                                Remover
                              </button>
                            </div>
                            <Input
                              value={condition.label}
                              onChange={(event) =>
                                updateCondition(index, conditionIndex, "label", event.target.value)
                              }
                              className="mt-2 border-white/20 bg-black/40 text-white"
                              placeholder="Ex.: Se a execução falhar"
                            />
                            <Textarea
                              value={condition.action}
                              onChange={(event) =>
                                updateCondition(index, conditionIndex, "action", event.target.value)
                              }
                              className="mt-2 border-white/20 bg-black/40 text-white"
                              placeholder="Descreva o que deve acontecer quando a condição for verdadeira."
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            className="rounded-2xl px-6 py-2"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </section>
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#050513] p-6 text-white shadow-[0_25px_90px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
                  Editar dados
                </p>
                <h3 className="text-xl font-semibold">Squads e automations</h3>
              </div>
              <button
                type="button"
                className="text-sm text-zinc-400 hover:text-white"
                onClick={() => setEditModalOpen(false)}
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 space-y-4 text-sm text-zinc-200">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Squads (separe por vírgulas)
                </label>
                <Textarea
                  value={squadsInput}
                  onChange={(event) => setSquadsInput(event.target.value)}
                  className="mt-2 border-white/20 bg-black/40 text-white"
                  placeholder="ex.: Squad Vuln, Squad Web"
                />
                {squadsPreview.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                    {squadsPreview.map((squad) => (
                      <span
                        key={squad}
                        className="rounded-full border border-white/10 px-3 py-1"
                      >
                        {squad}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Automations (separe por vírgulas)
                </label>
                <Textarea
                  value={automationsInput}
                  onChange={(event) => setAutomationsInput(event.target.value)}
                  className="mt-2 border-white/20 bg-black/40 text-white"
                  placeholder="ex.: Jira bulk update, Script mitigacao"
                />
                {automationsPreview.length > 0 && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-zinc-400">
                    {automationsPreview.map((automation) => (
                      <li key={automation}>{automation}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="ghost"
                className="text-sm text-zinc-300 hover:bg-white/10"
                onClick={() => setEditModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="rounded-2xl px-6 py-2"
                disabled={saving}
                onClick={async () => {
                  const success = await handleSave();
                  if (success) {
                    setEditModalOpen(false);
                  }
                }}
              >
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </div>
      )}
        <ScriptPickerModal
          open={scriptModalOpen}
          onClose={() => setScriptModalOpen(false)}
          onSelect={(path) => setScriptPath(path)}
          initialPath={scriptPath}
        />
      </div>
    </DashboardShell>
  );
}
  function addCondition(stepIndex: number) {
    setSteps((prev) => {
      const clone = [...prev];
      const existing = Array.isArray(clone[stepIndex].conditions) ? clone[stepIndex].conditions! : [];
      const next = [...existing, { label: "", action: "" }];
      clone[stepIndex] = { ...clone[stepIndex], conditions: next };
      return clone;
    });
  }

  function updateCondition(
    stepIndex: number,
    conditionIndex: number,
    field: keyof PlaybookCondition,
    value: string
  ) {
    setSteps((prev) => {
      const clone = [...prev];
      const conditions = Array.isArray(clone[stepIndex].conditions) ? [...clone[stepIndex].conditions!] : [];
      if (!conditions[conditionIndex]) return prev;
      conditions[conditionIndex] = { ...conditions[conditionIndex], [field]: value };
      clone[stepIndex] = { ...clone[stepIndex], conditions };
      return clone;
    });
  }

  function removeCondition(stepIndex: number, conditionIndex: number) {
    setSteps((prev) => {
      const clone = [...prev];
      const conditions = Array.isArray(clone[stepIndex].conditions) ? [...clone[stepIndex].conditions!] : [];
      const filtered = conditions.filter((_, index) => index !== conditionIndex);
      clone[stepIndex] = { ...clone[stepIndex], conditions: filtered };
      return clone;
    });
  }
