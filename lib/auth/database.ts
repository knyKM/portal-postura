import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { getLocalTimestamp } from "@/lib/utils/time";

const dataDir = path.join(process.cwd(), "data");
const dbFile = path.join(dataDir, "auth.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbFile);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'analista',
    security_level TEXT DEFAULT 'padrao',
    is_active INTEGER DEFAULT 1,
    mfa_secret TEXT,
    mfa_enabled INTEGER DEFAULT 0,
    last_seen_at TEXT,
    jira_url TEXT,
    jira_token TEXT,
    jira_verify_ssl TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

type TableInfoRow = {
  name: string;
};

const tableInfo = db
  .prepare("PRAGMA table_info(users)")
  .all() as TableInfoRow[];

const hasRoleColumn = tableInfo.some((column) => column.name === "role");
const hasSecurityLevelColumn = tableInfo.some(
  (column) => column.name === "security_level"
);
const hasIsActiveColumn = tableInfo.some(
  (column) => column.name === "is_active"
);
const hasMfaSecretColumn = tableInfo.some(
  (column) => column.name === "mfa_secret"
);
const hasMfaEnabledColumn = tableInfo.some(
  (column) => column.name === "mfa_enabled"
);
const hasLastSeenColumn = tableInfo.some(
  (column) => column.name === "last_seen_at"
);
const hasJiraUrlColumn = tableInfo.some((column) => column.name === "jira_url");
const hasJiraTokenColumn = tableInfo.some((column) => column.name === "jira_token");
const hasJiraVerifyColumn = tableInfo.some(
  (column) => column.name === "jira_verify_ssl"
);
const hasTenableAccessKeyColumn = tableInfo.some(
  (column) => column.name === "tenable_access_key"
);
const hasTenableSecretKeyColumn = tableInfo.some(
  (column) => column.name === "tenable_secret_key"
);

if (!hasRoleColumn) {
  db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'analista'");
}

if (!hasSecurityLevelColumn) {
  db.exec("ALTER TABLE users ADD COLUMN security_level TEXT DEFAULT 'padrao'");
  db.exec(
    "UPDATE users SET security_level = 'padrao' WHERE security_level IS NULL OR security_level = ''"
  );
}

if (!hasIsActiveColumn) {
  db.exec("ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1");
  db.exec("UPDATE users SET is_active = 1 WHERE is_active IS NULL");
}

if (!hasMfaSecretColumn) {
  db.exec("ALTER TABLE users ADD COLUMN mfa_secret TEXT");
}

if (!hasMfaEnabledColumn) {
  db.exec("ALTER TABLE users ADD COLUMN mfa_enabled INTEGER DEFAULT 0");
  db.exec("UPDATE users SET mfa_enabled = 0 WHERE mfa_enabled IS NULL");
}

if (!hasLastSeenColumn) {
  db.exec("ALTER TABLE users ADD COLUMN last_seen_at TEXT");
}
if (!hasJiraUrlColumn) {
  db.exec("ALTER TABLE users ADD COLUMN jira_url TEXT");
}
if (!hasJiraTokenColumn) {
  db.exec("ALTER TABLE users ADD COLUMN jira_token TEXT");
}
if (!hasJiraVerifyColumn) {
  db.exec("ALTER TABLE users ADD COLUMN jira_verify_ssl TEXT");
}
if (!hasTenableAccessKeyColumn) {
  db.exec("ALTER TABLE users ADD COLUMN tenable_access_key TEXT");
}
if (!hasTenableSecretKeyColumn) {
  db.exec("ALTER TABLE users ADD COLUMN tenable_secret_key TEXT");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS action_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action_type TEXT NOT NULL,
    filter_mode TEXT NOT NULL,
    filter_value TEXT NOT NULL,
    requested_status TEXT,
    payload TEXT,
    requester_id INTEGER,
    requester_email TEXT,
    requester_name TEXT,
    status TEXT DEFAULT 'pending',
    error_status_code INTEGER,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    approved_at TEXT,
    approved_by TEXT,
    audit_notes TEXT
  );
`);


db.exec(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    payload TEXT,
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    read_at TEXT
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_notifications_user_read
  ON notifications (user_id, is_read, created_at);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS integration_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS supplemental_balance_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS action_execution_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    error_message TEXT,
    error_status_code INTEGER,
    total_issues INTEGER,
    processed_issues INTEGER,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    started_at TEXT,
    finished_at TEXT,
    FOREIGN KEY(request_id) REFERENCES action_requests(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS action_request_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    message TEXT,
    actor_name TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY(request_id) REFERENCES action_requests(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS action_request_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER NOT NULL,
    sender_id INTEGER,
    sender_name TEXT,
    sender_role TEXT,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY(request_id) REFERENCES action_requests(id)
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_action_request_events_request
  ON action_request_events (request_id, created_at);
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_action_request_messages_request
  ON action_request_messages (request_id, created_at);
`);

const actionMessageTableInfo = db
  .prepare("PRAGMA table_info(action_request_messages)")
  .all() as TableInfoRow[];

const hasMessageSenderId = actionMessageTableInfo.some(
  (column) => column.name === "sender_id"
);
const hasMessageSenderName = actionMessageTableInfo.some(
  (column) => column.name === "sender_name"
);
const hasMessageSenderRole = actionMessageTableInfo.some(
  (column) => column.name === "sender_role"
);

if (!hasMessageSenderId) {
  db.exec("ALTER TABLE action_request_messages ADD COLUMN sender_id INTEGER");
}
if (!hasMessageSenderName) {
  db.exec("ALTER TABLE action_request_messages ADD COLUMN sender_name TEXT");
}
if (!hasMessageSenderRole) {
  db.exec("ALTER TABLE action_request_messages ADD COLUMN sender_role TEXT");
}

const actionJobTableInfo = db
  .prepare("PRAGMA table_info(action_execution_jobs)")
  .all() as TableInfoRow[];
const actionRequestTableInfo = db
  .prepare("PRAGMA table_info(action_requests)")
  .all() as TableInfoRow[];

const hasTotalIssuesColumn = actionJobTableInfo.some(
  (column) => column.name === "total_issues"
);
const hasProcessedIssuesColumn = actionJobTableInfo.some(
  (column) => column.name === "processed_issues"
);
const hasJobErrorStatusCodeColumn = actionJobTableInfo.some(
  (column) => column.name === "error_status_code"
);
const hasRequestErrorStatusCodeColumn = actionRequestTableInfo.some(
  (column) => column.name === "error_status_code"
);

if (!hasTotalIssuesColumn) {
  db.exec("ALTER TABLE action_execution_jobs ADD COLUMN total_issues INTEGER");
}

if (!hasProcessedIssuesColumn) {
  db.exec("ALTER TABLE action_execution_jobs ADD COLUMN processed_issues INTEGER");
}
if (!hasJobErrorStatusCodeColumn) {
  db.exec("ALTER TABLE action_execution_jobs ADD COLUMN error_status_code INTEGER");
}
if (!hasRequestErrorStatusCodeColumn) {
  db.exec("ALTER TABLE action_requests ADD COLUMN error_status_code INTEGER");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS security_levels (
    key TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    allowed_routes TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

const securityLevelTableInfo = db
  .prepare("PRAGMA table_info(security_levels)")
  .all() as TableInfoRow[];

const hasAllowedRoutesColumn = securityLevelTableInfo.some(
  (column) => column.name === "allowed_routes"
);

if (!hasAllowedRoutesColumn) {
  db.exec("ALTER TABLE security_levels ADD COLUMN allowed_routes TEXT");
}

const defaultAllowedRoutes = JSON.stringify([
  "/acoes",
  "/playbooks",
  "/ferramentas",
  "/gestao-contratos",
  "/auditoria",
  "/sugestoes-problemas",
  "/sugestoes",
  "/sugestoes/jira",
  "/fila-aprovacoes",
  "/usuarios",
]);

db.exec(
  `UPDATE security_levels
   SET allowed_routes = '${defaultAllowedRoutes}'
   WHERE allowed_routes IS NULL OR allowed_routes = ''`
);

type SecurityLevelRouteRow = {
  key: string;
  allowed_routes: string | null;
};

const routeRows = db
  .prepare<SecurityLevelRouteRow>(
    "SELECT key, allowed_routes FROM security_levels"
  )
  .all();

const requiredRoutes = [
  "/sugestoes-problemas",
  "/sugestoes",
  "/sugestoes/jira",
  "/gestao-contratos",
];
const updateAllowedRoutes = db.prepare(
  "UPDATE security_levels SET allowed_routes = ? WHERE key = ?"
);

routeRows.forEach((row) => {
  let parsed: string[] = [];
  if (row.allowed_routes) {
    try {
      const data = JSON.parse(row.allowed_routes);
      parsed = Array.isArray(data) ? data : [];
    } catch {
      parsed = [];
    }
  }
  const next = Array.from(new Set([...parsed, ...requiredRoutes]));
  updateAllowedRoutes.run(JSON.stringify(next), row.key);
});

db.exec(`
  CREATE TABLE IF NOT EXISTS network_sensors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hostname TEXT NOT NULL,
    ip TEXT NOT NULL,
    environment TEXT,
    owner_tool TEXT,
    status TEXT DEFAULT 'unknown',
    last_detail TEXT,
    last_checked_at TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

const sensorTableInfo = db
  .prepare("PRAGMA table_info(network_sensors)")
  .all() as TableInfoRow[];

const hasSensorStatusColumn = sensorTableInfo.some(
  (column) => column.name === "status"
);
const hasSensorDetailColumn = sensorTableInfo.some(
  (column) => column.name === "last_detail"
);
const hasSensorCheckedColumn = sensorTableInfo.some(
  (column) => column.name === "last_checked_at"
);

if (!hasSensorStatusColumn) {
  db.exec("ALTER TABLE network_sensors ADD COLUMN status TEXT DEFAULT 'unknown'");
}
if (!hasSensorDetailColumn) {
  db.exec("ALTER TABLE network_sensors ADD COLUMN last_detail TEXT");
}
if (!hasSensorCheckedColumn) {
  db.exec("ALTER TABLE network_sensors ADD COLUMN last_checked_at TEXT");
}

type SecurityLevelRow = {
  total: number;
};

const securityLevelCount = db
  .prepare<SecurityLevelRow>("SELECT COUNT(*) as total FROM security_levels")
  .get();

if ((securityLevelCount?.total ?? 0) === 0) {
  const insertLevel = db.prepare(
    "INSERT INTO security_levels (key, name, description, allowed_routes) VALUES (?, ?, ?, ?)"
  );
  insertLevel.run(
    "padrao",
    "Padrão",
    "Acesso base aos módulos operacionais.",
    defaultAllowedRoutes
  );
  insertLevel.run(
    "restrito",
    "Restrito",
    "Somente leitura e visibilidade limitada.",
    defaultAllowedRoutes
  );
  insertLevel.run(
    "critico",
    "Crítico",
    "Acesso completo a módulos sensíveis.",
    defaultAllowedRoutes
  );
}

db.exec(`
  CREATE TABLE IF NOT EXISTS automation_jobs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner TEXT NOT NULL,
    queue_seconds INTEGER DEFAULT 0,
    pending_issues INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    last_run TEXT,
    status_code INTEGER DEFAULT 3,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS automation_job_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id TEXT NOT NULL,
    message TEXT NOT NULL,
    level TEXT DEFAULT 'info',
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (job_id) REFERENCES automation_jobs(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS vulnerabilities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT,
    observations TEXT,
    remediation TEXT,
    affected TEXT,
    score REAL DEFAULT 0,
    source TEXT DEFAULT 'manual',
    external_id TEXT,
    last_synced_at TEXT,
    plugin_publication_date TEXT,
    patch_publication_date TEXT,
    intel_type TEXT,
    plugin_type TEXT,
    cve TEXT,
    cpe TEXT,
    cvss4_base_score REAL,
    cvss4_temporal_score REAL,
    cvss3_base_score REAL,
    cvss3_temporal_score REAL,
    cvss_temporal_score REAL,
    vpr_score REAL,
    vpr_updated TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS vulnerability_servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ip TEXT NOT NULL,
    environment TEXT,
    asset_class TEXT DEFAULT 'Servidor',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

const vulnerabilityTableInfo = db
  .prepare("PRAGMA table_info(vulnerabilities)")
  .all() as TableInfoRow[];
const vulnerabilityServersInfo = db
  .prepare("PRAGMA table_info(vulnerability_servers)")
  .all() as TableInfoRow[];

const hasVulnSourceColumn = vulnerabilityTableInfo.some(
  (column) => column.name === "source"
);
const hasVulnExternalIdColumn = vulnerabilityTableInfo.some(
  (column) => column.name === "external_id"
);
const hasVulnLastSyncedAtColumn = vulnerabilityTableInfo.some(
  (column) => column.name === "last_synced_at"
);
const hasVulnPluginPublicationDate = vulnerabilityTableInfo.some(
  (column) => column.name === "plugin_publication_date"
);
const hasVulnPatchPublicationDate = vulnerabilityTableInfo.some(
  (column) => column.name === "patch_publication_date"
);
const hasVulnIntelType = vulnerabilityTableInfo.some(
  (column) => column.name === "intel_type"
);
const hasVulnPluginType = vulnerabilityTableInfo.some(
  (column) => column.name === "plugin_type"
);
const hasVulnCve = vulnerabilityTableInfo.some((column) => column.name === "cve");
const hasVulnCpe = vulnerabilityTableInfo.some((column) => column.name === "cpe");
const hasVulnCvss4Base = vulnerabilityTableInfo.some(
  (column) => column.name === "cvss4_base_score"
);
const hasVulnCvss4Temporal = vulnerabilityTableInfo.some(
  (column) => column.name === "cvss4_temporal_score"
);
const hasVulnCvss3Base = vulnerabilityTableInfo.some(
  (column) => column.name === "cvss3_base_score"
);
const hasVulnCvss3Temporal = vulnerabilityTableInfo.some(
  (column) => column.name === "cvss3_temporal_score"
);
const hasVulnCvssTemporal = vulnerabilityTableInfo.some(
  (column) => column.name === "cvss_temporal_score"
);
const hasVulnVprScore = vulnerabilityTableInfo.some(
  (column) => column.name === "vpr_score"
);
const hasVulnVprUpdated = vulnerabilityTableInfo.some(
  (column) => column.name === "vpr_updated"
);

if (!hasVulnSourceColumn) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN source TEXT DEFAULT 'manual'");
}
if (!hasVulnExternalIdColumn) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN external_id TEXT");
}
if (!hasVulnLastSyncedAtColumn) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN last_synced_at TEXT");
}
if (!hasVulnPluginPublicationDate) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN plugin_publication_date TEXT");
}
if (!hasVulnPatchPublicationDate) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN patch_publication_date TEXT");
}
if (!hasVulnIntelType) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN intel_type TEXT");
}
if (!hasVulnPluginType) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN plugin_type TEXT");
}
if (!hasVulnCve) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN cve TEXT");
}
if (!hasVulnCpe) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN cpe TEXT");
}
if (!hasVulnCvss4Base) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN cvss4_base_score REAL");
}
if (!hasVulnCvss4Temporal) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN cvss4_temporal_score REAL");
}
if (!hasVulnCvss3Base) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN cvss3_base_score REAL");
}
if (!hasVulnCvss3Temporal) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN cvss3_temporal_score REAL");
}
if (!hasVulnCvssTemporal) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN cvss_temporal_score REAL");
}
if (!hasVulnVprScore) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN vpr_score REAL");
}
if (!hasVulnVprUpdated) {
  db.exec("ALTER TABLE vulnerabilities ADD COLUMN vpr_updated TEXT");
}

const hasAssetClassColumn = vulnerabilityServersInfo.some(
  (column) => column.name === "asset_class"
);
if (!hasAssetClassColumn) {
  db.exec("ALTER TABLE vulnerability_servers ADD COLUMN asset_class TEXT DEFAULT 'Servidor'");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS tenable_scans (
    scan_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT,
    scan_type TEXT,
    last_modification_date INTEGER,
    details_json TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS vulnerability_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vulnerability_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    occurrences INTEGER DEFAULT 1,
    resolved_count INTEGER DEFAULT 0,
    first_detected_at TEXT,
    last_changed_at TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    UNIQUE(vulnerability_id, server_id),
    FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id),
    FOREIGN KEY (server_id) REFERENCES vulnerability_servers(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS vulnerability_link_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vulnerability_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id),
    FOREIGN KEY (server_id) REFERENCES vulnerability_servers(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS vulnerability_retests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vulnerability_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'requested',
    requested_at TEXT NOT NULL,
    retested_at TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id),
    FOREIGN KEY (server_id) REFERENCES vulnerability_servers(id)
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_vulnerability_links_lookup
  ON vulnerability_links (vulnerability_id, server_id);
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_vulnerability_events_lookup
  ON vulnerability_link_events (vulnerability_id, server_id, event_at);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS jira_suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'aberto',
    requester_id INTEGER,
    requester_name TEXT,
    requester_email TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_jira_suggestions_status
  ON jira_suggestions (status, created_at);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    vendor TEXT NOT NULL,
    owner TEXT NOT NULL,
    area TEXT,
    contract_type TEXT,
    segment TEXT,
    sap_contract TEXT,
    contract_year TEXT,
    contract_scope TEXT,
    management TEXT,
    status TEXT NOT NULL DEFAULT 'ativo',
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    alert_days INTEGER DEFAULT 30,
    value_amount REAL,
    value_currency TEXT,
    description TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_contracts_status_end
  ON contracts (status, end_date);
`);

const contractsTableInfo = db
  .prepare("PRAGMA table_info(contracts)")
  .all() as TableInfoRow[];
const hasContractSegment = contractsTableInfo.some((column) => column.name === "segment");
const hasContractSap = contractsTableInfo.some((column) => column.name === "sap_contract");
const hasContractYear = contractsTableInfo.some((column) => column.name === "contract_year");
const hasContractScope = contractsTableInfo.some((column) => column.name === "contract_scope");
const hasContractManagement = contractsTableInfo.some((column) => column.name === "management");
const hasContractSupplementalUsed = contractsTableInfo.some(
  (column) => column.name === "supplemental_used"
);
if (!hasContractSegment) {
  db.exec("ALTER TABLE contracts ADD COLUMN segment TEXT");
}
if (!hasContractSap) {
  db.exec("ALTER TABLE contracts ADD COLUMN sap_contract TEXT");
}
if (!hasContractYear) {
  db.exec("ALTER TABLE contracts ADD COLUMN contract_year TEXT");
}
if (!hasContractScope) {
  db.exec("ALTER TABLE contracts ADD COLUMN contract_scope TEXT");
}
if (!hasContractManagement) {
  db.exec("ALTER TABLE contracts ADD COLUMN management TEXT");
}
if (!hasContractSupplementalUsed) {
  db.exec("ALTER TABLE contracts ADD COLUMN supplemental_used REAL");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS jira_export_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requester_id INTEGER NOT NULL,
    job_name TEXT,
    jql TEXT NOT NULL,
    fields_json TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    file_path TEXT,
    file_name TEXT,
    error_message TEXT,
    expires_at TEXT,
    total_issues INTEGER,
    processed_issues INTEGER,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    started_at TEXT,
    finished_at TEXT,
    FOREIGN KEY(requester_id) REFERENCES users(id)
  );
`);

const jiraExportTableInfo = db
  .prepare("PRAGMA table_info(jira_export_jobs)")
  .all() as TableInfoRow[];
const hasJiraExportExpiresAt = jiraExportTableInfo.some(
  (column) => column.name === "expires_at"
);
const hasJiraExportJobName = jiraExportTableInfo.some(
  (column) => column.name === "job_name"
);
const hasJiraExportTotalIssues = jiraExportTableInfo.some(
  (column) => column.name === "total_issues"
);
const hasJiraExportProcessedIssues = jiraExportTableInfo.some(
  (column) => column.name === "processed_issues"
);
if (!hasJiraExportExpiresAt) {
  db.exec("ALTER TABLE jira_export_jobs ADD COLUMN expires_at TEXT");
}
if (!hasJiraExportJobName) {
  db.exec("ALTER TABLE jira_export_jobs ADD COLUMN job_name TEXT");
}
if (!hasJiraExportTotalIssues) {
  db.exec("ALTER TABLE jira_export_jobs ADD COLUMN total_issues INTEGER");
}
if (!hasJiraExportProcessedIssues) {
  db.exec("ALTER TABLE jira_export_jobs ADD COLUMN processed_issues INTEGER");
}

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_jira_export_jobs_requester
  ON jira_export_jobs (requester_id, status, created_at);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS jira_export_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    fields_json TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_jira_export_templates_user
  ON jira_export_templates (user_id, created_at);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user
  ON password_reset_tokens (user_id, expires_at);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    front TEXT NOT NULL,
    owner TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    start_month TEXT,
    end_month TEXT,
    target_type TEXT NOT NULL DEFAULT 'percent',
    target_value REAL NOT NULL DEFAULT 100,
    target_unit TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

const goalsTableInfo = db
  .prepare("PRAGMA table_info(goals)")
  .all() as TableInfoRow[];

const hasGoalsDueDate = goalsTableInfo.some((column) => column.name === "due_date");
const hasGoalsStartMonth = goalsTableInfo.some(
  (column) => column.name === "start_month"
);
const hasGoalsEndMonth = goalsTableInfo.some((column) => column.name === "end_month");

if (!hasGoalsDueDate) {
  db.exec("ALTER TABLE goals ADD COLUMN due_date TEXT");
}
if (!hasGoalsStartMonth) {
  db.exec("ALTER TABLE goals ADD COLUMN start_month TEXT");
}
if (!hasGoalsEndMonth) {
  db.exec("ALTER TABLE goals ADD COLUMN end_month TEXT");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS goal_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id INTEGER NOT NULL,
    progress_type TEXT NOT NULL DEFAULT 'percent',
    progress_value REAL NOT NULL DEFAULT 0,
    progress_unit TEXT,
    progress_percent REAL,
    note TEXT,
    progress_date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_goal_updates_goal
  ON goal_updates (goal_id, progress_date);
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_vulnerability_retests_lookup
  ON vulnerability_retests (vulnerability_id, server_id, requested_at);
`);

type CountRow = { total: number };

const vulnerabilityCount = db
  .prepare<CountRow>("SELECT COUNT(*) as total FROM vulnerabilities")
  .get();

if ((vulnerabilityCount?.total ?? 0) === 0) {
  const insertVulnerability = db.prepare(
    `INSERT INTO vulnerabilities
      (id, title, severity, description, observations, remediation, affected, score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  insertVulnerability.run(
    "vuln-001",
    "CVE-2023-1023 · Exposição de credenciais",
    "Crítica",
    "Credenciais expostas em endpoint de diagnóstico.",
    "O endpoint retorna variáveis sensíveis quando executado com um token desatualizado.",
    "Desabilitar endpoint, rotacionar segredos e aplicar patch do fornecedor.",
    "API Gateway · Auth Service · Batch Notifier",
    9.4
  );
  insertVulnerability.run(
    "vuln-002",
    "CVE-2024-2211 · Execução remota",
    "Alta",
    "Falha em biblioteca de parsing utilizada por serviços web.",
    "A biblioteca aceita payloads maliciosos quando o parâmetro debug está ativo.",
    "Atualizar dependência e bloquear upload de arquivos temporários.",
    "Web Portal · Relatórios",
    8.1
  );
  insertVulnerability.run(
    "vuln-003",
    "CVE-2022-7789 · Privilege escalation",
    "Média",
    "Permissões excessivas em serviço legado.",
    "Contas de serviço com escopo amplo herdam permissões administrativas.",
    "Revisar IAM e remover papéis não utilizados.",
    "Legacy Jobs · Scheduler",
    6.3
  );
  insertVulnerability.run(
    "vuln-004",
    "CVE-2021-4450 · Weak TLS config",
    "Baixa",
    "Cifragem fraca habilitada em servidores antigos.",
    "TLS 1.0 habilitado em servidores de homologação.",
    "Forçar TLS 1.2+ e revisar ciphers legados.",
    "Homologação · Proxy",
    4.2
  );
}

const serverCount = db
  .prepare<CountRow>("SELECT COUNT(*) as total FROM vulnerability_servers")
  .get();

if ((serverCount?.total ?? 0) === 0) {
  const insertServer = db.prepare(
    "INSERT INTO vulnerability_servers (id, name, ip, environment) VALUES (?, ?, ?, ?)"
  );
  for (let index = 0; index < 20; index += 1) {
    const id = `srv-${String(index + 1).padStart(2, "0")}`;
    insertServer.run(
      id,
      `server-${String(index + 1).padStart(2, "0")}`,
      `10.10.${Math.floor(index / 5) + 1}.${11 + index}`,
      index < 8 ? "Produção" : index < 14 ? "Homologação" : "Dev"
    );
  }
}

const linkCount = db
  .prepare<CountRow>("SELECT COUNT(*) as total FROM vulnerability_links")
  .get();

if ((linkCount?.total ?? 0) === 0) {
  const insertLink = db.prepare(
    `INSERT INTO vulnerability_links
      (vulnerability_id, server_id, status, occurrences, resolved_count, first_detected_at, last_changed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const insertEvent = db.prepare(
    `INSERT INTO vulnerability_link_events
      (vulnerability_id, server_id, event_type, event_at)
      VALUES (?, ?, ?, ?)`
  );

  const addEvent = (
    vulnerabilityId: string,
    serverId: string,
    type: string,
    when: string
  ) => {
    insertEvent.run(vulnerabilityId, serverId, type, when);
  };

  insertLink.run(
    "vuln-001",
    "srv-01",
    "active",
    1,
    0,
    "2026-01-15T10:14:00",
    "2026-01-15T10:14:00"
  );
  addEvent("vuln-001", "srv-01", "detected", "2026-01-15T10:14:00");

  insertLink.run(
    "vuln-001",
    "srv-02",
    "resolved",
    1,
    1,
    "2026-01-10T09:02:00",
    "2026-01-12T08:20:00"
  );
  addEvent("vuln-001", "srv-02", "detected", "2026-01-10T09:02:00");
  addEvent("vuln-001", "srv-02", "resolved", "2026-01-12T08:20:00");

  insertLink.run(
    "vuln-001",
    "srv-03",
    "active",
    2,
    1,
    "2026-01-11T13:22:00",
    "2026-01-14T18:02:00"
  );
  addEvent("vuln-001", "srv-03", "detected", "2026-01-11T13:22:00");
  addEvent("vuln-001", "srv-03", "resolved", "2026-01-12T16:40:00");
  addEvent("vuln-001", "srv-03", "reopened", "2026-01-14T18:02:00");

  insertLink.run(
    "vuln-002",
    "srv-05",
    "active",
    1,
    0,
    "2026-01-15T09:48:00",
    "2026-01-15T09:48:00"
  );
  addEvent("vuln-002", "srv-05", "detected", "2026-01-15T09:48:00");

  insertLink.run(
    "vuln-002",
    "srv-06",
    "resolved",
    2,
    2,
    "2026-01-06T10:05:00",
    "2026-01-10T16:30:00"
  );
  addEvent("vuln-002", "srv-06", "detected", "2026-01-06T10:05:00");
  addEvent("vuln-002", "srv-06", "resolved", "2026-01-07T08:20:00");
  addEvent("vuln-002", "srv-06", "reopened", "2026-01-09T14:50:00");
  addEvent("vuln-002", "srv-06", "resolved", "2026-01-10T16:30:00");

  insertLink.run(
    "vuln-003",
    "srv-10",
    "resolved",
    1,
    1,
    "2026-01-06T12:40:00",
    "2026-01-08T14:12:00"
  );
  addEvent("vuln-003", "srv-10", "detected", "2026-01-06T12:40:00");
  addEvent("vuln-003", "srv-10", "resolved", "2026-01-08T14:12:00");

  insertLink.run(
    "vuln-004",
    "srv-15",
    "active",
    1,
    0,
    "2026-01-13T13:40:00",
    "2026-01-13T13:40:00"
  );
  addEvent("vuln-004", "srv-15", "detected", "2026-01-13T13:40:00");
}

const jiraSuggestionCount = db
  .prepare<CountRow>("SELECT COUNT(*) as total FROM jira_suggestions")
  .get();

if ((jiraSuggestionCount?.total ?? 0) === 0) {
  const insertSuggestion = db.prepare(
    `INSERT INTO jira_suggestions
      (type, title, description, status, requester_name, requester_email, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  insertSuggestion.run(
    "problema",
    "Erro ao sincronizar campos customizados",
    "Os campos customizados não aparecem na criação de issues quando o projeto é ASSETN.",
    "aberto",
    "Kaua Morateli",
    "kaua.melo@telefonica.com",
    "2026-01-15T09:00:00",
    "2026-01-15T09:00:00"
  );
  insertSuggestion.run(
    "sugestao",
    "Sugestão de automação para transição em lote",
    "Gostaria de um fluxo para transicionar issues de alto risco para Done automaticamente.",
    "em_analise",
    "Andre Massarente",
    "andre.massarente@telefonica.com",
    "2026-01-14T15:12:00",
    "2026-01-14T15:12:00"
  );
  insertSuggestion.run(
    "problema",
    "Timeout em consulta JQL",
    "Quando a JQL retorna mais de 5k issues, ocorre timeout na API.",
    "em_execucao",
    "Leticia Campos",
    "leticia.campos@telefonica.com",
    "2026-01-13T10:25:00",
    "2026-01-14T18:45:00"
  );
  insertSuggestion.run(
    "sugestao",
    "Adicionar atalho para histórico de mudanças",
    "Seria útil um botão direto para auditoria da fila de aprovação.",
    "concluido",
    "Carlos Silva",
    "carlos.silva@telefonica.com",
    "2026-01-10T14:05:00",
    "2026-01-12T17:20:00"
  );
}

const retestCount = db
  .prepare<CountRow>("SELECT COUNT(*) as total FROM vulnerability_retests")
  .get();

if ((retestCount?.total ?? 0) === 0) {
  const insertRetest = db.prepare(
    `INSERT INTO vulnerability_retests
      (vulnerability_id, server_id, status, requested_at, retested_at)
      VALUES (?, ?, ?, ?, ?)`
  );
  insertRetest.run(
    "vuln-001",
    "srv-01",
    "requested",
    "2026-01-15T11:00:00",
    null
  );
  insertRetest.run(
    "vuln-001",
    "srv-03",
    "failed",
    "2026-01-13T09:10:00",
    "2026-01-14T08:30:00"
  );
  insertRetest.run(
    "vuln-002",
    "srv-06",
    "passed",
    "2026-01-09T09:00:00",
    "2026-01-10T16:30:00"
  );
}

db.exec(`
  CREATE TABLE IF NOT EXISTS idea_suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    implementation_stage TEXT DEFAULT 'Descoberta',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

const suggestionTableInfo = db
  .prepare("PRAGMA table_info(idea_suggestions)")
  .all() as TableInfoRow[];

const hasSuggestionStatusColumn = suggestionTableInfo.some(
  (column) => column.name === "status"
);
const hasImplementationStageColumn = suggestionTableInfo.some(
  (column) => column.name === "implementation_stage"
);

if (!hasSuggestionStatusColumn) {
  db.exec("ALTER TABLE idea_suggestions ADD COLUMN status TEXT DEFAULT 'pending'");
  db.exec(
    "UPDATE idea_suggestions SET status = 'pending' WHERE status IS NULL OR status = ''"
  );
}

if (!hasImplementationStageColumn) {
  db.exec(
    "ALTER TABLE idea_suggestions ADD COLUMN implementation_stage TEXT DEFAULT 'Descoberta'"
  );
  db.exec(
    "UPDATE idea_suggestions SET implementation_stage = 'Descoberta' WHERE implementation_stage IS NULL OR implementation_stage = ''"
  );
}

db.exec(`
  CREATE TABLE IF NOT EXISTS playbooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    squads TEXT NOT NULL,
    automations TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'em validação',
    last_run TEXT,
    steps TEXT NOT NULL,
    script_path TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS topologies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nodes TEXT NOT NULL,
    links TEXT NOT NULL,
    custom_types TEXT NOT NULL DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

const topologyTableInfo = db
  .prepare("PRAGMA table_info(topologies)")
  .all() as TableInfoRow[];

const hasCustomTypesColumn = topologyTableInfo.some(
  (column) => column.name === "custom_types"
);

if (!hasCustomTypesColumn) {
  db.exec("ALTER TABLE topologies ADD COLUMN custom_types TEXT NOT NULL DEFAULT '[]'");
  db.exec("UPDATE topologies SET custom_types = '[]' WHERE custom_types IS NULL OR custom_types = ''");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS dashboard_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    config TEXT NOT NULL DEFAULT '{}',
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

const dashboardTableInfo = db
  .prepare("PRAGMA table_info(dashboard_templates)")
  .all() as TableInfoRow[];

const hasDashboardConfigColumn = dashboardTableInfo.some(
  (column) => column.name === "config"
);

if (!hasDashboardConfigColumn) {
  db.exec("ALTER TABLE dashboard_templates ADD COLUMN config TEXT NOT NULL DEFAULT '{}'");
  db.exec(
    "UPDATE dashboard_templates SET config = '{}' WHERE config IS NULL OR config = ''"
  );
}

const playbookTableInfo = db
  .prepare("PRAGMA table_info(playbooks)")
  .all() as TableInfoRow[];

const hasScriptPathColumn = playbookTableInfo.some(
  (column) => column.name === "script_path"
);

if (!hasScriptPathColumn) {
  db.exec("ALTER TABLE playbooks ADD COLUMN script_path TEXT");
}

type PlaybookRow = {
  total: number;
};

const playbookCount = db
  .prepare<PlaybookRow>("SELECT COUNT(*) as total FROM playbooks")
  .get();

if ((playbookCount?.total ?? 0) === 0) {
  const insertPlaybook = db.prepare(
    `INSERT INTO playbooks
      (name, description, squads, automations, status, last_run, steps, script_path)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const seeds = [
    {
      name: "Reforço OWASP Top 10",
      description:
        "Escaneia superfícies expostas, abre issues Jira e envia comandos para correções automáticas nos microserviços.",
      squads: ["Portal B2C", "Checkout"],
      automations: ["JQL: label=owasp_top10", "Webhook: pipelines-devsecops"],
      status: "pronto",
      last_run: "Há 2 dias",
      steps: [
        {
          title: "Detectar superficies",
          detail: "Executar scanners Tenable e APIs internas para serviço web.",
        },
        {
          title: "Abrir issues",
          detail: "Criar tickets Jira por squad com prioridade automática.",
        },
        {
          title: "Aplicar correções",
          detail: "Disparar playbooks React + Vite para ajustar pipelines.",
        },
      ],
      scriptPath: "scripts/owasp_reinforcement.sh",
    },
    {
      name: "Resiliência de Identidades",
      description:
        "Revisa todas as identidades privilegiadas, aplica MFA obrigatório e dispara alertas quando políticas são quebradas.",
      squads: ["IAM", "Infra Sec"],
      automations: ["Suspender contas inativas", "Sincronizar MFA"],
      status: "em validação",
      last_run: "Há 6 horas",
      steps: [
        {
          title: "Inventário IAM",
          detail: "Listar contas privilegiadas e verificar status MFA.",
        },
        {
          title: "Aplicar políticas",
          detail: "Sincronizar MFA e bloquear exceções automaticamente.",
        },
        {
          title: "Alertar squads",
          detail: "Enviar relatórios para SOC e líderes das tribos.",
        },
      ],
      scriptPath: "scripts/iam_resilience.py",
    },
    {
      name: "Higienização de Repositórios",
      description:
        "Fluxo para rodar scanners de segredos, abrir tickets e integrar com pipelines React + Vite automaticamente.",
      squads: ["DevRel", "DevSecOps"],
      automations: ["Scanner secrets", "Remover tokens vazados"],
      status: "em construção",
      last_run: "Em preparação",
      steps: [
        {
          title: "Rodar scanners",
          detail: "Executar detecção de segredos em repositórios React.",
        },
        {
          title: "Iniciar remediação",
          detail: "Abrir tickets e atribuir tasks automáticas por squad.",
        },
        {
          title: "Validar build",
          detail: "Ajustar pipelines Vite para prevenir regressões.",
        },
      ],
      scriptPath: "scripts/higienizacao_repos.sh",
    },
    {
      name: "Limpeza e Scans Tenable",
      description:
        "Remove scans antigos do Tenable.VM para impedir que o limite de 10k seja atingido e garante continuidade dos assessments.",
      squads: ["Vulnerability Ops", "Infra Sec"],
      automations: [
        "Cleanup scans Tenable.VM",
        "Monitor limite 10k",
        "Notificar SOC",
      ],
      status: "pronto",
      last_run: "Há 1 hora",
      steps: [
        {
          title: "Identificar scans antigos",
          detail: "Listar execuções acima de 30 dias e sinalizar excedentes.",
        },
        {
          title: "Remover do Tenable.VM",
          detail: "Executar API de exclusão mantendo histórico local.",
        },
        {
          title: "Notificar SOC",
          detail: "Enviar relatório e garantir capacidade abaixo de 10k.",
        },
      ],
      scriptPath: "scripts/tenable_cleanup.sh",
    },
    {
      name: "Atualização de senha Tenable.IE",
      description:
        "Atualiza a senha em rotação no Tenable.IE para manter a comunicação com o Active Directory Redecorp, evitando falhas nos scanners.",
      squads: ["IAM", "Vulnerability Ops"],
      automations: [
        "Rotacionar credencial serviço",
        "Sincronizar Tenable.IE",
        "Validar comunicação AD Redecorp",
      ],
      status: "em validação",
      last_run: "Há 30 minutos",
      steps: [
        {
          title: "Obter senha nova",
          detail: "Consultar cofre e validar rotação prevista.",
        },
        {
          title: "Atualizar Tenable.IE",
          detail: "Aplicar a senha no conector e registrar data.",
        },
        {
          title: "Testar AD",
          detail: "Executar teste de comunicação com o Active Directory Redecorp.",
        },
      ],
      scriptPath: "scripts/update_tenable_password.py",
    },
  ];

  seeds.forEach((seed) => {
    insertPlaybook.run(
      seed.name,
      seed.description,
      JSON.stringify(seed.squads),
      JSON.stringify(seed.automations),
      seed.status,
      seed.last_run,
      JSON.stringify(seed.steps),
      seed.scriptPath
    );
  });
}

const insertPlaybook = db.prepare(
  `INSERT INTO playbooks
    (name, description, squads, automations, status, last_run, steps, script_path)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);

function ensurePlaybook(seed: {
  name: string;
  description: string;
  squads: string[];
  automations: string[];
  status: string;
  last_run: string;
  steps: { title: string; detail: string }[];
  scriptPath: string;
}) {
  const exists = db
    .prepare<{ id: number }>("SELECT id FROM playbooks WHERE name = ?")
    .get(seed.name);
  if (exists) return;
  insertPlaybook.run(
    seed.name,
    seed.description,
    JSON.stringify(seed.squads),
    JSON.stringify(seed.automations),
    seed.status,
    seed.last_run,
    JSON.stringify(seed.steps),
    seed.scriptPath
  );
}

ensurePlaybook({
  name: "Sync plugins Tenable",
  description:
    "Sincroniza diariamente o catálogo de vulnerabilidades (plugins) do Tenable.VM.",
  squads: ["Vulnerability Ops"],
  automations: ["Agendamento diário", "Execução manual sob demanda"],
  status: "pronto",
  last_run: "Em preparação",
  steps: [
    {
      title: "Conectar à API Tenable",
      detail: "Valida access key e secret key configuradas nas integrações.",
    },
    {
      title: "Coletar plugins",
      detail: "Atualiza título, descrição detalhada e solução de mitigação.",
    },
    {
      title: "Persistir catálogo",
      detail: "Atualiza banco local e registra data da última sincronização.",
    },
  ],
  scriptPath: "api/tenable/sync-plugins",
});

ensurePlaybook({
  name: "Sync scans Tenable",
  description:
    "Sincroniza a lista de scans e detalhes para correlacionar ativos e vulnerabilidades.",
  squads: ["Vulnerability Ops", "Infra Sec"],
  automations: ["Agendamento diário", "Execução manual sob demanda"],
  status: "pronto",
  last_run: "Em preparação",
  steps: [
    {
      title: "Listar scans",
      detail: "Consulta os scans disponíveis e identifica execuções recentes.",
    },
    {
      title: "Detalhar execuções",
      detail: "Coleta metadados completos de cada scan no Tenable.VM.",
    },
    {
      title: "Persistir histórico",
      detail: "Armazena dados para consumo na gestão de vulnerabilidades.",
    },
  ],
  scriptPath: "api/tenable/sync-scans",
});

type CountRow = {
  total: number;
};

const automationJobCount = db
  .prepare<CountRow>("SELECT COUNT(*) as total FROM automation_jobs")
  .get();

if ((automationJobCount?.total ?? 0) === 0) {
  const now = Date.now();
  const offsetMinutes = (minutes: number) =>
    getLocalTimestamp(new Date(now - minutes * 60_000));
  const insertJob = db.prepare(
    `INSERT INTO automation_jobs
      (id, name, description, owner, queue_seconds, pending_issues, duration_seconds, last_run, status_code, created_at, updated_at)
     VALUES (@id, @name, @description, @owner, @queue_seconds, @pending_issues, @duration_seconds, @last_run, @status_code, @created_at, @updated_at)`
  );

  const seedJobs = [
    {
      id: "sync-web",
      name: "Sync backlog Web",
      description: "Garante sincronismo entre backlogs e issues prioritárias.",
      owner: "Squad Web",
      queue_seconds: 42,
      pending_issues: 37,
      duration_seconds: 133,
      last_run: offsetMinutes(4),
      status_code: 2,
    },
    {
      id: "close-done",
      name: "Decay 90d",
      description: "Enfileira fechamento automático após 90 dias.",
      owner: "Squad Jira",
      queue_seconds: 310,
      pending_issues: 120,
      duration_seconds: 105,
      last_run: offsetMinutes(60),
      status_code: 3,
    },
    {
      id: "sla-alert",
      name: "Alertar SLAs críticos",
      description: "Verifica SLAs de squads e dispara alertas.",
      owner: "Automação SOC",
      queue_seconds: 0,
      pending_issues: 18,
      duration_seconds: 32,
      last_run: offsetMinutes(12),
      status_code: 0,
    },
    {
      id: "bulk-comment",
      name: "Comentário padrão squads",
      description: "Publica comentários de alinhamento automaticamente.",
      owner: "Squad Backlog",
      queue_seconds: 0,
      pending_issues: 0,
      duration_seconds: 201,
      last_run: offsetMinutes(20),
      status_code: 1,
    },
  ];

  seedJobs.forEach((job) => {
    insertJob.run({
      ...job,
      created_at: offsetMinutes(120),
      updated_at: offsetMinutes(2),
    });
  });

  const insertLog = db.prepare(
    `INSERT INTO automation_job_logs (job_id, message, level, created_at)
     VALUES (?, ?, ?, ?)`
  );

  insertLog.run(
    "sync-web",
    "37 issues sincronizadas. Jira: OK · DB: OK",
    "info",
    offsetMinutes(4)
  );
  insertLog.run(
    "sla-alert",
    "Erro HTTP 429 ao consultar API Jira. Será reexecutado em 5 minutos.",
    "error",
    offsetMinutes(12)
  );
  insertLog.run(
    "close-done",
    "Fila aguardando slot livre. Esperando aprovação manual.",
    "warning",
    offsetMinutes(60)
  );
  insertLog.run(
    "bulk-comment",
    "Comentário aplicado em 64 issues. Sem falhas.",
    "info",
    offsetMinutes(20)
  );
}

const ensureAutomationJob = db.prepare(
  `INSERT INTO automation_jobs
    (id, name, description, owner, queue_seconds, pending_issues, duration_seconds, last_run, status_code, created_at, updated_at)
   VALUES (?, ?, ?, ?, 0, 0, 0, NULL, 3, ?, ?)`
);

function ensureAutomationJobExists(input: {
  id: string;
  name: string;
  description: string;
  owner: string;
}) {
  const exists = db
    .prepare<{ id: string }>("SELECT id FROM automation_jobs WHERE id = ?")
    .get(input.id);
  if (exists) return;
  const now = getLocalTimestamp();
  ensureAutomationJob.run(
    input.id,
    input.name,
    input.description,
    input.owner,
    now,
    now
  );
}

ensureAutomationJobExists({
  id: "tenable-plugins-sync",
  name: "Sync plugins Tenable",
  description: "Atualiza catálogo de vulnerabilidades Tenable (plugins).",
  owner: "Automação Tenable",
});

ensureAutomationJobExists({
  id: "tenable-scans-sync",
  name: "Sync scans Tenable",
  description: "Atualiza execuções e metadados dos scans Tenable.",
  owner: "Automação Tenable",
});

export { db };
