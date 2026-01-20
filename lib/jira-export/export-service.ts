import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

export type JiraExportJobRecord = {
  id: number;
  requester_id: number;
  jql: string;
  fields_json: string;
  status: "queued" | "running" | "completed" | "failed";
  file_path: string | null;
  file_name: string | null;
  error_message: string | null;
  expires_at: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
};

export type JiraExportJobPayload = {
  requesterId: number;
  jql: string;
  fields: string[];
};

export function createJiraExportJob(input: JiraExportJobPayload) {
  const now = getLocalTimestamp();
  const fieldsJson = JSON.stringify(input.fields);
  const record = db
    .prepare<JiraExportJobRecord>(
      `INSERT INTO jira_export_jobs
        (requester_id, jql, fields_json, status, created_at)
       VALUES (?, ?, ?, 'queued', ?)
       RETURNING id, requester_id, jql, fields_json, status, file_path, file_name, error_message, expires_at, created_at, started_at, finished_at`
    )
    .get(input.requesterId, input.jql, fieldsJson, now);
  return record;
}

export function listJiraExportJobsByUser(userId: number) {
  return db
    .prepare<JiraExportJobRecord>(
      `SELECT id, requester_id, jql, fields_json, status, file_path, file_name, error_message,
              expires_at, created_at, started_at, finished_at
       FROM jira_export_jobs
       WHERE requester_id = ?
       ORDER BY created_at DESC`
    )
    .all(userId);
}

export function getJiraExportJobById(id: number) {
  return db
    .prepare<JiraExportJobRecord>(
      `SELECT id, requester_id, jql, fields_json, status, file_path, file_name, error_message,
              expires_at, created_at, started_at, finished_at
       FROM jira_export_jobs
       WHERE id = ?`
    )
    .get(id);
}

export function updateJiraExportJobStatus({
  id,
  status,
  filePath,
  fileName,
  errorMessage,
  expiresAt,
}: {
  id: number;
  status: "queued" | "running" | "completed" | "failed";
  filePath?: string | null;
  fileName?: string | null;
  errorMessage?: string | null;
  expiresAt?: string | null;
}) {
  const now = getLocalTimestamp();
  const setStartedAt = status === "running" ? now : null;
  const setFinishedAt = status === "completed" || status === "failed" ? now : null;

  db.prepare(
    `UPDATE jira_export_jobs
     SET status = ?,
         file_path = COALESCE(?, file_path),
         file_name = COALESCE(?, file_name),
         error_message = COALESCE(?, error_message),
         expires_at = COALESCE(?, expires_at),
         started_at = COALESCE(?, started_at),
         finished_at = COALESCE(?, finished_at)
     WHERE id = ?`
  ).run(
    status,
    filePath ?? null,
    fileName ?? null,
    errorMessage ?? null,
    expiresAt ?? null,
    setStartedAt,
    setFinishedAt,
    id
  );

  return getJiraExportJobById(id);
}
