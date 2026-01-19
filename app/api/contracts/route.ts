import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createContract,
  deleteContract,
  listContracts,
  updateContract,
} from "@/lib/contracts/contract-service";

type ContractPayload = {
  id?: number;
  title?: string;
  vendor?: string;
  owner?: string;
  area?: string | null;
  contractType?: string | null;
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
  const contractType =
    typeof payload.contractType === "string" ? payload.contractType.trim() : "";
  const status = sanitizeStatus(payload.status);
  const alertDays =
    typeof payload.alertDays === "number" && Number.isFinite(payload.alertDays)
      ? Math.max(0, Math.round(payload.alertDays))
      : 30;
  const valueAmount =
    typeof payload.valueAmount === "number" && Number.isFinite(payload.valueAmount)
      ? payload.valueAmount
      : null;
  const valueCurrency =
    typeof payload.valueCurrency === "string" ? payload.valueCurrency.trim() : "";
  const notes = typeof payload.notes === "string" ? payload.notes.trim() : "";

  if (!title || !vendor || !owner || !startDate || !endDate || !description) {
    return NextResponse.json(
      { error: "Preencha todos os campos obrigatórios do contrato." },
      { status: 400 }
    );
  }

  try {
    const record = createContract({
      title,
      vendor,
      owner,
      area: area || null,
      contractType: contractType || null,
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
  const contractType =
    typeof payload.contractType === "string" ? payload.contractType.trim() : "";
  const status = sanitizeStatus(payload.status);
  const alertDays =
    typeof payload.alertDays === "number" && Number.isFinite(payload.alertDays)
      ? Math.max(0, Math.round(payload.alertDays))
      : 30;
  const valueAmount =
    typeof payload.valueAmount === "number" && Number.isFinite(payload.valueAmount)
      ? payload.valueAmount
      : null;
  const valueCurrency =
    typeof payload.valueCurrency === "string" ? payload.valueCurrency.trim() : "";
  const notes = typeof payload.notes === "string" ? payload.notes.trim() : "";

  if (!title || !vendor || !owner || !startDate || !endDate || !description) {
    return NextResponse.json(
      { error: "Preencha todos os campos obrigatórios do contrato." },
      { status: 400 }
    );
  }

  try {
    const record = updateContract({
      id,
      title,
      vendor,
      owner,
      area: area || null,
      contractType: contractType || null,
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
