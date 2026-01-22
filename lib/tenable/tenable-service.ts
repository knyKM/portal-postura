import { Agent } from "undici";
import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

const TENABLE_BASE_URL = "https://cloud.tenable.com";

export type TenableCredentials = {
  accessKey: string;
  secretKey: string;
};

function buildTenableHeaders(credentials: TenableCredentials) {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-ApiKeys": `accessKey=${credentials.accessKey}; secretKey=${credentials.secretKey}`,
  };
}

function shouldVerifySsl() {
  const raw = process.env.TENABLE_VERIFY_SSL;
  if (!raw) return true;
  return !["false", "0", "no"].includes(raw.toLowerCase());
}

async function tenableFetch(
  path: string,
  credentials: TenableCredentials,
  init?: RequestInit
) {
  const dispatcher = shouldVerifySsl()
    ? undefined
    : new Agent({ connect: { rejectUnauthorized: false } });
  try {
    return await fetch(`${TENABLE_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        ...buildTenableHeaders(credentials),
      },
      dispatcher,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao conectar no Tenable.";
    throw new Error(message);
  }
}

export async function fetchPlugins(credentials: TenableCredentials) {
  const plugins: Array<{ id: number }> = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const response = await tenableFetch(
      `/plugins/plugin?offset=${offset}&limit=${limit}`,
      credentials
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        (data?.error as string | undefined) ||
          (data?.message as string | undefined) ||
          `Falha ao listar plugins (${response.status}).`
      );
    }
    const batch = Array.isArray(data?.plugins) ? data.plugins : [];
    plugins.push(...batch);
    if (batch.length < limit) {
      break;
    }
    offset += limit;
  }

  return plugins;
}

export async function fetchPluginDetail(
  pluginId: number,
  credentials: TenableCredentials
) {
  const response = await tenableFetch(`/plugins/plugin/${pluginId}`, credentials);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      (data?.error as string | undefined) ||
        (data?.message as string | undefined) ||
        `Falha ao buscar plugin ${pluginId} (${response.status}).`
    );
  }
  return data;
}

function normalizeSeverity(detail: Record<string, unknown>) {
  const risk = (detail?.risk_factor as string | undefined) || "";
  const severity = (detail?.severity as string | undefined) || "";
  return (risk || severity || "unknown").toLowerCase();
}

export function upsertTenablePlugin(pluginId: number, detail: Record<string, unknown>) {
  const now = getLocalTimestamp();
  const title =
    (detail?.name as string | undefined) ||
    (detail?.plugin_name as string | undefined) ||
    `Plugin ${pluginId}`;
  const description =
    (detail?.description as string | undefined) ||
    (detail?.plugin_description as string | undefined) ||
    "";
  const remediation =
    (detail?.solution as string | undefined) ||
    (detail?.remediation as string | undefined) ||
    "";
  const severity = normalizeSeverity(detail);
  const score = Number(detail?.cvss_base_score ?? 0);

  const stmt = db.prepare(
    `INSERT INTO vulnerabilities
      (id, title, severity, description, remediation, score, source, external_id, last_synced_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'tenable', ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       severity = excluded.severity,
       description = excluded.description,
       remediation = excluded.remediation,
       score = excluded.score,
       source = 'tenable',
       external_id = excluded.external_id,
       last_synced_at = excluded.last_synced_at`
  );

  stmt.run(
    String(pluginId),
    title,
    severity,
    description,
    remediation,
    Number.isFinite(score) ? score : 0,
    String(pluginId),
    now,
    now
  );
}

export async function fetchScans(credentials: TenableCredentials) {
  const response = await tenableFetch("/scans", credentials);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      (data?.error as string | undefined) ||
        (data?.message as string | undefined) ||
        `Falha ao listar scans (${response.status}).`
    );
  }
  return Array.isArray(data?.scans) ? data.scans : [];
}

export async function fetchScanDetail(
  scanId: number,
  credentials: TenableCredentials
) {
  const response = await tenableFetch(`/scans/${scanId}`, credentials);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      (data?.error as string | undefined) ||
        (data?.message as string | undefined) ||
        `Falha ao buscar scan ${scanId} (${response.status}).`
    );
  }
  return data;
}

export function upsertTenableScan(
  scan: Record<string, unknown>,
  detail: Record<string, unknown>
) {
  const now = getLocalTimestamp();
  const scanId = Number(scan?.id ?? detail?.info?.scan_id ?? 0);
  if (!scanId) return;

  const name = (scan?.name as string | undefined) || (detail?.info?.name as string | undefined) || `Scan ${scanId}`;
  const status = (scan?.status as string | undefined) || (detail?.info?.status as string | undefined) || null;
  const scanType = (scan?.type as string | undefined) || (detail?.info?.type as string | undefined) || null;
  const lastMod = Number(
    scan?.last_modification_date ??
      detail?.info?.timestamp ??
      detail?.info?.last_modification_date ??
      0
  );

  const stmt = db.prepare(
    `INSERT INTO tenable_scans
      (scan_id, name, status, scan_type, last_modification_date, details_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(scan_id) DO UPDATE SET
       name = excluded.name,
       status = excluded.status,
       scan_type = excluded.scan_type,
       last_modification_date = excluded.last_modification_date,
       details_json = excluded.details_json,
       updated_at = excluded.updated_at`
  );

  stmt.run(
    scanId,
    name,
    status,
    scanType,
    Number.isFinite(lastMod) ? lastMod : null,
    JSON.stringify(detail ?? {}),
    now,
    now
  );
}
