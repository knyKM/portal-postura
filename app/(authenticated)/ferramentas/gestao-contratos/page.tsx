"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";
import { CalendarDays, FileSignature, ShieldCheck } from "lucide-react";

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
  created_at: string;
  updated_at: string;
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

function parseLocalDate(value?: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map((item) => Number(item));
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
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

function getDaysRemaining(endDate: string) {
  const end = parseLocalDate(endDate);
  if (!end) return null;
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const diffMs = startOfEnd.getTime() - startOfToday.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function GestaoContratosPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expiringDays, setExpiringDays] = useState(30);
  const [expiringInput, setExpiringInput] = useState("30");
  const [expiringSaving, setExpiringSaving] = useState(false);
  const [expiringError, setExpiringError] = useState<string | null>(null);
  const [expiringModalOpen, setExpiringModalOpen] = useState(false);
  const [supplementalBalance, setSupplementalBalance] = useState(0);
  const [supplementalInput, setSupplementalInput] = useState("0");
  const [supplementalSaving, setSupplementalSaving] = useState(false);
  const [supplementalError, setSupplementalError] = useState<string | null>(null);
  const [supplementalModalOpen, setSupplementalModalOpen] = useState(false);
  const [supplementalDescription, setSupplementalDescription] = useState("");
  const [supplementalHistory, setSupplementalHistory] = useState<
    Array<{ id: number; amount: number; description: string; created_at: string }>
  >([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [supplementalFieldError, setSupplementalFieldError] = useState<
    string | null
  >(null);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [vendor, setVendor] = useState("");
  const [owner, setOwner] = useState("");
  const [area, setArea] = useState("");
  const [lpu, setLpu] = useState("");
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
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleEntry[]>(
    []
  );
  const [valueAmount, setValueAmount] = useState("");
  const [valueCurrency, setValueCurrency] = useState("BRL");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [supplementalUsed, setSupplementalUsed] = useState("");

  const portalTarget = typeof document !== "undefined" ? document.body : null;
  const [expandedLpuIds, setExpandedLpuIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
    } catch {
      router.replace("/login");
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (loading) return;
    const controller = new AbortController();
    async function fetchContracts() {
      setError(null);
      try {
        const response = await fetch("/api/contracts", { signal: controller.signal });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Não foi possível carregar os contratos.");
        }
        setContracts(data?.contracts ?? []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar contratos.");
      }
    }
    fetchContracts();
    return () => controller.abort();
  }, [loading]);

  async function refreshContracts() {
    setError(null);
    try {
      const response = await fetch("/api/contracts");
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível recarregar os contratos.");
      }
      setContracts(data?.contracts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao recarregar contratos.");
    }
  }

  useEffect(() => {
    if (loading) return;
    fetch("/api/contracts/settings")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (typeof data?.expiringDays === "number") {
          setExpiringDays(data.expiringDays);
          setExpiringInput(String(data.expiringDays));
        }
        if (typeof data?.supplementalBalance === "number") {
          setSupplementalBalance(data.supplementalBalance);
          setSupplementalInput(formatPlainCurrency(data.supplementalBalance));
        }
        if (Array.isArray(data?.supplementalHistory)) {
          setSupplementalHistory(data.supplementalHistory);
        }
      })
      .catch(() => null);
  }, [loading]);

  const filteredContracts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return contracts;
    return contracts.filter((contract) => {
      const haystack = [
        contract.title,
        contract.vendor,
        contract.owner,
        contract.segment,
        contract.sap_contract,
        contract.contract_year,
        contract.contract_scope,
        contract.management,
        contract.lpu,
        contract.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [contracts, query]);

  const stats = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const currentYear = today.getFullYear();
    let active = 0;
    let expiring = 0;
    let expired = 0;
    let supplementalUsedTotal = 0;
    let totalAdjudicatedActive = 0;
    let oneshotCurrentYearTotal = 0;
    contracts.forEach((contract) => {
      if (contract.status === "encerrado") return;
      if (typeof contract.supplemental_used === "number") {
        supplementalUsedTotal += contract.supplemental_used;
      }
      if (
        contract.status === "ativo" &&
        typeof contract.value_amount === "number" &&
        (contract.value_currency ?? "BRL") === "BRL"
      ) {
        totalAdjudicatedActive += contract.value_amount;
      }
      if (
        contract.payment_type === "oneshot" &&
        typeof contract.value_amount === "number"
      ) {
        const year =
          contract.contract_year && /^\d{4}$/.test(contract.contract_year)
            ? Number(contract.contract_year)
            : Number(contract.start_date?.slice(0, 4));
        if (year === currentYear) {
          oneshotCurrentYearTotal += contract.value_amount;
        }
      }
      const daysRemaining = getDaysRemaining(contract.end_date);
      if (daysRemaining !== null && daysRemaining < 0) {
        expired += 1;
        return;
      }
      const alertWindow = contract.alert_days ?? expiringDays;
      if (daysRemaining !== null && daysRemaining <= alertWindow) {
        expiring += 1;
        return;
      }
      const start = parseLocalDate(contract.start_date);
      if (start && start <= startOfToday) {
        active += 1;
      }
    });
    return {
      active,
      expiring,
      expired,
      supplementalUsedTotal,
      totalAdjudicatedActive,
      oneshotCurrentYearTotal,
    };
  }, [contracts, expiringDays]);

  const safeBalance = Number.isFinite(supplementalBalance) ? supplementalBalance : 0;
  const safeUsedTotal = Number.isFinite(stats.supplementalUsedTotal)
    ? stats.supplementalUsedTotal
    : 0;
  const editingContractUsed = useMemo(() => {
    if (!editingId) return 0;
    const contract = contracts.find((item) => item.id === editingId);
    return typeof contract?.supplemental_used === "number"
      ? contract.supplemental_used
      : 0;
  }, [editingId, contracts]);

  const supplementalAvailable = Math.max(0, safeBalance - safeUsedTotal);
  const scheduleTotals = useMemo(
    () => sumScheduleDraft(paymentSchedule),
    [paymentSchedule]
  );
  const supplementalDraftUsed =
    paymentType === "oneshot"
      ? supplementalUsed
        ? parseCurrencyInput(supplementalUsed) ?? 0
        : 0
      : scheduleTotals.supplementalUsed;
  const supplementalDraftDelta = editingId
    ? Math.max(0, supplementalDraftUsed - editingContractUsed)
    : supplementalDraftUsed;
  const supplementalVisible = supplementalAvailable;

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

  function resetForm() {
    setTitle("");
    setVendor("");
    setOwner("");
    setArea("");
    setLpu("");
    setLpuImage(null);
    setContractType("");
    setSegmentSelect("");
    setSegmentCustom("");
    setSapContract("");
    setContractYear("");
    setContractYearCustom("");
    setScopeSelect("");
    setScopeCustom("");
    setManagementSelect("");
    setManagementCustom("");
    setResponsibleSelect("");
    setResponsibleCustom("");
    setStatus("ativo");
    setStartDate("");
    setEndDate("");
    setAlertDays("30");
    setPaymentType("oneshot");
    setScheduleYear("");
    setPaymentSchedule([]);
    setValueAmount("");
    setValueCurrency("BRL");
    setDescription("");
    setNotes("");
    setSupplementalUsed("");
    setSupplementalFieldError(null);
  }

  function toggleLpu(contractId: number) {
    setExpandedLpuIds((prev) => {
      const next = new Set(prev);
      if (next.has(contractId)) {
        next.delete(contractId);
      } else {
        next.add(contractId);
      }
      return next;
    });
  }

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
              valueAmount: entry.valueAmount
                ? parseCurrencyInput(entry.valueAmount)
                : null,
              supplementalUsed: entry.supplementalUsed
                ? parseCurrencyInput(entry.supplementalUsed)
                : null,
            }));
    const scheduleTotals = sumScheduleDraft(paymentSchedule);
    const payload = {
      id: editingId ?? undefined,
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
      const available =
        supplementalAvailable + (editingId ? editingContractUsed : 0);
      if (payload.supplementalUsed > available) {
        setSaving(false);
        setSupplementalFieldError(
          "Saldo suplementar insuficiente para este contrato."
        );
        return;
      }
    }

    try {
      const response = await fetch("/api/contracts", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível salvar o contrato.");
      }
      const updated = data?.contract;
      setContracts((prev) => {
        if (editingId) {
          return prev.map((item) => (item.id === editingId ? updated : item));
        }
        return [updated, ...prev];
      });
      await refreshContracts();
      setFormOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar contrato.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir este contrato?")) return;
    setDeletingId(id);
    setError(null);
    try {
      const response = await fetch("/api/contracts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível excluir o contrato.");
      }
      setContracts((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao excluir contrato.");
    } finally {
      setDeletingId(null);
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
      pageTitle="Gestão de Contratos"
      pageSubtitle="Cadastre, acompanhe prazos e mantenha a governança dos contratos."
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 lg:px-10">
        <section
          className={cn(
            "relative overflow-hidden rounded-3xl border px-6 py-6",
            isDark
              ? "border-white/10 bg-gradient-to-br from-[#070b1a] via-[#060614] to-[#090015] text-zinc-100"
              : "border-slate-200 bg-white text-slate-900"
          )}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Badge
                variant="outline"
                className={cn(
                  "border-purple-500/60 bg-purple-500/10 text-[11px] uppercase tracking-[0.3em]",
                  isDark ? "text-purple-200" : "text-purple-700"
                )}
              >
                Gestão contratual
              </Badge>
              <h1 className="text-2xl font-semibold">Contratos sob controle</h1>
              <p className="max-w-2xl text-sm text-zinc-400">
                Registre responsáveis, prazos críticos, valores e observações para manter
                o acompanhamento da equipe sempre atualizado.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por título, fornecedor ou área"
                className={cn(
                  "w-full rounded-2xl text-sm sm:w-72",
                  isDark ? "border-white/10 bg-black/30 text-white" : "border-slate-200 bg-white"
                )}
              />
              <Button
                type="button"
                className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                onClick={() => router.push("/ferramentas/gestao-contratos/novo")}
              >
                Cadastrar contrato
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            {
              label: "Ativos",
              value: stats.active,
              icon: ShieldCheck,
              accent: "from-emerald-500/15 via-emerald-500/5 to-transparent",
              border: "border-emerald-500/40",
            },
            {
              label: "Vencendo",
              value: stats.expiring,
              icon: CalendarDays,
              accent: "from-amber-500/20 via-amber-500/5 to-transparent",
              border: "border-amber-500/40",
            },
            {
              label: "Vencidos",
              value: stats.expired,
              icon: FileSignature,
              accent: "from-rose-500/20 via-rose-500/5 to-transparent",
              border: "border-rose-500/40",
            },
            {
              label: "Saldo",
              value: formatCurrency(supplementalVisible, "BRL"),
              icon: ShieldCheck,
              accent: "from-sky-500/20 via-sky-500/5 to-transparent",
              border: "border-sky-500/40",
            },
            {
              label: "Valor adjudicado",
              value: formatCurrency(stats.totalAdjudicatedActive, "BRL"),
              icon: FileSignature,
              accent: "from-indigo-500/20 via-indigo-500/5 to-transparent",
              border: "border-indigo-500/40",
            },
            {
              label: `Oneshot ${currentYear}`,
              value: formatCurrency(stats.oneshotCurrentYearTotal, "BRL"),
              icon: FileSignature,
              accent: "from-purple-500/20 via-purple-500/5 to-transparent",
              border: "border-purple-500/40",
            },
          ].map((card) => (
            <Card
              key={card.label}
              className={cn(
                "rounded-2xl border gap-0 py-0",
                isDark
                  ? `${card.border} bg-[#050816] text-zinc-100`
                  : `${card.border} bg-white text-slate-800`
              )}
            >
              <CardContent className="relative flex items-center justify-between gap-4 p-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    {card.label}
                  </p>
                  <p className="text-2xl font-semibold">{card.value}</p>
                  {card.label === "Vencendo" && (
                    <div className="mt-2 space-y-2 text-[11px] text-zinc-500">
                      <p>Considerando {expiringDays} dias</p>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setExpiringError(null);
                          setExpiringModalOpen(true);
                        }}
                      >
                        Ajustar janela
                      </Button>
                    </div>
                  )}
                  {card.label === "Saldo" && (
                    <div className="mt-2 space-y-2 text-[11px] text-zinc-500">
                      <p>Usado {formatCurrency(stats.supplementalUsedTotal, "BRL")}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSupplementalDescription("");
                            setSupplementalError(null);
                            setSupplementalModalOpen(true);
                          }}
                        >
                          Ajustar saldo
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setHistoryModalOpen(true)}
                        >
                          Ver histórico
                        </Button>
                      </div>
                      {supplementalError && (
                        <p className="text-[11px] text-rose-400">
                          {supplementalError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-full p-2",
                    isDark
                      ? "bg-white/5 text-purple-200"
                      : "bg-slate-100 text-purple-600"
                  )}
                >
                  <card.icon className="h-5 w-5" />
                </div>
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50",
                    card.accent
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </section>

        {error && (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isDark
                ? "border-rose-500/40 bg-rose-500/10 text-rose-100"
                : "border-rose-200 bg-rose-50 text-rose-700"
            )}
          >
            {error}
          </div>
        )}

        <section className="grid gap-4 lg:grid-cols-2">
          {filteredContracts.length === 0 ? (
            <Card
              className={cn(
                "border",
                isDark
                  ? "border-white/10 bg-[#050816] text-zinc-400"
                  : "border-slate-200 bg-white text-slate-500"
              )}
            >
              <CardContent className="flex flex-col gap-2 p-6 text-sm">
                <p>Nenhum contrato cadastrado ainda.</p>
                <p>Use o botão “Cadastrar contrato” para iniciar o controle.</p>
              </CardContent>
            </Card>
          ) : (
            filteredContracts.map((contract) => {
              const daysRemaining = getDaysRemaining(contract.end_date);
              const alertWindow = contract.alert_days ?? expiringDays;
              const deadlineLabel =
                daysRemaining === null
                  ? "Prazo indefinido"
                  : daysRemaining < 0
                  ? "Vencido"
                  : daysRemaining <= alertWindow
                  ? `Vence em ${daysRemaining} dias`
                  : `Em dia · ${daysRemaining} dias`;
              const statusLabel =
                statusOptions.find((option) => option.value === contract.status)?.label ??
                contract.status;
              const hasLpu = Boolean(contract.lpu) || Boolean(contract.lpu_image);
              const lpuExpanded = expandedLpuIds.has(contract.id);
              return (
                <Card
                  key={contract.id}
                  className={cn(
                    "border",
                    isDark
                      ? "border-white/10 bg-[#050816] text-zinc-100"
                      : "border-slate-200 bg-white text-slate-800"
                  )}
                >
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{contract.title}</p>
                        <p className="text-xs text-zinc-400">{contract.vendor}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-white/10 text-[11px]",
                          isDark ? "text-zinc-200" : "text-slate-700"
                        )}
                      >
                        {statusLabel}
                      </Badge>
                    </div>

                    <div className="grid gap-3 text-xs text-zinc-400 md:grid-cols-2">
                      <div>
                        <p className="uppercase tracking-[0.2em]">Responsável</p>
                        <p className="text-sm text-zinc-200">{contract.owner}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Segmento</p>
                        <p className="text-sm text-zinc-200">
                          {contract.segment ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Gerência</p>
                        <p className="text-sm text-zinc-200">
                          {contract.management ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Escopo</p>
                        <p className="text-sm text-zinc-200">
                          {contract.contract_scope ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Prazo</p>
                        <p
                          className={cn(
                            "text-sm",
                            daysRemaining !== null && daysRemaining < 0
                              ? "text-rose-300"
                              : daysRemaining !== null && daysRemaining <= alertWindow
                              ? "text-amber-300"
                              : "text-emerald-300"
                          )}
                        >
                          {deadlineLabel}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Ano contrato</p>
                        <p className="text-sm text-zinc-200">
                          {contract.contract_year ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Contrato SAP</p>
                        <p className="text-sm text-zinc-200">
                          {contract.sap_contract ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">LPU</p>
                        {hasLpu ? (
                          <div className="mt-1 space-y-2">
                            {lpuExpanded ? (
                              <>
                                {contract.lpu && (
                                  <p className="text-sm text-zinc-200">{contract.lpu}</p>
                                )}
                                {contract.lpu_image && (
                                  <img
                                    src={contract.lpu_image}
                                    alt="LPU"
                                    className="max-h-40 w-full rounded-xl border border-white/10 object-contain"
                                  />
                                )}
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleLpu(contract.id)}
                                >
                                  Ocultar
                                </Button>
                              </>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => toggleLpu(contract.id)}
                              >
                                Exibir LPU
                              </Button>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-zinc-200">—</p>
                        )}
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Vigência</p>
                        <p className="text-sm text-zinc-200">
                          {new Date(contract.start_date).toLocaleDateString("pt-BR")} ·{" "}
                          {new Date(contract.end_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Valor adjudicado</p>
                        <p className="text-sm text-zinc-200">
                          {formatCurrency(contract.value_amount, contract.value_currency)}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Saldo</p>
                        <p className="text-sm text-zinc-200">
                          {formatCurrency(contract.supplemental_used, "BRL")}
                        </p>
                      </div>
                    </div>

                    {contract.description && (
                      <p className="text-xs text-zinc-400">
                        {contract.description}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            router.push(
                              `/ferramentas/gestao-contratos/editar/${contract.id}`
                            )
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleDelete(contract.id)}
                          disabled={deletingId === contract.id}
                        >
                          {deletingId === contract.id ? "Removendo..." : "Excluir"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>
      </div>
      {portalTarget && supplementalModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div
                className={cn(
                  "w-full max-w-lg rounded-3xl border p-6",
                  isDark ? "border-white/10 bg-[#050816]" : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                      Saldo
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">Atualizar saldo</h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Informe o valor e a descrição da atualização.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setSupplementalModalOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <Input
                    value={supplementalInput}
                    onChange={(event) =>
                      setSupplementalInput(formatCurrencyInput(event.target.value))
                    }
                    placeholder="Valor do saldo (R$)"
                    className={cn(
                      "h-10 rounded-xl text-sm",
                      isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                    )}
                  />
                  <Textarea
                    value={supplementalDescription}
                    onChange={(event) => setSupplementalDescription(event.target.value)}
                    placeholder="Descreva o motivo da atualização *"
                    className={cn(
                      "min-h-[80px] rounded-xl text-sm",
                      isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                    )}
                  />
                  {supplementalError && (
                    <p className="text-xs text-rose-400">{supplementalError}</p>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setSupplementalModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      disabled={supplementalSaving}
                      onClick={async () => {
                        const value = parseCurrencyInput(supplementalInput);
                        if (!Number.isFinite(value) || value < 0) {
                          setSupplementalError("Informe um valor válido.");
                          return;
                        }
                        if (!supplementalDescription.trim()) {
                          setSupplementalError("Informe a descrição do ajuste.");
                          return;
                        }
                        setSupplementalSaving(true);
                        setSupplementalError(null);
                        try {
                          const response = await fetch("/api/contracts/settings", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              supplementalBalance: value,
                              supplementalDescription: supplementalDescription.trim(),
                            }),
                          });
                          const data = await response.json().catch(() => null);
                          if (!response.ok) {
                            throw new Error(data?.error || "Não foi possível salvar.");
                          }
                          const nextBalance =
                            typeof data?.supplementalBalance === "number"
                              ? data.supplementalBalance
                              : value ?? 0;
                          setSupplementalBalance(nextBalance);
                          setSupplementalInput(formatPlainCurrency(nextBalance));
                          if (Array.isArray(data?.supplementalHistory)) {
                            setSupplementalHistory(data.supplementalHistory);
                          }
                          setSupplementalDescription("");
                          setSupplementalModalOpen(false);
                        } catch (err) {
                          setSupplementalError(
                            err instanceof Error ? err.message : "Falha ao salvar saldo."
                          );
                        } finally {
                          setSupplementalSaving(false);
                        }
                      }}
                    >
                      {supplementalSaving ? "Salvando..." : "Salvar saldo"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>,
            portalTarget
          )
        : null}
      {portalTarget && historyModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div
                className={cn(
                  "w-full max-w-2xl rounded-3xl border p-6",
                  isDark ? "border-white/10 bg-[#050816]" : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                      Histórico do saldo
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      Ajustes do saldo
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Veja todas as alterações registradas.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setHistoryModalOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  {supplementalHistory.length === 0 ? (
                    <p className="text-zinc-400">Nenhuma atualização registrada.</p>
                  ) : (
                    supplementalHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className={cn(
                          "rounded-xl border px-3 py-3",
                          isDark
                            ? "border-white/10 bg-black/30 text-zinc-200"
                            : "border-slate-200 bg-white text-slate-700"
                        )}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold">
                            {formatCurrency(entry.amount, "BRL")}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {new Date(entry.created_at).toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <p className="mt-2 text-sm">{entry.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>,
            portalTarget
          )
        : null}
      {portalTarget && expiringModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div
                className={cn(
                  "w-full max-w-md rounded-3xl border p-6",
                  isDark ? "border-white/10 bg-[#050816]" : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-purple-400">
                      Janela de vencimento
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">Ajustar prazo</h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Defina em quantos dias um contrato entra em “Vencendo”.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setExpiringModalOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <Input
                    type="number"
                    min={1}
                    max={365}
                    value={expiringInput}
                    onChange={(event) => setExpiringInput(event.target.value)}
                    className={cn(
                      "h-10 rounded-xl text-sm",
                      isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                    )}
                  />
                  {expiringError && (
                    <p className="text-xs text-rose-400">{expiringError}</p>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setExpiringModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      disabled={expiringSaving}
                      onClick={async () => {
                        const value = Number(expiringInput);
                        if (!Number.isFinite(value) || value <= 0) {
                          setExpiringError("Informe um número válido em dias.");
                          return;
                        }
                        setExpiringSaving(true);
                        setExpiringError(null);
                        try {
                          const response = await fetch("/api/contracts/settings", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ expiringDays: value }),
                          });
                          const data = await response.json().catch(() => null);
                          if (!response.ok) {
                            throw new Error(data?.error || "Não foi possível salvar.");
                          }
                          setExpiringDays(data?.expiringDays ?? value);
                          setExpiringInput(String(data?.expiringDays ?? value));
                          setExpiringModalOpen(false);
                        } catch (err) {
                          setExpiringError(
                            err instanceof Error ? err.message : "Falha ao salvar prazo."
                          );
                        } finally {
                          setExpiringSaving(false);
                        }
                      }}
                    >
                      {expiringSaving ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>,
            portalTarget
          )
        : null}
    </DashboardShell>
  );
}
