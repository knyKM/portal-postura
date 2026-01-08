"use server";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { updateDashboardTemplate } from "@/lib/dashboards/dashboard-service";

type ParamsPromise = Promise<{ id: string }>;

type UpdatePayload = {
  name?: string;
  config?: Record<string, unknown>;
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
    const dashboard = updateDashboardTemplate(id, {
      name: payload.name,
      config: payload.config,
    });
    return NextResponse.json({ dashboard });
  } catch (error) {
    console.error("[dashboards:PATCH]", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o template." },
      { status: 500 }
    );
  }
}
