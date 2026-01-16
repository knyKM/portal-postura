import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

export type DashboardTemplateRecord = {
  id: number;
  name: string;
  config: string;
  created_at: string;
  updated_at: string;
};

export type DashboardTemplate = {
  id: number;
  name: string;
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

function mapRecord(record: DashboardTemplateRecord): DashboardTemplate {
  return {
    id: record.id,
    name: record.name,
    config: parseJson<Record<string, unknown>>(record.config ?? "{}", {}),
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function listDashboardTemplates(): DashboardTemplate[] {
  const stmt = db.prepare<DashboardTemplateRecord>(
    "SELECT * FROM dashboard_templates ORDER BY created_at DESC"
  );
  return stmt.all().map(mapRecord);
}

type CreateDashboardTemplateInput = {
  name: string;
  config?: Record<string, unknown>;
};

export function createDashboardTemplate(
  data: CreateDashboardTemplateInput
): DashboardTemplate {
  const now = getLocalTimestamp();
  const stmt = db.prepare(
    `INSERT INTO dashboard_templates (name, config, created_at, updated_at)
     VALUES (?, ?, ?, ?)`
  );
  const info = stmt.run(data.name, JSON.stringify(data.config ?? {}), now, now);
  const fetch = db.prepare<DashboardTemplateRecord>(
    "SELECT * FROM dashboard_templates WHERE id = ?"
  );
  const record = fetch.get(Number(info.lastInsertRowid));
  if (!record) {
    throw new Error("Falha ao criar template de dashboard");
  }
  return mapRecord(record);
}

type UpdateDashboardTemplateInput = Partial<{
  name: string;
  config: Record<string, unknown>;
}>;

export function updateDashboardTemplate(
  id: number,
  input: UpdateDashboardTemplateInput
): DashboardTemplate {
  const existing = db
    .prepare<DashboardTemplateRecord>("SELECT * FROM dashboard_templates WHERE id = ?")
    .get(id);
  if (!existing) {
    throw new Error("Template não encontrado");
  }
  const stmt = db.prepare(
    `UPDATE dashboard_templates
     SET name = ?, config = ?, updated_at = datetime('now','localtime')
     WHERE id = ?`
  );
  const nextName = input.name ?? existing.name;
  const nextConfig = JSON.stringify(
    input.config ?? parseJson<Record<string, unknown>>(existing.config ?? "{}", {})
  );
  stmt.run(nextName, nextConfig, id);
  const record = db
    .prepare<DashboardTemplateRecord>("SELECT * FROM dashboard_templates WHERE id = ?")
    .get(id);
  if (!record) {
    throw new Error("Falha ao atualizar template");
  }
  return mapRecord(record);
}

export function deleteDashboardTemplate(id: number): boolean {
  const stmt = db.prepare("DELETE FROM dashboard_templates WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}
