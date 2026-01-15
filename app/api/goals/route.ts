import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import {
  createGoal,
  createGoalUpdate,
  listGoals,
  listGoalUpdates,
} from "@/lib/goals/goals-service";

export async function GET(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    return NextResponse.json({
      goals: listGoals(),
      updates: listGoalUpdates(),
    });
  } catch (error) {
    console.error("[goals:GET]", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as metas." },
      { status: 500 }
    );
  }
}

type GoalPayload = {
  name?: string;
  front?: string;
  owner?: string;
  description?: string;
  targetType?: "percent" | "value";
  targetValue?: number;
  targetUnit?: string;
};

type UpdatePayload = {
  goalId?: number;
  progressType?: "percent" | "value";
  progressValue?: number;
  progressUnit?: string;
  note?: string;
  progressDate?: string;
};

export async function POST(request: Request) {
  const session = await getSessionUser(request.headers.get("cookie") ?? undefined);
  if (!session) {
    return NextResponse.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | GoalPayload
    | UpdatePayload
    | null;

  if (payload && "goalId" in payload) {
    const goalId = Number(payload.goalId);
    if (!Number.isInteger(goalId) || goalId <= 0) {
      return NextResponse.json({ error: "Meta inválida." }, { status: 400 });
    }
    const progressType =
      payload.progressType === "value" ? "value" : "percent";
    const progressValue = Number(payload.progressValue ?? 0);
    const progressDate =
      typeof payload.progressDate === "string" && payload.progressDate
        ? payload.progressDate
        : new Date().toISOString();

    const record = createGoalUpdate({
      goalId,
      progressType,
      progressValue,
      progressUnit: payload.progressUnit ?? null,
      note: payload.note ?? null,
      progressDate,
    });

    if (!record) {
      return NextResponse.json({ error: "Meta não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ update: record }, { status: 201 });
  }

  if (!payload) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const front = typeof payload.front === "string" ? payload.front.trim() : "";
  const owner = typeof payload.owner === "string" ? payload.owner.trim() : "";
  const description =
    typeof payload.description === "string" ? payload.description.trim() : "";
  const targetType = payload.targetType === "value" ? "value" : "percent";
  const targetValue = Number(payload.targetValue ?? (targetType === "percent" ? 100 : 0));
  const targetUnit =
    typeof payload.targetUnit === "string" ? payload.targetUnit.trim() : "";

  if (!name || !front || !owner) {
    return NextResponse.json(
      { error: "Preencha nome, frente responsável e owner." },
      { status: 400 }
    );
  }

  if (!Number.isFinite(targetValue) || targetValue < 0) {
    return NextResponse.json(
      { error: "Informe uma meta alvo válida." },
      { status: 400 }
    );
  }

  try {
    const record = createGoal({
      name,
      front,
      owner,
      description,
      targetType,
      targetValue,
      targetUnit,
    });
    return NextResponse.json({ goal: record }, { status: 201 });
  } catch (error) {
    console.error("[goals:POST]", error);
    return NextResponse.json(
      { error: "Não foi possível registrar a meta." },
      { status: 500 }
    );
  }
}
