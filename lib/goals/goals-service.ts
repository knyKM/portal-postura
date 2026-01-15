import { db } from "@/lib/auth/database";

export type GoalRecord = {
  id: number;
  name: string;
  front: string;
  owner: string;
  description: string | null;
  due_date: string | null;
  target_type: "percent" | "value";
  target_value: number;
  target_unit: string | null;
  created_at: string;
  updated_at: string;
};

export type GoalUpdateRecord = {
  id: number;
  goal_id: number;
  progress_type: "percent" | "value";
  progress_value: number;
  progress_unit: string | null;
  progress_percent: number | null;
  note: string | null;
  progress_date: string;
  created_at: string;
};

export type GoalInput = {
  name: string;
  front: string;
  owner: string;
  description?: string | null;
  dueDate?: string | null;
  targetType: "percent" | "value";
  targetValue: number;
  targetUnit?: string | null;
};

export type GoalUpdateInput = {
  goalId: number;
  progressType: "percent" | "value";
  progressValue: number;
  progressUnit?: string | null;
  note?: string | null;
  progressDate: string;
};

export function listGoals() {
  return db
    .prepare<GoalRecord>(
      `SELECT id, name, front, owner, description, due_date, target_type, target_value, target_unit,
              created_at, updated_at
       FROM goals
       ORDER BY created_at DESC`
    )
    .all();
}

export function listGoalUpdates() {
  return db
    .prepare<GoalUpdateRecord>(
      `SELECT id, goal_id, progress_type, progress_value, progress_unit, progress_percent,
              note, progress_date, created_at
       FROM goal_updates
       ORDER BY progress_date DESC`
    )
    .all();
}

export function createGoal(input: GoalInput) {
  const now = new Date().toISOString();
  const record = db
    .prepare<GoalRecord>(
      `INSERT INTO goals
        (name, front, owner, description, due_date, target_type, target_value, target_unit, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING id, name, front, owner, description, due_date, target_type, target_value, target_unit,
                 created_at, updated_at`
    )
    .get(
      input.name,
      input.front,
      input.owner,
      input.description ?? null,
      input.dueDate ?? null,
      input.targetType,
      input.targetValue,
      input.targetUnit ?? null,
      now,
      now
    );
  return record;
}

export function createGoalUpdate(input: GoalUpdateInput) {
  const now = new Date().toISOString();
  const target = db
    .prepare<Pick<GoalRecord, "target_value" | "target_type">>(
      "SELECT target_value, target_type FROM goals WHERE id = ?"
    )
    .get(input.goalId);

  if (!target) return null;

  let progressPercent: number | null = null;
  if (input.progressType === "percent") {
    progressPercent = Math.max(0, Math.min(100, input.progressValue));
  } else if (target.target_type === "value" && target.target_value > 0) {
    progressPercent = Math.max(
      0,
      Math.min(100, (input.progressValue / target.target_value) * 100)
    );
  }

  const record = db
    .prepare<GoalUpdateRecord>(
      `INSERT INTO goal_updates
        (goal_id, progress_type, progress_value, progress_unit, progress_percent, note, progress_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING id, goal_id, progress_type, progress_value, progress_unit, progress_percent,
                 note, progress_date, created_at`
    )
    .get(
      input.goalId,
      input.progressType,
      input.progressValue,
      input.progressUnit ?? null,
      progressPercent,
      input.note ?? null,
      input.progressDate,
      now
    );

  db.prepare("UPDATE goals SET updated_at = ? WHERE id = ?").run(now, input.goalId);

  return record;
}
