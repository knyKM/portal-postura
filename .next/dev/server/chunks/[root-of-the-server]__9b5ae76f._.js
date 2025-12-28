module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/auth/tokens.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAuthToken",
    ()=>createAuthToken,
    "createMfaToken",
    ()=>createMfaToken,
    "verifyAuthToken",
    ()=>verifyAuthToken,
    "verifyMfaToken",
    ()=>verifyMfaToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
const DEFAULT_EXPIRATION = "1h";
const MFA_TOKEN_EXPIRATION = "10m";
const AUTH_SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change";
function createAuthToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, AUTH_SECRET, {
        expiresIn: DEFAULT_EXPIRATION
    });
}
function verifyAuthToken(token) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, AUTH_SECRET);
}
function createMfaToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, AUTH_SECRET, {
        expiresIn: MFA_TOKEN_EXPIRATION
    });
}
function verifyMfaToken(token, expectedPurpose) {
    const payload = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, AUTH_SECRET);
    if (payload.purpose !== expectedPurpose) {
        throw new Error("Invalid MFA token purpose");
    }
    return payload;
}
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/better-sqlite3 [external] (better-sqlite3, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("better-sqlite3", () => require("better-sqlite3"));

module.exports = mod;
}),
"[project]/lib/auth/database.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs)");
;
;
;
const dataDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data");
const dbFile = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(dataDir, "auth.db");
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dataDir)) {
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(dataDir, {
        recursive: true
    });
}
const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](dbFile);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'analista',
    is_active INTEGER DEFAULT 1,
    mfa_secret TEXT,
    mfa_enabled INTEGER DEFAULT 0,
    last_seen_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);
const tableInfo = db.prepare("PRAGMA table_info(users)").all();
const hasRoleColumn = tableInfo.some((column)=>column.name === "role");
const hasIsActiveColumn = tableInfo.some((column)=>column.name === "is_active");
const hasMfaSecretColumn = tableInfo.some((column)=>column.name === "mfa_secret");
const hasMfaEnabledColumn = tableInfo.some((column)=>column.name === "mfa_enabled");
const hasLastSeenColumn = tableInfo.some((column)=>column.name === "last_seen_at");
if (!hasRoleColumn) {
    db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'analista'");
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
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
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
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
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
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS automation_job_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id TEXT NOT NULL,
    message TEXT NOT NULL,
    level TEXT DEFAULT 'info',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES automation_jobs(id) ON DELETE CASCADE
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS idea_suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    implementation_stage TEXT DEFAULT 'Descoberta',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);
const suggestionTableInfo = db.prepare("PRAGMA table_info(idea_suggestions)").all();
const hasSuggestionStatusColumn = suggestionTableInfo.some((column)=>column.name === "status");
const hasImplementationStageColumn = suggestionTableInfo.some((column)=>column.name === "implementation_stage");
if (!hasSuggestionStatusColumn) {
    db.exec("ALTER TABLE idea_suggestions ADD COLUMN status TEXT DEFAULT 'pending'");
    db.exec("UPDATE idea_suggestions SET status = 'pending' WHERE status IS NULL OR status = ''");
}
if (!hasImplementationStageColumn) {
    db.exec("ALTER TABLE idea_suggestions ADD COLUMN implementation_stage TEXT DEFAULT 'Descoberta'");
    db.exec("UPDATE idea_suggestions SET implementation_stage = 'Descoberta' WHERE implementation_stage IS NULL OR implementation_stage = ''");
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
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);
const playbookTableInfo = db.prepare("PRAGMA table_info(playbooks)").all();
const hasScriptPathColumn = playbookTableInfo.some((column)=>column.name === "script_path");
if (!hasScriptPathColumn) {
    db.exec("ALTER TABLE playbooks ADD COLUMN script_path TEXT");
}
const playbookCount = db.prepare("SELECT COUNT(*) as total FROM playbooks").get();
if ((playbookCount?.total ?? 0) === 0) {
    const insertPlaybook = db.prepare(`INSERT INTO playbooks
      (name, description, squads, automations, status, last_run, steps, script_path)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    const seeds = [
        {
            name: "Reforço OWASP Top 10",
            description: "Escaneia superfícies expostas, abre issues Jira e envia comandos para correções automáticas nos microserviços.",
            squads: [
                "Portal B2C",
                "Checkout"
            ],
            automations: [
                "JQL: label=owasp_top10",
                "Webhook: pipelines-devsecops"
            ],
            status: "pronto",
            last_run: "Há 2 dias",
            steps: [
                {
                    title: "Detectar superficies",
                    detail: "Executar scanners Tenable e APIs internas para serviço web."
                },
                {
                    title: "Abrir issues",
                    detail: "Criar tickets Jira por squad com prioridade automática."
                },
                {
                    title: "Aplicar correções",
                    detail: "Disparar playbooks React + Vite para ajustar pipelines."
                }
            ],
            scriptPath: "scripts/owasp_reinforcement.sh"
        },
        {
            name: "Resiliência de Identidades",
            description: "Revisa todas as identidades privilegiadas, aplica MFA obrigatório e dispara alertas quando políticas são quebradas.",
            squads: [
                "IAM",
                "Infra Sec"
            ],
            automations: [
                "Suspender contas inativas",
                "Sincronizar MFA"
            ],
            status: "em validação",
            last_run: "Há 6 horas",
            steps: [
                {
                    title: "Inventário IAM",
                    detail: "Listar contas privilegiadas e verificar status MFA."
                },
                {
                    title: "Aplicar políticas",
                    detail: "Sincronizar MFA e bloquear exceções automaticamente."
                },
                {
                    title: "Alertar squads",
                    detail: "Enviar relatórios para SOC e líderes das tribos."
                }
            ],
            scriptPath: "scripts/iam_resilience.py"
        },
        {
            name: "Higienização de Repositórios",
            description: "Fluxo para rodar scanners de segredos, abrir tickets e integrar com pipelines React + Vite automaticamente.",
            squads: [
                "DevRel",
                "DevSecOps"
            ],
            automations: [
                "Scanner secrets",
                "Remover tokens vazados"
            ],
            status: "em construção",
            last_run: "Em preparação",
            steps: [
                {
                    title: "Rodar scanners",
                    detail: "Executar detecção de segredos em repositórios React."
                },
                {
                    title: "Iniciar remediação",
                    detail: "Abrir tickets e atribuir tasks automáticas por squad."
                },
                {
                    title: "Validar build",
                    detail: "Ajustar pipelines Vite para prevenir regressões."
                }
            ],
            scriptPath: "scripts/higienizacao_repos.sh"
        },
        {
            name: "Limpeza e Scans Tenable",
            description: "Remove scans antigos do Tenable.VM para impedir que o limite de 10k seja atingido e garante continuidade dos assessments.",
            squads: [
                "Vulnerability Ops",
                "Infra Sec"
            ],
            automations: [
                "Cleanup scans Tenable.VM",
                "Monitor limite 10k",
                "Notificar SOC"
            ],
            status: "pronto",
            last_run: "Há 1 hora",
            steps: [
                {
                    title: "Identificar scans antigos",
                    detail: "Listar execuções acima de 30 dias e sinalizar excedentes."
                },
                {
                    title: "Remover do Tenable.VM",
                    detail: "Executar API de exclusão mantendo histórico local."
                },
                {
                    title: "Notificar SOC",
                    detail: "Enviar relatório e garantir capacidade abaixo de 10k."
                }
            ],
            scriptPath: "scripts/tenable_cleanup.sh"
        },
        {
            name: "Atualização de senha Tenable.IE",
            description: "Atualiza a senha em rotação no Tenable.IE para manter a comunicação com o Active Directory Redecorp, evitando falhas nos scanners.",
            squads: [
                "IAM",
                "Vulnerability Ops"
            ],
            automations: [
                "Rotacionar credencial serviço",
                "Sincronizar Tenable.IE",
                "Validar comunicação AD Redecorp"
            ],
            status: "em validação",
            last_run: "Há 30 minutos",
            steps: [
                {
                    title: "Obter senha nova",
                    detail: "Consultar cofre e validar rotação prevista."
                },
                {
                    title: "Atualizar Tenable.IE",
                    detail: "Aplicar a senha no conector e registrar data."
                },
                {
                    title: "Testar AD",
                    detail: "Executar teste de comunicação com o Active Directory Redecorp."
                }
            ],
            scriptPath: "scripts/update_tenable_password.py"
        }
    ];
    seeds.forEach((seed)=>{
        insertPlaybook.run(seed.name, seed.description, JSON.stringify(seed.squads), JSON.stringify(seed.automations), seed.status, seed.last_run, JSON.stringify(seed.steps), seed.scriptPath);
    });
}
const automationJobCount = db.prepare("SELECT COUNT(*) as total FROM automation_jobs").get();
if ((automationJobCount?.total ?? 0) === 0) {
    const now = Date.now();
    const offsetMinutes = (minutes)=>new Date(now - minutes * 60_000).toISOString();
    const insertJob = db.prepare(`INSERT INTO automation_jobs
      (id, name, description, owner, queue_seconds, pending_issues, duration_seconds, last_run, status_code, created_at, updated_at)
     VALUES (@id, @name, @description, @owner, @queue_seconds, @pending_issues, @duration_seconds, @last_run, @status_code, @created_at, @updated_at)`);
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
            status_code: 2
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
            status_code: 3
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
            status_code: 0
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
            status_code: 1
        }
    ];
    seedJobs.forEach((job)=>{
        insertJob.run({
            ...job,
            created_at: offsetMinutes(120),
            updated_at: offsetMinutes(2)
        });
    });
    const insertLog = db.prepare(`INSERT INTO automation_job_logs (job_id, message, level, created_at)
     VALUES (?, ?, ?, ?)`);
    insertLog.run("sync-web", "37 issues sincronizadas. Jira: OK · DB: OK", "info", offsetMinutes(4));
    insertLog.run("sla-alert", "Erro HTTP 429 ao consultar API Jira. Será reexecutado em 5 minutos.", "error", offsetMinutes(12));
    insertLog.run("close-done", "Fila aguardando slot livre. Esperando aprovação manual.", "warning", offsetMinutes(60));
    insertLog.run("bulk-comment", "Comentário aplicado em 64 issues. Sem falhas.", "info", offsetMinutes(20));
}
;
}),
"[project]/lib/auth/password.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
function hashPassword(password) {
    const salt = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(16).toString("hex");
    const hash = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
}
function verifyPassword(password, storedHash) {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) {
        return false;
    }
    const derived = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].scryptSync(password, salt, 64);
    const stored = Buffer.from(hash, "hex");
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(derived, stored);
}
}),
"[project]/lib/auth/user-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createUser",
    ()=>createUser,
    "enableUserMfa",
    ()=>enableUserMfa,
    "findUserByEmail",
    ()=>findUserByEmail,
    "findUserById",
    ()=>findUserById,
    "listAdmins",
    ()=>listAdmins,
    "listOnlineAdmins",
    ()=>listOnlineAdmins,
    "listUsers",
    ()=>listUsers,
    "updateUserActiveStatus",
    ()=>updateUserActiveStatus,
    "updateUserLastSeen",
    ()=>updateUserLastSeen,
    "upsertUserMfaSecret",
    ()=>upsertUserMfaSecret,
    "validateUserCredentials",
    ()=>validateUserCredentials
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$password$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/password.ts [app-route] (ecmascript)");
;
;
const seedUser = {
    email: "admin@postura.com",
    password: "cyber123",
    name: "Administrador Postura SM",
    avatar: "/logo_vivo_sem_fundo.png",
    role: "admin"
};
let isSeeded = false;
function seedAdmin() {
    if (isSeeded) return;
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("SELECT id, role, is_active FROM users WHERE email = ?");
    const existing = stmt.get(seedUser.email);
    if (!existing) {
        const insert = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("INSERT INTO users (email, password_hash, name, avatar, role, is_active) VALUES (?, ?, ?, ?, ?, 1)");
        insert.run(seedUser.email, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$password$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(seedUser.password), seedUser.name, seedUser.avatar, seedUser.role);
    } else if (existing.role !== seedUser.role || existing.is_active !== 1) {
        const update = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("UPDATE users SET role = ?, is_active = 1 WHERE id = ?");
        update.run(seedUser.role, existing.id);
    }
    isSeeded = true;
}
function findUserByEmail(email) {
    seedAdmin();
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("SELECT id, email, name, avatar, password_hash, role, is_active, mfa_secret, mfa_enabled, last_seen_at, created_at FROM users WHERE email = ?");
    return stmt.get(email);
}
function validateUserCredentials(email, password) {
    const user = findUserByEmail(email);
    if (!user) return null;
    const isValid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$password$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPassword"])(password, user.password_hash);
    if (!isValid) {
        return null;
    }
    if (!user.is_active) {
        return null;
    }
    return user;
}
function createUser({ name, email, password, role, avatar = null }) {
    seedAdmin();
    const normalizedEmail = email.trim().toLowerCase();
    const insert = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("INSERT INTO users (name, email, password_hash, role, avatar, is_active) VALUES (?, ?, ?, ?, ?, 1)");
    const result = insert.run(name.trim(), normalizedEmail, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$password$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(password), role, avatar);
    const insertedId = Number(result.lastInsertRowid);
    const fetchNew = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("SELECT id, email, name, avatar, password_hash, role, is_active, mfa_secret, mfa_enabled, last_seen_at, created_at FROM users WHERE id = ?");
    const created = fetchNew.get(insertedId);
    if (!created) {
        throw new Error("Falha ao criar usuário.");
    }
    return created;
}
function listAdmins() {
    seedAdmin();
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("SELECT id, name, email FROM users WHERE role = 'admin'");
    return stmt.all();
}
function listUsers() {
    seedAdmin();
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("SELECT id, name, email, role, created_at, is_active, last_seen_at FROM users ORDER BY created_at DESC");
    return stmt.all();
}
function updateUserActiveStatus(userId, isActive) {
    seedAdmin();
    const update = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("UPDATE users SET is_active = ? WHERE id = ?");
    const result = update.run(isActive ? 1 : 0, userId);
    if (result.changes === 0) {
        return null;
    }
    const fetch = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("SELECT id, email, name, avatar, password_hash, role, is_active, mfa_secret, mfa_enabled, last_seen_at, created_at FROM users WHERE id = ?");
    return fetch.get(userId) ?? null;
}
function findUserById(id) {
    seedAdmin();
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("SELECT id, email, name, avatar, password_hash, role, is_active, mfa_secret, mfa_enabled, last_seen_at, created_at FROM users WHERE id = ?");
    return stmt.get(id);
}
function upsertUserMfaSecret(userId, secret) {
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("UPDATE users SET mfa_secret = ?, mfa_enabled = 0 WHERE id = ?");
    stmt.run(secret, userId);
}
function enableUserMfa(userId) {
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("UPDATE users SET mfa_enabled = 1 WHERE id = ?");
    stmt.run(userId);
}
function updateUserLastSeen(userId) {
    seedAdmin();
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("UPDATE users SET last_seen_at = CURRENT_TIMESTAMP WHERE id = ?");
    stmt.run(userId);
}
function listOnlineAdmins(withinMinutes = 5) {
    seedAdmin();
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("SELECT id, name, email, last_seen_at FROM users WHERE role = 'admin' AND last_seen_at IS NOT NULL AND datetime(last_seen_at) >= datetime('now', ?) ORDER BY datetime(last_seen_at) DESC");
    return stmt.all(`-${withinMinutes} minutes`);
}
}),
"[project]/lib/auth/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSessionUser",
    ()=>getSessionUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$tokens$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/tokens.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$user$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/user-service.ts [app-route] (ecmascript)");
;
;
;
;
async function getSessionUser(cookieHeader) {
    let token;
    if (!cookieHeader) {
        try {
            const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
            token = cookieStore.get?.("postura_auth")?.value;
        } catch  {
        // cookies() might throw outside of a request context
        }
    }
    if (!token) {
        const source = cookieHeader ?? "";
        token = source.split(";").map((entry)=>entry.trim()).find((entry)=>entry.startsWith("postura_auth="))?.split("=")[1];
        if (token) {
            try {
                token = decodeURIComponent(token);
            } catch  {
                token = undefined;
            }
        }
    }
    if (!token) {
        return null;
    }
    try {
        const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$tokens$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAuthToken"])(token);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$user$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateUserLastSeen"])(payload.sub);
        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role
        };
    } catch  {
        return null;
    }
}
}),
"[project]/lib/actions/action-request-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createActionRequest",
    ()=>createActionRequest,
    "listCompletedRequests",
    ()=>listCompletedRequests,
    "listPendingRequests",
    ()=>listPendingRequests,
    "listRecentRequests",
    ()=>listRecentRequests,
    "listUserRequests",
    ()=>listUserRequests,
    "updateActionRequestStatus",
    ()=>updateActionRequestStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/database.ts [app-route] (ecmascript)");
;
function createActionRequest({ actionType, filterMode, filterValue, requestedStatus, payload, requester }) {
    const insert = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`INSERT INTO action_requests
      (action_type, filter_mode, filter_value, requested_status, payload, requester_id, requester_email, requester_name)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    const payloadString = payload ? JSON.stringify(payload) : null;
    const result = insert.run(actionType, filterMode, filterValue, requestedStatus ?? null, payloadString, requester.id, requester.email, requester.name);
    const id = Number(result.lastInsertRowid);
    const fetch = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("SELECT * FROM action_requests WHERE id = ?");
    const record = fetch.get(id);
    if (!record) {
        throw new Error("Falha ao registrar a ação.");
    }
    return record;
}
function listRecentRequests(limit = 5) {
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`SELECT * FROM action_requests
     ORDER BY created_at DESC
     LIMIT ?`);
    return stmt.all(limit);
}
function listPendingRequests(limit = 20) {
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`SELECT * FROM action_requests
     WHERE status = 'pending'
     ORDER BY created_at ASC
     LIMIT ?`);
    return stmt.all(limit);
}
function listCompletedRequests(limit = 20) {
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`SELECT * FROM action_requests
     WHERE status IN ('approved', 'declined')
     ORDER BY approved_at DESC
     LIMIT ?`);
    return stmt.all(limit);
}
function listUserRequests({ userId, status, limit = 20 }) {
    if (status === "completed") {
        const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`SELECT * FROM action_requests
       WHERE requester_id = ?
         AND status IN ('approved', 'declined')
       ORDER BY approved_at DESC, created_at DESC
       LIMIT ?`);
        return stmt.all(userId, limit);
    }
    if (status === "pending" || status === "approved" || status === "declined") {
        const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`SELECT * FROM action_requests
       WHERE requester_id = ?
         AND status = ?
       ORDER BY created_at DESC
       LIMIT ?`);
        return stmt.all(userId, status, limit);
    }
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`SELECT * FROM action_requests
     WHERE requester_id = ?
     ORDER BY created_at DESC
     LIMIT ?`);
    return stmt.all(userId, limit);
}
function updateActionRequestStatus({ id, status, approverName, auditNotes }) {
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`UPDATE action_requests
     SET status = ?,
         approved_at = CURRENT_TIMESTAMP,
         approved_by = ?,
         audit_notes = ?
     WHERE id = ?`);
    stmt.run(status, approverName, auditNotes ?? null, id);
    const fetch = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("SELECT * FROM action_requests WHERE id = ?");
    return fetch.get(id);
}
}),
"[project]/lib/notifications/notification-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "countUnreadNotifications",
    ()=>countUnreadNotifications,
    "createNotification",
    ()=>createNotification,
    "deleteUserNotifications",
    ()=>deleteUserNotifications,
    "listUserNotifications",
    ()=>listUserNotifications,
    "markNotificationsAsRead",
    ()=>markNotificationsAsRead
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/database.ts [app-route] (ecmascript)");
;
function createNotification({ userId, type, title, message, payload }) {
    const insert = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`INSERT INTO notifications (user_id, type, title, message, payload)
     VALUES (?, ?, ?, ?, ?)`);
    const payloadString = payload ? JSON.stringify(payload) : null;
    const result = insert.run(userId, type, title, message, payloadString);
    const insertedId = Number(result.lastInsertRowid);
    const fetch = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare("SELECT * FROM notifications WHERE id = ?");
    const record = fetch.get(insertedId);
    if (!record) {
        throw new Error("Falha ao registrar notificação.");
    }
    return record;
}
function listUserNotifications(userId, limit = 20) {
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`SELECT * FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT ?`);
    return stmt.all(userId, limit);
}
function countUnreadNotifications(userId) {
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`SELECT COUNT(*) as total
     FROM notifications
     WHERE user_id = ? AND is_read = 0`);
    const row = stmt.get(userId);
    return row?.total ?? 0;
}
function markNotificationsAsRead(userId, notificationIds) {
    if (notificationIds && notificationIds.length > 0) {
        const placeholders = notificationIds.map(()=>"?").join(", ");
        const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`UPDATE notifications
       SET is_read = 1,
           read_at = CURRENT_TIMESTAMP
       WHERE user_id = ?
         AND id IN (${placeholders})
         AND is_read = 0`);
        stmt.run(userId, ...notificationIds);
        return;
    }
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`UPDATE notifications
     SET is_read = 1,
         read_at = CURRENT_TIMESTAMP
     WHERE user_id = ?
       AND is_read = 0`);
    stmt.run(userId);
}
function deleteUserNotifications(userId) {
    const stmt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prepare(`DELETE FROM notifications WHERE user_id = ?`);
    stmt.run(userId);
}
}),
"[project]/app/api/actions/requests/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/session.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$action$2d$request$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/action-request-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$user$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/user-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$notifications$2f$notification$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/notifications/notification-service.ts [app-route] (ecmascript)");
;
;
;
;
;
const ALLOWED_STATUS = [
    "DONE",
    "Cancelado"
];
const SUPPORTED_ACTIONS = [
    "status",
    "assignee",
    "comment",
    "fields",
    "escalate",
    "delete"
];
const ACTION_LABELS = {
    status: "alterar status",
    assignee: "mudar responsável",
    comment: "adicionar comentário",
    fields: "atualizar campos",
    escalate: "subir issue",
    delete: "deletar issue"
};
function serializeRequest(record) {
    return {
        id: record.id,
        action_type: record.action_type,
        filter_mode: record.filter_mode,
        filter_value: record.filter_value,
        requested_status: record.requested_status,
        payload: record.payload ? safeParsePayload(record.payload) : null,
        requester_name: record.requester_name,
        requester_email: record.requester_email,
        status: record.status,
        created_at: record.created_at,
        approved_at: record.approved_at,
        approved_by: record.approved_by,
        audit_notes: record.audit_notes
    };
}
function safeParsePayload(raw) {
    try {
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function describeActionSummary(actionType, requestedStatus, payload) {
    switch(actionType){
        case "status":
            return requestedStatus ? `${ACTION_LABELS.status} para ${requestedStatus}` : ACTION_LABELS.status;
        case "assignee":
            return payload?.assignee ? `${ACTION_LABELS.assignee} para ${payload.assignee}` : ACTION_LABELS.assignee;
        case "comment":
            return ACTION_LABELS.comment;
        case "fields":
            {
                const total = Array.isArray(payload?.fields) ? payload.fields?.length ?? 0 : 0;
                return total ? `${ACTION_LABELS.fields} (${total} campo${total > 1 ? "s" : ""})` : ACTION_LABELS.fields;
            }
        case "escalate":
            return ACTION_LABELS.escalate;
        case "delete":
            return ACTION_LABELS.delete;
        default:
            return "executar ação";
    }
}
function buildNotificationPayload(record, actionType, requestedStatus, payload, extra) {
    return {
        requestId: record.id,
        actionType,
        filterMode: record.filter_mode,
        filterValue: record.filter_value,
        requestedStatus: requestedStatus ?? record.requested_status ?? null,
        ...payload ?? {},
        ...extra ?? {}
    };
}
function notifyAdminsOfRequest({ record, requesterName, actionType, requestedStatus, payload }) {
    const admins = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$user$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listAdmins"])();
    const summary = describeActionSummary(actionType, requestedStatus, payload);
    admins.forEach((admin)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$notifications$2f$notification$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createNotification"])({
            userId: admin.id,
            type: "action_request_received",
            title: "Nova solicitação de ação",
            message: `${requesterName} solicitou ${summary}.`,
            payload: buildNotificationPayload(record, actionType, requestedStatus, payload)
        });
    });
}
function notifyRequesterDecision({ record, decision, approverName }) {
    if (!record.requester_id) return;
    const payload = record.payload ? safeParsePayload(record.payload) : null;
    const summary = describeActionSummary(record.action_type, record.requested_status, payload);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$notifications$2f$notification$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createNotification"])({
        userId: record.requester_id,
        type: "action_request_decision",
        title: decision === "approved" ? "Solicitação aprovada" : "Solicitação declinada",
        message: `Sua solicitação #${record.id} para ${summary} foi ${decision === "approved" ? "aprovada" : "declinada"} por ${approverName}.`,
        payload: buildNotificationPayload(record, record.action_type, record.requested_status ?? undefined, payload, {
            decision
        })
    });
}
async function GET(request) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUser"])(request.headers.get("cookie") ?? undefined);
    if (!session) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Sessão inválida."
        }, {
            status: 401
        });
    }
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const scope = searchParams.get("scope");
    const limitParam = Number(searchParams.get("limit") ?? (scope === "self" ? 25 : 50));
    const limit = Number.isNaN(limitParam) ? scope === "self" ? 25 : 50 : Math.max(1, Math.min(100, limitParam));
    if (scope === "self") {
        const normalizedStatus = statusFilter === "pending" || statusFilter === "approved" || statusFilter === "declined" || statusFilter === "completed" ? statusFilter : undefined;
        const userRequests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$action$2d$request$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserRequests"])({
            userId: session.id,
            status: normalizedStatus,
            limit
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            requests: userRequests.map((record)=>serializeRequest(record))
        });
    }
    if (session.role !== "admin") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Não autorizado."
        }, {
            status: 403
        });
    }
    const rawRequests = statusFilter === "pending" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$action$2d$request$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listPendingRequests"])(limit) : statusFilter === "completed" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$action$2d$request$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listCompletedRequests"])(limit) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$action$2d$request$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listRecentRequests"])(limit);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        requests: rawRequests.map((record)=>serializeRequest(record))
    });
}
async function POST(request) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUser"])(request.headers.get("cookie") ?? undefined);
    if (!session) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Sessão inválida. Autentique-se novamente."
        }, {
            status: 401
        });
    }
    const body = await request.json();
    const actionType = body?.actionType ?? "status";
    const filterMode = body?.filterMode;
    const filterValue = body?.filterValue?.trim();
    const requestedStatus = body?.requestedStatus;
    const projectKey = body?.projectKey?.trim();
    const csvData = body?.csvData?.trim();
    const csvFileName = body?.csvFileName?.trim();
    if (!SUPPORTED_ACTIONS.includes(actionType)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Tipo de ação não suportado."
        }, {
            status: 400
        });
    }
    let normalizedFilterMode = filterMode;
    let normalizedFilterValue = filterValue;
    if (actionType === "escalate") {
        normalizedFilterMode = "project";
        normalizedFilterValue = projectKey ?? "";
    }
    if (actionType !== "escalate") {
        if (!normalizedFilterMode || ![
            "jql",
            "ids"
        ].includes(normalizedFilterMode)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Filtro inválido. Escolha entre JQL ou IDs."
            }, {
                status: 400
            });
        }
        if (!normalizedFilterValue) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Informe o conjunto de issues para a ação."
            }, {
                status: 400
            });
        }
    } else if (!projectKey) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Selecione o projeto destino para escalar as issues."
        }, {
            status: 400
        });
    }
    let payload = null;
    let nextRequestedStatus = undefined;
    if (actionType === "status") {
        if (!requestedStatus || !ALLOWED_STATUS.includes(requestedStatus)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Status inválido."
            }, {
                status: 400
            });
        }
        nextRequestedStatus = requestedStatus;
    } else if (actionType === "assignee") {
        const assignee = body?.assignee?.trim();
        if (!assignee) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Informe o novo responsável."
            }, {
                status: 400
            });
        }
        payload = {
            assignee
        };
    } else if (actionType === "comment") {
        const comment = body?.comment?.trim();
        if (!comment) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Digite o comentário da ação."
            }, {
                status: 400
            });
        }
        payload = {
            comment
        };
    } else if (actionType === "fields") {
        const fields = (body?.fields ?? []).map((field)=>({
                key: field?.key?.trim() ?? "",
                value: field?.value?.trim() ?? ""
            }));
        const hasValidFields = Array.isArray(body?.fields) && fields.length > 0 && fields.every((field)=>field.key && field.value);
        if (!hasValidFields) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Informe ao menos um campo com valor."
            }, {
                status: 400
            });
        }
        payload = {
            fields
        };
    } else if (actionType === "escalate") {
        const fields = (body?.fields ?? []).map((field)=>({
                key: field?.key?.trim() ?? "",
                value: field?.value?.trim() ?? ""
            }));
        const validFields = fields.filter((field)=>field.key && field.value);
        if (!projectKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Selecione o projeto destino antes de enviar."
            }, {
                status: 400
            });
        }
        if (validFields.length === 0 && !csvData) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Envie o arquivo CSV de template ou preencha ao menos um campo personalizado."
            }, {
                status: 400
            });
        }
        payload = {
            projectKey,
            fields: validFields.length ? validFields : undefined,
            csvData: csvData || undefined,
            csvFileName: csvFileName || undefined
        };
    }
    const record = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$action$2d$request$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createActionRequest"])({
        actionType,
        filterMode: normalizedFilterMode ?? "jql",
        filterValue: normalizedFilterValue ?? "",
        requestedStatus: nextRequestedStatus,
        payload,
        requester: {
            id: session.id,
            email: session.email,
            name: session.name
        }
    });
    notifyAdminsOfRequest({
        record,
        requesterName: session.name,
        actionType,
        requestedStatus: nextRequestedStatus,
        payload
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        request: serializeRequest(record)
    }, {
        status: 201
    });
}
async function PATCH(request) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUser"])(request.headers.get("cookie") ?? undefined);
    if (!session || session.role !== "admin") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Apenas administradores podem aprovar ações."
        }, {
            status: 403
        });
    }
    const body = await request.json();
    const id = body?.id;
    const decision = body?.decision;
    const notes = body?.notes?.trim();
    if (!id || decision !== "approve" && decision !== "decline") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Requisição inválida."
        }, {
            status: 400
        });
    }
    if (!notes) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Informe o motivo da aprovação ou declínio."
        }, {
            status: 400
        });
    }
    const newStatus = decision === "approve" ? "approved" : "declined";
    const updated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$action$2d$request$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateActionRequestStatus"])({
        id,
        status: newStatus,
        approverName: session.name,
        auditNotes: notes
    });
    if (!updated) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Solicitação não encontrada."
        }, {
            status: 404
        });
    }
    notifyRequesterDecision({
        record: updated,
        decision: newStatus,
        approverName: session.name
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        request: updated ? serializeRequest(updated) : null
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9b5ae76f._.js.map