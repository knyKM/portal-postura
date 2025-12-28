"use client";

import { useEffect, useState, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/theme/theme-provider";

type ActionField = { key: string; value: string };

type ActionPayload = {
  assignee?: string;
  comment?: string;
  fields?: ActionField[];
  projectKey?: string;
  csvData?: string;
  csvFileName?: string;
};

type ApprovalRequest = {
  id: number;
  action_type: "status" | "assignee" | "comment" | "fields" | "escalate" | "delete";
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

type ApprovalQueueProps = {
  pending: ApprovalRequest[];
  completed: ApprovalRequest[];
  focusRequestId?: number | null;
};

export function ApprovalQueue({ pending, completed, focusRequestId }: ApprovalQueueProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [requests, setRequests] = useState(pending);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [notesById, setNotesById] = useState<Record<number, string>>({});
  const [noteErrors, setNoteErrors] = useState<Record<number, string>>({});
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const mutedText = isDark ? "text-zinc-500" : "text-slate-500";
  const surface = isDark
    ? "border-white/5 bg-gradient-to-br from-[#0a0f1f] via-[#050814] to-[#04060f] text-white"
    : "border-slate-200 bg-white text-slate-900";
  const secondarySurface = isDark
    ? "border-white/5 bg-white/5 text-white"
    : "border-slate-200 bg-slate-50 text-slate-800";

  function summarizeIds(value: string, maxPreview = 3) {
    const ids = value
      .split(/[\r\n,]+/)
      .map((id) => id.trim())
      .filter(Boolean);
    const preview = ids.slice(0, maxPreview);
    const remaining = Math.max(ids.length - preview.length, 0);
    return { preview, remaining, total: ids.length };
  }

  const actionLabels: Record<ApprovalRequest["action_type"], string> = {
    status: "Alterar status",
    assignee: "Mudar responsável",
    comment: "Adicionar comentário",
    fields: "Atualizar campos",
    escalate: "Subir issue",
    delete: "Deletar issue",
  };

  useEffect(() => {
    setRequests(pending);
  }, [pending]);

  useEffect(() => {
    if (!focusRequestId) return;
    setHighlightedId(focusRequestId);
    const element = document.getElementById(`request-${focusRequestId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    const timeout = window.setTimeout(() => setHighlightedId(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [focusRequestId]);

  async function handleDecision(id: number, decision: "approve" | "decline") {
    const noteValue = (notesById[id] ?? "").trim();
    if (!noteValue) {
      setNoteErrors((prev) => ({
        ...prev,
        [id]: "Informe o motivo antes de enviar.",
      }));
      return;
    }
    setNoteErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setProcessingId(id);
    setError(null);
    try {
      const response = await fetch("/api/actions/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, decision, notes: noteValue }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao atualizar a solicitação.");
      }
      setRequests((prev) => prev.filter((request) => request.id !== id));
      setNotesById((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível processar a ação."
      );
    } finally {
      setProcessingId(null);
    }
  }

  function renderActionDetails(request: ApprovalRequest): ReactNode {
    const shellClass = cn(
      "rounded-2xl border px-4 py-3 text-sm",
      secondarySurface
    );

    switch (request.action_type) {
      case "status":
        return (
          <div className={shellClass}>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Novo status
            </p>
            <p className="mt-2 text-lg font-semibold">
              {request.requested_status ?? "-"}
            </p>
          </div>
        );
      case "assignee":
        return (
          <div className={shellClass}>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Novo responsável
            </p>
            <p className="mt-2 text-lg font-semibold">
              {request.payload?.assignee ?? "-"}
            </p>
          </div>
        );
      case "comment":
        return (
          <div className={shellClass}>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Comentário sugerido
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
              {request.payload?.comment ?? "-"}
            </p>
          </div>
        );
      case "fields":
        return (
          <div className={shellClass}>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Campos a atualizar
            </p>
            <div className="mt-2 space-y-2 text-sm">
              {(request.payload?.fields ?? []).map((field, index) => (
                <div
                  key={`${field.key}-${index}`}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-3 py-2 text-sm",
                    isDark
                      ? "border-white/10 bg-black/20 text-white"
                      : "border-slate-200 bg-white text-slate-900"
                  )}
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    {field.key}
                  </span>
                  <span className="font-semibold">{field.value}</span>
                </div>
              ))}
              {(request.payload?.fields?.length ?? 0) === 0 && (
                <p className={cn("text-sm", mutedText)}>Nenhum campo fornecido.</p>
              )}
            </div>
          </div>
        );
      case "escalate": {
        const project =
          request.payload?.projectKey ?? request.filter_value ?? "-";
        const fields = request.payload?.fields ?? [];
        const csvName = request.payload?.csvFileName;
        const hasCsv = Boolean(request.payload?.csvData);
        return (
          <div className="space-y-3">
            <div className={shellClass}>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Projeto destino
              </p>
              <p className="mt-2 text-lg font-semibold">{project}</p>
            </div>
            <div className={shellClass}>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Campos adicionais
              </p>
              <div className="mt-2 space-y-2 text-sm">
                {fields.map((field, index) => (
                  <div
                    key={`${field.key}-${index}`}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2 text-sm",
                      isDark
                        ? "border-white/10 bg-black/20 text-white"
                        : "border-slate-200 bg-white text-slate-900"
                    )}
                  >
                    <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                      {field.key}
                    </span>
                    <span className="font-semibold">{field.value}</span>
                  </div>
                ))}
                {fields.length === 0 && (
                  <p className={cn("text-sm", mutedText)}>
                    Nenhum campo manual preenchido.
                  </p>
                )}
              </div>
            </div>
            {hasCsv && (
              <div className={shellClass}>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  CSV anexado
                </p>
                <div className="mt-2 flex flex-col gap-2 text-sm">
                  <p>{csvName ?? "Arquivo importado via template"}</p>
                  <a
                    href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                      request.payload?.csvData ?? ""
                    )}`}
                    download={csvName ?? "escalate.csv"}
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl px-3 py-1 text-xs font-semibold transition",
                      isDark
                        ? "border border-white/10 text-white hover:border-white/30"
                        : "border border-slate-300 text-slate-700 hover:border-slate-500"
                    )}
                  >
                    Baixar CSV
                  </a>
                </div>
              </div>
            )}
          </div>
        );
      }
      case "delete": {
        const summary = summarizeIds(request.filter_value, 8);
        return (
          <div className="space-y-3">
            <div className={shellClass}>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                IDs para exclusão
              </p>
              {summary.preview.length === 0 ? (
                <p className="mt-2 text-sm">Nenhum ID informado.</p>
              ) : (
                <div className="mt-2 space-y-1 text-sm">
                  {summary.preview.map((id, idx) => (
                    <p key={`${request.id}-del-${idx}`}>{id}</p>
                  ))}
                  {summary.remaining > 0 && (
                    <p className={cn("text-xs", mutedText)}>
                      + {summary.remaining} issue
                      {summary.remaining > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div
              className={cn(
                "rounded-2xl border px-4 py-3 text-xs",
                isDark
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              )}
            >
              <p className="font-semibold uppercase tracking-[0.3em]">
                Não há rollback
              </p>
              <p className="mt-1 text-sm">
                Confirme se todas as issues listadas podem ser removidas definitivamente antes de aprovar.
              </p>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  }

  function getHistoryDescription(request: ApprovalRequest) {
    switch (request.action_type) {
      case "status":
        return `Status alvo: ${request.requested_status ?? "-"}`;
      case "assignee":
        return `Novo responsável: ${request.payload?.assignee ?? "-"}`;
      case "comment":
        if (!request.payload?.comment) return "Comentário registrado.";
        return request.payload.comment.length > 60
          ? `${request.payload.comment.slice(0, 60).trim()}...`
          : request.payload.comment;
      case "fields":
        return `Campos atualizados: ${request.payload?.fields?.length ?? 0}`;
      case "escalate":
        return `Projeto destino: ${
          request.payload?.projectKey ?? request.filter_value ?? "-"
        }`;
      case "delete":
        return "Exclusão definitiva de issues";
      default:
        return "";
    }
  }

  return (
    <div className="space-y-8">
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

      <Card className={cn("rounded-4xl border bg-transparent", isDark ? "border-white/5" : "border-slate-200")}>
        <CardHeader className="gap-2">
          <CardTitle className="text-xl font-semibold">
            Cards pendentes para decidir
          </CardTitle>
          <CardDescription className={cn("text-sm", mutedText)}>
            Cada solicitação reúne contexto, destino e justificativa esperada. Decida e registre o motivo para auditoria.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requests.length === 0 ? (
            <p className={cn("rounded-3xl border px-4 py-6 text-center text-sm", isDark ? "border-white/5 text-zinc-400" : "border-slate-200 text-slate-600")}>
              Nenhuma solicitação pendente. Tudo em dia!
            </p>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {requests.map((request) => {
                const summary =
                  request.filter_mode === "ids"
                    ? summarizeIds(request.filter_value, 4)
                    : null;
                const highlight = highlightedId === request.id;

                return (
                  <article
                    id={`request-${request.id}`}
                    key={request.id}
                    className={cn(
                      "group flex h-full flex-col gap-5 rounded-3xl border px-5 py-5 shadow-xl transition duration-200",
                      surface,
                      highlight && "ring-2 ring-purple-400/70"
                    )}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                            Solicitação #{request.id}
                          </p>
                          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-purple-400/30 px-3 py-1 text-xs uppercase tracking-[0.35em] text-purple-200">
                            {actionLabels[request.action_type]}
                          </div>
                          <p className={cn("mt-2 text-xs", mutedText)}>
                            {request.requester_name ?? "Desconhecido"} ·{" "}
                            {request.requester_email ?? "sem e-mail"}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                            Criada em
                          </span>
                          <p className="text-sm font-semibold">
                            {new Date(request.created_at).toLocaleString("pt-BR", {
                              timeZone: "America/Sao_Paulo",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className={cn("rounded-2xl border px-4 py-3 text-sm", secondarySurface)}>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                          Conjunto ({request.filter_mode.toUpperCase()})
                        </p>
                        {request.filter_mode === "ids" && summary ? (
                          <div className="mt-2 space-y-1 text-sm">
                            {summary.preview.map((id, index) => (
                              <p key={`${request.id}-preview-${index}`}>{id}</p>
                            ))}
                            {summary.remaining > 0 && (
                              <p className={cn("text-xs", mutedText)}>
                                {`+ ${summary.remaining} issue${summary.remaining > 1 ? "s" : ""}`}
                              </p>
                            )}
                          </div>
                        ) : (
                          <pre className="mt-2 whitespace-pre-wrap text-sm">
                            {request.filter_value}
                          </pre>
                        )}
                      </div>

                      {renderActionDetails(request)}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
                        Motivo da decisão
                      </label>
                      <Textarea
                        className="min-h-[90px]"
                        placeholder="Descreva brevemente a justificativa para o time de auditoria."
                        value={notesById[request.id] ?? ""}
                        onChange={(event) =>
                          setNotesById((prev) => ({
                            ...prev,
                            [request.id]: event.target.value,
                          }))
                        }
                      />
                      {noteErrors[request.id] && (
                        <p className="text-xs text-rose-400">{noteErrors[request.id]}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:justify-end">
                      <Button
                        variant="outline"
                        className={cn(
                          "rounded-2xl border-white/20 text-xs font-semibold",
                          processingId === request.id && "opacity-60"
                        )}
                        disabled={processingId === request.id}
                        onClick={() => handleDecision(request.id, "decline")}
                      >
                        Declinar
                      </Button>
                      <Button
                        className={cn(
                          "rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white shadow-lg",
                          processingId === request.id && "opacity-60"
                        )}
                        disabled={processingId === request.id}
                        onClick={() => handleDecision(request.id, "approve")}
                      >
                        Aprovar e executar
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={cn("rounded-4xl border bg-transparent", isDark ? "border-white/5" : "border-slate-200")}>
        <CardHeader className="gap-2">
          <CardTitle className="text-xl font-semibold">
            Histórico recente
          </CardTitle>
          <CardDescription className={cn("text-sm", mutedText)}>
            Tudo que já foi aprovado ou declinado fica registrado com justificativa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {completed.length === 0 ? (
            <p className={cn("rounded-3xl border px-4 py-6 text-center text-sm", isDark ? "border-white/5 text-zinc-400" : "border-slate-200 text-slate-600")}>
              Nenhuma ação concluída recentemente.
            </p>
          ) : (
            completed.map((request) => (
              <article
                key={request.id}
                className={cn(
                  "rounded-3xl border px-5 py-4",
                  isDark ? "border-white/5 bg-white/5 text-white" : "border-slate-200 bg-white text-slate-900"
                )}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      #{request.id} · {request.requester_name ?? "Desconhecido"}
                    </p>
                    <p className={cn("text-xs", mutedText)}>
                      {new Date(request.created_at).toLocaleString("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                      })}{" "}
                      · {getHistoryDescription(request)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]",
                      request.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-rose-500/10 text-rose-300"
                    )}
                  >
                    {request.status === "approved" ? "Aprovado" : "Declinado"}
                  </span>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className={cn("rounded-2xl border px-4 py-3 text-sm", secondarySurface)}>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                      Conjunto ({request.filter_mode.toUpperCase()})
                    </p>
                    {request.filter_mode === "ids" ? (
                      (() => {
                        const summary = summarizeIds(request.filter_value, 5);
                        return (
                          <div className="mt-2 space-y-1 text-sm">
                            {summary.preview.map((id, index) => (
                              <p key={`${request.id}-history-${index}`}>{id}</p>
                            ))}
                            {summary.remaining > 0 && (
                              <p className={cn("text-xs", mutedText)}>
                                {`+ ${summary.remaining} issue${
                                  summary.remaining > 1 ? "s" : ""
                                }`}
                              </p>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      <pre className="mt-2 whitespace-pre-wrap text-sm">
                        {request.filter_value}
                      </pre>
                    )}
                  </div>
                  {request.audit_notes && (
                    <div className={cn("rounded-2xl border px-4 py-3 text-sm", secondarySurface)}>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                        Motivo registrado
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm">
                        {request.audit_notes}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
