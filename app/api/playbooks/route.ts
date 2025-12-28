"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  listPlaybooks,
  createPlaybook,
} from "@/lib/playbooks/playbook-service";

function serialize(playbook: ReturnType<typeof listPlaybooks>[number]) {
  return playbook;
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }
  return NextResponse.json({ playbooks: listPlaybooks() });
}

type CreatePayload = {
  name?: string;
  description?: string;
  squads?: string[];
  automations?: string[];
  status?: string;
  lastRun?: string;
  steps?: { title: string; detail: string }[];
  scriptPath?: string;
};

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as CreatePayload | null;
  if (!body?.name || !body.squads || !body.automations) {
    return NextResponse.json(
      { error: "Informe nome, squads e automations." },
      { status: 400 }
    );
  }

  try {
    const playbook = createPlaybook({
      name: body.name,
      description: body.description,
      squads: body.squads,
      automations: body.automations,
      status: body.status,
      lastRun: body.lastRun,
      steps: body.steps,
      scriptPath: body.scriptPath,
    });
    return NextResponse.json({ playbook: serialize(playbook) }, { status: 201 });
  } catch (error) {
    console.error("[playbooks:POST]", error);
    return NextResponse.json(
      { error: "Falha ao criar playbook." },
      { status: 500 }
    );
  }
}
