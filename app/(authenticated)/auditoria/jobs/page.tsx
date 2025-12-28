"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AutomationJob } from "@/data/automation-monitor";

type AutomationSnapshotResponse = {
  jobs?: AutomationJob[];
};

const statusLabel: Record<AutomationJob["status"], string> = {
  running: "Em execução",
  pending: "Na fila",
  failed: "Falhou",
  success: "Sucesso",
};

const statusAccent: Record<AutomationJob["status"], string> = {
  running: "bg-emerald-500/10 text-emerald-200 border-emerald-500/40",
  pending: "bg-amber-500/10 text-amber-200 border-amber-500/40",
  failed: "bg-rose-500/10 text-rose-200 border-rose-500/40",
  success: "bg-indigo-500/10 text-indigo-200 border-indigo-500/40",
};

type JobForm = {
  name: string;
  owner: string;
  description: string;
  queueSeconds: string;
  pendingIssues: string;
};

const emptyForm: JobForm = {
  name: "",
  owner: "",
  description: "",
  queueSeconds: "",
  pendingIssues: "",
};

export default function AuditoriaJobsManagementPage() {
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<JobForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<JobForm>(emptyForm);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

  async function loadJobs() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auditoria", { cache: "no-store" });
      const data = (await response.json().catch(() => null)) as AutomationSnapshotResponse | null;
      if (!response.ok) {
        throw new Error((data as any)?.error || "Falha ao consultar jobs.");
      }
      setJobs(data?.jobs ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleCreateJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (creating) return;
    setCreateError(null);
    setCreateMessage(null);
    setCreating(true);
    try {
      const response = await fetch("/api/auditoria/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          owner: createForm.owner,
          description: createForm.description,
          queueSeconds: Number(createForm.queueSeconds) || 0,
          pendingIssues: Number(createForm.pendingIssues) || 0,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao criar job.");
      }
      setCreateMessage(`Job criado. Endpoint: ${data.endpoint}`);
      setCreateForm(emptyForm);
      loadJobs();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setCreating(false);
    }
  }

function startEditing(job: AutomationJob) {
  setEditingId(job.id);
  setEditingStatus(null);
  setEditingForm({
    name: job.name,
    owner: job.owner,
    description: job.description ?? "",
      queueSeconds: job.queueSeconds ? String(job.queueSeconds) : "",
      pendingIssues: job.pendingIssues ? String(job.pendingIssues) : "",
    });
  }

  function resetEditing() {
    setEditingId(null);
    setEditingForm(emptyForm);
    setEditingStatus(null);
  }

  async function handleUpdateJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) return;
    setEditingStatus("Salvando alterações...");
    try {
      const response = await fetch(`/api/auditoria/jobs/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingForm.name,
          owner: editingForm.owner,
          description: editingForm.description,
          queueSeconds: Number(editingForm.queueSeconds),
          pendingIssues: Number(editingForm.pendingIssues),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao atualizar job.");
      }
      setEditingStatus("Alterações salvas.");
      setTimeout(() => setEditingStatus(null), 2500);
      loadJobs();
    } catch (err) {
      setEditingStatus(err instanceof Error ? err.message : "Erro inesperado ao atualizar.");
    }
  }

  return (
    <DashboardShell
      pageTitle="Jobs monitorados"
      pageSubtitle="Cadastre novas integrações e edite os jobs existentes para refletir mudanças nas automações."
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        <div className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-gradient-to-br from-[#050516] via-[#080e23] to-[#04020d] p-6 text-white">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-purple-200">
            <span>Auditoria React + Vite</span>
            <Badge
              variant="secondary"
              className="border-purple-400/40 bg-purple-500/20 text-[10px] text-purple-100"
            >
              Jobs em tempo real
            </Badge>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-zinc-300">
              Envie status diretamente via API e mantenha os metadados alinhados nesta central.
            </p>
            <Button variant="outline" asChild className="rounded-full border-white/30 text-xs text-white">
              <Link href="/auditoria">Voltar para auditoria</Link>
            </Button>
          </div>
          <p className="text-xs text-zinc-400">
            Endpoints principais: <code className="font-mono text-[11px]">POST /api/auditoria/jobs</code>,
            <code className="font-mono text-[11px]"> PATCH /api/auditoria/jobs/:id</code> e{" "}
            <code className="font-mono text-[11px]">POST /api/auditoria/jobs/:id/status</code>.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            Falha ao carregar jobs: {error}
          </div>
        )}

        <Card className="rounded-3xl border border-white/10 bg-[#050816]/80 text-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Criar novo job</CardTitle>
            <p className="text-xs text-zinc-400">
              Gere um ID exclusivo e receba o endpoint para enviar o status da automação.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {createMessage && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
                {createMessage}
              </div>
            )}
            {createError && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
                {createError}
              </div>
            )}
            <form onSubmit={handleCreateJob} className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Nome</label>
                <Input
                  value={createForm.name}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                  placeholder="Ex: Sync backlog Web"
                  className="mt-1 border-white/10 bg-black/40 text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Owner</label>
                <Input
                  value={createForm.owner}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, owner: event.target.value }))
                  }
                  required
                  placeholder="Squad Jira"
                  className="mt-1 border-white/10 bg-black/40 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Descrição</label>
                <Textarea
                  value={createForm.description}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Explique o objetivo desta automação..."
                  className="mt-1 min-h-[70px] border-white/10 bg-black/40 text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Fila inicial</label>
                <Input
                  type="number"
                  min={0}
                  value={createForm.queueSeconds}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, queueSeconds: event.target.value }))
                  }
                  placeholder="0"
                  className="mt-1 border-white/10 bg-black/40 text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Pendências</label>
                <Input
                  type="number"
                  min={0}
                  value={createForm.pendingIssues}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, pendingIssues: event.target.value }))
                  }
                  placeholder="0"
                  className="mt-1 border-white/10 bg-black/40 text-white"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white"
                >
                  {creating ? "Registrando..." : "Criar job"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-white/10 bg-[#050816]/80 text-white">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Jobs existentes</CardTitle>
              <p className="text-xs text-zinc-400">
                Clique em editar para ajustar metadados do job.
              </p>
            </div>
            <span className="text-xs text-zinc-500">
              {loading ? "Carregando..." : `${jobs.length} job(s) cadastrados`}
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobs.length === 0 && !loading && (
              <div className="rounded-2xl border border-dashed border-purple-500/40 px-4 py-3 text-sm text-zinc-400">
                Nenhum job foi registrado ainda. Utilize o formulário acima para iniciar.
              </div>
            )}
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{job.name}</p>
                  <p className="font-mono text-[11px] text-zinc-500">{job.id}</p>
                  <p className="text-xs text-zinc-400">Owner: {job.owner}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 font-semibold",
                      statusAccent[job.status]
                    )}
                  >
                    {statusLabel[job.status]}
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-zinc-400">
                    Fila: {job.queueSeconds || 0}s
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-zinc-400">
                    Pendências: {job.pendingIssues || 0}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full border-white/30 text-xs text-white hover:bg-white/10"
                  onClick={() => startEditing(job)}
                >
                  Editar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {editingId && (
          <Card className="rounded-3xl border border-white/10 bg-[#040314]/90 text-white">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Editar job</CardTitle>
              <p className="text-xs text-zinc-400">Atualize as informações e salve para refletir na auditoria.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateJob} className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Nome</label>
                  <Input
                    value={editingForm.name}
                    onChange={(event) =>
                      setEditingForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    required
                    className="mt-1 border-white/10 bg-black/40 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Owner</label>
                  <Input
                    value={editingForm.owner}
                    onChange={(event) =>
                      setEditingForm((prev) => ({ ...prev, owner: event.target.value }))
                    }
                    required
                    className="mt-1 border-white/10 bg-black/40 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Descrição</label>
                  <Textarea
                    value={editingForm.description}
                    onChange={(event) =>
                      setEditingForm((prev) => ({ ...prev, description: event.target.value }))
                    }
                    className="mt-1 min-h-[70px] border-white/10 bg-black/40 text-white"
                    placeholder="Atualize observações sobre esse job..."
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Fila</label>
                  <Input
                    type="number"
                    min={0}
                    value={editingForm.queueSeconds}
                    onChange={(event) =>
                      setEditingForm((prev) => ({ ...prev, queueSeconds: event.target.value }))
                    }
                    className="mt-1 border-white/10 bg-black/40 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Pendências</label>
                  <Input
                    type="number"
                    min={0}
                    value={editingForm.pendingIssues}
                    onChange={(event) =>
                      setEditingForm((prev) => ({ ...prev, pendingIssues: event.target.value }))
                    }
                    className="mt-1 border-white/10 bg-black/40 text-white"
                  />
                </div>
                <div className="md:col-span-2 flex justify-between gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-sm text-zinc-400 hover:bg-white/5"
                    onClick={resetEditing}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white"
                  >
                    Salvar alterações
                  </Button>
                </div>
              </form>
              {editingStatus && (
                <p className="mt-3 text-xs text-zinc-400">{editingStatus}</p>
              )}
              <p className="mt-3 text-xs text-zinc-500">
                Para atualizar o status operacional, continue utilizando{" "}
                <code className="font-mono text-[11px]">POST /api/auditoria/jobs/{editingId}/status</code>{" "}
                com <code className="font-mono text-[11px]">{`{ "status": 0|1|2 }`}</code>.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
