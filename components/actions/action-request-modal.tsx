"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

type RequestRecord = {
  id: number;
  action_type: string;
  filter_mode: string;
  filter_value: string;
  requested_status: string | null;
  requester_name: string | null;
  requester_email: string | null;
  status: string;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
  audit_notes: string | null;
  payload: Record<string, unknown> | null;
};

type RequestEvent = {
  id: number;
  request_id: number;
  type: string;
  message: string | null;
  actor_name: string | null;
  created_at: string;
};

type RequestMessage = {
  id: number;
  request_id: number;
  sender_name: string | null;
  sender_role: string | null;
  message: string;
  created_at: string;
};

const eventLabels: Record<string, string> = {
  created: "Criado",
  approved: "Aprovado",
  returned: "Devolvido",
  declined: "Reprovado",
  queued: "Em fila",
  running: "Executando",
  completed: "Execução concluída",
  failed: "Erro",
  cancelled: "Cancelado",
  resubmitted: "Reenviado",
};

const actionLabels: Record<string, string> = {
  status: "Alterar status",
  assignee: "Mudar responsável",
  comment: "Adicionar comentário",
  fields: "Atualizar campos",
  escalate: "Subir issue",
  delete: "Deletar issue",
};

export function ActionRequestModal({
  requestId,
  onClose,
}: {
  requestId: number | null;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<RequestRecord | null>(null);
  const [events, setEvents] = useState<RequestEvent[]>([]);
  const [messages, setMessages] = useState<RequestMessage[]>([]);
  const [canChat, setCanChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [idsVisibleCount, setIdsVisibleCount] = useState(6);

  const headerClass = isDark ? "text-zinc-100" : "text-slate-900";
  const subtleText = isDark ? "text-zinc-500" : "text-slate-500";
  const panelClass = isDark
    ? "border-zinc-800 bg-[#050816]"
    : "border-slate-200 bg-white";

  function formatDateTime(value: string | null) {
    if (!value) return "-";
    const hasTimeZone = /Z|[+-]\d{2}:?\d{2}$/.test(value);
    if (hasTimeZone) {
      return new Date(value).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      });
    }
    const normalized = value.includes("T") ? value : value.replace(" ", "T");
    return new Date(normalized).toLocaleString("pt-BR");
  }

  function parseIds(value: string) {
    const ids = value
      .split(/[\r\n,]+/)
      .map((id) => id.trim())
      .filter(Boolean);
    return ids;
  }

  function getActionDescription(record: RequestRecord, idsTotal: number) {
    const actionLabel = actionLabels[record.action_type] ?? record.action_type;
    const plural = idsTotal !== 1;
    const issuesLabel = idsTotal ? `${idsTotal} issue${plural ? "s" : ""}` : "as issues";
    if (record.action_type === "status") {
      return record.requested_status
        ? `${actionLabel} ${issuesLabel} para o status ${record.requested_status}.`
        : `${actionLabel} ${issuesLabel}.`;
    }
    if (record.action_type === "assignee") {
      return `${actionLabel} ${issuesLabel} com os responsáveis informados.`;
    }
    if (record.action_type === "comment") {
      return `${actionLabel} ${issuesLabel} com o comentário informado.`;
    }
    if (record.action_type === "fields") {
      return `${actionLabel} ${issuesLabel} com os campos personalizados informados.`;
    }
    if (record.action_type === "escalate") {
      const project = typeof record.payload?.projectKey === "string"
        ? record.payload.projectKey
        : record.filter_value;
      return project
        ? `${actionLabel} ${issuesLabel} para o projeto ${project}.`
        : `${actionLabel} ${issuesLabel}.`;
    }
    return `${actionLabel} ${issuesLabel}.`;
  }

  useEffect(() => {
    if (!requestId) return;
    setIsLoading(true);
    setError(null);
    setRecord(null);
    setEvents([]);
    setMessages([]);
    setCanChat(false);
    setIdsVisibleCount(6);
    void (async () => {
      try {
        const response = await fetch(`/api/actions/requests/${requestId}`);
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível carregar o chamado.");
        }
        setRecord(data?.request ?? null);
        setEvents(Array.isArray(data?.events) ? data.events : []);
        setMessages(Array.isArray(data?.messages) ? data.messages : []);
        setCanChat(Boolean(data?.canChat));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao carregar.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [requestId]);

  const historyItems = useMemo(() => {
    return events.map((event) => ({
      ...event,
      label: eventLabels[event.type] ?? event.type,
    }));
  }, [events]);

  async function handleSendMessage() {
    if (!requestId) return;
    const message = chatMessage.trim();
    if (!message) {
      setSendError("Digite uma mensagem antes de enviar.");
      return;
    }
    setIsSending(true);
    setSendError(null);
    try {
      const response = await fetch(`/api/actions/requests/${requestId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível enviar.");
      }
      setMessages((prev) => [...prev, data.message]);
      setChatMessage("");
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Não foi possível enviar.");
    } finally {
      setIsSending(false);
    }
  }

  if (!requestId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className={cn("w-full max-w-4xl rounded-3xl border p-6", panelClass)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
              Chamado #{requestId}
            </p>
            <h3 className={cn("text-xl font-semibold", headerClass)}>
              Detalhes do chamado
            </h3>
            <p className={cn("text-xs", subtleText)}>
              Informações, histórico e mensagens da solicitação.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>

        {isLoading ? (
          <p className={cn("mt-4 text-sm", subtleText)}>
            Carregando chamado...
          </p>
        ) : error ? (
          <div
            className={cn(
              "mt-4 rounded-2xl border px-4 py-3 text-sm",
              isDark
                ? "border-rose-500/50 bg-rose-500/10 text-rose-100"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            {error}
          </div>
        ) : record ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Card
              className={cn(
                "rounded-2xl border p-4",
                isDark ? "border-white/5 bg-white/5" : "border-slate-200 bg-slate-50"
              )}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Solicitante
              </p>
              <p className={cn("mt-2 text-sm font-semibold", headerClass)}>
                {record.requester_name ?? "-"}
              </p>
              <p className={cn("text-xs", subtleText)}>
                {record.requester_email ?? "-"}
              </p>
              <p className={cn("mt-2 text-xs", subtleText)}>
                Abertura: {formatDateTime(record.created_at)}
              </p>
            </Card>

            <Card
              className={cn(
                "rounded-2xl border p-4",
                isDark ? "border-white/5 bg-white/5" : "border-slate-200 bg-slate-50"
              )}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Aprovação
              </p>
              <p className={cn("mt-2 text-sm font-semibold", headerClass)}>
                {record.approved_by ?? "Sem aprovador"}
              </p>
              <p className={cn("text-xs", subtleText)}>
                {record.approved_at ? formatDateTime(record.approved_at) : "Aguardando decisão"}
              </p>
            </Card>

            <Card
              className={cn(
                "rounded-2xl border p-3",
                isDark ? "border-white/5 bg-white/5" : "border-slate-200 bg-slate-50"
              )}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Status</p>
              <p className={cn("mt-2 text-sm font-semibold", headerClass)}>
                {record.status}
              </p>
            </Card>

            <Card
              className={cn(
                "rounded-2xl border p-4 lg:col-span-3",
                isDark ? "border-white/5 bg-white/5" : "border-slate-200 bg-slate-50"
              )}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Detalhes da solicitação
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <p className={cn("text-xs uppercase tracking-[0.3em]", subtleText)}>
                    Tipo de ação
                  </p>
                  <p className={cn("mt-1 text-sm font-semibold", headerClass)}>
                    {actionLabels[record.action_type] ?? record.action_type}
                  </p>
                </div>
                <div>
                  <p className={cn("text-xs uppercase tracking-[0.3em]", subtleText)}>
                    Conjunto ({record.filter_mode.toUpperCase()})
                  </p>
                  {record.filter_mode === "ids" ? (
                    (() => {
                      const ids = parseIds(record.filter_value);
                      const preview = ids.slice(0, idsVisibleCount);
                      const remaining = Math.max(ids.length - preview.length, 0);
                      return (
                        <div className="mt-1 text-sm">
                          <p>{preview.join(", ")}</p>
                          {remaining > 0 && (
                            <p className={cn("text-xs", subtleText)}>
                              +{remaining} issues
                            </p>
                          )}
                          {ids.length > preview.length && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              <button
                                type="button"
                                className={cn(
                                  "text-xs font-semibold",
                                  isDark ? "text-purple-300" : "text-purple-600"
                                )}
                                onClick={() =>
                                  setIdsVisibleCount((prev) => Math.min(prev + 6, ids.length))
                                }
                              >
                                Exibir mais
                              </button>
                              <button
                                type="button"
                                className={cn(
                                  "text-xs font-semibold",
                                  isDark ? "text-purple-300" : "text-purple-600"
                                )}
                                onClick={() => setIdsVisibleCount(ids.length)}
                              >
                                Exibir todos
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <pre className="mt-1 whitespace-pre-wrap text-sm">
                      {record.filter_value}
                    </pre>
                  )}
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <p className={cn("text-xs uppercase tracking-[0.3em]", subtleText)}>
                    Ação planejada
                  </p>
                  <p className={cn("mt-1 text-sm", headerClass)}>
                    {getActionDescription(
                      record,
                      record.filter_mode === "ids"
                        ? parseIds(record.filter_value).length
                        : 0
                    )}
                  </p>
                </div>
                {record.action_type === "status" && (
                  <div>
                    <p className={cn("text-xs uppercase tracking-[0.3em]", subtleText)}>
                      Status planejado
                    </p>
                    <p className={cn("mt-1 text-sm", headerClass)}>
                      {record.requested_status ?? "-"}
                    </p>
                  </div>
                )}
                {record.action_type === "comment" &&
                  typeof record.payload?.comment === "string" && (
                    <div>
                      <p className={cn("text-xs uppercase tracking-[0.3em]", subtleText)}>
                        Comentário
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm">
                        {record.payload.comment}
                      </p>
                    </div>
                  )}
                {record.action_type === "assignee" &&
                  Array.isArray(record.payload?.customFields) && (
                    <div>
                      <p className={cn("text-xs uppercase tracking-[0.3em]", subtleText)}>
                        Áreas responsáveis
                      </p>
                      <div className="mt-1 space-y-2 text-sm">
                        {(record.payload?.customFields ?? []).map(
                          (
                            field: { id?: string; label?: string; value?: string; mode?: string },
                            index: number
                          ) => (
                            <p key={`${field.id ?? "field"}-${index}`}>
                              {field.label ?? field.id}:{" "}
                              {field.mode === "clear" ? "<limpar>" : field.value ?? ""}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
              {record.action_type === "fields" &&
                Array.isArray(record.payload?.fields) && (
                  <div className="mt-3 space-y-2 text-sm">
                    {(record.payload?.fields ?? []).map(
                      (field: { key?: string; value?: string }, index: number) => (
                        <p key={`${field.key ?? "field"}-${index}`}>
                          {field.key}: {field.value ?? ""}
                        </p>
                      )
                    )}
                  </div>
                )}
            </Card>

            <Card
              className={cn(
                "rounded-2xl border p-4 lg:col-span-3",
                isDark ? "border-white/5 bg-white/5" : "border-slate-200 bg-slate-50"
              )}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Histórico do chamado
              </p>
              <div className="mt-3 space-y-2">
                {historyItems.length === 0 ? (
                  <p className={cn("text-xs", subtleText)}>
                    Nenhum histórico disponível.
                  </p>
                ) : (
                  historyItems.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "rounded-2xl border px-3 py-2 text-xs",
                        isDark
                          ? "border-white/10 text-zinc-300"
                          : "border-slate-200 text-slate-600"
                      )}
                    >
                      <p className={cn("font-semibold", headerClass)}>{event.label}</p>
                      <p className={cn("text-[11px]", subtleText)}>
                        {formatDateTime(event.created_at)}
                        {event.actor_name ? ` · ${event.actor_name}` : ""}
                      </p>
                      {event.message && (
                        <p className="mt-1 whitespace-pre-wrap text-[12px]">
                          {event.message}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card
              className={cn(
                "rounded-2xl border p-4 lg:col-span-3",
                isDark ? "border-white/5 bg-white/5" : "border-slate-200 bg-slate-50"
              )}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Chat</p>
              <div className="mt-3 space-y-3">
                {messages.length === 0 ? (
                  <p className={cn("text-xs", subtleText)}>
                    Nenhuma mensagem registrada.
                  </p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "rounded-2xl border px-3 py-2 text-xs",
                        isDark
                          ? "border-white/10 text-zinc-300"
                          : "border-slate-200 text-slate-600"
                      )}
                    >
                      <p className={cn("font-semibold", headerClass)}>
                        {message.sender_name ?? "Usuário"}
                        {message.sender_role ? ` · ${message.sender_role}` : ""}
                      </p>
                      <p className={cn("text-[11px]", subtleText)}>
                        {new Date(message.created_at).toLocaleString("pt-BR", {
                          timeZone: "America/Sao_Paulo",
                        })}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-[12px]">
                        {message.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {canChat ? (
                <div className="mt-4 space-y-2">
                  <Textarea
                    value={chatMessage}
                    onChange={(event) => setChatMessage(event.target.value)}
                    placeholder="Escreva uma mensagem para o aprovador/solicitante..."
                  />
                  {sendError && (
                    <p className="text-xs text-rose-400">{sendError}</p>
                  )}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      disabled={isSending}
                      onClick={handleSendMessage}
                      className="rounded-xl"
                    >
                      {isSending ? "Enviando..." : "Enviar"}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className={cn("mt-4 text-xs", subtleText)}>
                  Chat encerrado. O histórico permanece disponível.
                </p>
              )}
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
