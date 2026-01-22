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
  contract_type: string | null;
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

const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "em_negociacao", label: "Em negociação" },
  { value: "suspenso", label: "Suspenso" },
  { value: "encerrado", label: "Encerrado" },
];

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
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} ${code}`.trim();
  }
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
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expiringDays, setExpiringDays] = useState(30);
  const [expiringInput, setExpiringInput] = useState("30");
  const [expiringSaving, setExpiringSaving] = useState(false);
  const [expiringError, setExpiringError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [vendor, setVendor] = useState("");
  const [owner, setOwner] = useState("");
  const [area, setArea] = useState("");
  const [contractType, setContractType] = useState("");
  const [status, setStatus] = useState("ativo");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [alertDays, setAlertDays] = useState("30");
  const [valueAmount, setValueAmount] = useState("");
  const [valueCurrency, setValueCurrency] = useState("BRL");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const portalTarget = typeof document !== "undefined" ? document.body : null;

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

  useEffect(() => {
    if (loading) return;
    fetch("/api/contracts/settings")
      .then((res) => res.json().catch(() => null))
      .then((data) => {
        if (typeof data?.expiringDays === "number") {
          setExpiringDays(data.expiringDays);
          setExpiringInput(String(data.expiringDays));
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
        contract.area,
        contract.contract_type,
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
    let active = 0;
    let expiring = 0;
    let expired = 0;
    contracts.forEach((contract) => {
      const daysRemaining = getDaysRemaining(contract.end_date);
      if (contract.status === "encerrado") return;
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
    return { active, expiring, expired };
  }, [contracts, expiringDays]);

  function resetForm() {
    setTitle("");
    setVendor("");
    setOwner("");
    setArea("");
    setContractType("");
    setStatus("ativo");
    setStartDate("");
    setEndDate("");
    setAlertDays("30");
    setValueAmount("");
    setValueCurrency("BRL");
    setDescription("");
    setNotes("");
  }

  function openNewModal() {
    resetForm();
    setEditingId(null);
    setModalOpen(true);
  }

  function openEditModal(contract: Contract) {
    setTitle(contract.title);
    setVendor(contract.vendor);
    setOwner(contract.owner);
    setArea(contract.area ?? "");
    setContractType(contract.contract_type ?? "");
    setStatus(contract.status);
    setStartDate(contract.start_date);
    setEndDate(contract.end_date);
    setAlertDays(String(contract.alert_days ?? 30));
    setValueAmount(contract.value_amount?.toString() ?? "");
    setValueCurrency(contract.value_currency ?? "BRL");
    setDescription(contract.description ?? "");
    setNotes(contract.notes ?? "");
    setEditingId(contract.id);
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const payload = {
      id: editingId ?? undefined,
      title,
      vendor,
      owner,
      area,
      contractType,
      status,
      startDate,
      endDate,
      alertDays: Number(alertDays),
      valueAmount: valueAmount ? Number(valueAmount) : null,
      valueCurrency,
      description,
      notes,
    };

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
      const updated = editingId ? data?.contract : data?.contract;
      setContracts((prev) => {
        if (editingId) {
          return prev.map((item) => (item.id === editingId ? updated : item));
        }
        return [updated, ...prev];
      });
      setModalOpen(false);
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
                onClick={openNewModal}
              >
                Cadastrar contrato
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
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
                    <p className="text-[11px] text-zinc-500">
                      Considerando {expiringDays} dias
                    </p>
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

        <section
          className={cn(
            "flex flex-col items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-xs md:flex-row md:items-center",
            isDark
              ? "border-white/10 bg-black/30 text-zinc-300"
              : "border-slate-200 bg-slate-50 text-slate-700"
          )}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Janela de vencimento
            </p>
            <p className="mt-1 text-sm">
              Ajuste o prazo em dias para considerar contratos como “vencendo”.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="number"
              min={1}
              max={365}
              value={expiringInput}
              onChange={(event) => setExpiringInput(event.target.value)}
              className={cn(
                "h-9 w-24 rounded-xl text-sm",
                isDark
                  ? "border-white/10 bg-black/40 text-white"
                  : "border-slate-200 bg-white"
              )}
            />
            <Button
              type="button"
              variant="secondary"
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
                } catch (err) {
                  setExpiringError(
                    err instanceof Error ? err.message : "Falha ao salvar prazo."
                  );
                } finally {
                  setExpiringSaving(false);
                }
              }}
            >
              {expiringSaving ? "Salvando..." : "Salvar prazo"}
            </Button>
          </div>
          {expiringError && (
            <p className="text-xs text-rose-400">{expiringError}</p>
          )}
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
                        <p className="uppercase tracking-[0.2em]">Vigência</p>
                        <p className="text-sm text-zinc-200">
                          {new Date(contract.start_date).toLocaleDateString("pt-BR")} ·{" "}
                          {new Date(contract.end_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Valor</p>
                        <p className="text-sm text-zinc-200">
                          {formatCurrency(contract.value_amount, contract.value_currency)}
                        </p>
                      </div>
                    </div>

                    {contract.description && (
                      <p className="text-xs text-zinc-400">
                        {contract.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="text-zinc-500">
                        {contract.area ? `Área: ${contract.area}` : "Área não informada"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => openEditModal(contract)}
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

      {portalTarget && modalOpen
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
                      {editingId ? "Editar contrato" : "Novo contrato"}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {editingId ? "Atualize as informações" : "Cadastrar contrato"}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Campos com * são obrigatórios.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>

                <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Título do contrato *"
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
                  <Input
                    value={owner}
                    onChange={(event) => setOwner(event.target.value)}
                    placeholder="Responsável *"
                    required
                    className={cn(
                      "h-10 rounded-xl text-sm",
                      isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                    )}
                  />
                  <Input
                    value={area}
                    onChange={(event) => setArea(event.target.value)}
                    placeholder="Área responsável"
                    className={cn(
                      "h-10 rounded-xl text-sm",
                      isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                    )}
                  />
                  <Input
                    value={contractType}
                    onChange={(event) => setContractType(event.target.value)}
                    placeholder="Tipo de contrato"
                    className={cn(
                      "h-10 rounded-xl text-sm",
                      isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                    )}
                  />
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
                  <Input
                    value={valueAmount}
                    onChange={(event) => setValueAmount(event.target.value)}
                    placeholder="Valor contratado"
                    className={cn(
                      "h-10 rounded-xl text-sm",
                      isDark ? "border-white/10 bg-black/40 text-white" : "border-slate-200"
                    )}
                  />
                  <Input
                    value={valueCurrency}
                    onChange={(event) => setValueCurrency(event.target.value)}
                    placeholder="Moeda"
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
                      onClick={() => setModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving
                        ? "Salvando..."
                        : editingId
                        ? "Salvar alterações"
                        : "Cadastrar contrato"}
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
