"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createDashboardTemplate,
  listDashboardTemplates,
} from "@/lib/dashboards/dashboard-service";
import { upsertRegistryTemplate } from "@/lib/dashboards/jql-registry";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }
  return NextResponse.json({ dashboards: listDashboardTemplates() });
}

type CreatePayload = {
  name?: string;
  config?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as CreatePayload | null;
  if (!body?.name) {
    return NextResponse.json(
      { error: "Informe o nome do template." },
      { status: 400 }
    );
  }

  try {
    const dashboard = createDashboardTemplate({
      name: body.name,
      config: body.config,
    });
    upsertRegistryTemplate({
      userId: session.id,
      templateId: String(dashboard.id),
      name: dashboard.name,
    });
    return NextResponse.json({ dashboard }, { status: 201 });
  } catch (error) {
    console.error("[dashboards:POST]", error);
    return NextResponse.json(
      { error: "Falha ao criar template." },
      { status: 500 }
    );
  }
}
