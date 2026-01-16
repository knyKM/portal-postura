"use server";

import { randomUUID } from "node:crypto";
import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";
import type {
  AutomationJob,
  AutomationJobStatus,
  AutomationLog,
  AutomationLogLevel,
} from "@/data/automation-monitor";

type AutomationJobRow = {
  id: string;
  name: string;
  description?: string | null;
  owner?: string | null;
  queue_seconds?: number | null;
  pending_issues?: number | null;
  duration_seconds?: number | null;
  last_run?: string | null;
  status_code: number;
  updated_at?: string | null;
};

type AutomationLogRow = {
  job_id: string;
  message: string;
  level?: string | null;
  created_at: string;
};

const STATUS_CODE_TO_LABEL: Record<number, AutomationJobStatus> = {
  0: "failed",
  1: "success",
  2: "running",
  3: "pending",
};

const VALID_STATUS_FOR_POST = new Set([0, 1, 2]);
const LOG_LEVELS: AutomationLogLevel[] = ["info", "warning", "error"];

function sanitizeLogLevel(level?: AutomationLogLevel | string | null) {
  if (!level) return "info" as AutomationLogLevel;
  return LOG_LEVELS.includes(level as AutomationLogLevel)
    ? (level as AutomationLogLevel)
    : "info";
}

function formatDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) {
    return "—";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}m${remainingSeconds
    .toString()
    .padStart(2, "0")}s`;
}

function formatRelativeTime(value?: string | null) {
  if (!value) return "Nunca";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60_000) return "agora";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function mapRowToJob(row: AutomationJobRow): AutomationJob {
  const status = STATUS_CODE_TO_LABEL[row.status_code] ?? "pending";
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    owner: row.owner || "Automação",
    status,
    queueSeconds: row.queue_seconds ?? 0,
    lastRun: formatRelativeTime(row.last_run),
    duration: formatDuration(row.duration_seconds),
    pendingIssues: row.pending_issues ?? 0,
  };
}

function mapLogRow(row: AutomationLogRow): AutomationLog {
  return {
    jobId: row.job_id,
    message: row.message,
    level: row.level as AutomationLogLevel | undefined,
    timestamp: formatTimestamp(row.created_at),
  };
}

export async function listAutomationSnapshot(limitLogs = 20) {
  const jobRows = db
    .prepare<AutomationJobRow>("SELECT * FROM automation_jobs ORDER BY created_at DESC")
    .all();
  const logRows = db
    .prepare<AutomationLogRow>(
      "SELECT job_id, message, level, created_at FROM automation_job_logs ORDER BY id DESC LIMIT ?"
    )
    .all(limitLogs);

  return {
    jobs: jobRows.map(mapRowToJob),
    logs: logRows.map(mapLogRow),
    generatedAt: getLocalTimestamp(),
  };
}

type CreateAutomationJobInput = {
  name: string;
  owner: string;
  description?: string;
  queueSeconds?: number;
  pendingIssues?: number;
};

export async function createAutomationJob(input: CreateAutomationJobInput) {
  const id = randomUUID();
  const now = getLocalTimestamp();
  db.prepare(
    `INSERT INTO automation_jobs
      (id, name, description, owner, queue_seconds, pending_issues, duration_seconds, last_run, status_code, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 0, NULL, 3, ?, ?)`
  ).run(
    id,
    input.name,
    input.description ?? null,
    input.owner,
    input.queueSeconds ?? 0,
    input.pendingIssues ?? 0,
    now,
    now
  );

  return mapRowToJob({
    id,
    name: input.name,
    description: input.description,
    owner: input.owner,
    queue_seconds: input.queueSeconds ?? 0,
    pending_issues: input.pendingIssues ?? 0,
    duration_seconds: 0,
    last_run: null,
    status_code: 3,
  });
}

type UpdateAutomationJobPayload = {
  statusCode: number;
  queueSeconds?: number;
  pendingIssues?: number;
  durationSeconds?: number;
  lastRunAt?: string;
  logMessage?: string;
  logLevel?: AutomationLogLevel;
};

export async function updateAutomationJobStatus(
  id: string,
  payload: UpdateAutomationJobPayload
) {
  if (!VALID_STATUS_FOR_POST.has(payload.statusCode)) {
    throw new Error("Status inválido. Utilize 0 (falhou), 1 (sucesso) ou 2 (em execução).");
  }

  const existing = db
    .prepare<AutomationJobRow>("SELECT * FROM automation_jobs WHERE id = ?")
    .get(id);

  if (!existing) {
    throw new Error("Job não encontrado.");
  }

  const now = getLocalTimestamp();
  const nextQueueSeconds =
    typeof payload.queueSeconds === "number"
      ? Math.max(0, Math.round(payload.queueSeconds))
      : existing.queue_seconds ?? 0;
  const nextPendingIssues =
    typeof payload.pendingIssues === "number"
      ? Math.max(0, Math.round(payload.pendingIssues))
      : existing.pending_issues ?? 0;
  const nextDuration =
    typeof payload.durationSeconds === "number"
      ? Math.max(0, Math.round(payload.durationSeconds))
      : existing.duration_seconds ?? 0;

  let nextLastRun = existing.last_run;
  if (payload.lastRunAt) {
    nextLastRun = payload.lastRunAt;
  } else if (payload.statusCode === 0 || payload.statusCode === 1) {
    nextLastRun = now;
  }

  db.prepare(
    `UPDATE automation_jobs
     SET status_code = ?, queue_seconds = ?, pending_issues = ?, duration_seconds = ?, last_run = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    payload.statusCode,
    nextQueueSeconds,
    nextPendingIssues,
    nextDuration,
    nextLastRun,
    now,
    id
  );

  if (payload.logMessage) {
    const level = sanitizeLogLevel(payload.logLevel);
    db.prepare(
      `INSERT INTO automation_job_logs (job_id, message, level, created_at)
       VALUES (?, ?, ?, ?)`
    ).run(id, payload.logMessage, level, now);
  }

  return mapRowToJob({
    ...existing,
    queue_seconds: nextQueueSeconds,
    pending_issues: nextPendingIssues,
    duration_seconds: nextDuration,
    last_run: nextLastRun,
    status_code: payload.statusCode,
    updated_at: now,
  });
}

type UpdateAutomationJobMetadataInput = {
  name?: string;
  owner?: string;
  description?: string;
  queueSeconds?: number;
  pendingIssues?: number;
};

export async function updateAutomationJobMetadata(
  id: string,
  updates: UpdateAutomationJobMetadataInput
) {
  const existing = db
    .prepare<AutomationJobRow>("SELECT * FROM automation_jobs WHERE id = ?")
    .get(id);

  if (!existing) {
    throw new Error("Job não encontrado.");
  }

  const nextName =
    typeof updates.name === "string" && updates.name.trim().length > 0
      ? updates.name.trim()
      : existing.name;
  const nextOwner =
    typeof updates.owner === "string" && updates.owner.trim().length > 0
      ? updates.owner.trim()
      : existing.owner ?? "Automação";
  const nextDescription =
    typeof updates.description === "string"
      ? updates.description.trim()
      : existing.description ?? null;
  const nextQueue =
    typeof updates.queueSeconds === "number"
      ? Math.max(0, Math.round(updates.queueSeconds))
      : existing.queue_seconds ?? 0;
  const nextPending =
    typeof updates.pendingIssues === "number"
      ? Math.max(0, Math.round(updates.pendingIssues))
      : existing.pending_issues ?? 0;

  const now = getLocalTimestamp();
  db.prepare(
    `UPDATE automation_jobs
       SET name = ?, owner = ?, description = ?, queue_seconds = ?, pending_issues = ?, updated_at = ?
     WHERE id = ?`
  ).run(nextName, nextOwner, nextDescription, nextQueue, nextPending, now, id);

  return mapRowToJob({
    ...existing,
    name: nextName,
    owner: nextOwner,
    description: nextDescription ?? undefined,
    queue_seconds: nextQueue,
    pending_issues: nextPending,
    updated_at: now,
  });
}
