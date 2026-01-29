import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  updateDashboardWidget,
  deleteDashboardWidget,
} from "@/lib/dashboards/dashboard-widget-service";
import {
  upsertRegistryWidget,
  removeRegistryWidget,
} from "@/lib/dashboards/jql-registry";

type UpdatePayload = {
  name?: string;
  templateId?: string;
  config?: Record<string, unknown>;
};

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const { id } = await context.params;
  const widgetId = Number(id);
  if (!widgetId) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as UpdatePayload | null;
  if (!payload) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  try {
    const widget = updateDashboardWidget(widgetId, session.id, payload);
    const config = (payload.config ?? widget.config ?? {}) as {
      dashboardId?: string;
      jqlEntries?: Array<{ name: string; jql: string; color?: string }>;
    };
    const dashboardId = String(config.dashboardId ?? "default");
    const entries = Array.isArray(config.jqlEntries) ? config.jqlEntries : [];
    upsertRegistryWidget({
      userId: session.id,
      templateId: dashboardId,
      widgetId: widget.id,
      widgetName: payload.name ?? widget.name,
      templateType: payload.templateId ?? widget.templateId,
      entries,
    });
    return NextResponse.json({ widget });
  } catch (error) {
    console.error("[dashboard-widgets:PATCH]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao atualizar." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const { id } = await context.params;
  const widgetId = Number(id);
  if (!widgetId) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const removed = deleteDashboardWidget(widgetId, session.id);
    const templateId =
      new URL(request.url).searchParams.get("templateId") ?? "default";
    removeRegistryWidget({
      userId: session.id,
      templateId: String(templateId),
      widgetId,
    });
    if (!removed) {
      return NextResponse.json(
        { error: "Widget não encontrado." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[dashboard-widgets:DELETE]", error);
    return NextResponse.json(
      { error: "Não foi possível excluir o widget." },
      { status: 500 }
    );
  }
}
