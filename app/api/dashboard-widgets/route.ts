import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createDashboardWidget,
  listDashboardWidgetsByUser,
} from "@/lib/dashboards/dashboard-widget-service";
import { writeDashboardJqlRegistry } from "@/lib/dashboards/jql-registry";

type CreatePayload = {
  name?: string;
  templateId?: string;
  config?: Record<string, unknown>;
};

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  try {
    const widgets = listDashboardWidgetsByUser(session.id);
    return NextResponse.json({ widgets });
  } catch (error) {
    console.error("[dashboard-widgets:GET]", error);
    return NextResponse.json(
      { error: "Não foi possível carregar widgets." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as CreatePayload | null;
  if (!payload?.name || !payload?.templateId) {
    return NextResponse.json(
      { error: "Informe nome e tipo do widget." },
      { status: 400 }
    );
  }

  try {
    const widget = createDashboardWidget({
      userId: session.id,
      name: payload.name,
      templateId: payload.templateId,
      config: payload.config ?? {},
    });
    writeDashboardJqlRegistry();
    return NextResponse.json({ widget }, { status: 201 });
  } catch (error) {
    console.error("[dashboard-widgets:POST]", error);
    return NextResponse.json(
      { error: "Não foi possível criar widget." },
      { status: 500 }
    );
  }
}
