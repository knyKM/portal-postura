"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionForm } from "@/components/actions/action-form";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Workflow,
  Repeat,
  UserCheck,
  MessageSquare,
  ClipboardList,
  UploadCloud,
  Trash2,
} from "lucide-react";

const actionOptions = [
  {
    id: "status",
    title: "Alterar status",
    description: "Atualize o status de várias issues ao mesmo tempo.",
    icon: Repeat,
  },
  {
    id: "assignee",
    title: "Mudar responsável",
    description: "Reatribua para outro analista ou squad.",
    icon: UserCheck,
  },
  {
    id: "comment",
    title: "Adicionar comentário",
    description: "Envie uma mensagem padrão para todas as issues selecionadas.",
    icon: MessageSquare,
  },
  {
    id: "fields",
    title: "Atualizar campos",
    description: "Modifique campos personalizados como prioridades ou versões.",
    icon: ClipboardList,
  },
  {
    id: "escalate",
    title: "Subir issue",
    description: "Encaminhe issues críticas para triagem imediata.",
    icon: UploadCloud,
  },
  {
    id: "delete",
    title: "Deletar issue",
    description: "Exclua registros específicos de forma definitiva.",
    icon: Trash2,
  },
];

const projectOptions = [
  { value: "ASSETN", label: "ASSETN - Ativos" },
  { value: "CPE", label: "CPE - Catálogo de CPEs" },
  { value: "OPENCVE", label: "OPENCVE - CVEs Emergenciais" },
];

const statusOptions = ["Done", "Cancelado"];
const assigneeProjectKey = "ASSETN";
const assigneeJqlPrefix = `project = ${assigneeProjectKey} AND `;

const actionLabelMap = actionOptions.reduce<Record<string, string>>(
  (acc, action) => {
    acc[action.id] = action.title;
    return acc;
  },
  {}
);

type UserActionRequest = {
  id: number;
  action_type: "status" | "assignee" | "comment" | "fields" | "escalate" | "delete";
  filter_mode: string;
  filter_value: string;
  requested_status: string | null;
  payload: {
    customFields?: Array<{ id: string; label?: string; value?: string; mode?: string }>;
    comment?: string;
    fields?: Array<{ key: string; value: string }>;
    projectKey?: string;
    csvData?: string;
    csvFileName?: string;
  } | null;
  status: "pending" | "approved" | "declined" | "returned";
  audit_notes?: string | null;
  created_at: string;
  approved_at: string | null;
};

export default function AcoesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedAction, setSelectedAction] = useState<string | null>("status");
  const [filterMode, setFilterMode] = useState<"jql" | "ids">("jql");
  const [filterValue, setFilterValue] = useState("");
  const [statusValue, setStatusValue] = useState(statusOptions[0]);
  const assigneeCustomFields = [
    { id: "customfield_11702", label: "Área Proprietária Ativo Diretor_LB" },
    { id: "customfield_11704", label: "Área Proprietária Ativo Ponto Focal_LB" },
    { id: "customfield_11703", label: "Área Proprietária Ativo Gerente Sr_LB" },
    { id: "customfield_11706", label: "Área Solucionadora Responsável Gerente Sr_LB" },
    { id: "customfield_11705", label: "Área Solucionadora Responsável Diretor_LB" },
    { id: "customfield_11707", label: "Área Solucionadora Responsável Ponto Focal_LB" },
    { id: "customfield_10663", label: "Área Solucionadora Responsável VP" },
    { id: "customfield_10647", label: "Área Negócio Responsável VP" },
    { id: "customfield_13200", label: "Owner de Desenvolvimento" },
    { id: "customfield_13202", label: "Owner de Operação" },
    { id: "customfield_13205", label: "Owner de Sustentação" },
    { id: "customfield_12301", label: "Owner de Negócio" },
  ];
  const [assigneeFields, setAssigneeFields] = useState(
    assigneeCustomFields.map((field) => ({ ...field, value: "" }))
  );
  const [comment, setComment] = useState("");
  const [fields, setFields] = useState<Array<{ key: string; value: string }>>([
    { key: "", value: "" },
  ]);
  const [idsFileName, setIdsFileName] = useState<string | null>(null);
  const [projectKey, setProjectKey] = useState(projectOptions[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [issuesCount, setIssuesCount] = useState<number | null>(null);
  const [isCheckingCount, setIsCheckingCount] = useState(false);
  const [myRequests, setMyRequests] = useState<UserActionRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [requestsRefreshKey, setRequestsRefreshKey] = useState(0);
  const [historyCollapsed, setHistoryCollapsed] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSelectedAction, setEditSelectedAction] = useState<string | null>(null);
  const [editFilterMode, setEditFilterMode] = useState<"jql" | "ids">("jql");
  const [editFilterValue, setEditFilterValue] = useState("");
  const [editStatusValue, setEditStatusValue] = useState(statusOptions[0]);
  const [editAssigneeFields, setEditAssigneeFields] = useState(
    assigneeCustomFields.map((field) => ({ ...field, value: "" }))
  );
  const [editComment, setEditComment] = useState("");
  const [editFields, setEditFields] = useState<Array<{ key: string; value: string }>>([
    { key: "", value: "" },
  ]);
  const [editProjectKey, setEditProjectKey] = useState(projectOptions[0].value);
  const [editIssuesCount, setEditIssuesCount] = useState<number | null>(null);
  const [editIsCheckingCount, setEditIsCheckingCount] = useState(false);
  const [editIdsFileName, setEditIdsFileName] = useState<string | null>(null);
  const cardClasses = cn(
    "rounded-3xl border",
    isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white"
  );

  useEffect(() => {
    let active = true;
    setIsLoadingRequests(true);
    setRequestsError(null);

    fetch("/api/actions/requests?scope=self&limit=25")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!active) {
          return;
        }
        if (!res.ok) {
          throw new Error(
            data?.error || "Não foi possível carregar suas solicitações."
          );
        }
        setMyRequests(data?.requests ?? []);
        setIsLoadingRequests(false);
      })
      .catch((err) => {
        if (!active) {
          return;
        }
        setRequestsError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar suas solicitações."
        );
        setIsLoadingRequests(false);
      });

    return () => {
      active = false;
    };
  }, [requestsRefreshKey]);

  function normalizeAssigneeJql(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      return assigneeJqlPrefix;
    }
    if (/^project\s*=\s*assetn\b/i.test(trimmed)) {
      if (/^project\s*=\s*assetn\s*and\s*$/i.test(trimmed)) {
        return assigneeJqlPrefix;
      }
      return trimmed;
    }
    return `${assigneeJqlPrefix}${trimmed}`;
  }

  function parseIssueIds(value: string) {
    return value
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function handleFilterModeChange(mode: "jql" | "ids") {
    if (selectedAction === "delete" && mode === "jql") {
      return;
    }
    setFilterMode(mode);
    if (selectedAction === "assignee" && mode === "jql") {
      setFilterValue(assigneeJqlPrefix);
    } else {
      setFilterValue("");
    }
    setIssuesCount(null);
    if (mode !== "ids") {
      setIdsFileName(null);
    }
  }

  async function submitAction({
    requestId,
    actionType,
    filterModeValue,
    filterValueValue,
    statusValueValue,
    assigneeFieldsValue,
    commentValue,
    fieldsValue,
    projectValue,
    idsFileNameValue,
  }: {
    requestId?: number | null;
    actionType: string | null;
    filterModeValue: "jql" | "ids";
    filterValueValue: string;
    statusValueValue: string;
    assigneeFieldsValue: Array<{ id: string; label: string; value: string }>;
    commentValue: string;
    fieldsValue: Array<{ key: string; value: string }>;
    projectValue: string;
    idsFileNameValue: string | null;
  }) {
    if (!actionType) {
      setError("Selecione uma ação antes de continuar.");
      return;
    }

    const isEscalate = actionType === "escalate";

    if (!isEscalate && !filterValueValue.trim()) {
      setError("Informe a JQL ou os IDs antes de enviar.");
      return;
    }

    if (actionType === "assignee") {
      if (filterModeValue === "jql") {
        const normalized = normalizeAssigneeJql(filterValueValue);
        if (!/^project\s*=\s*assetn\b/i.test(normalized)) {
          setError("A JQL deve iniciar com project = ASSETN.");
          return;
        }
        if (normalized !== filterValueValue && !requestId) {
          setFilterValue(normalized);
        }
      } else {
        const ids = parseIssueIds(filterValueValue);
        if (!ids.length) {
          setError("Informe os IDs antes de enviar.");
          return;
        }
        const invalid = ids.filter((id) => !/^ASSETN-/i.test(id));
        if (invalid.length) {
          setError("Apenas IDs iniciados com ASSETN- são permitidos.");
          return;
        }
      }
    }

    if (actionType === "comment" && !commentValue.trim()) {
      setError("Digite o comentário que será replicado.");
      return;
    }

    const normalizedAssigneeFields = assigneeFieldsValue
      .map((field) => ({
        id: field.id,
        label: field.label,
        value: field.value.trim(),
      }))
      .filter((field) => field.value);

    const assigneePayload =
      actionType === "assignee"
        ? normalizedAssigneeFields.map((field) => ({
            id: field.id,
            label: field.label,
            value: field.value === "<limpar>" ? "" : field.value,
            mode: field.value === "<limpar>" ? "clear" : "set",
          }))
        : [];

    const normalizedFields = fieldsValue.map((field) => ({
      key: field.key.trim(),
      value: field.value.trim(),
    }));

    if (actionType === "fields") {
      const hasEmptyFields = normalizedFields.some(
        (field) => !field.key || !field.value
      );
      if (hasEmptyFields) {
        setError("Preencha todos os campos e valores antes de continuar.");
        return;
      }
    }

    const cleanedFields =
      actionType === "fields" || isEscalate
        ? normalizedFields.filter((field) => field.key && field.value)
        : [];

    if (isEscalate) {
      const csvData = filterValueValue.trim();
      if (!projectValue) {
        setError("Selecione o projeto destino antes de continuar.");
        return;
      }
      if (!csvData && cleanedFields.length === 0) {
        setError("Envie o CSV de template ou preencha ao menos um campo manualmente.");
        return;
      }
    }

    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const payload = {
        actionType,
        filterMode: isEscalate ? "project" : filterModeValue,
        filterValue: isEscalate ? projectValue : filterValueValue.trim(),
        requestedStatus: actionType === "status" ? statusValueValue : undefined,
        assigneeFields: actionType === "assignee" ? assigneePayload : undefined,
        comment: actionType === "comment" ? commentValue.trim() : undefined,
        fields: actionType === "fields" || isEscalate ? cleanedFields : undefined,
        projectKey: isEscalate ? projectValue : undefined,
        csvData: isEscalate ? filterValueValue.trim() || undefined : undefined,
        csvFileName: isEscalate ? idsFileNameValue ?? undefined : undefined,
      };
      const response = await fetch(
        requestId ? `/api/actions/requests/${requestId}` : "/api/actions/requests",
        {
          method: requestId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Falha ao registrar a ação.");
      }
      setMessage(
        requestId
          ? "Solicitação reenviada para aprovação do administrador."
          : "Solicitação enviada para aprovação do administrador. Você será notificado após a revisão."
      );
      setFilterValue("");
      setIssuesCount(null);
      setAssigneeFields(assigneeCustomFields.map((field) => ({ ...field, value: "" })));
      setComment("");
      setFields([{ key: "", value: "" }]);
      setIdsFileName(null);
      setEditingRequestId(null);
      setIsEditModalOpen(false);
      triggerRequestsRefresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível enviar a ação."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    await submitAction({
      requestId: null,
      actionType: selectedAction,
      filterModeValue: filterMode,
      filterValueValue: filterValue,
      statusValueValue: statusValue,
      assigneeFieldsValue: assigneeFields,
      commentValue: comment,
      fieldsValue: fields,
      projectValue: projectKey,
      idsFileNameValue: idsFileName,
    });
  }

  async function handleEditSubmit() {
    if (!editingRequestId) return;
    setIsSubmitting(true);
    await submitAction({
      requestId: editingRequestId,
      actionType: editSelectedAction,
      filterModeValue: editFilterMode,
      filterValueValue: editFilterValue,
      statusValueValue: editStatusValue,
      assigneeFieldsValue: editAssigneeFields,
      commentValue: editComment,
      fieldsValue: editFields,
      projectValue: editProjectKey,
      idsFileNameValue: editIdsFileName,
    });
  }

  async function handleSimulateCount() {
    if (filterMode !== "jql") return;
    if (!filterValue.trim()) {
      setError("Escreva uma JQL antes de estimar a quantidade.");
      return;
    }
    setError(null);
    setMessage(null);
    setIsCheckingCount(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const fakeNumber = 42 + Math.floor(Math.random() * 80);
    setIssuesCount(fakeNumber);
    setIsCheckingCount(false);
  }

  function triggerRequestsRefresh() {
    setRequestsRefreshKey((prev) => prev + 1);
  }

  function handleImportIdsFromFile(content: string, fileName: string) {
    if (selectedAction === "escalate") {
      setFilterValue(content.trim());
      setIdsFileName(fileName);
      return;
    }
    setFilterMode("ids");
    setFilterValue(content.trim());
    setIdsFileName(fileName);
    setIssuesCount(null);
  }

  function handlePrefillFieldKey(fieldKey: string) {
    setFields((prev) => {
      const targetIndex = prev.findIndex((field) => !field.key.trim());
      if (targetIndex !== -1) {
        return prev.map((field, index) =>
          index === targetIndex ? { ...field, key: fieldKey } : field
        );
      }
      return [...prev, { key: fieldKey, value: "" }];
    });
  }

  useEffect(() => {
    if (selectedAction === "delete") {
      setFilterMode("ids");
    }
    if (selectedAction === "assignee" && filterMode === "jql") {
      setFilterValue((current) => normalizeAssigneeJql(current));
    }
  }, [selectedAction]);

  function getStatusInfo(status: UserActionRequest["status"]) {
    switch (status) {
      case "approved":
        return {
          label: "Aprovado",
          className: isDark
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
            : "border-emerald-200 bg-emerald-50 text-emerald-700",
        };
      case "queued":
        return {
          label: "Em fila",
          className: isDark
            ? "border-sky-500/50 bg-sky-500/10 text-sky-200"
            : "border-sky-200 bg-sky-50 text-sky-700",
        };
      case "running":
        return {
          label: "Executando",
          className: isDark
            ? "border-amber-500/50 bg-amber-500/10 text-amber-200"
            : "border-amber-200 bg-amber-50 text-amber-700",
        };
      case "completed":
        return {
          label: "Execução concluída",
          className: isDark
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
            : "border-emerald-200 bg-emerald-50 text-emerald-700",
        };
      case "failed":
        return {
          label: "Erro",
          className: isDark
            ? "border-rose-500/50 bg-rose-500/10 text-rose-300"
            : "border-rose-200 bg-rose-50 text-rose-700",
        };
      case "declined":
        return {
          label: "Declinado",
          className: isDark
            ? "border-rose-500/50 bg-rose-500/10 text-rose-300"
            : "border-rose-200 bg-rose-50 text-rose-700",
        };
      case "returned":
        return {
          label: "Devolvido",
          className: isDark
            ? "border-amber-500/50 bg-amber-500/10 text-amber-200"
            : "border-amber-200 bg-amber-50 text-amber-700",
        };
      default:
        return {
          label: "Pendente",
          className: isDark
            ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
            : "border-amber-200 bg-amber-50 text-amber-700",
        };
    }
  }

  function getActionSummary(request: UserActionRequest) {
    switch (request.action_type) {
      case "status":
        return `Alterar status para ${request.requested_status ?? "-"}.`;
      case "assignee":
        return request.payload?.customFields?.length
          ? `Mudar responsável (${request.payload.customFields.length} campo${
              request.payload.customFields.length > 1 ? "s" : ""
            }).`
          : "Mudar responsável.";
      case "comment": {
        const commentText = request.payload?.comment ?? "";
        if (!commentText) {
          return "Adicionar comentário padronizado.";
        }
        const preview =
          commentText.length > 80
            ? `${commentText.slice(0, 80).trim()}...`
            : commentText;
        return `Adicionar comentário: "${preview}"`;
      }
      case "fields": {
        const total = request.payload?.fields?.length ?? 0;
        return total
          ? `Atualizar ${total} campo${total > 1 ? "s" : ""} personalizado${
              total > 1 ? "s" : ""
            }.`
          : "Atualizar campos personalizados.";
      }
      case "escalate": {
        const project =
          request.payload?.projectKey ?? request.filter_value ?? "-";
        const total = request.payload?.fields?.length ?? 0;
        const csvInfo = request.payload?.csvFileName
          ? ` com CSV (${request.payload.csvFileName})`
          : request.payload?.csvData
          ? " com CSV anexado"
          : "";
        return total
          ? `Subir issue para ${project} atualizando ${total} campo${
              total > 1 ? "s" : ""
            }${csvInfo}.`
          : `Subir issue para ${project}${csvInfo}.`;
      }
      case "delete": {
        const total = request.payload?.fields?.length ?? 0;
        const warning =
          total > 0
            ? `Remover issues e apagar ${total} campo${total > 1 ? "s" : ""} antes da exclusão.`
            : "Exclusão permanente das issues informadas.";
        return warning;
      }
      default:
        return actionLabelMap[request.action_type] ?? request.action_type;
    }
  }

  return (
    <DashboardShell
      pageTitle="Ações em Massa"
      pageSubtitle="Automação de incidentes e integrações Jira"
    >
      <div className="flex w-full flex-col gap-6 px-4 lg:px-10">
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div
              className={cn(
                "w-full max-w-5xl rounded-3xl border p-6",
                isDark ? "border-zinc-800 bg-[#050816]" : "border-slate-200 bg-white"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                    Editar solicitação
                  </p>
                  <h3 className="text-xl font-semibold">
                    Ajuste os parâmetros antes de reenviar
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingRequestId(null);
                  }}
                >
                  Fechar
                </Button>
              </div>
              <div className="mt-4">
                <ActionForm
                  selectedAction={editSelectedAction}
                  filterMode={editFilterMode}
                  filterValue={editFilterValue}
                  projectValue={editProjectKey}
                  statusValue={editStatusValue}
                  assigneeFields={editAssigneeFields}
                  comment={editComment}
                  fields={editFields}
                  issuesCount={editIssuesCount}
                  isCheckingCount={editIsCheckingCount}
                  isSubmitting={isSubmitting}
                  error={error}
                  message={message}
                  onFilterModeChange={(mode) => {
                    setEditFilterMode(mode);
                    setEditFilterValue("");
                    setEditIssuesCount(null);
                    if (mode !== "ids") {
                      setEditIdsFileName(null);
                    }
                  }}
                  onFilterValueChange={(value) => {
                    setEditFilterValue(value);
                    setEditIssuesCount(null);
                  }}
                  onProjectChange={(value) => setEditProjectKey(value)}
                  onStatusChange={(value) => setEditStatusValue(value)}
                  onAssigneeFieldChange={(id, value) =>
                    setEditAssigneeFields((prev) =>
                      prev.map((field) =>
                        field.id === id ? { ...field, value } : field
                      )
                    )
                  }
                  onCommentChange={(value) => setEditComment(value)}
                  onFieldKeyChange={(index, value) =>
                    setEditFields((prev) =>
                      prev.map((field, fieldIndex) =>
                        fieldIndex === index ? { ...field, key: value } : field
                      )
                    )
                  }
                  onFieldValueChange={(index, value) =>
                    setEditFields((prev) =>
                      prev.map((field, fieldIndex) =>
                        fieldIndex === index ? { ...field, value } : field
                      )
                    )
                  }
                  onAddField={() =>
                    setEditFields((prev) => [...prev, { key: "", value: "" }])
                  }
                  onRemoveField={(index) =>
                    setEditFields((prev) =>
                      prev.length === 1
                        ? prev
                        : prev.filter((_, fieldIndex) => fieldIndex !== index)
                    )
                  }
                  onPrefillFieldKey={(fieldKey) =>
                    setEditFields((prev) => {
                      const targetIndex = prev.findIndex((field) => !field.key.trim());
                      if (targetIndex !== -1) {
                        return prev.map((field, index) =>
                          index === targetIndex ? { ...field, key: fieldKey } : field
                        );
                      }
                      return [...prev, { key: fieldKey, value: "" }];
                    })
                  }
                  onSimulateCount={async () => {
                    if (editFilterMode !== "jql" || !editFilterValue.trim()) {
                      return;
                    }
                    setEditIsCheckingCount(true);
                    await new Promise((resolve) => setTimeout(resolve, 700));
                    const fakeNumber = 42 + Math.floor(Math.random() * 80);
                    setEditIssuesCount(fakeNumber);
                    setEditIsCheckingCount(false);
                  }}
                  onSubmit={handleEditSubmit}
                  onImportIdsFromFile={(content, fileName) => {
                    setEditFilterMode("ids");
                    setEditFilterValue(content.trim());
                    setEditIdsFileName(fileName);
                    setEditIssuesCount(null);
                  }}
                  uploadedFileName={editIdsFileName}
                  projectOptions={projectOptions}
                  csvTemplateUrl="/templates/escalate-template.csv"
                  idsTemplateUrl="/templates/action-ids-template.csv"
                />
              </div>
            </div>
          </div>
        )}
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border px-6 py-6",
            isDark
              ? "border-white/5 bg-gradient-to-br from-[#090f1f] to-[#05060f] text-zinc-100"
              : "border-slate-200 bg-white text-slate-800"
          )}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl">
                <Workflow className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-300">
                  Automação Jira
                </p>
                <h2 className="text-2xl font-semibold">Gerencie ações em lote</h2>
                <p className="text-sm text-zinc-400">
                  Centralize solicitações complexas em uma única fila com auditoria.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-purple-400">
            Selecione uma ação
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {actionOptions.map((action) => {
              const Icon = action.icon;
              const active = selectedAction === action.id;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setSelectedAction(action.id)}
                  className={cn(
                    "flex w-full flex-col gap-3 rounded-[22px] border px-4 py-4 text-left transition-all",
                    active
                      ? "border-purple-500 bg-gradient-to-br from-purple-600/40 to-indigo-600/40 text-white shadow-lg shadow-purple-900/20"
                      : cn(
                          "hover:border-purple-400/60 hover:bg-purple-500/5",
                          isDark
                            ? "border-white/5 bg-transparent text-zinc-300"
                            : "border-slate-200 bg-white text-slate-600"
                        )
                  )}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-2xl border",
                        active
                          ? "border-white/20 bg-white/10 text-white"
                          : isDark
                          ? "border-white/10 text-zinc-400"
                          : "border-slate-200 text-slate-500"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <p
                      className={cn(
                        "text-xs font-semibold tracking-wide",
                        active
                          ? "text-white"
                          : isDark
                          ? "text-zinc-100"
                          : "text-slate-800"
                      )}
                    >
                      {action.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

          <ActionForm
          selectedAction={selectedAction}
          filterMode={filterMode}
          filterValue={filterValue}
          projectValue={projectKey}
          statusValue={statusValue}
          assigneeFields={assigneeFields}
          comment={comment}
          fields={fields}
          issuesCount={issuesCount}
          isCheckingCount={isCheckingCount}
          isSubmitting={isSubmitting}
          error={error}
          message={message}
          onFilterModeChange={handleFilterModeChange}
          onFilterValueChange={(value) => {
            if (selectedAction === "assignee" && filterMode === "jql") {
              setFilterValue(normalizeAssigneeJql(value));
            } else {
              setFilterValue(value);
            }
            setIssuesCount(null);
          }}
          onProjectChange={(value) => setProjectKey(value)}
          onStatusChange={(value) => setStatusValue(value)}
          onAssigneeFieldChange={(id, value) =>
            setAssigneeFields((prev) =>
              prev.map((field) =>
                field.id === id ? { ...field, value } : field
              )
            )
          }
          onCommentChange={(value) => setComment(value)}
          onFieldKeyChange={(index, value) =>
            setFields((prev) =>
              prev.map((field, fieldIndex) =>
                fieldIndex === index ? { ...field, key: value } : field
              )
            )
          }
          onFieldValueChange={(index, value) =>
            setFields((prev) =>
              prev.map((field, fieldIndex) =>
                fieldIndex === index ? { ...field, value } : field
              )
            )
          }
          onAddField={() =>
            setFields((prev) => [...prev, { key: "", value: "" }])
          }
          onRemoveField={(index) =>
            setFields((prev) =>
              prev.length === 1
                ? prev
                : prev.filter((_, fieldIndex) => fieldIndex !== index)
            )
          }
          onPrefillFieldKey={handlePrefillFieldKey}
          onSimulateCount={handleSimulateCount}
          onSubmit={handleSubmit}
          onImportIdsFromFile={handleImportIdsFromFile}
          uploadedFileName={idsFileName}
          projectOptions={projectOptions}
          csvTemplateUrl="/templates/escalate-template.csv"
          idsTemplateUrl="/templates/action-ids-template.csv"
        />

        <Card className={cardClasses}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">Minhas solicitações recentes</CardTitle>
              <CardDescription
                className={cn("text-sm", isDark ? "text-zinc-500" : "text-slate-500")}
              >
                Acompanhe o status e os motivos registrados pelo administrador.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-xl text-xs text-zinc-400 hover:text-zinc-100"
                onClick={() => setHistoryCollapsed((prev) => !prev)}
              >
                {historyCollapsed ? "Expandir" : "Recolher"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-xl text-xs",
                  isDark
                    ? "border border-zinc-700 text-zinc-200"
                    : "border border-slate-300 text-slate-700"
                )}
                onClick={triggerRequestsRefresh}
                disabled={isLoadingRequests}
              >
                {isLoadingRequests ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </CardHeader>
          {!historyCollapsed && (
            <CardContent
              className={cn(
                "space-y-4 text-sm",
                isDark ? "text-zinc-300" : "text-slate-600"
              )}
            >
              {requestsError && (
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-xs",
                    isDark
                      ? "border-rose-500/50 bg-rose-500/10 text-rose-100"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  )}
                >
                  {requestsError}
                </div>
              )}
              {isLoadingRequests ? (
                <p
                  className={cn("text-xs", isDark ? "text-zinc-500" : "text-slate-500")}
                >
                  Carregando suas solicitações...
                </p>
              ) : myRequests.length === 0 ? (
                <p
                  className={cn("text-xs", isDark ? "text-zinc-500" : "text-slate-500")}
                >
                  Você ainda não enviou solicitações de ação. Use o formulário acima para registrar a primeira.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {myRequests.map((request) => {
                    const statusInfo = getStatusInfo(request.status);
                    return (
                      <div
                        key={request.id}
                        className={cn(
                          "rounded-2xl border px-3 py-3 text-sm",
                          isDark
                            ? "border-zinc-700 text-zinc-300"
                            : "border-slate-200 bg-white text-slate-600"
                        )}
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p
                              className={cn(
                                "text-base font-semibold",
                                isDark ? "text-white" : "text-slate-800"
                              )}
                            >
                              {actionLabelMap[request.action_type] ?? request.action_type}
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isDark ? "text-zinc-500" : "text-slate-500"
                              )}
                            >
                              #{request.id} ·{" "}
                              {new Date(request.created_at).toLocaleString("pt-BR", {
                                timeZone: "America/Sao_Paulo",
                              })}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]",
                              statusInfo.className
                            )}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {request.status === "returned" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-xl text-xs"
                              onClick={() => {
                                setEditingRequestId(request.id);
                                setEditSelectedAction(request.action_type);
                                setEditFilterMode(
                                  request.filter_mode === "ids" ? "ids" : "jql"
                                );
                                setEditFilterValue(request.filter_value ?? "");
                                setEditStatusValue(
                                  request.requested_status ?? statusOptions[0]
                                );
                                setEditAssigneeFields(
                                  assigneeCustomFields.map((field) => {
                                    const match = request.payload?.customFields?.find(
                                      (item) => item.id === field.id
                                    );
                                    const value =
                                      match?.mode === "clear"
                                        ? "<limpar>"
                                        : (match?.value ?? "");
                                    return { ...field, value };
                                  })
                                );
                                setEditComment(request.payload?.comment ?? "");
                                setEditFields(
                                  request.payload?.fields?.length
                                    ? request.payload.fields
                                    : [{ key: "", value: "" }]
                                );
                                setEditProjectKey(request.payload?.projectKey ?? projectKey);
                                setEditIssuesCount(null);
                                setEditIdsFileName(null);
                                setIsEditModalOpen(true);
                              }}
                            >
                              Editar e reenviar
                            </Button>
                          )}
                        </div>
                        <div
                          className={cn(
                            "mt-2 rounded-2xl border border-dashed px-3 py-2 text-xs",
                            isDark
                              ? "border-zinc-700/70 text-zinc-400"
                              : "border-slate-200 text-slate-500"
                          )}
                        >
                          <p
                            className={cn(
                              "font-semibold",
                              isDark ? "text-zinc-200" : "text-slate-700"
                            )}
                          >
                            {getActionSummary(request)}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.3em]">
                            Conjunto ({request.filter_mode.toUpperCase()})
                          </p>
                          <pre className="mt-1 whitespace-pre-wrap text-[11px]">
                            {request.filter_value}
                          </pre>
                        </div>
                        {request.status === "pending" ? (
                          <p
                            className={cn(
                              "mt-2 text-xs",
                              isDark ? "text-zinc-500" : "text-slate-500"
                            )}
                          >
                            Aguardando aprovação de um administrador.
                          </p>
                        ) : (
                          <div
                            className={cn(
                              "mt-2 rounded-2xl border px-3 py-2 text-xs",
                              request.status === "approved"
                                ? isDark
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : isDark
                                ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                                : "border-rose-200 bg-rose-50 text-rose-700"
                            )}
                          >
                            <p className="font-semibold">Motivo registrado</p>
                            <p className="mt-1 whitespace-pre-wrap text-[12px] leading-relaxed">
                              {request.audit_notes ?? "Sem observações registradas."}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
