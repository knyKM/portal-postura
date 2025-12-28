import { db } from "@/lib/auth/database";

export function getIntegrationSetting(key: string) {
  const stmt = db.prepare<{ value: string | null }>(
    "SELECT value FROM integration_settings WHERE key = ?"
  );
  const row = stmt.get(key);
  return row?.value ?? null;
}

export function setIntegrationSetting(key: string, value: string | null) {
  if (value === null) {
    const del = db.prepare("DELETE FROM integration_settings WHERE key = ?");
    del.run(key);
    return;
  }

  const stmt = db.prepare(
    `INSERT INTO integration_settings (key, value)
     VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  );
  stmt.run(key, value);
}
