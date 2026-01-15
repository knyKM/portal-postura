import { useMemo, useRef, useState, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import jiraFieldsJson from "@/data/jira-fields.json";

type JiraField = {
  id: string;
  name: string;
  custom: boolean;
  clauseNames?: string[];
  schema?: {
    type?: string;
    custom?: string;
    customId?: number;
    system?: string;
    items?: string;
  };
};

const initialFieldCatalog = jiraFieldsJson as JiraField[];

type ActionFormProps = {
  selectedAction: string | null;
  filterMode: "jql" | "ids" | "bulk";
  filterValue: string;
  projectValue: string;
  statusValue: string;
  assigneeFields: Array<{ id: string; label: string; value: string }>;
  comment: string;
  fields: Array<{ key: string; value: string }>;
  issuesCount: number | null;
  isCheckingCount: boolean;
  isSubmitting: boolean;
  error: string | null;
  message: string | null;
  onFilterModeChange: (mode: "jql" | "ids" | "bulk") => void;
  onFilterValueChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAssigneeFieldChange: (id: string, value: string) => void;
  onCommentChange: (value: string) => void;
  onFieldKeyChange: (index: number, value: string) => void;
  onFieldValueChange: (index: number, value: string) => void;
  onAddField: () => void;
  onRemoveField: (index: number) => void;
  onPrefillFieldKey: (value: string) => void;
  onSimulateCount: () => void;
  onSubmit: () => void;
  onImportIdsFromFile: (content: string, fileName: string) => void;
  onImportAssigneeCsv: (content: string, fileName: string) => void;
  assigneeCsvFileName: string | null;
  uploadedFileName: string | null;
  projectOptions: Array<{ value: string; label: string }>;
  csvTemplateUrl: string;
  idsTemplateUrl: string;
  assigneeCsvTemplateUrl: string;
};

type FieldBlockProps = {
  label: string;
  children: ReactNode;
  labelClassName: string;
};

function FieldBlock({ label, children, labelClassName }: FieldBlockProps) {
  return (
    <div className="space-y-2">
      <label className={cn("text-xs font-semibold", labelClassName)}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function ActionForm(props: ActionFormProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    selectedAction,
    filterMode,
    filterValue,
    projectValue,
    statusValue,
    assigneeFields,
    comment,
    fields,
    issuesCount,
    isCheckingCount,
    isSubmitting,
    error,
    message,
    onFilterModeChange,
    onFilterValueChange,
    onProjectChange,
    onStatusChange,
    onAssigneeFieldChange,
    onCommentChange,
    onFieldKeyChange,
    onFieldValueChange,
    onAddField,
    onRemoveField,
    onPrefillFieldKey,
    onSimulateCount,
    onSubmit,
    onImportIdsFromFile,
    onImportAssigneeCsv,
    assigneeCsvFileName,
    uploadedFileName,
    projectOptions,
    csvTemplateUrl,
    idsTemplateUrl,
    assigneeCsvTemplateUrl,
  } = props;

  const isEscalate = selectedAction === "escalate";
  const isDelete = selectedAction === "delete";
  const hasManualEscalateFields = useMemo(
    () => fields.some((field) => field.key.trim() && field.value.trim()),
    [fields]
  );
  const disableSubmit =
    isSubmitting ||
    (selectedAction === null
      ? true
      : isEscalate
      ? !filterValue.trim() && !hasManualEscalateFields
      : !filterValue.trim());
  const [fieldCatalog, setFieldCatalog] = useState<JiraField[]>(initialFieldCatalog);
  const [fieldSearch, setFieldSearch] = useState("");
  const [fieldTypeFilter, setFieldTypeFilter] = useState("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const idsFileInputRef = useRef<HTMLInputElement | null>(null);
  const bulkFileInputRef = useRef<HTMLInputElement | null>(null);
  const catalogFileInputRef = useRef<HTMLInputElement | null>(null);
  const fieldSuggestionsId = "jira-field-suggestions";
  const shouldShowFieldSuggestions = selectedAction === "fields" || isEscalate;
  const assigneeBulkLabels = useMemo(
    () => assigneeFields.map((field) => field.label).filter(Boolean),
    [assigneeFields]
  );
  const typeFilterOptions = [
    { id: "all", label: "Todos" },
    { id: "string", label: "Texto" },
    { id: "option", label: "Seleção" },
    { id: "array", label: "Lista" },
    { id: "date", label: "Data" },
    { id: "datetime", label: "Data/Hora" },
    { id: "number", label: "Número" },
    { id: "user", label: "Usuário" },
    { id: "other", label: "Outros" },
  ] as const;

  function getFieldKind(field: JiraField) {
    const rawType =
      field.schema?.type ||
      field.schema?.system ||
      field.schema?.custom ||
      "other";
    const normalized = rawType.toLowerCase();
    if (normalized.includes("datetime")) return "datetime";
    if (normalized.includes("date")) return "date";
    if (
      normalized.includes("option") ||
      normalized.includes("select") ||
      normalized.includes("radio")
    ) {
      return "option";
    }
    if (
      normalized.includes("array") ||
      normalized.includes("labels") ||
      normalized.includes("list")
    ) {
      return "array";
    }
    if (
      normalized.includes("number") ||
      normalized.includes("float") ||
      normalized.includes("progress")
    ) {
      return "number";
    }
    if (
      normalized.includes("user") ||
      normalized.includes("assignee") ||
      normalized.includes("reporter")
    ) {
      return "user";
    }
    if (normalized.includes("text") || normalized.includes("string")) {
      return "string";
    }
    return "other";
  }

  const filteredFields = useMemo(() => {
    const search = fieldSearch.trim().toLowerCase();
    return fieldCatalog.filter((field) => {
      const matchesSearch =
        !search ||
        [field.name, field.id, ...(field.clauseNames ?? [])].some((value) =>
          value.toLowerCase().includes(search)
        );
      const matchesType =
        fieldTypeFilter === "all" || getFieldKind(field) === fieldTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [fieldCatalog, fieldSearch, fieldTypeFilter]);

  const totalFields = fieldCatalog.length;
  const csvStats = useMemo(() => {
    if (!isEscalate) {
      return { rowCount: 0, columns: [] as string[] };
    }
    const trimmed = filterValue.trim();
    if (!trimmed) {
      return { rowCount: 0, columns: [] as string[] };
    }
    const sanitized = trimmed.replace(/\r/g, "");
    const lines = sanitized
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) {
      return { rowCount: 0, columns: [] as string[] };
    }
    const header = lines[0]
      .split(",")
      .map((cell) => cell.trim())
      .filter(Boolean);
    const rowCount = Math.max(lines.length - 1, 0);
    return { rowCount, columns: header.slice(0, 6) };
  }, [filterValue, isEscalate]);

  const labelColor = isDark ? "text-zinc-400" : "text-slate-600";
  const subtleText = isDark ? "text-zinc-500" : "text-slate-500";
  const cardClasses = cn(
    "rounded-3xl border shadow-lg",
    isDark
      ? "border-white/5 bg-gradient-to-b from-[#080d1f] to-[#050713] text-zinc-100"
      : "border-slate-200 bg-white text-slate-800"
  );
  const inputClasses = cn(
    "rounded-2xl border px-3 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-purple-500/40",
    isDark
      ? "border-zinc-700 bg-[#050818] text-zinc-100 placeholder:text-zinc-500"
      : "border-slate-300 bg-white text-slate-700 placeholder:text-slate-400"
  );
  const textareaClasses = cn(
    "min-h-[120px] rounded-2xl border px-3 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-purple-500/40",
    isDark
      ? "border-zinc-700 bg-[#050818] text-zinc-100 placeholder:text-zinc-500"
      : "border-slate-300 bg-white text-slate-700 placeholder:text-slate-400"
  );

  function handleDataFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      onImportIdsFromFile(text, file.name);
      if (idsFileInputRef.current) {
        idsFileInputRef.current.value = "";
      }
    };
    reader.readAsText(file, "utf-8");
  }

  function handleBulkFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      onImportAssigneeCsv(text, file.name);
      if (bulkFileInputRef.current) {
        bulkFileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  }

  function handleCatalogImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = typeof reader.result === "string" ? reader.result : "";
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error("O arquivo deve conter um array de campos.");
        }
        const sanitized = parsed
          .filter((item) => item && typeof item.id === "string" && typeof item.name === "string")
          .map((item) => ({
            id: item.id,
            name: item.name,
            custom: Boolean(item.custom),
            clauseNames: Array.isArray(item.clauseNames) ? item.clauseNames : [],
            schema: item.schema ?? {},
          })) as JiraField[];
        if (!sanitized.length) {
          throw new Error("Nenhum campo válido foi encontrado no JSON.");
        }
        setFieldCatalog(sanitized);
        setFieldSearch("");
        setFieldTypeFilter("all");
        setCatalogError(null);
      } catch (err) {
        setCatalogError(
          err instanceof Error
            ? err.message
            : "Não foi possível interpretar o JSON de campos."
        );
      } finally {
        if (catalogFileInputRef.current) {
          catalogFileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  }

  function handleCopyFieldId(fieldId: string) {
    if (typeof navigator !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(fieldId).catch(() => null);
    }
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField((current) => (current === fieldId ? null : current)), 1500);
  }

  function renderDynamicFieldsBlock(hint?: string, listId?: string) {
    return (
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={`field-${index}`}
            className={cn(
              "rounded-2xl border p-4",
              isDark
                ? "border-zinc-800 bg-[#060818]/70"
                : "border-slate-200 bg-slate-50"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between text-xs font-semibold",
                labelColor
              )}
            >
              <span>Campo #{index + 1}</span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveField(index)}
                  className={cn(
                    "text-[11px] transition",
                    isDark
                      ? "text-rose-400 hover:text-rose-200"
                      : "text-rose-600 hover:text-rose-400"
                  )}
                >
                  Remover
                </button>
              )}
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <FieldBlock
                label="Campo a ser alterado"
                labelClassName={labelColor}
              >
                <Input
                  className={inputClasses}
                  placeholder="Ex: customfield_12345"
                  list={listId}
                  value={field.key}
                  onChange={(event) => onFieldKeyChange(index, event.target.value)}
                />
                {(() => {
                  const match = fieldCatalog.find((item) => item.id === field.key);
                  if (!match) return null;
                  return (
                    <p className={cn("mt-1 text-[11px]", subtleText)}>
                      {match.name}
                    </p>
                  );
                })()}
              </FieldBlock>
              <FieldBlock label="Valor" labelClassName={labelColor}>
                <Input
                  className={inputClasses}
                  placeholder="Novo valor"
                  value={field.value}
                  onChange={(event) => onFieldValueChange(index, event.target.value)}
                />
              </FieldBlock>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full rounded-2xl text-xs",
            isDark
              ? "border border-zinc-700 text-zinc-200"
              : "border border-slate-300 text-slate-700"
          )}
          onClick={onAddField}
        >
          Adicionar campo
        </Button>
        {hint && <p className={cn("text-[11px]", subtleText)}>{hint}</p>}
      </div>
    );
  }

  function renderActionFields() {
    switch (selectedAction) {
      case "status":
        return (
          <FieldBlock label="Novo status" labelClassName={labelColor}>
            <div
              className={cn(
                "rounded-2xl border",
                isDark
                  ? "border-zinc-700 bg-[#050816]"
                  : "border-slate-300 bg-white"
              )}
            >
              <select
                value={statusValue}
                onChange={(event) => onStatusChange(event.target.value)}
                className={cn(
                  "w-full rounded-2xl bg-transparent px-3 py-2 text-sm focus-visible:outline-none",
                  isDark ? "text-zinc-100" : "text-slate-700"
                )}
              >
                {[
                  "In Analysis",
                  "Request For Risk Acceptance",
                  "Risk Accepted",
                  "In Progress",
                  "Retest Fail",
                  "Ready For Retest",
                  "In Retest",
                  "Erro",
                  "Done",
                  "Containment measure fail",
                  "Containment measure OK",
                  "Containment measure ready for retest",
                  "Containment Measure In Retest",
                  "Cancelado",
                  "Reabrir",
                ].map((status) => (
                  <option
                    key={status}
                    value={status}
                    className={cn(
                      isDark ? "bg-[#050816] text-white" : "bg-white text-slate-700"
                    )}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <p className={cn("text-[11px]", subtleText)}>
              Fluxo atual disponibiliza: DONE e Cancelado. Outras transições serão adicionadas após integração com Jira.
            </p>
          </FieldBlock>
        );
      case "assignee":
        if (filterMode === "bulk") {
          return (
            <>
              <div
                className={cn(
                  "rounded-2xl border p-4 text-sm",
                  isDark
                    ? "border-white/10 bg-white/5"
                    : "border-slate-200 bg-slate-50"
                )}
              >
                <p className={cn("text-xs font-semibold uppercase tracking-[0.3em]", labelColor)}>
                  Carga por arquivo
                </p>
                <p className={cn("mt-2 text-sm", subtleText)}>
                  As alterações serão aplicadas linha a linha conforme o CSV. Cada ID pode ter
                  valores diferentes por campo.
                </p>
              </div>
              <p className={cn("text-[11px]", subtleText)}>
                Deixe em branco para não alterar o campo. Use &lt;limpar&gt; para limpar a
                informação.
              </p>
            </>
          );
        }
        return (
          <>
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div
                  className={cn(
                    "rounded-2xl border p-4",
                    isDark
                      ? "border-white/10 bg-white/5"
                      : "border-slate-200 bg-slate-50"
                  )}
                >
                  <p className={cn("text-xs font-semibold uppercase tracking-[0.3em]", labelColor)}>
                    Área Proprietária
                  </p>
                  <div className="mt-3 space-y-3">
                    {assigneeFields
                      .filter((field) =>
                        ["customfield_11702", "customfield_11703", "customfield_11704"].includes(
                          field.id
                        )
                      )
                      .map((field) => (
                        <FieldBlock
                          key={field.id}
                          label={field.label}
                          labelClassName={labelColor}
                        >
                          <Input
                            placeholder="Nome ou <limpar>"
                            value={field.value}
                            onChange={(event) =>
                              onAssigneeFieldChange(field.id, event.target.value)
                            }
                            className={inputClasses}
                          />
                        </FieldBlock>
                      ))}
                  </div>
                </div>
                <div
                  className={cn(
                    "rounded-2xl border p-4",
                    isDark
                      ? "border-white/10 bg-white/5"
                      : "border-slate-200 bg-slate-50"
                  )}
                >
                  <p className={cn("text-xs font-semibold uppercase tracking-[0.3em]", labelColor)}>
                    Área Solucionadora
                  </p>
                  <div className="mt-3 space-y-3">
                    {assigneeFields
                      .filter((field) =>
                        ["customfield_11705", "customfield_11706", "customfield_11707", "customfield_10663"].includes(field.id)
                      )
                      .map((field) => (
                        <FieldBlock
                          key={field.id}
                          label={field.label}
                          labelClassName={labelColor}
                        >
                          <Input
                            placeholder="Nome ou <limpar>"
                            value={field.value}
                            onChange={(event) =>
                              onAssigneeFieldChange(field.id, event.target.value)
                            }
                            className={inputClasses}
                          />
                        </FieldBlock>
                      ))}
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "rounded-2xl border p-4",
                  isDark
                    ? "border-white/10 bg-white/5"
                    : "border-slate-200 bg-slate-50"
                )}
              >
                <p className={cn("text-xs font-semibold uppercase tracking-[0.3em]", labelColor)}>
                  Owners e Negócio
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {assigneeFields
                    .filter((field) =>
                      [
                        "customfield_10647",
                        "customfield_13200",
                        "customfield_13201",
                        "customfield_13202",
                        "customfield_13203",
                        "customfield_13205",
                        "customfield_13204",
                        "customfield_12301",
                        "customfield_12302",
                      ].includes(field.id)
                    )
                    .map((field) => (
                      <FieldBlock
                        key={field.id}
                        label={field.label}
                        labelClassName={labelColor}
                      >
                        <Input
                          placeholder="Nome ou <limpar>"
                          value={field.value}
                          onChange={(event) =>
                            onAssigneeFieldChange(field.id, event.target.value)
                          }
                          className={inputClasses}
                        />
                      </FieldBlock>
                    ))}
                </div>
              </div>
            </div>
            <p className={cn("text-[11px]", subtleText)}>
              Apenas issues do projeto ASSETN podem ser reatribuídas por aqui.
            </p>
            <p className={cn("text-[11px]", subtleText)}>
              Deixe vazio para não alterar o campo. Use &lt;limpar&gt; para limpar a informação.
            </p>
            <p className={cn("text-[11px]", subtleText)}>
              Quando integrado ao Jira, a automação verificará se o usuário tem permissão no projeto antes de aplicar.
            </p>
          </>
        );
      case "comment":
        return (
          <>
            <FieldBlock label="Comentário" labelClassName={labelColor}>
              <Textarea
                className={textareaClasses}
                placeholder="Mensagem padrão a ser replicada nas issues selecionadas."
                value={comment}
                onChange={(event) => onCommentChange(event.target.value)}
              />
            </FieldBlock>
            <p className={cn("text-[11px]", subtleText)}>
              Comentários serão gravados com a credencial técnica e marcados como automação.
            </p>
          </>
        );
      case "fields":
        return renderDynamicFieldsBlock(
          undefined,
          shouldShowFieldSuggestions ? fieldSuggestionsId : undefined
        );
      case "escalate":
        return renderDynamicFieldsBlock(
          "Use os campos para definir valores padrão quando não houver CSV.",
          fieldSuggestionsId
        );
      case "delete":
        return (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-xs",
              isDark
                ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">
              Atenção
            </p>
            <p className="mt-2 text-sm">
              A exclusão não possui rollback. Verifique os IDs antes de enviar e confirme
              que as issues podem ser removidas definitivamente.
            </p>
          </div>
        );
      default:
        return null;
    }
  }

  const filterBlock = isEscalate ? (
    <div className="space-y-4">
      <FieldBlock label="Projeto destino" labelClassName={labelColor}>
        <div
          className={cn(
            "rounded-2xl border",
            isDark ? "border-zinc-700 bg-[#050816]" : "border-slate-300 bg-white"
          )}
        >
          <select
            value={projectValue}
            onChange={(event) => onProjectChange(event.target.value)}
            className={cn(
              "w-full rounded-2xl bg-transparent px-3 py-2 text-sm focus-visible:outline-none",
              isDark ? "text-zinc-100" : "text-slate-700"
            )}
          >
            {projectOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className={cn(
                  isDark ? "bg-[#050816] text-white" : "bg-white text-slate-700"
                )}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <p className={cn("text-[11px]", subtleText)}>
          Defina para qual projeto as issues escalonadas serão criadas.
        </p>
      </FieldBlock>
      <div
        className={cn(
          "rounded-2xl border px-4 py-3 text-xs",
          isDark
            ? "border-purple-500/30 bg-purple-500/5 text-purple-100"
            : "border-purple-200 bg-purple-50 text-purple-700"
        )}
      >
        <p className="font-semibold uppercase tracking-[0.3em]">Template CSV</p>
        <p className={cn("mt-1 text-[11px]", subtleText)}>
          Use o arquivo base para estruturar colunas de custom fields e valores.
        </p>
        <a
          href={csvTemplateUrl}
          download
          className={cn(
            "mt-2 inline-flex items-center justify-center rounded-xl px-3 py-1 text-xs font-semibold",
            isDark ? "bg-white/10 text-white" : "bg-white text-purple-700 shadow"
          )}
        >
          Baixar template CSV
        </a>
      </div>
      <FieldBlock label="Cole ou revise o CSV" labelClassName={labelColor}>
        <Textarea
          className={textareaClasses}
          placeholder="Ex: summary,description,customfield_12300\nIssue crítica,Detalhes..."
          value={filterValue}
          onChange={(event) => onFilterValueChange(event.target.value)}
        />
        <p className={cn("text-[11px]", subtleText)}>
          Cole o conteúdo do template diretamente aqui ou importe um arquivo abaixo. Você pode ajustar valores linha a linha.
        </p>
        {(csvStats.rowCount > 0 || csvStats.columns.length > 0 || uploadedFileName) && (
          <div
            className={cn(
              "mt-3 grid gap-2 rounded-2xl border px-3 py-2 text-[11px]",
              isDark
                ? "border-zinc-700 bg-black/30 text-zinc-200"
                : "border-slate-200 bg-slate-50 text-slate-700"
            )}
          >
            {uploadedFileName && (
              <p>
                Último arquivo importado: <strong>{uploadedFileName}</strong>
              </p>
            )}
            {csvStats.rowCount > 0 && (
              <p>
                {csvStats.rowCount} registro{csvStats.rowCount === 1 ? "" : "s"} detectado{csvStats.rowCount === 1 ? "" : "s"} após o cabeçalho.
              </p>
            )}
            {csvStats.columns.length > 0 && (
              <p>
                Colunas identificadas: {csvStats.columns.join(", ")}
                {csvStats.columns.length === 6 && "..."}
              </p>
            )}
          </div>
        )}
      </FieldBlock>
      <FieldBlock label="Importar CSV (opcional)" labelClassName={labelColor}>
        <div
          className={cn(
            "rounded-2xl border border-dashed p-4 text-center",
            isDark
              ? "border-emerald-400/40 bg-emerald-400/5"
              : "border-emerald-200 bg-emerald-50"
          )}
        >
          <label
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2 text-xs font-semibold",
              isDark ? "text-emerald-200" : "text-emerald-700"
            )}
          >
            <span className="rounded-full border border-emerald-400/40 px-3 py-1">
              Selecionar CSV
            </span>
            <span className={cn("text-[11px]", subtleText)}>
              Aceitamos .csv com cabeçalho conforme o template (Sistema, customfield_...).
            </span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={idsFileInputRef}
              onChange={handleDataFileChange}
            />
          </label>
        </div>
        <p className={cn("text-[11px]", subtleText)}>
          Para poucos itens, utilize os campos personalizados manualmente ao lado.
        </p>
      </FieldBlock>
      <FieldBlock
        label="Catálogo de campos do Jira"
        labelClassName={labelColor}
      >
        <div
          className={cn(
            "space-y-3 rounded-2xl border p-4",
            isDark ? "border-zinc-800 bg-[#060818]/70" : "border-slate-200 bg-slate-50"
          )}
        >
          <Input
            placeholder="Buscar por nome, ID ou clauseName"
            value={fieldSearch}
            onChange={(event) => setFieldSearch(event.target.value)}
            className={inputClasses}
          />
          <div className="flex flex-wrap items-center gap-2">
            {typeFilterOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => setFieldTypeFilter(option.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-semibold transition",
                  fieldTypeFilter === option.id
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : isDark
                    ? "border border-white/10 text-zinc-400"
                    : "border border-slate-300 text-slate-500"
                )}
              >
                {option.label}
              </button>
            ))}
            <span className={cn("ml-auto text-[11px]", subtleText)}>
              {filteredFields.length} de {totalFields} campos catalogados
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 font-semibold",
                isDark
                  ? "border-zinc-700 text-zinc-200"
                  : "border-slate-300 text-slate-700"
              )}
            >
              Importar JSON
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                ref={catalogFileInputRef}
                onChange={handleCatalogImport}
              />
            </label>
            <span className={cn("text-[11px]", subtleText)}>
              Utilize o dump do endpoint /rest/api/3/field (como o JSON informado).
            </span>
          </div>
          {catalogError && (
            <p
              className={cn(
                "rounded-xl border px-3 py-2 text-[11px]",
                isDark
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                  : "border-rose-200 bg-rose-50 text-rose-600"
              )}
            >
              {catalogError}
            </p>
          )}
          <div
            className={cn(
              "rounded-2xl border",
              isDark ? "border-zinc-800 bg-[#050713]" : "border-slate-200 bg-white"
            )}
          >
            <ScrollArea className="h-[315px] w-full">
              <div className="space-y-2 p-3">
                {filteredFields.length === 0 ? (
                  <p className={cn("text-[11px]", subtleText)}>
                    Nenhum campo encontrado para esse filtro.
                  </p>
                ) : (
                  filteredFields.map((field) => (
                    <div
                      key={field.id}
                      className={cn(
                        "rounded-2xl border p-3 text-xs",
                        isDark
                          ? "border-zinc-800 bg-[#04050e]"
                          : "border-slate-200 bg-slate-50"
                      )}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p
                              className={cn(
                                "text-sm font-semibold",
                                isDark ? "text-white" : "text-slate-800"
                              )}
                            >
                              {field.name}
                            </p>
                            <p className={cn("text-[11px]", subtleText)}>
                              {field.id}
                            </p>
                            {field.clauseNames?.length ? (
                              <p className={cn("text-[11px]", subtleText)}>
                                Clause: {field.clauseNames.slice(0, 3).join(", ")}
                              </p>
                            ) : null}
                          </div>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
                              field.custom
                                ? isDark
                                  ? "bg-emerald-500/10 text-emerald-200"
                                  : "bg-emerald-50 text-emerald-700"
                                : isDark
                                ? "bg-blue-500/10 text-blue-200"
                                : "bg-blue-50 text-blue-700"
                            )}
                          >
                            {field.custom ? "Custom" : "Nativo"}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5",
                              isDark
                                ? "bg-white/5 text-zinc-300"
                                : "bg-white text-slate-600"
                            )}
                          >
                            {getFieldKind(field)}
                          </span>
                          {field.schema?.type && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5",
                                isDark
                                  ? "bg-white/5 text-zinc-400"
                                  : "bg-white text-slate-500"
                              )}
                            >
                              tipo: {field.schema.type}
                            </span>
                          )}
                          {field.schema?.custom && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5",
                                isDark
                                  ? "bg-white/5 text-zinc-400"
                                  : "bg-white text-slate-500"
                              )}
                            >
                              {field.schema.custom}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                          <button
                            type="button"
                            onClick={() => handleCopyFieldId(field.id)}
                            className={cn(
                              "rounded-full border px-3 py-1 font-semibold transition",
                              isDark
                                ? "border-zinc-700 text-zinc-200 hover:border-zinc-500"
                                : "border-slate-300 text-slate-700 hover:border-slate-500"
                            )}
                          >
                            {copiedField === field.id ? "Copiado!" : "Copiar ID"}
                          </button>
                          <button
                            type="button"
                            onClick={() => onPrefillFieldKey(field.id)}
                            className={cn(
                              "rounded-full border px-3 py-1 font-semibold transition",
                              isDark
                                ? "border-emerald-500/50 text-emerald-200 hover:border-emerald-400"
                                : "border-emerald-300 text-emerald-700 hover:border-emerald-500"
                            )}
                          >
                            Adicionar ao formulário
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
          <p className={cn("text-[11px]", subtleText)}>
            O campo selecionado já aparece como sugestão no formulário ao lado (lista automática).
          </p>
        </div>
      </FieldBlock>
    </div>
  ) : isDelete ? (
    <FieldBlock
      label="IDs das issues para exclusão"
      labelClassName={labelColor}
    >
      <Textarea
        className={textareaClasses}
        placeholder="ISSUE-1, ISSUE-2, ISSUE-3"
        value={filterValue}
        onChange={(event) => onFilterValueChange(event.target.value)}
      />
        <p className={cn("text-[11px]", subtleText)}>
          Liste apenas IDs válidos do Jira separados por vírgula ou quebra de linha. Esta ação removerá
          definitivamente os registros.
        </p>
        <a
          href={idsTemplateUrl}
          download
          className={cn(
            "mt-2 inline-flex items-center justify-center rounded-xl px-3 py-1 text-xs font-semibold",
            isDark ? "bg-white/10 text-white" : "bg-white text-purple-700 shadow"
          )}
        >
          Baixar template de IDs
        </a>
      </FieldBlock>
  ) : (
    <FieldBlock label="Conjunto de issues" labelClassName={labelColor}>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onFilterModeChange("jql")}
          className={cn(
            "flex-1 rounded-2xl text-xs",
            filterMode === "jql"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
              : cn(
                  "border bg-transparent",
                  isDark
                    ? "border-zinc-700 text-zinc-300"
                    : "border-slate-300 text-slate-600"
                )
          )}
        >
          JQL
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onFilterModeChange("ids")}
          className={cn(
            "flex-1 rounded-2xl text-xs",
            filterMode === "ids"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
              : cn(
                  "border bg-transparent",
                  isDark
                    ? "border-zinc-700 text-zinc-300"
                    : "border-slate-300 text-slate-600"
                )
          )}
        >
          IDs
        </Button>
        {selectedAction === "assignee" && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => onFilterModeChange("bulk")}
            className={cn(
              "flex-1 rounded-2xl text-xs",
              filterMode === "bulk"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                : cn(
                    "border bg-transparent",
                    isDark
                      ? "border-zinc-700 text-zinc-300"
                      : "border-slate-300 text-slate-600"
                  )
            )}
          >
            Carga
          </Button>
        )}
      </div>
      {filterMode === "bulk" && selectedAction === "assignee" ? (
        <div
          className={cn(
            "mt-3 rounded-2xl border border-dashed p-4",
            isDark
              ? "border-purple-500/40 bg-purple-500/5"
              : "border-purple-200 bg-purple-50"
          )}
        >
          <p className={cn("text-xs font-semibold", isDark ? "text-purple-200" : "text-purple-700")}>
            Template de carga por ID
          </p>
          <p className={cn("mt-1 text-[11px]", subtleText)}>
            Preencha a coluna ID e as colunas de áreas/owners. Deixe em branco para não alterar e use
            &lt;limpar&gt; para limpar.
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-zinc-400">
            {assigneeBulkLabels.slice(0, 6).map((label) => (
              <span
                key={label}
                className={cn(
                  "rounded-full border px-2 py-0.5",
                  isDark ? "border-white/10" : "border-slate-200"
                )}
              >
                {label}
              </span>
            ))}
            {assigneeBulkLabels.length > 6 && (
              <span className={cn("text-[11px]", subtleText)}>
                +{assigneeBulkLabels.length - 6} colunas
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-xs",
                isDark ? "border-purple-400/40 text-purple-200" : "border-purple-300 text-purple-700"
              )}
            >
              <span>Anexar arquivo CSV</span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={bulkFileInputRef}
                onChange={handleBulkFileChange}
              />
            </label>
            <a
              href={assigneeCsvTemplateUrl}
              download
              className={cn(
                "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold",
                isDark ? "bg-white/10 text-white" : "bg-white text-purple-700 shadow"
              )}
            >
              Baixar template de carga
            </a>
          </div>
          {assigneeCsvFileName && (
            <p className={cn("mt-2 text-[11px]", subtleText)}>
              Arquivo enviado: {assigneeCsvFileName}
            </p>
          )}
        </div>
      ) : (
        <>
          <Textarea
            className={textareaClasses}
            placeholder={
              filterMode === "jql"
                ? selectedAction === "assignee"
                  ? 'project = ASSETN AND status in ("To Do","In Progress")'
                  : 'Ex: project = POSTURA AND status in ("To Do","In Progress")'
                : selectedAction === "assignee"
                ? "ASSETN-123, ASSETN-456"
                : "ISSUE-1, ISSUE-2, ISSUE-3"
            }
            value={filterValue}
            onChange={(event) => onFilterValueChange(event.target.value)}
          />
          {filterMode === "jql" && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-2xl text-xs"
                disabled={isCheckingCount || !filterValue.trim()}
                onClick={onSimulateCount}
              >
                {isCheckingCount ? "Consultando..." : "Estimar quantidade"}
              </Button>
              {issuesCount !== null && !isCheckingCount && (
                <span className={cn("text-xs", subtleText)}>
                  {issuesCount} issues serão impactadas (simulado)
                </span>
              )}
            </div>
          )}
          <p className={cn("text-[11px]", subtleText)}>
            {filterMode === "jql"
              ? selectedAction === "assignee"
                ? "A consulta já deve iniciar com project = ASSETN."
                : "Adicione uma consulta JQL completa para selecionar as issues."
              : selectedAction === "assignee"
              ? "Informe apenas IDs iniciados com ASSETN-, separados por vírgula ou quebra de linha."
              : "Informe os IDs separados por vírgula ou quebra de linha."}
          </p>
          {filterMode === "ids" && (
            <div
              className={cn(
                "mt-2 rounded-2xl border border-dashed p-3",
                isDark
                  ? "border-purple-500/40 bg-purple-500/5"
                  : "border-purple-200 bg-purple-50"
              )}
            >
              <label
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 text-xs",
                  isDark ? "text-purple-200" : "text-purple-700"
                )}
              >
                <span className="rounded-full border border-purple-400/40 px-3 py-1">
                  Anexar arquivo com IDs
                </span>
                <span className={cn("text-[11px]", subtleText)}>
                  Aceitamos .txt ou .csv com um ID por linha.
                </span>
                <input
                  type="file"
                  accept=".txt,.csv"
                  className="hidden"
                  ref={idsFileInputRef}
                  onChange={handleDataFileChange}
                />
              </label>
              <a
                href={idsTemplateUrl}
                download
                className={cn(
                  "mt-3 inline-flex items-center justify-center rounded-xl px-3 py-1 text-[11px] font-semibold",
                  isDark ? "bg-white/10 text-white" : "bg-white text-purple-700 shadow"
                )}
              >
                Baixar template de IDs
              </a>
              {uploadedFileName && (
                <p className={cn("mt-2 text-[11px]", subtleText)}>
                  Arquivo enviado: {uploadedFileName}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </FieldBlock>
  );

  return (
    <Card className={cardClasses}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Parâmetros da ação selecionada
        </CardTitle>
        <CardDescription className={cn("text-sm", subtleText)}>
          {isEscalate
            ? "Escolha o projeto destino, campos personalizados e (se necessário) envie o CSV de template."
            : "Informe filtros de issues e detalhes necessários para executar a automação."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
        {message && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isDark
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}
          >
            {message}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {filterBlock}
          {renderActionFields()}
        </div>

        {shouldShowFieldSuggestions && (
          <datalist id={fieldSuggestionsId}>
            {fieldCatalog.map((field) => (
              <option key={field.id} value={field.id} label={field.name} />
            ))}
          </datalist>
        )}

        <div
          className={cn(
            "flex flex-col gap-3 rounded-2xl border border-dashed px-4 py-4 text-sm md:flex-row md:items-center md:justify-between",
            isDark
              ? "border-zinc-700 text-zinc-400"
              : "border-slate-300 text-slate-600"
          )}
        >
          <p className={cn(subtleText)}>
            Toda ação registrada será encaminhada para aprovação do administrador antes da execução.
          </p>
          <Button
            type="button"
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
            disabled={disableSubmit}
            onClick={onSubmit}
          >
            {isSubmitting ? "Registrando..." : "Enviar para aprovação"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
