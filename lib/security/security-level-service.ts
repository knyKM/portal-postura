import { db } from "@/lib/auth/database";

export type SecurityLevelRecord = {
  key: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type SecurityLevel = {
  key: string;
  name: string;
  description: string | null;
  createdAt: string;
};

function mapRecord(record: SecurityLevelRecord): SecurityLevel {
  return {
    key: record.key,
    name: record.name,
    description: record.description ?? null,
    createdAt: record.created_at,
  };
}

export function listSecurityLevels(): SecurityLevel[] {
  const stmt = db.prepare<SecurityLevelRecord>(
    "SELECT key, name, description, created_at FROM security_levels ORDER BY created_at ASC"
  );
  return stmt.all().map(mapRecord);
}

export function getSecurityLevelByKey(key: string): SecurityLevel | null {
  const stmt = db.prepare<SecurityLevelRecord>(
    "SELECT key, name, description, created_at FROM security_levels WHERE key = ?"
  );
  const record = stmt.get(key);
  return record ? mapRecord(record) : null;
}

type CreateSecurityLevelInput = {
  name: string;
  description?: string | null;
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
  const stmt = db.prepare(
    "INSERT INTO security_levels (key, name, description) VALUES (?, ?, ?)"
  );
  stmt.run(key, input.name.trim(), input.description?.trim() || null);
  const created = getSecurityLevelByKey(key);
  if (!created) {
    throw new Error("Falha ao criar nível.");
  }
  return created;
}
