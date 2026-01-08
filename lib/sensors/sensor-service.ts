import { db } from "@/lib/auth/database";

export type SensorStatus = "up" | "down" | "unknown";

export type SensorRecord = {
  id: number;
  hostname: string;
  ip: string;
  environment: string | null;
  owner_tool: string | null;
  status: SensorStatus;
  last_detail: string | null;
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Sensor = {
  id: number;
  hostname: string;
  ip: string;
  environment: string | null;
  ownerTool: string | null;
  status: SensorStatus;
  lastDetail: string | null;
  lastCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function mapRecord(record: SensorRecord): Sensor {
  return {
    id: record.id,
    hostname: record.hostname,
    ip: record.ip,
    environment: record.environment ?? null,
    ownerTool: record.owner_tool ?? null,
    status: record.status ?? "unknown",
    lastDetail: record.last_detail ?? null,
    lastCheckedAt: record.last_checked_at ?? null,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function listSensors(): Sensor[] {
  const stmt = db.prepare<SensorRecord>(
    "SELECT * FROM network_sensors ORDER BY created_at DESC"
  );
  return stmt.all().map(mapRecord);
}

type CreateSensorInput = {
  hostname: string;
  ip: string;
  environment?: string | null;
  ownerTool?: string | null;
};

export function createSensor(input: CreateSensorInput): Sensor {
  const stmt = db.prepare(
    `INSERT INTO network_sensors (hostname, ip, environment, owner_tool, status)
     VALUES (?, ?, ?, ?, 'unknown')`
  );
  const info = stmt.run(
    input.hostname.trim(),
    input.ip.trim(),
    input.environment?.trim() || null,
    input.ownerTool?.trim() || null
  );
  const record = db
    .prepare<SensorRecord>("SELECT * FROM network_sensors WHERE id = ?")
    .get(Number(info.lastInsertRowid));
  if (!record) {
    throw new Error("Falha ao criar sensor.");
  }
  return mapRecord(record);
}

export function createSensorsBulk(inputs: CreateSensorInput[]): Sensor[] {
  const insert = db.prepare(
    `INSERT INTO network_sensors (hostname, ip, environment, owner_tool, status)
     VALUES (?, ?, ?, ?, 'unknown')`
  );
  const fetch = db.prepare<SensorRecord>(
    "SELECT * FROM network_sensors WHERE id = ?"
  );
  const sensors: Sensor[] = [];
  const transaction = db.transaction((rows: CreateSensorInput[]) => {
    rows.forEach((row) => {
      const info = insert.run(
        row.hostname.trim(),
        row.ip.trim(),
        row.environment?.trim() || null,
        row.ownerTool?.trim() || null
      );
      const record = fetch.get(Number(info.lastInsertRowid));
      if (record) {
        sensors.push(mapRecord(record));
      }
    });
  });
  transaction(inputs);
  return sensors;
}

export function updateSensorStatus(
  id: number,
  status: SensorStatus,
  detail: string | null,
  checkedAt: string
): Sensor | null {
  const stmt = db.prepare(
    `UPDATE network_sensors
     SET status = ?, last_detail = ?, last_checked_at = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  );
  const result = stmt.run(status, detail, checkedAt, id);
  if (result.changes === 0) {
    return null;
  }
  const record = db
    .prepare<SensorRecord>("SELECT * FROM network_sensors WHERE id = ?")
    .get(id);
  return record ? mapRecord(record) : null;
}

export function listStaleSensors(thresholdMinutes: number): Sensor[] {
  const cutoff = new Date(Date.now() - thresholdMinutes * 60_000).toISOString();
  const stmt = db.prepare<SensorRecord>(
    `SELECT * FROM network_sensors
     WHERE last_checked_at IS NULL OR last_checked_at < ?
     ORDER BY created_at DESC`
  );
  return stmt.all(cutoff).map(mapRecord);
}
