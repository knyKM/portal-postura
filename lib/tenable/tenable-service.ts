import { Agent, ProxyAgent } from "undici";
import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";
import { getIntegrationSetting } from "@/lib/settings/integration-settings";

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
  const setting = getIntegrationSetting("tenable_verify_ssl");
  if (setting !== null) {
    return !["false", "0", "no"].includes(String(setting).toLowerCase());
  }
  const raw = process.env.TENABLE_VERIFY_SSL;
  if (!raw) return true;
  return !["false", "0", "no"].includes(raw.toLowerCase());
}

function getTenableProxyUrl() {
  const host = getIntegrationSetting("tenable_proxy_host");
  const port = getIntegrationSetting("tenable_proxy_port");
  if (!host || !port) return null;
  const trimmedHost = String(host).trim();
  const trimmedPort = String(port).trim();
  if (!trimmedHost || !trimmedPort) return null;
  return `http://${trimmedHost}:${trimmedPort}`;
}

async function tenableFetch(
  path: string,
  credentials: TenableCredentials,
  init?: RequestInit
) {
  const proxyUrl = getTenableProxyUrl();
  const dispatcher = proxyUrl
    ? new ProxyAgent(proxyUrl)
    : shouldVerifySsl()
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

export async function fetchPlugins(
  credentials: TenableCredentials,
  lastUpdated?: string
) {
  const plugins: Array<{ id: number; name?: string; attributes?: Record<string, unknown> }> = [];
  let page = 1;
  const size = 1000;
  let totalCount: number | null = null;
  const lastUpdatedParam =
    typeof lastUpdated === "string" && lastUpdated.trim().length > 0
      ? `&last_updated=${encodeURIComponent(lastUpdated.trim())}`
      : "";

  while (true) {
    const response = await tenableFetch(
      `/plugins/plugin?page=${page}&size=${size}${lastUpdatedParam}`,
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
    const batch = Array.isArray(data?.data?.plugin_details)
      ? data.data.plugin_details
      : Array.isArray(data?.plugins)
      ? data.plugins
      : [];
    plugins.push(...batch);
    if (totalCount === null && Number.isFinite(data?.total_count)) {
      totalCount = Number(data.total_count);
    }
    if (batch.length === 0) {
      break;
    }
    if (totalCount !== null && plugins.length >= totalCount) {
      break;
    }
    if (batch.length < size) {
      break;
    }
    page += 1;
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

function extractAttributes(detail: Record<string, unknown>) {
  const attributes = Array.isArray(detail?.attributes) ? detail.attributes : [];
  const map = new Map<string, string[]>();
  attributes.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const name = (item as { attribute_name?: string }).attribute_name;
    const value = (item as { attribute_value?: string }).attribute_value;
    if (!name || typeof value !== "string") return;
    const list = map.get(name) ?? [];
    list.push(value);
    map.set(name, list);
  });
  return map;
}

function getAttrValue(map: Map<string, string[]>, key: string) {
  const values = map.get(key);
  if (!values || values.length === 0) return "";
  return values.join("\n");
}

function normalizeListValue(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value.filter((item) => typeof item === "string").join(", ");
}

function readListAttribute(detail: Record<string, unknown>, key: string) {
  const listValue = normalizeListValue(detail?.[key as keyof typeof detail]);
  if (listValue) return listValue;
  const listFromAttributes = normalizeListValue(
    (detail as { listAttributes?: Record<string, unknown> }).listAttributes?.[key]
  );
  return listFromAttributes;
}

function readNumericAttr(map: Map<string, string[]>, key: string) {
  const raw = getAttrValue(map, key);
  if (!raw) return null;
  const value = Number(raw.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function normalizeNumericValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function getExistingPluginModificationDates(ids: string[]) {
  if (!Array.isArray(ids) || ids.length === 0) return {};
  const placeholders = ids.map(() => "?").join(", ");
  const rows = db
    .prepare<{ id: string; plugin_modification_date: string | null }>(
      `SELECT id, plugin_modification_date FROM vulnerabilities WHERE id IN (${placeholders})`
    )
    .all(...ids);
  return Object.fromEntries(
    rows.map((row) => [row.id, row.plugin_modification_date])
  );
}

function normalizeSeverity(detail: Record<string, unknown>, attrMap?: Map<string, string[]>) {
  const riskFromAttr = attrMap ? getAttrValue(attrMap, "risk_factor") : "";
  const risk = riskFromAttr || (detail?.risk_factor as string | undefined) || "";
  const severity = (detail?.severity as string | undefined) || "";
  return (risk || severity || "unknown").toLowerCase();
}

export function upsertTenablePlugin(pluginId: number, detail: Record<string, unknown>) {
  const now = getLocalTimestamp();
  const attrMap = extractAttributes(detail);
  const title =
    (detail?.name as string | undefined) ||
    (detail?.plugin_name as string | undefined) ||
    getAttrValue(attrMap, "plugin_name") ||
    `Plugin ${pluginId}`;
  const synopsis = getAttrValue(attrMap, "synopsis") || (detail?.synopsis as string | undefined) || "";
  const descriptionDetail =
    getAttrValue(attrMap, "description") ||
    (detail?.description as string | undefined) ||
    (detail?.plugin_description as string | undefined) ||
    "";
  const description = [synopsis, descriptionDetail].filter(Boolean).join("\n\n");
  const solution =
    getAttrValue(attrMap, "solution") ||
    (detail?.solution as string | undefined) ||
    (detail?.remediation as string | undefined) ||
    "";
  const seeAlso = getAttrValue(attrMap, "see_also");
  const remediation = [solution, seeAlso].filter(Boolean).join("\n\n");
  const severity = normalizeSeverity(detail, attrMap);
  if (["info", "informational"].includes(severity)) {
    return false;
  }
  const score = Number(detail?.cvss_base_score ?? 0);
  const pluginPublicationDate =
    getAttrValue(attrMap, "plugin_publication_date") ||
    (detail?.plugin_publication_date as string | undefined) ||
    "";
  const pluginModificationDate =
    getAttrValue(attrMap, "plugin_modification_date") ||
    (detail?.plugin_modification_date as string | undefined) ||
    "";
  const patchPublicationDate =
    getAttrValue(attrMap, "patch_publication_date") ||
    (detail?.patch_publication_date as string | undefined) ||
    "";
  const intelType =
    getAttrValue(attrMap, "intel_type") || (detail?.intel_type as string | undefined) || "";
  const pluginType =
    getAttrValue(attrMap, "plugin_type") || (detail?.plugin_type as string | undefined) || "";
  const cve = readListAttribute(detail, "cve");
  const cpe = readListAttribute(detail, "cpe");
  const vprRaw = (detail as { vpr?: { score?: unknown; updated?: unknown } }).vpr;
  const vprScore = normalizeNumericValue(vprRaw?.score);
  const vprUpdated =
    typeof vprRaw?.updated === "string" ? vprRaw.updated : null;
  const cvss4BaseScore = readNumericAttr(attrMap, "cvss4_base_score");
  const cvss4TemporalScore = readNumericAttr(attrMap, "cvss4_temporal_score");
  const cvss3BaseScore = readNumericAttr(attrMap, "cvss3_base_score");
  const cvss3TemporalScore = readNumericAttr(attrMap, "cvss3_temporal_score");
  const cvssTemporalScore = readNumericAttr(attrMap, "cvss_temporal_score");

  const stmt = db.prepare(
    `INSERT INTO vulnerabilities
      (id, title, severity, description, remediation, score, source, external_id, last_synced_at,
       plugin_modification_date, plugin_publication_date, patch_publication_date, intel_type, plugin_type,
       cve, cpe, vpr_score, vpr_updated, cvss4_base_score, cvss4_temporal_score,
       cvss3_base_score, cvss3_temporal_score, cvss_temporal_score, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'tenable', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       severity = excluded.severity,
       description = excluded.description,
       remediation = excluded.remediation,
       score = excluded.score,
       source = 'tenable',
       external_id = excluded.external_id,
       last_synced_at = excluded.last_synced_at,
       plugin_modification_date = excluded.plugin_modification_date,
       plugin_publication_date = excluded.plugin_publication_date,
       patch_publication_date = excluded.patch_publication_date,
       intel_type = excluded.intel_type,
       plugin_type = excluded.plugin_type,
       cve = excluded.cve,
       cpe = excluded.cpe,
       vpr_score = excluded.vpr_score,
       vpr_updated = excluded.vpr_updated,
       cvss4_base_score = excluded.cvss4_base_score,
       cvss4_temporal_score = excluded.cvss4_temporal_score,
       cvss3_base_score = excluded.cvss3_base_score,
       cvss3_temporal_score = excluded.cvss3_temporal_score,
       cvss_temporal_score = excluded.cvss_temporal_score`
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
    pluginModificationDate || null,
    pluginPublicationDate || null,
    patchPublicationDate || null,
    intelType || null,
    pluginType || null,
    cve || null,
    cpe || null,
    vprScore,
    vprUpdated,
    cvss4BaseScore,
    cvss4TemporalScore,
    cvss3BaseScore,
    cvss3TemporalScore,
    cvssTemporalScore,
    now
  );
  return true;
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
  const path = `/scans/${scanId}`;
  const response = await tenableFetch(path, credentials);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      (data?.error as string | undefined) ||
        (data?.message as string | undefined) ||
        `Falha ao buscar scan ${scanId} (${response.status}). Endpoint: ${path}`
    );
  }
  return data;
}

export async function fetchScanHistory(
  scanId: number,
  credentials: TenableCredentials
) {
  const path = `/scans/${scanId}/history`;
  const response = await tenableFetch(path, credentials);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      (data?.error as string | undefined) ||
        (data?.message as string | undefined) ||
        `Falha ao buscar histórico do scan ${scanId} (${response.status}). Endpoint: ${path}`
    );
  }
  return Array.isArray(data?.history) ? data.history : [];
}

export async function fetchScanDetailWithHistory(
  scanId: number,
  historyId: number,
  credentials: TenableCredentials
) {
  const path = `/scans/${scanId}?history_id=${historyId}`;
  const response = await tenableFetch(path, credentials);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      (data?.error as string | undefined) ||
        (data?.message as string | undefined) ||
        `Falha ao buscar detalhes do scan ${scanId} (${response.status}). Endpoint: ${path}`
    );
  }
  return data;
}

export async function fetchScanHostDetail(
  scanId: number,
  hostId: number,
  historyId: number,
  credentials: TenableCredentials
) {
  const path = `/scans/${scanId}/hosts/${hostId}?history_id=${historyId}`;
  const response = await tenableFetch(path, credentials);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      (data?.error as string | undefined) ||
        (data?.message as string | undefined) ||
        `Falha ao buscar host ${hostId} do scan ${scanId} (${response.status}). Endpoint: ${path}`
    );
  }
  return data;
}

export async function fetchScanHostPlugins(
  scanId: number,
  hostId: number,
  historyId: number,
  credentials: TenableCredentials
) {
  const path = `/scans/${scanId}/hosts/${hostId}/plugins?history_id=${historyId}`;
  const response = await tenableFetch(path, credentials);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      (data?.error as string | undefined) ||
        (data?.message as string | undefined) ||
        `Falha ao buscar plugins do host ${hostId} (${response.status}). Endpoint: ${path}`
    );
  }
  return Array.isArray(data?.plugins) ? data.plugins : [];
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
