import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

export type DashboardWidgetRecord = {
  id: number;
  user_id: number;
  name: string;
  template_id: string;
  config_json: string;
  created_at: string;
  updated_at: string;
};

export type DashboardWidget = {
  id: number;
  userId: number;
  name: string;
  templateId: string;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapRecord(record: DashboardWidgetRecord): DashboardWidget {
  return {
    id: record.id,
    userId: record.user_id,
    name: record.name,
    templateId: record.template_id,
    config: parseJson<Record<string, unknown>>(record.config_json ?? "{}", {}),
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function listDashboardWidgetsByUser(userId: number): DashboardWidget[] {
  const stmt = db.prepare<DashboardWidgetRecord>(
    "SELECT * FROM dashboard_widgets WHERE user_id = ? ORDER BY created_at DESC"
  );
  return stmt.all(userId).map(mapRecord);
}

export function listAllDashboardWidgets(): DashboardWidget[] {
  const stmt = db.prepare<DashboardWidgetRecord>(
    "SELECT * FROM dashboard_widgets ORDER BY created_at DESC"
  );
  return stmt.all().map(mapRecord);
}

export function createDashboardWidget(input: {
  userId: number;
  name: string;
  templateId: string;
  config: Record<string, unknown>;
}): DashboardWidget {
  const now = getLocalTimestamp();
  const stmt = db.prepare(
    `INSERT INTO dashboard_widgets (user_id, name, template_id, config_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  const result = stmt.run(
    input.userId,
    input.name,
    input.templateId,
    JSON.stringify(input.config ?? {}),
    now,
    now
  );
  const record = db
    .prepare<DashboardWidgetRecord>("SELECT * FROM dashboard_widgets WHERE id = ?")
    .get(Number(result.lastInsertRowid));
  if (!record) {
    throw new Error("Falha ao criar widget");
  }
  return mapRecord(record);
}

export function deleteDashboardWidget(id: number, userId: number): boolean {
  const stmt = db.prepare("DELETE FROM dashboard_widgets WHERE id = ? AND user_id = ?");
  const result = stmt.run(id, userId);
  return result.changes > 0;
}

export function deleteDashboardWidgetById(id: number): boolean {
  const stmt = db.prepare("DELETE FROM dashboard_widgets WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

export function deleteDashboardWidgetsByTemplateId(templateId: number): number {
  const widgets = listAllDashboardWidgets();
  const targetId = String(templateId);
  let removed = 0;
  widgets.forEach((widget) => {
    const config = widget.config as { dashboardId?: string };
    const dashboardId = String(config?.dashboardId ?? "default");
    if (dashboardId === targetId) {
      if (deleteDashboardWidgetById(widget.id)) {
        removed += 1;
      }
    }
  });
  return removed;
}

export function updateDashboardWidget(
  id: number,
  userId: number,
  input: Partial<{
    name: string;
    templateId: string;
    config: Record<string, unknown>;
  }>
): DashboardWidget {
  const current = db
    .prepare<DashboardWidgetRecord>(
      "SELECT * FROM dashboard_widgets WHERE id = ? AND user_id = ?"
    )
    .get(id, userId);
  if (!current) {
    throw new Error("Widget não encontrado.");
  }

  const nextName = input.name ?? current.name;
  const nextTemplate = input.templateId ?? current.template_id;
  const nextConfig = input.config
    ? JSON.stringify(input.config)
    : current.config_json;
  const now = getLocalTimestamp();

  db.prepare(
    `UPDATE dashboard_widgets
     SET name = ?, template_id = ?, config_json = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`
  ).run(nextName, nextTemplate, nextConfig, now, id, userId);

  const updated = db
    .prepare<DashboardWidgetRecord>(
      "SELECT * FROM dashboard_widgets WHERE id = ? AND user_id = ?"
    )
    .get(id, userId);
  if (!updated) {
    throw new Error("Falha ao atualizar widget.");
  }
  return mapRecord(updated);
}
