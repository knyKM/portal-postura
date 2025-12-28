import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

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
    is_active INTEGER DEFAULT 1,
    mfa_secret TEXT,
    mfa_enabled INTEGER DEFAULT 0,
    last_seen_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

type TableInfoRow = {
  name: string;
};

const tableInfo = db
  .prepare("PRAGMA table_info(users)")
  .all() as TableInfoRow[];

const hasRoleColumn = tableInfo.some((column) => column.name === "role");
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
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

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

type CountRow = {
  total: number;
};

const automationJobCount = db
  .prepare<CountRow>("SELECT COUNT(*) as total FROM automation_jobs")
  .get();

if ((automationJobCount?.total ?? 0) === 0) {
  const now = Date.now();
  const offsetMinutes = (minutes: number) => new Date(now - minutes * 60_000).toISOString();
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

export { db };
