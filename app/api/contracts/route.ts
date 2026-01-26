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
  contractType?: string | null;
  segment?: string | null;
  sapContract?: string | null;
  contractYear?: string | null;
  contractScope?: string | null;
  management?: string | null;
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

function sanitizeStatus(value?: string) {
  if (value && STATUS_OPTIONS.has(value)) return value;
  return "ativo";
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

  if (!title || !vendor || !owner || !startDate || !endDate || !description) {
    return NextResponse.json(
      { error: "Preencha todos os campos obrigatórios do contrato." },
      { status: 400 }
    );
  }

  if (supplementalUsed !== null) {
    const balanceRaw = getIntegrationSetting("contracts_supplemental_balance");
    const balance = balanceRaw ? Number(balanceRaw) : 0;
    const totalUsed = listContracts().reduce((acc, contract) => {
      if (typeof contract.supplemental_used === "number") {
        return acc + contract.supplemental_used;
      }
      return acc;
    }, 0);
    const available = Math.max(0, (Number.isFinite(balance) ? balance : 0) - totalUsed);
    if (supplementalUsed > available) {
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
      contractType: contractType || null,
      segment: segment || null,
      sapContract: sapContract || null,
      contractYear: contractYear || null,
      contractScope: contractScope || null,
      management: management || null,
      supplementalUsed,
      status,
      startDate,
      endDate,
      alertDays,
      valueAmount,
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

  if (!title || !vendor || !owner || !startDate || !endDate || !description) {
    return NextResponse.json(
      { error: "Preencha todos os campos obrigatórios do contrato." },
      { status: 400 }
    );
  }

  if (supplementalUsed !== null) {
    const balanceRaw = getIntegrationSetting("contracts_supplemental_balance");
    const balance = balanceRaw ? Number(balanceRaw) : 0;
    const existing = getContractById(id);
    const currentUsed = typeof existing?.supplemental_used === "number" ? existing.supplemental_used : 0;
    const totalUsed = listContracts().reduce((acc, contract) => {
      if (typeof contract.supplemental_used === "number") {
        return acc + contract.supplemental_used;
      }
      return acc;
    }, 0);
    const adjustedTotal = Math.max(0, totalUsed - currentUsed);
    const available = Math.max(0, (Number.isFinite(balance) ? balance : 0) - adjustedTotal);
    if (supplementalUsed > available) {
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
      contractType: contractType || null,
      segment: segment || null,
      sapContract: sapContract || null,
      contractYear: contractYear || null,
      contractScope: contractScope || null,
      management: management || null,
      supplementalUsed,
      status,
      startDate,
      endDate,
      alertDays,
      valueAmount,
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
