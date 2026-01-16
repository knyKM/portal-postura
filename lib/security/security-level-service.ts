import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

export type SecurityLevelRecord = {
  key: string;
  name: string;
  description: string | null;
  allowed_routes: string | null;
  created_at: string;
};

export type SecurityLevel = {
  key: string;
  name: string;
  description: string | null;
  allowedRoutes: string[];
  createdAt: string;
};

function mapRecord(record: SecurityLevelRecord): SecurityLevel {
  let allowedRoutes: string[] = [];
  if (record.allowed_routes) {
    try {
      const parsed = JSON.parse(record.allowed_routes);
      allowedRoutes = Array.isArray(parsed) ? parsed : [];
    } catch {
      allowedRoutes = [];
    }
  }
  return {
    key: record.key,
    name: record.name,
    description: record.description ?? null,
    allowedRoutes,
    createdAt: record.created_at,
  };
}

export function listSecurityLevels(): SecurityLevel[] {
  const stmt = db.prepare<SecurityLevelRecord>(
    "SELECT key, name, description, allowed_routes, created_at FROM security_levels ORDER BY created_at ASC"
  );
  return stmt.all().map(mapRecord);
}

export function getSecurityLevelByKey(key: string): SecurityLevel | null {
  const stmt = db.prepare<SecurityLevelRecord>(
    "SELECT key, name, description, allowed_routes, created_at FROM security_levels WHERE key = ?"
  );
  const record = stmt.get(key);
  return record ? mapRecord(record) : null;
}

type CreateSecurityLevelInput = {
  name: string;
  description?: string | null;
  allowedRoutes?: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function createSecurityLevel(
  input: CreateSecurityLevelInput
): SecurityLevel {
  const key = slugify(input.name);
  if (!key) {
    throw new Error("Nome inválido para o nível.");
  }
  const exists = getSecurityLevelByKey(key);
  if (exists) {
    throw new Error("Já existe um nível com esse nome.");
  }
  const now = getLocalTimestamp();
  const stmt = db.prepare(
    "INSERT INTO security_levels (key, name, description, allowed_routes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const allowedRoutes = Array.isArray(input.allowedRoutes)
    ? input.allowedRoutes
    : [];
  stmt.run(
    key,
    input.name.trim(),
    input.description?.trim() || null,
    JSON.stringify(allowedRoutes),
    now,
    now
  );
  const created = getSecurityLevelByKey(key);
  if (!created) {
    throw new Error("Falha ao criar nível.");
  }
  return created;
}

type UpdateSecurityLevelInput = {
  key: string;
  name: string;
  description?: string | null;
  allowedRoutes?: string[];
};

export function updateSecurityLevel(
  input: UpdateSecurityLevelInput
): SecurityLevel {
  const exists = getSecurityLevelByKey(input.key);
  if (!exists) {
    throw new Error("Nível não encontrado.");
  }
  const allowedRoutes = Array.isArray(input.allowedRoutes)
    ? input.allowedRoutes
    : [];
  const stmt = db.prepare(
    "UPDATE security_levels SET name = ?, description = ?, allowed_routes = ? WHERE key = ?"
  );
  stmt.run(
    input.name.trim(),
    input.description?.trim() || null,
    JSON.stringify(allowedRoutes),
    input.key
  );
  const updated = getSecurityLevelByKey(input.key);
  if (!updated) {
    throw new Error("Falha ao atualizar nível.");
  }
  return updated;
}

export function deleteSecurityLevel(key: string) {
  const stmt = db.prepare("DELETE FROM security_levels WHERE key = ?");
  const result = stmt.run(key);
  return result.changes > 0;
}
