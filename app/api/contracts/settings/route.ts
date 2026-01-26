import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getIntegrationSetting, setIntegrationSetting } from "@/lib/settings/integration-settings";
import { db } from "@/lib/auth/database";

function parseExpiringDays(value: string | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 30;
  return Math.min(365, Math.floor(parsed));
}

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }
  const raw = getIntegrationSetting("contracts_expiring_days");
  const rawBalance = getIntegrationSetting("contracts_supplemental_balance");
  const balance = rawBalance ? Number(rawBalance) : 0;
  const history = db
    .prepare(
      `SELECT id, amount, description, created_at
       FROM supplemental_balance_history
       ORDER BY created_at DESC`
    )
    .all();
  return NextResponse.json({
    expiringDays: parseExpiringDays(raw),
    supplementalBalance: Number.isFinite(balance) ? balance : 0,
    supplementalHistory: history,
  });
}

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Permissão insuficiente." }, { status: 403 });
  }
  const body = (await request.json().catch(() => null)) as
    | { expiringDays?: number; supplementalBalance?: number; supplementalDescription?: string }
    | null;
  const expiringDays = Number(body?.expiringDays);
  const supplementalBalance =
    typeof body?.supplementalBalance === "number" && Number.isFinite(body.supplementalBalance)
      ? Math.max(0, body.supplementalBalance)
      : undefined;
  const supplementalDescription =
    typeof body?.supplementalDescription === "string"
      ? body.supplementalDescription.trim()
      : "";

  if (typeof body?.expiringDays === "number") {
    if (!Number.isFinite(expiringDays) || expiringDays <= 0) {
      return NextResponse.json(
        { error: "Informe um prazo válido em dias." },
        { status: 400 }
      );
    }
    const normalized = Math.min(365, Math.floor(expiringDays));
    setIntegrationSetting("contracts_expiring_days", String(normalized));
  }

  if (typeof supplementalBalance === "number") {
    if (!supplementalDescription) {
      return NextResponse.json(
        { error: "Informe a descrição do saldo suplementar." },
        { status: 400 }
      );
    }
    setIntegrationSetting("contracts_supplemental_balance", String(supplementalBalance));
    db.prepare(
      `INSERT INTO supplemental_balance_history (amount, description)
       VALUES (?, ?)`
    ).run(supplementalBalance, supplementalDescription);
  }

  return NextResponse.json({
    expiringDays: parseExpiringDays(getIntegrationSetting("contracts_expiring_days")),
    supplementalBalance:
      typeof supplementalBalance === "number"
        ? supplementalBalance
        : Number(getIntegrationSetting("contracts_supplemental_balance") ?? 0),
    supplementalHistory: db
      .prepare(
        `SELECT id, amount, description, created_at
         FROM supplemental_balance_history
         ORDER BY created_at DESC`
      )
      .all(),
  });
}
