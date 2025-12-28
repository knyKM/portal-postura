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
"[project]/lib/auth/mfa-utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkMfaCode",
    ()=>checkMfaCode,
    "createMfaSecret",
    ()=>createMfaSecret,
    "getMfaOtpauthUrl",
    ()=>getMfaOtpauthUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$otplib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/otplib/index.js [app-route] (ecmascript)");
;
const MFA_APP_NAME = process.env.MFA_APP_NAME || "Postura SM";
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$otplib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticator"].options = {
    window: 1
};
function createMfaSecret(email) {
    const secret = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$otplib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticator"].generateSecret();
    const otpauthUrl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$otplib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticator"].keyuri(email, MFA_APP_NAME, secret);
    return {
        secret,
        otpauthUrl
    };
}
function getMfaOtpauthUrl(email, secret) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$otplib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticator"].keyuri(email, MFA_APP_NAME, secret);
}
function checkMfaCode(secret, code) {
    if (!secret) return false;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$otplib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticator"].verify({
        secret,
        token: code
    });
}
}),
"[project]/app/api/auth/mfa/verify/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$tokens$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/tokens.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$user$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/user-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$mfa$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/mfa-utils.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(request) {
    const body = await request.json().catch(()=>null);
    const token = body?.token;
    const code = body?.code?.trim();
    if (!token || !code) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Token e código são obrigatórios."
        }, {
            status: 400
        });
    }
    let payload;
    try {
        payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$tokens$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyMfaToken"])(token, "verify");
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Token inválido."
        }, {
            status: 401
        });
    }
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$user$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findUserById"])(payload.sub);
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Usuário não encontrado."
        }, {
            status: 404
        });
    }
    if (!user.mfa_secret || !user.mfa_enabled) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "MFA não configurado. Reinicie o processo de login."
        }, {
            status: 400
        });
    }
    const isValid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$mfa$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkMfaCode"])(user.mfa_secret, code);
    if (!isValid) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Código inválido."
        }, {
            status: 400
        });
    }
    const authToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$tokens$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthToken"])({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    });
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            is_active: Boolean(user.is_active)
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$user$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateUserLastSeen"])(user.id);
    response.cookies.set({
        name: "postura_auth",
        value: authToken,
        httpOnly: true,
        sameSite: "lax",
        secure: ("TURBOPACK compile-time value", "development") === "production",
        maxAge: 60 * 60,
        path: "/"
    });
    return response;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d50428c1._.js.map