"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  getPlaybookById,
  updatePlaybook,
  deletePlaybook,
} from "@/lib/playbooks/playbook-service";

type ParamsPromise = Promise<{ id: string }>;

export async function GET(
  request: Request,
  { params }: { params: ParamsPromise }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const playbook = getPlaybookById(id);
  if (!playbook) {
    return NextResponse.json({ error: "Playbook não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ playbook });
}

type UpdatePayload = {
  name?: string;
  description?: string;
  squads?: string[];
  automations?: string[];
  status?: string;
  lastRun?: string;
  steps?: { title: string; detail: string }[];
  scriptPath?: string;
};

export async function PATCH(
  request: Request,
  { params }: { params: ParamsPromise }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as UpdatePayload | null;
  if (!payload) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  try {
    const playbook = updatePlaybook(id, {
      name: payload.name,
      description: payload.description,
      squads: payload.squads,
      automations: payload.automations,
      status: payload.status,
      lastRun: payload.lastRun,
      steps: payload.steps,
      scriptPath: payload.scriptPath,
    });
    return NextResponse.json({ playbook });
  } catch (error) {
    console.error("[playbooks:PATCH]", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o playbook." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: ParamsPromise }
) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Apenas administradores podem excluir playbooks." }, { status: 403 });
  }

  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const removed = deletePlaybook(id);
    if (!removed) {
      return NextResponse.json({ error: "Playbook não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[playbooks:DELETE]", error);
    return NextResponse.json(
      { error: "Não foi possível remover o playbook." },
      { status: 500 }
    );
  }
}
