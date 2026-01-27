import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createContract,
  deleteContract,
  getContractById,
  listContracts,
  updateContract,
} from "@/lib/contracts/contract-service";
import { getIntegrationSetting } from "@/lib/settings/integration-settings";

type ContractPayload = {
  id?: number;
  title?: string;
  vendor?: string;
  owner?: string;
  area?: string | null;
  lpu?: string | null;
  lpuImage?: string | null;
  contractType?: string | null;
  segment?: string | null;
  sapContract?: string | null;
  contractYear?: string | null;
  contractScope?: string | null;
  management?: string | null;
  paymentType?: string | null;
  paymentSchedule?: Array<{
    year?: string | null;
    valueAmount?: string | number | null;
    supplementalUsed?: string | number | null;
  }> | null;
  supplementalUsed?: number | null;
  status?: string;
  startDate?: string;
  endDate?: string;
  alertDays?: number | null;
  valueAmount?: number | null;
  valueCurrency?: string | null;
  description?: string | null;
  notes?: string | null;
};

const STATUS_OPTIONS = new Set(["ativo", "em_negociacao", "suspenso", "encerrado"]);
const PAYMENT_TYPE_OPTIONS = new Set(["oneshot", "oneshot_anual", "mensal"]);

function sanitizeStatus(value?: string) {
  if (value && STATUS_OPTIONS.has(value)) return value;
  return "ativo";
}

function sanitizePaymentType(value?: string | null) {
  if (value && PAYMENT_TYPE_OPTIONS.has(value)) return value;
  return "oneshot";
}

function parseLocaleNumber(value?: string | number | null) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
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

function normalizePaymentSchedule(
  schedule?: ContractPayload["paymentSchedule"] | null
) {
  if (!Array.isArray(schedule)) return [];
  return schedule
    .map((entry) => {
      const year = typeof entry?.year === "string" ? entry.year.trim() : "";
      if (!year) return null;
      const valueAmount = parseLocaleNumber(entry.valueAmount ?? null);
      const supplementalUsed = parseLocaleNumber(entry.supplementalUsed ?? null);
      return {
        year,
        valueAmount: Number.isFinite(valueAmount ?? NaN) ? valueAmount : null,
        supplementalUsed: Number.isFinite(supplementalUsed ?? NaN) ? supplementalUsed : null,
      };
    })
    .filter(Boolean) as Array<{
    year: string;
    valueAmount: number | null;
    supplementalUsed: number | null;
  }>;
}

function sumScheduleValues(
  schedule: Array<{ valueAmount: number | null; supplementalUsed: number | null }>
) {
  return schedule.reduce(
    (acc, entry) => {
      if (typeof entry.valueAmount === "number") {
        acc.valueAmount += entry.valueAmount;
      }
      if (typeof entry.supplementalUsed === "number") {
        acc.supplementalUsed += entry.supplementalUsed;
      }
      return acc;
    },
    { valueAmount: 0, supplementalUsed: 0 }
  );
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    return NextResponse.json({ contracts: listContracts() });
  } catch (error) {
    console.error("[contracts:GET]", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os contratos." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as ContractPayload | null;
  if (!payload) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const vendor = typeof payload.vendor === "string" ? payload.vendor.trim() : "";
  const owner = typeof payload.owner === "string" ? payload.owner.trim() : "";
  const startDate =
    typeof payload.startDate === "string" ? payload.startDate.trim() : "";
  const endDate = typeof payload.endDate === "string" ? payload.endDate.trim() : "";
  const description =
    typeof payload.description === "string" ? payload.description.trim() : "";
  const area = typeof payload.area === "string" ? payload.area.trim() : "";
  const lpu = typeof payload.lpu === "string" ? payload.lpu.trim() : "";
  const lpuImage =
    typeof payload.lpuImage === "string" && payload.lpuImage.trim()
      ? payload.lpuImage.trim()
      : null;
  const contractType =
    typeof payload.contractType === "string" ? payload.contractType.trim() : "";
  const segment = typeof payload.segment === "string" ? payload.segment.trim() : "";
  const sapContract =
    typeof payload.sapContract === "string" ? payload.sapContract.trim() : "";
  const contractYear =
    typeof payload.contractYear === "string" ? payload.contractYear.trim() : "";
  const contractScope =
    typeof payload.contractScope === "string" ? payload.contractScope.trim() : "";
  const management =
    typeof payload.management === "string" ? payload.management.trim() : "";
  const paymentType = sanitizePaymentType(payload.paymentType);
  const paymentSchedule = normalizePaymentSchedule(payload.paymentSchedule);
  const supplementalUsedRaw = parseLocaleNumber(payload.supplementalUsed ?? null);
  const supplementalUsed =
    typeof supplementalUsedRaw === "number" ? Math.max(0, supplementalUsedRaw) : null;
  const status = sanitizeStatus(payload.status);
  const alertDays =
    typeof payload.alertDays === "number" && Number.isFinite(payload.alertDays)
      ? Math.max(0, Math.round(payload.alertDays))
      : 30;
  const valueAmount = parseLocaleNumber(payload.valueAmount ?? null);
  const valueCurrency =
    typeof payload.valueCurrency === "string" ? payload.valueCurrency.trim() : "";
  const notes = typeof payload.notes === "string" ? payload.notes.trim() : "";
  const scheduleTotals = sumScheduleValues(paymentSchedule);
  const effectiveValueAmount =
    paymentType === "oneshot" ? valueAmount : scheduleTotals.valueAmount;
  const effectiveSupplementalUsed =
    paymentType === "oneshot" ? supplementalUsed : scheduleTotals.supplementalUsed;
  const paymentScheduleJson =
    paymentType === "oneshot" ? null : JSON.stringify(paymentSchedule);

  if (!title || !vendor || !owner || !startDate || !endDate || !description) {
    const missing = [
      !title ? "Objeto do contrato" : null,
      !vendor ? "Fornecedor" : null,
      !owner ? "Responsável" : null,
      !startDate ? "Início" : null,
      !endDate ? "Fim" : null,
      !description ? "Descrição do contrato" : null,
    ].filter(Boolean);
    return NextResponse.json(
      {
        error: `Preencha os campos obrigatórios: ${missing.join(", ")}.`,
      },
      { status: 400 }
    );
  }

  if (paymentType !== "oneshot" && paymentSchedule.length === 0) {
    return NextResponse.json(
      { error: "Informe os valores anuais do contrato para este tipo de pagamento." },
      { status: 400 }
    );
  }
  if (
    paymentType !== "oneshot" &&
    paymentSchedule.some((entry) => typeof entry.valueAmount !== "number")
  ) {
    return NextResponse.json(
      { error: "Informe o valor adjudicado para todos os anos selecionados." },
      { status: 400 }
    );
  }
  if (
    paymentType !== "oneshot" &&
    paymentSchedule.some((entry) => typeof entry.valueAmount !== "number")
  ) {
    return NextResponse.json(
      { error: "Informe o valor adjudicado para todos os anos selecionados." },
      { status: 400 }
    );
  }

  if (effectiveSupplementalUsed !== null) {
    const balanceRaw = getIntegrationSetting("contracts_supplemental_balance");
    const balance = balanceRaw ? Number(balanceRaw) : 0;
    const totalUsed = listContracts().reduce((acc, contract) => {
      if (typeof contract.supplemental_used === "number") {
        return acc + contract.supplemental_used;
      }
      return acc;
    }, 0);
    const available = Math.max(0, (Number.isFinite(balance) ? balance : 0) - totalUsed);
    if (effectiveSupplementalUsed > available) {
      return NextResponse.json(
        {
          error:
            "Saldo suplementar insuficiente para este contrato. Ajuste o valor ou o saldo disponível.",
        },
        { status: 400 }
      );
    }
  }

  try {
    const record = createContract({
      title,
      vendor,
      owner,
      area: area || null,
      lpu: lpu || null,
      lpuImage,
      contractType: contractType || null,
      segment: segment || null,
      sapContract: sapContract || null,
      contractYear: contractYear || null,
      contractScope: contractScope || null,
      management: management || null,
      paymentType,
      paymentScheduleJson,
      supplementalUsed: effectiveSupplementalUsed,
      status,
      startDate,
      endDate,
      alertDays,
      valueAmount: effectiveValueAmount,
      valueCurrency: valueCurrency || null,
      description,
      notes: notes || null,
    });
    return NextResponse.json({ contract: record }, { status: 201 });
  } catch (error) {
    console.error("[contracts:POST]", error);
    return NextResponse.json(
      { error: "Não foi possível cadastrar o contrato." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as ContractPayload | null;
  if (!payload) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const id = Number(payload.id ?? 0);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Contrato inválido." }, { status: 400 });
  }

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const vendor = typeof payload.vendor === "string" ? payload.vendor.trim() : "";
  const owner = typeof payload.owner === "string" ? payload.owner.trim() : "";
  const startDate =
    typeof payload.startDate === "string" ? payload.startDate.trim() : "";
  const endDate = typeof payload.endDate === "string" ? payload.endDate.trim() : "";
  const description =
    typeof payload.description === "string" ? payload.description.trim() : "";
  const area = typeof payload.area === "string" ? payload.area.trim() : "";
  const lpu = typeof payload.lpu === "string" ? payload.lpu.trim() : "";
  const lpuImage =
    typeof payload.lpuImage === "string" && payload.lpuImage.trim()
      ? payload.lpuImage.trim()
      : null;
  const contractType =
    typeof payload.contractType === "string" ? payload.contractType.trim() : "";
  const segment = typeof payload.segment === "string" ? payload.segment.trim() : "";
  const sapContract =
    typeof payload.sapContract === "string" ? payload.sapContract.trim() : "";
  const contractYear =
    typeof payload.contractYear === "string" ? payload.contractYear.trim() : "";
  const contractScope =
    typeof payload.contractScope === "string" ? payload.contractScope.trim() : "";
  const management =
    typeof payload.management === "string" ? payload.management.trim() : "";
  const paymentType = sanitizePaymentType(payload.paymentType);
  const paymentSchedule = normalizePaymentSchedule(payload.paymentSchedule);
  const supplementalUsedRaw = parseLocaleNumber(payload.supplementalUsed ?? null);
  const supplementalUsed =
    typeof supplementalUsedRaw === "number" ? Math.max(0, supplementalUsedRaw) : null;
  const status = sanitizeStatus(payload.status);
  const alertDays =
    typeof payload.alertDays === "number" && Number.isFinite(payload.alertDays)
      ? Math.max(0, Math.round(payload.alertDays))
      : 30;
  const valueAmount = parseLocaleNumber(payload.valueAmount ?? null);
  const valueCurrency =
    typeof payload.valueCurrency === "string" ? payload.valueCurrency.trim() : "";
  const notes = typeof payload.notes === "string" ? payload.notes.trim() : "";
  const scheduleTotals = sumScheduleValues(paymentSchedule);
  const effectiveValueAmount =
    paymentType === "oneshot" ? valueAmount : scheduleTotals.valueAmount;
  const effectiveSupplementalUsed =
    paymentType === "oneshot" ? supplementalUsed : scheduleTotals.supplementalUsed;
  const paymentScheduleJson =
    paymentType === "oneshot" ? null : JSON.stringify(paymentSchedule);

  if (!title || !vendor || !owner || !startDate || !endDate || !description) {
    const missing = [
      !title ? "Objeto do contrato" : null,
      !vendor ? "Fornecedor" : null,
      !owner ? "Responsável" : null,
      !startDate ? "Início" : null,
      !endDate ? "Fim" : null,
      !description ? "Descrição do contrato" : null,
    ].filter(Boolean);
    return NextResponse.json(
      {
        error: `Preencha os campos obrigatórios: ${missing.join(", ")}.`,
      },
      { status: 400 }
    );
  }

  if (paymentType !== "oneshot" && paymentSchedule.length === 0) {
    return NextResponse.json(
      { error: "Informe os valores anuais do contrato para este tipo de pagamento." },
      { status: 400 }
    );
  }

  if (effectiveSupplementalUsed !== null) {
    const balanceRaw = getIntegrationSetting("contracts_supplemental_balance");
    const balance = balanceRaw ? Number(balanceRaw) : 0;
    const existing = getContractById(id);
    const currentUsed =
      typeof existing?.supplemental_used === "number" ? existing.supplemental_used : 0;
    const totalUsed = listContracts().reduce((acc, contract) => {
      if (typeof contract.supplemental_used === "number") {
        return acc + contract.supplemental_used;
      }
      return acc;
    }, 0);
    const adjustedTotal = Math.max(0, totalUsed - currentUsed);
    const available = Math.max(0, (Number.isFinite(balance) ? balance : 0) - adjustedTotal);
    if (effectiveSupplementalUsed > available) {
      return NextResponse.json(
        {
          error:
            "Saldo suplementar insuficiente para este contrato. Ajuste o valor ou o saldo disponível.",
        },
        { status: 400 }
      );
    }
  }

  try {
    const record = updateContract({
      id,
      title,
      vendor,
      owner,
      area: area || null,
      lpu: lpu || null,
      lpuImage,
      contractType: contractType || null,
      segment: segment || null,
      sapContract: sapContract || null,
      contractYear: contractYear || null,
      contractScope: contractScope || null,
      management: management || null,
      paymentType,
      paymentScheduleJson,
      supplementalUsed: effectiveSupplementalUsed,
      status,
      startDate,
      endDate,
      alertDays,
      valueAmount: effectiveValueAmount,
      valueCurrency: valueCurrency || null,
      description,
      notes: notes || null,
    });

    if (!record) {
      return NextResponse.json({ error: "Contrato não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ contract: record });
  } catch (error) {
    console.error("[contracts:PATCH]", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o contrato." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { id?: number } | null;
  const id = Number(payload?.id ?? 0);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Contrato inválido." }, { status: 400 });
  }

  try {
    const removed = deleteContract(id);
    if (!removed) {
      return NextResponse.json({ error: "Contrato não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contracts:DELETE]", error);
    return NextResponse.json(
      { error: "Não foi possível remover o contrato." },
      { status: 500 }
    );
  }
}
