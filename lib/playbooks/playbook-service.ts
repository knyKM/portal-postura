import { db } from "@/lib/auth/database";

export type PlaybookCondition = {
  label: string;
  action: string;
};

export type PlaybookStep = {
  title: string;
  detail: string;
  conditions?: PlaybookCondition[];
};

export type PlaybookRecord = {
  id: number;
  name: string;
  description: string | null;
  squads: string;
  automations: string;
  status: string;
  last_run: string | null;
  steps: string;
  script_path: string | null;
  created_at: string;
  updated_at: string;
};

export type Playbook = {
  id: number;
  name: string;
  description: string | null;
  squads: string[];
  automations: string[];
  status: string;
  lastRun: string | null;
  steps: PlaybookStep[];
  scriptPath: string | null;
  createdAt: string;
  updatedAt: string;
};

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapRecord(record: PlaybookRecord): Playbook {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    squads: parseJson<string[]>(record.squads, []),
    automations: parseJson<string[]>(record.automations, []),
    status: record.status,
    lastRun: record.last_run,
    steps: parseJson<PlaybookStep[]>(record.steps, []),
    scriptPath: record.script_path ?? null,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function listPlaybooks(): Playbook[] {
  const stmt = db.prepare<PlaybookRecord>(
    "SELECT * FROM playbooks ORDER BY created_at DESC"
  );
  return stmt.all().map(mapRecord);
}

export function getPlaybookById(id: number): Playbook | null {
  const stmt = db.prepare<PlaybookRecord>("SELECT * FROM playbooks WHERE id = ?");
  const record = stmt.get(id);
  return record ? mapRecord(record) : null;
}

type CreatePlaybookInput = {
  name: string;
  description?: string | null;
  squads: string[];
  automations: string[];
  status?: string;
  lastRun?: string | null;
  steps?: PlaybookStep[];
  scriptPath?: string | null;
};

const DEFAULT_STEPS: PlaybookStep[] = [
  {
    title: "Defina os passos",
    detail: "Edite o playbook para incluir as etapas customizadas.",
    conditions: [],
  },
];

export function createPlaybook(data: CreatePlaybookInput): Playbook {
  const normalizedSteps =
    Array.isArray(data.steps) && data.steps.length > 0
      ? data.steps.map((step) => ({
          ...step,
          conditions: Array.isArray(step.conditions) ? step.conditions : [],
        }))
      : DEFAULT_STEPS;

  const stmt = db.prepare(
    `INSERT INTO playbooks
      (name, description, squads, automations, status, last_run, steps, script_path)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const info = stmt.run(
    data.name,
    data.description ?? null,
    JSON.stringify(data.squads),
    JSON.stringify(data.automations),
    data.status ?? "em validação",
    data.lastRun ?? null,
    JSON.stringify(normalizedSteps),
    data.scriptPath ?? null
  );

  const fetch = db.prepare<PlaybookRecord>("SELECT * FROM playbooks WHERE id = ?");
  const record = fetch.get(Number(info.lastInsertRowid));
  if (!record) {
    throw new Error("Falha ao criar playbook");
  }
  return mapRecord(record);
}

type UpdatePlaybookInput = Partial<{
  name: string;
  description: string | null;
  squads: string[];
  automations: string[];
  status: string;
  lastRun: string | null;
  steps: PlaybookStep[];
  scriptPath: string | null;
}>;

export function updatePlaybook(id: number, input: UpdatePlaybookInput): Playbook {
  const existing = getPlaybookById(id);
  if (!existing) {
    throw new Error("Playbook não encontrado");
  }

  const normalizedSteps =
    Array.isArray(input.steps) && input.steps.length > 0
      ? input.steps.map((step) => ({
          ...step,
          conditions: Array.isArray(step.conditions) ? step.conditions : [],
        }))
      : existing.steps;

  const stmt = db.prepare(
    `UPDATE playbooks
     SET name = ?, description = ?, squads = ?, automations = ?, status = ?, last_run = ?, steps = ?, script_path = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  );

  stmt.run(
    input.name ?? existing.name,
    input.description ?? existing.description,
    JSON.stringify(input.squads ?? existing.squads),
    JSON.stringify(input.automations ?? existing.automations),
    input.status ?? existing.status,
    input.lastRun ?? existing.lastRun,
    JSON.stringify(normalizedSteps),
    input.scriptPath ?? existing.scriptPath,
    id
  );

  const refreshed = getPlaybookById(id);
  if (!refreshed) {
    throw new Error("Falha ao atualizar playbook");
  }
  return refreshed;
}

export function deletePlaybook(id: number): boolean {
  const stmt = db.prepare("DELETE FROM playbooks WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}
