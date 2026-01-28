"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

type Contract = {
  id: number;
  title: string;
  vendor: string;
  owner: string;
  area: string | null;
  lpu: string | null;
  lpu_image: string | null;
  contract_type: string | null;
  segment: string | null;
  sap_contract: string | null;
  contract_year: string | null;
  contract_scope: string | null;
  management: string | null;
  payment_type: string | null;
  payment_schedule_json: string | null;
  supplemental_used: number | null;
  status: string;
  start_date: string;
  end_date: string;
  alert_days: number | null;
  value_amount: number | null;
  value_currency: string | null;
  description: string | null;
  notes: string | null;
};

type PaymentScheduleEntry = {
  year: string;
  valueAmount: string;
  supplementalUsed: string;
};

const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "em_negociacao", label: "Em negociação" },
  { value: "suspenso", label: "Suspenso" },
  { value: "encerrado", label: "Encerrado" },
];

const paymentTypeOptions = [
  { value: "oneshot", label: "Oneshot" },
  { value: "oneshot_anual", label: "Oneshot anual" },
  { value: "mensal", label: "Mensal" },
];

const segmentOptions = ["CAPEX", "OPEX"];
const scopeOptions = ["Licenças", "Serviço", "Licenças/Serviços"];
const managementOptions = ["Red", "Postura Cibernetica", "DevSecOps", "OffSecOps", "AppSec"];
const responsibleOptions = ["Alisson Oliveira", "Maffei", "Dalson", "Thiago Ribeiro"];
const CUSTOM_OPTION_VALUE = "__custom__";

function resolveSelectValue(value: string, options: string[]) {
  if (!value) {
    return { selected: "", custom: "" };
  }
  if (options.includes(value)) {
    return { selected: value, custom: "" };
  }
  return { selected: CUSTOM_OPTION_VALUE, custom: value };
}

function formatCurrency(value: number | null, currency?: string | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  const code = currency || "BRL";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value} ${code}`.trim();
  }
}

function parseCurrencyInput(value: string) {
  if (!value) return null;
  const cleaned = value.replace(/[^\d,.-]/g, "");
  if (!cleaned) return null;
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");
  let normalized = cleaned;
  if (hasComma && hasDot) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = cleaned.replace(",", ".");
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const padded = digits.length <= 2 ? digits.padStart(3, "0") : digits;
  const rawInteger = padded.length > 2 ? padded.slice(0, -2) : "0";
  const integerPart = rawInteger.replace(/^0+(?=\d)/, "") || "0";
  const decimalPart = padded.slice(-2);
  const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withThousands},${decimalPart}`;
}

function formatPlainCurrency(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "";
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parseScheduleJson(raw?: string | null) {
  if (!raw) return [] as PaymentScheduleEntry[];
  try {
    const parsed = JSON.parse(raw) as Array<{
      year?: string;
      valueAmount?: number | null;
      supplementalUsed?: number | null;
    }>;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry) => ({
      year: entry.year ?? "",
      valueAmount: formatPlainCurrency(
        typeof entry.valueAmount === "number" ? entry.valueAmount : null
      ),
      supplementalUsed: formatPlainCurrency(
        typeof entry.supplementalUsed === "number" ? entry.supplementalUsed : null
      ),
    }));
  } catch {
    return [];
  }
}

function sumScheduleDraft(schedule: PaymentScheduleEntry[]) {
  return schedule.reduce(
    (acc, entry) => {
      const valueAmount = parseCurrencyInput(entry.valueAmount);
      const supplementalUsed = parseCurrencyInput(entry.supplementalUsed);
      if (typeof valueAmount === "number") {
        acc.valueAmount += valueAmount;
      }
      if (typeof supplementalUsed === "number") {
        acc.supplementalUsed += supplementalUsed;
      }
      return acc;
    },
    { valueAmount: 0, supplementalUsed: 0 }
  );
}

export function ContractForm({
  mode,
  contractId,
}: {
  mode: "create" | "edit";
  contractId?: number;
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [supplementalBalance, setSupplementalBalance] = useState(0);
  const [contracts, setContracts] = useState<Contract[]>([]);

  const [title, setTitle] = useState("");
  const [vendor, setVendor] = useState("");
  const [owner, setOwner] = useState("");
  const [area, setArea] = useState("");
  const [lpu, setLpu] = useState("");
  const [lpuImage, setLpuImage] = useState<string | null>(null);
  const [contractType, setContractType] = useState("");
  const [segmentSelect, setSegmentSelect] = useState("");
  const [segmentCustom, setSegmentCustom] = useState("");
  const [sapContract, setSapContract] = useState("");
  const [contractYear, setContractYear] = useState("");
  const [contractYearCustom, setContractYearCustom] = useState("");
  const [scopeSelect, setScopeSelect] = useState("");
  const [scopeCustom, setScopeCustom] = useState("");
  const [managementSelect, setManagementSelect] = useState("");
  const [managementCustom, setManagementCustom] = useState("");
  const [responsibleSelect, setResponsibleSelect] = useState("");
  const [responsibleCustom, setResponsibleCustom] = useState("");
  const [status, setStatus] = useState("ativo");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [alertDays, setAlertDays] = useState("30");
  const [paymentType, setPaymentType] = useState("oneshot");
  const [scheduleYear, setScheduleYear] = useState("");
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleEntry[]>([]);
  const [valueAmount, setValueAmount] = useState("");
  const [valueCurrency, setValueCurrency] = useState("BRL");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [supplementalUsed, setSupplementalUsed] = useState("");
  const [supplementalFieldError, setSupplementalFieldError] = useState<string | null>(null);

  const contractYearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const years: string[] = [];
    for (let year = current + 5; year >= current - 10; year -= 1) {
      years.push(String(year));
    }
    return years;
  }, []);

  const scheduleYearOptions = useMemo(() => {
    const used = new Set(paymentSchedule.map((entry) => entry.year));
    return contractYearOptions.filter((year) => !used.has(year));
  }, [contractYearOptions, paymentSchedule]);

  const totalUsed = useMemo(() => {
    return contracts.reduce((acc, contract) => {
      if (typeof contract.supplemental_used === "number") {
        return acc + contract.supplemental_used;
      }
      return acc;
    }, 0);
  }, [contracts]);

  const supplementalAvailable = Math.max(
    0,
    (Number.isFinite(supplementalBalance) ? supplementalBalance : 0) - totalUsed
  );

  const editingContractUsed = useMemo(() => {
    if (!isEdit || !contractId) return 0;
    const contract = contracts.find((item) => item.id === contractId);
    return typeof contract?.supplemental_used === "number" ? contract.supplemental_used : 0;
  }, [contracts, contractId, isEdit]);

  useEffect(() => {
    let active = true;
    function applyContract(contract: Contract) {
      const segmentResolved = resolveSelectValue(contract.segment ?? "", segmentOptions);
      const scopeResolved = resolveSelectValue(contract.contract_scope ?? "", scopeOptions);
      const managementResolved = resolveSelectValue(
        contract.management ?? "",
        managementOptions
      );
      const responsibleResolved = resolveSelectValue(
        contract.owner ?? "",
        responsibleOptions
      );
      setTitle(contract.title);
      setVendor(contract.vendor);
      setOwner(contract.owner);
      setArea(contract.area ?? "");
      setLpu(contract.lpu ?? "");
      setLpuImage(contract.lpu_image ?? null);
      setContractType(contract.contract_type ?? "");
      setSegmentSelect(segmentResolved.selected);
      setSegmentCustom(segmentResolved.custom);
      setSapContract(contract.sap_contract ?? "");
      if (contract.contract_year && !contractYearOptions.includes(contract.contract_year)) {
        setContractYear(CUSTOM_OPTION_VALUE);
        setContractYearCustom(contract.contract_year);
      } else {
        setContractYear(contract.contract_year ?? "");
        setContractYearCustom("");
      }
      setScopeSelect(scopeResolved.selected);
      setScopeCustom(scopeResolved.custom);
      setManagementSelect(managementResolved.selected);
      setManagementCustom(managementResolved.custom);
      setResponsibleSelect(responsibleResolved.selected);
      setResponsibleCustom(responsibleResolved.custom);
      setPaymentType(contract.payment_type ?? "oneshot");
      setPaymentSchedule(parseScheduleJson(contract.payment_schedule_json));
      setScheduleYear("");
      setStatus(contract.status);
      setStartDate(contract.start_date);
      setEndDate(contract.end_date);
      setAlertDays(String(contract.alert_days ?? 30));
      setValueAmount(formatPlainCurrency(contract.value_amount));
      setValueCurrency(contract.value_currency ?? "BRL");
      setDescription(contract.description ?? "");
      setNotes(contract.notes ?? "");
      setSupplementalUsed(
        typeof contract.supplemental_used === "number"
          ? formatPlainCurrency(contract.supplemental_used)
          : ""
      );
    }

    async function fetchSettings() {
      try {
        const response = await fetch("/api/contracts/settings");
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível carregar as configurações.");
        }
        if (typeof data?.supplementalBalance === "number") {
          setSupplementalBalance(data.supplementalBalance);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Falha ao carregar configurações.");
      }
    }

    async function fetchContracts() {
      try {
        const response = await fetch("/api/contracts");
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível carregar contratos.");
        }
        const list = Array.isArray(data?.contracts) ? data.contracts : [];
        setContracts(list);
        if (isEdit && contractId) {
          const contract = list.find(
            (item: Contract) => String(item.id) === String(contractId)
          );
          if (contract) {
            applyContract(contract);
          } else {
            const detailResponse = await fetch(`/api/contracts?id=${contractId}`);
            const detailData = await detailResponse.json().catch(() => null);
            if (!detailResponse.ok) {
              throw new Error(detailData?.error || "Contrato não encontrado.");
            }
            if (detailData?.contract) {
              applyContract(detailData.contract as Contract);
            } else {
              throw new Error("Contrato não encontrado.");
            }
          }
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Falha ao carregar contratos.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchSettings();
    fetchContracts();
    return () => {
      active = false;
    };
  }, [contractId, contractYearOptions, isEdit]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSupplementalFieldError(null);

    const segmentValue =
      segmentSelect === CUSTOM_OPTION_VALUE ? segmentCustom : segmentSelect;
    const scopeValue = scopeSelect === CUSTOM_OPTION_VALUE ? scopeCustom : scopeSelect;
    const managementValue =
      managementSelect === CUSTOM_OPTION_VALUE ? managementCustom : managementSelect;
    const responsibleValue =
      responsibleSelect === CUSTOM_OPTION_VALUE ? responsibleCustom : responsibleSelect;
    const yearValue =
      contractYear === CUSTOM_OPTION_VALUE ? contractYearCustom : contractYear;
    const schedulePayload =
      paymentType === "oneshot"
        ? []
        : paymentSchedule
            .filter((entry) => entry.year)
            .map((entry) => ({
              year: entry.year,
              valueAmount: entry.valueAmount ? parseCurrencyInput(entry.valueAmount) : null,
              supplementalUsed: entry.supplementalUsed
                ? parseCurrencyInput(entry.supplementalUsed)
                : null,
            }));
    const scheduleTotals = sumScheduleDraft(paymentSchedule);

    const payload = {
      id: isEdit ? contractId : undefined,
      title,
      vendor,
      owner: responsibleValue || owner,
      area,
      lpu,
      lpuImage,
      contractType,
      segment: segmentValue || null,
      sapContract,
      contractYear: yearValue || null,
      contractScope: scopeValue || null,
      management: managementValue || null,
      paymentType,
      paymentSchedule: schedulePayload,
      status,
      startDate,
      endDate,
      alertDays: Number(alertDays),
      valueAmount:
        paymentType === "oneshot"
          ? valueAmount
            ? parseCurrencyInput(valueAmount)
            : null
          : scheduleTotals.valueAmount,
      valueCurrency,
      description,
      notes,
      supplementalUsed:
        paymentType === "oneshot"
          ? supplementalUsed
            ? parseCurrencyInput(supplementalUsed)
            : null
          : scheduleTotals.supplementalUsed,
    };

    if (paymentType !== "oneshot" && schedulePayload.length === 0) {
      setSaving(false);
      setError("Informe os valores anuais do contrato para este tipo de pagamento.");
      return;
    }

    if (
      paymentType !== "oneshot" &&
      schedulePayload.some(
        (entry) => typeof entry.valueAmount !== "number" || !Number.isFinite(entry.valueAmount)
      )
    ) {
      setSaving(false);
      setError("Informe o valor adjudicado para todos os anos selecionados.");
      return;
    }

    if (payload.supplementalUsed !== null) {
      const available = supplementalAvailable + (isEdit ? editingContractUsed : 0);
      if (payload.supplementalUsed > available) {
        setSaving(false);
        setSupplementalFieldError("Saldo suplementar insuficiente para este contrato.");
        return;
      }
    }

    try {
      const response = await fetch("/api/contracts", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível salvar o contrato.");
      }
      router.push("/ferramentas/gestao-contratos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar contrato.");
    } finally {
      setSaving(false);
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
      pageTitle={isEdit ? "Editar contrato" : "Cadastrar contrato"}
      pageSubtitle="Preencha as informações para cadastrar ou atualizar o contrato."
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        <Card
          className={cn(
            "rounded-3xl border",
            isDark ? "border-white/10 bg-[#050816]" : "border-slate-200 bg-white"
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge
                  variant="outline"
                  className={cn(
                    "border-purple-500/60 bg-purple-500/10 text-[11px] uppercase tracking-[0.3em]",
                    isDark ? "text-purple-200" : "text-purple-700"
                  )}
                >
                  Gestão contratual
                </Badge>
                <h3 className="mt-2 text-lg font-semibold">
                  {isEdit ? "Editar contrato" : "Novo contrato"}
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Campos com * são obrigatórios.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/ferramentas/gestao-contratos")}
              >
                Voltar
              </Button>
            </div>

            {error && (
              <div
                className={cn(
                  "mt-4 rounded-2xl border px-4 py-3 text-sm",
                  isDark
                    ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                )}
              >
                {error}
              </div>
            )}

            <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Objeto do contrato *"
                required
                className={cn(
                  "h-10 rounded-xl text-sm",
                  isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                )}
              />
              <Input
                value={vendor}
                onChange={(event) => setVendor(event.target.value)}
                placeholder="Fornecedor *"
                required
                className={cn(
                  "h-10 rounded-xl text-sm",
                  isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                )}
              />
              <select
                value={segmentSelect}
                onChange={(event) => setSegmentSelect(event.target.value)}
                className={cn(
                  "h-10 rounded-xl border px-3 text-sm",
                  isDark
                    ? "border-white/10 bg-black/40 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                )}
              >
                <option value="">Selecionar segmento</option>
                {segmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value={CUSTOM_OPTION_VALUE}>Adicionar opção...</option>
              </select>
              {segmentSelect === CUSTOM_OPTION_VALUE && (
                <Input
                  value={segmentCustom}
                  onChange={(event) => setSegmentCustom(event.target.value)}
                  placeholder="Novo segmento"
                  className={cn(
                    "h-10 rounded-xl text-sm",
                    isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                  )}
                />
              )}
              <Input
                value={sapContract}
                onChange={(event) => setSapContract(event.target.value)}
                placeholder="Contrato SAP"
                className={cn(
                  "h-10 rounded-xl text-sm",
                  isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                )}
              />
              <div className="space-y-2 md:col-span-2">
                <Textarea
                  value={lpu}
                  onChange={(event) => setLpu(event.target.value)}
                  onPaste={(event) => {
                    const items = event.clipboardData?.items ?? [];
                    const imageItem = Array.from(items).find((item) =>
                      item.type.startsWith("image/")
                    );
                    if (!imageItem) return;
                    event.preventDefault();
                    const file = imageItem.getAsFile();
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === "string") {
                        setLpuImage(reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  placeholder="LPU (cole a imagem com Ctrl+V)"
                  className={cn(
                    "min-h-[80px] rounded-xl text-sm",
                    isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                  )}
                />
                {lpuImage && (
                  <div className="space-y-2">
                    <img
                      src={lpuImage}
                      alt="Pré-visualização do LPU"
                      className="max-h-48 w-full rounded-xl border border-white/10 object-contain"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setLpuImage(null)}
                    >
                      Remover imagem
                    </Button>
                  </div>
                )}
              </div>
              <select
                value={contractYear}
                onChange={(event) => {
                  const next = event.target.value;
                  setContractYear(next);
                  if (next !== CUSTOM_OPTION_VALUE) {
                    setContractYearCustom("");
                  }
                }}
                className={cn(
                  "h-10 rounded-xl border px-3 text-sm",
                  isDark
                    ? "border-white/10 bg-black/40 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                )}
              >
                <option value="">Selecionar ano do contrato</option>
                {contractYearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
                <option value={CUSTOM_OPTION_VALUE}>Adicionar opção...</option>
              </select>
              {contractYear === CUSTOM_OPTION_VALUE && (
                <Input
                  value={contractYearCustom}
                  onChange={(event) => setContractYearCustom(event.target.value)}
                  placeholder="Ano personalizado"
                  className={cn(
                    "h-10 rounded-xl text-sm",
                    isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                  )}
                />
              )}
              <select
                value={scopeSelect}
                onChange={(event) => setScopeSelect(event.target.value)}
                className={cn(
                  "h-10 rounded-xl border px-3 text-sm",
                  isDark
                    ? "border-white/10 bg-black/40 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                )}
              >
                <option value="">Selecionar escopo</option>
                {scopeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value={CUSTOM_OPTION_VALUE}>Adicionar opção...</option>
              </select>
              {scopeSelect === CUSTOM_OPTION_VALUE && (
                <Input
                  value={scopeCustom}
                  onChange={(event) => setScopeCustom(event.target.value)}
                  placeholder="Novo escopo"
                  className={cn(
                    "h-10 rounded-xl text-sm",
                    isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                  )}
                />
              )}
              <select
                value={paymentType}
                onChange={(event) => {
                  const next = event.target.value;
                  setPaymentType(next);
                  if (next === "oneshot") {
                    setPaymentSchedule([]);
                    setScheduleYear("");
                  }
                }}
                className={cn(
                  "h-10 rounded-xl border px-3 text-sm",
                  isDark
                    ? "border-white/10 bg-black/40 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                )}
              >
                <option value="">Selecionar forma de pagamento</option>
                {paymentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {paymentType !== "oneshot" && (
                <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-white/10 p-3 text-xs text-zinc-400 md:col-span-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={scheduleYear}
                      onChange={(event) => setScheduleYear(event.target.value)}
                      className={cn(
                        "h-9 rounded-xl border px-3 text-xs",
                        isDark
                          ? "border-white/10 bg-black/40 text-white"
                          : "border-slate-200 bg-white text-slate-700"
                      )}
                    >
                      <option value="">Selecionar ano</option>
                      {scheduleYearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (!scheduleYear) return;
                        setPaymentSchedule((prev) => [
                          ...prev,
                          { year: scheduleYear, valueAmount: "", supplementalUsed: "" },
                        ]);
                        setScheduleYear("");
                      }}
                    >
                      Adicionar ano
                    </Button>
                  </div>
                  {paymentSchedule.length === 0 ? (
                    <p>Adicione ao menos um ano para registrar valores.</p>
                  ) : (
                    <div className="space-y-3">
                      {paymentSchedule.map((entry, index) => (
                        <div
                          key={`${entry.year}-${index}`}
                          className={cn(
                            "rounded-xl border p-3",
                            isDark ? "border-white/10 bg-black/40" : "border-slate-200 bg-white"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                              Ano {entry.year}
                            </p>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setPaymentSchedule((prev) =>
                                  prev.filter((_, itemIndex) => itemIndex !== index)
                                )
                              }
                            >
                              Remover
                            </Button>
                          </div>
                          <div className="mt-2 grid gap-2 md:grid-cols-2">
                            <Input
                              value={entry.valueAmount}
                              onChange={(event) => {
                                const next = formatCurrencyInput(event.target.value);
                                setPaymentSchedule((prev) =>
                                  prev.map((item, itemIndex) =>
                                    itemIndex === index
                                      ? { ...item, valueAmount: next }
                                      : item
                                  )
                                );
                              }}
                              placeholder="Valor adjudicado (R$)"
                              className={cn(
                                "h-9 rounded-xl text-xs",
                                isDark
                                  ? "border-white/10 bg-black/40 text-white"
                                  : "border-slate-200"
                              )}
                            />
                            <Input
                              value={entry.supplementalUsed}
                              onChange={(event) => {
                                const next = formatCurrencyInput(event.target.value);
                                setPaymentSchedule((prev) =>
                                  prev.map((item, itemIndex) =>
                                    itemIndex === index
                                      ? { ...item, supplementalUsed: next }
                                      : item
                                  )
                                );
                              }}
                              placeholder="Saldo utilizado (R$)"
                              className={cn(
                                "h-9 rounded-xl text-xs",
                                isDark
                                  ? "border-white/10 bg-black/40 text-white"
                                  : "border-slate-200"
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {paymentType === "oneshot" && (
                <>
                  <Input
                    value={valueAmount}
                    onChange={(event) => setValueAmount(formatCurrencyInput(event.target.value))}
                    placeholder="Valor adjudicado (R$)"
                    className={cn(
                      "h-10 rounded-xl text-sm",
                      isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                    )}
                  />
                  <Input
                    value={supplementalUsed}
                    onChange={(event) =>
                      setSupplementalUsed(formatCurrencyInput(event.target.value))
                    }
                    placeholder="Saldo utilizado (R$)"
                    className={cn(
                      "h-10 rounded-xl text-sm",
                      isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                    )}
                  />
                </>
              )}
              <p className="text-[11px] text-zinc-500 md:col-span-2">
                Disponível: {formatCurrency(supplementalAvailable, "BRL")}
              </p>
              {supplementalFieldError && (
                <p className="text-[11px] text-rose-400 md:col-span-2">
                  {supplementalFieldError}
                </p>
              )}
              <select
                value={managementSelect}
                onChange={(event) => setManagementSelect(event.target.value)}
                className={cn(
                  "h-10 rounded-xl border px-3 text-sm",
                  isDark
                    ? "border-white/10 bg-black/40 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                )}
              >
                <option value="">Selecionar gerência</option>
                {managementOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value={CUSTOM_OPTION_VALUE}>Adicionar opção...</option>
              </select>
              {managementSelect === CUSTOM_OPTION_VALUE && (
                <Input
                  value={managementCustom}
                  onChange={(event) => setManagementCustom(event.target.value)}
                  placeholder="Nova gerência"
                  className={cn(
                    "h-10 rounded-xl text-sm",
                    isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                  )}
                />
              )}
              <select
                value={responsibleSelect}
                onChange={(event) => setResponsibleSelect(event.target.value)}
                className={cn(
                  "h-10 rounded-xl border px-3 text-sm",
                  isDark
                    ? "border-white/10 bg-black/40 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                )}
              >
                <option value="">Selecionar responsável</option>
                {responsibleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value={CUSTOM_OPTION_VALUE}>Adicionar opção...</option>
              </select>
              {responsibleSelect === CUSTOM_OPTION_VALUE && (
                <Input
                  value={responsibleCustom}
                  onChange={(event) => setResponsibleCustom(event.target.value)}
                  placeholder="Novo responsável"
                  className={cn(
                    "h-10 rounded-xl text-sm",
                    isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                  )}
                />
              )}
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={cn(
                  "h-10 rounded-xl border px-3 text-sm",
                  isDark
                    ? "border-white/10 bg-black/40 text-white"
                    : "border-slate-200 bg-white text-slate-700"
                )}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                placeholder="Início *"
                required
                className={cn(
                  "h-10 rounded-xl text-sm",
                  isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                )}
              />
              <Input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                placeholder="Fim *"
                required
                className={cn(
                  "h-10 rounded-xl text-sm",
                  isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                )}
              />
              <Input
                value={alertDays}
                onChange={(event) => setAlertDays(event.target.value)}
                placeholder="Alerta (dias)"
                className={cn(
                  "h-10 rounded-xl text-sm",
                  isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                )}
              />
            </div>
            <div className="mt-4 space-y-3">
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descrição do contrato *"
                required
                className={cn(
                  "min-h-[90px] rounded-xl text-sm",
                  isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                )}
              />
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Observações adicionais"
                className={cn(
                  "min-h-[70px] rounded-xl text-sm",
                  isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/ferramentas/gestao-contratos")}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar contrato"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
