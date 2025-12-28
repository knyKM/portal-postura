"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Layers, Workflow, Zap } from "lucide-react";
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
  createdAt: string;
  updatedAt: string;
};

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pronto: {
    label: "Pronto para uso",
    className: "bg-emerald-500/10 text-emerald-200 border-emerald-500/30",
  },
  "em validação": {
    label: "Em validação",
    className: "bg-amber-500/10 text-amber-200 border-amber-500/30",
  },
  "em construção": {
    label: "Em construção",
    className: "bg-purple-500/10 text-purple-200 border-purple-500/30",
  },
};

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scriptModalOpen, setScriptModalOpen] = useState(false);
  const [newPlaybook, setNewPlaybook] = useState({
    name: "",
    squads: "",
    automations: "",
    description: "",
    steps: "",
    scriptPath: "",
  });

  function parseArray(value: string) {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  function parseSteps(value: string): PlaybookStep[] {
    const lines = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return [
        {
          title: "Defina os passos",
          detail: "Edite o playbook para incluir etapas específicas.",
        },
      ];
    }

    return lines.map((line) => {
      const [title, ...rest] = line.split(" - ");
      return {
        title: title.trim(),
        detail: rest.join(" - ").trim() || "Detalhe a etapa posteriormente.",
        conditions: [],
      };
    });
  }

  async function fetchPlaybooks(signal?: AbortSignal) {
    setError(null);
    try {
      const response = await fetch("/api/playbooks", { signal });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível carregar playbooks.");
      }
      setPlaybooks(data?.playbooks ?? []);
    } catch (err) {
      if (signal?.aborted) return;
      setError(
        err instanceof Error ? err.message : "Falha inesperada ao carregar."
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchPlaybooks(controller.signal);
    return () => controller.abort();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const squads = parseArray(newPlaybook.squads);
    const automations = parseArray(newPlaybook.automations);
    if (!newPlaybook.name.trim() || squads.length === 0 || automations.length === 0) {
      setError("Informe nome, squads e automations para criar um playbook.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/playbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPlaybook.name.trim(),
          description: newPlaybook.description.trim(),
          squads,
          automations,
          steps: parseSteps(newPlaybook.steps),
          scriptPath: newPlaybook.scriptPath.trim(),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao criar playbook.");
      }

      setPlaybooks((prev) => [data.playbook, ...prev]);
      setNewPlaybook({
        name: "",
        squads: "",
        automations: "",
        description: "",
        steps: "",
        scriptPath: "",
      });
      setFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar playbook.");
    } finally {
      setSubmitting(false);
    }
  }

  const metrics = useMemo(
    () => [
      {
        label: "Playbooks ativos",
        value: playbooks.length,
        helper: "Fluxos disponíveis para squads",
      },
      {
        label: "Esteiras prontas",
        value: playbooks.filter((p) => p.status === "pronto").length,
        helper: "Liberadas para uso imediato",
      },
      {
        label: "Automations conectadas",
        value: playbooks.reduce((acc, p) => acc + p.automations.length, 0),
        helper: "Integrações React + Vite / Jira",
      },
    ],
    [playbooks]
  );

  return (
    <DashboardShell
      pageTitle="Centro de Playbooks Automatizados"
      pageSubtitle="Orquestre fluxos, conecte automações Jira e scripts React + Vite para acelerar mitigação."
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#090f21] via-[#050514] to-[#04000c] p-6 text-zinc-100 shadow-[0_20px_100px_rgba(88,28,135,0.35)]">
          <div className="absolute inset-y-0 right-6 w-48 rounded-full bg-gradient-to-b from-sky-500/40 via-purple-500/30 to-pink-500/20 blur-[120px]" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
                Orquestração inteligente
              </p>
              <h1 className="text-3xl font-semibold">
                Playbooks com automação end-to-end
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Desenhe fluxos, conecte automações Jira e scripts com a mesma
                estética dos painéis React + Vite.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 text-sm md:flex-row md:items-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.4em] text-zinc-300">
                Pipelines ativos {playbooks.length}
              </div>
              <Button
                onClick={() => setFormOpen((prev) => !prev)}
                className="rounded-xl border border-white/20 bg-transparent px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
              >
                {formOpen ? "Fechar criador" : "Novo playbook"}
              </Button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        {formOpen && (
          <Card className="border border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">
                Criar playbook automatizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <div className="md:col-span-2">
                  <label className="text-sm text-zinc-300">Nome do playbook</label>
                  <Input
                    value={newPlaybook.name}
                    onChange={(event) =>
                      setNewPlaybook((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="mt-1"
                    placeholder="Ex: Mitigação OWASP para squads React"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-300">Squads envolvidas</label>
                  <Input
                    value={newPlaybook.squads}
                    onChange={(event) =>
                      setNewPlaybook((prev) => ({
                        ...prev,
                        squads: event.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Separe por vírgula (ex: IAM, Checkout)"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-300">
                    Automations conectadas
                  </label>
                  <Input
                    value={newPlaybook.automations}
                    onChange={(event) =>
                      setNewPlaybook((prev) => ({
                        ...prev,
                        automations: event.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Script, JQL, webhook..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-zinc-300">
                    Descrição / contexto
                  </label>
                  <Textarea
                    value={newPlaybook.description}
                    onChange={(event) =>
                      setNewPlaybook((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    className="mt-1 min-h-[90px]"
                    placeholder="Descreva o objetivo, automações e integrações..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-zinc-300">
                    Passos (um por linha, formato: Título - detalhe)
                  </label>
                  <Textarea
                    value={newPlaybook.steps}
                    onChange={(event) =>
                      setNewPlaybook((prev) => ({
                        ...prev,
                        steps: event.target.value,
                      }))
                    }
                    className="mt-1 min-h-[120px]"
                    placeholder="Ex: Detectar vetor - Executar scanners Tenable e APIs..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-zinc-300">
                    Caminho do script (bash/python)
                  </label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      value={newPlaybook.scriptPath}
                      onChange={(event) =>
                        setNewPlaybook((prev) => ({
                          ...prev,
                          scriptPath: event.target.value,
                        }))
                      }
                      placeholder="Ex: scripts/tenable_cleanup.sh"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="whitespace-nowrap rounded-xl border-white/30 text-xs text-white hover:bg-white/10"
                      onClick={() => setScriptModalOpen(true)}
                    >
                      Escolher script
                    </Button>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button
                    type="submit"
                    className="rounded-xl border border-white/20 bg-transparent px-4 py-1.5 text-xs text-white hover:bg-white/10"
                    disabled={submitting}
                  >
                    {submitting ? "Salvando..." : "Salvar playbook"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <ScriptPickerModal
          open={scriptModalOpen}
          onClose={() => setScriptModalOpen(false)}
          onSelect={(path) =>
            setNewPlaybook((prev) => ({
              ...prev,
              scriptPath: path,
            }))
          }
          initialPath={newPlaybook.scriptPath}
        />

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-zinc-300">
            Carregando playbooks...
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((metric) => (
                <Card
                  key={metric.label}
                  className="border border-white/10 bg-gradient-to-br from-white/10 to-transparent text-white"
                >
                  <CardHeader className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-300">
                      {metric.label}
                    </p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-400">{metric.helper}</p>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {playbooks.map((playbook) => (
                <Card
                  key={playbook.id}
                  className="flex flex-col gap-4 border border-white/10 bg-[#040414]/80 p-4 text-zinc-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.4em] text-purple-300">
                        Playbook
                      </p>
                      <h3 className="text-xl font-semibold">{playbook.name}</h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.3em]",
                        statusConfig[playbook.status]?.className ??
                          "border-white/20 text-white"
                      )}
                    >
                      {statusConfig[playbook.status]?.label ?? playbook.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-400">{playbook.description}</p>
                  <div className="space-y-2 text-sm text-zinc-300">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Layers className="h-4 w-4 text-purple-300" />
                      <span>Squads</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400">
                      {playbook.squads.map((squad) => (
                        <span
                          key={squad}
                          className="rounded-full border border-white/10 px-3 py-1 text-zinc-200"
                        >
                          {squad}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-zinc-400">
                      <Workflow className="h-4 w-4 text-sky-300" />
                      <span>Automations</span>
                    </div>
                    <ul className="list-disc space-y-1 pl-5 text-xs text-zinc-400">
                      {playbook.automations.map((automation) => (
                        <li key={automation}>{automation}</li>
                      ))}
                    </ul>
                    {playbook.scriptPath && (
                      <p className="text-[11px] text-zinc-500">
                        Script: <span className="text-zinc-200">{playbook.scriptPath}</span>
                      </p>
                    )}
                    <p className="text-xs text-zinc-500">
                      Última execução: {playbook.lastRun ?? "Ainda não executado"}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="rounded-xl border-white/20 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                      asChild
                    >
                      <Link href={`/playbooks/${playbook.id}`}>Abrir playbook</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </section>
          </>
        )}

      </div>
    </DashboardShell>
  );
}
