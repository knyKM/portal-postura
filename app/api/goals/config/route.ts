import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getIntegrationSetting, setIntegrationSetting } from "@/lib/settings/integration-settings";

const CONFIG_KEY = "goals_risk_config";

function parseConfig(value: string | null) {
  if (!value) {
    return { riskDaysThreshold: 14, riskMinProgressPercent: 60 };
  }
  try {
    const parsed = JSON.parse(value) as {
      riskDaysThreshold?: number;
      riskMinProgressPercent?: number;
    };
    return {
      riskDaysThreshold:
        Number.isFinite(parsed?.riskDaysThreshold) && parsed.riskDaysThreshold
          ? parsed.riskDaysThreshold
          : 14,
      riskMinProgressPercent:
        Number.isFinite(parsed?.riskMinProgressPercent) ||
        parsed?.riskMinProgressPercent === 0
          ? parsed.riskMinProgressPercent
          : 60,
    };
  } catch {
    return { riskDaysThreshold: 14, riskMinProgressPercent: 60 };
  }
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const value = getIntegrationSetting(CONFIG_KEY);
  return NextResponse.json({ config: parseConfig(value) });
}

export async function PATCH(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as {
    riskDaysThreshold?: number;
    riskMinProgressPercent?: number;
  } | null;

  if (!payload) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const days = Number(payload.riskDaysThreshold);
  const minProgress = Number(payload.riskMinProgressPercent);
  if (!Number.isFinite(days) || days <= 0) {
    return NextResponse.json(
      { error: "Informe dias válidos para a ameaça." },
      { status: 400 }
    );
  }
  if (!Number.isFinite(minProgress) || minProgress < 0 || minProgress > 100) {
    return NextResponse.json(
      { error: "Informe percentual válido para a ameaça." },
      { status: 400 }
    );
  }

  const nextValue = JSON.stringify({
    riskDaysThreshold: days,
    riskMinProgressPercent: minProgress,
  });
  setIntegrationSetting(CONFIG_KEY, nextValue);

  return NextResponse.json({
    config: { riskDaysThreshold: days, riskMinProgressPercent: minProgress },
  });
}
