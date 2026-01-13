import { db } from "@/lib/auth/database";

export type ActionExecutionJobRecord = {
  id: number;
  request_id: number;
  status: "queued" | "running" | "completed" | "failed";
  error_message: string | null;
  total_issues: number | null;
  processed_issues: number | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
};

export function createActionExecutionJob(requestId: number) {
  const insert = db.prepare(
    `INSERT INTO action_execution_jobs (request_id, status)
     VALUES (?, 'queued')`
  );
  const result = insert.run(requestId);
  const fetch = db.prepare<ActionExecutionJobRecord>(
    "SELECT * FROM action_execution_jobs WHERE id = ?"
  );
  return fetch.get(Number(result.lastInsertRowid));
}

export function updateJobStatus({
  id,
  status,
  errorMessage,
}: {
  id: number;
  status: ActionExecutionJobRecord["status"];
  errorMessage?: string | null;
}) {
  const stmt = db.prepare(
    `UPDATE action_execution_jobs
     SET status = ?,
         error_message = ?,
         started_at = CASE WHEN ? = 'running' THEN CURRENT_TIMESTAMP ELSE started_at END,
         finished_at = CASE WHEN ? IN ('completed','failed') THEN CURRENT_TIMESTAMP ELSE finished_at END
     WHERE id = ?`
  );
  stmt.run(status, errorMessage ?? null, status, status, id);
  const fetch = db.prepare<ActionExecutionJobRecord>(
    "SELECT * FROM action_execution_jobs WHERE id = ?"
  );
  return fetch.get(id);
}

export function updateJobProgress({
  id,
  totalIssues,
  processedIssues,
}: {
  id: number;
  totalIssues?: number | null;
  processedIssues?: number | null;
}) {
  const stmt = db.prepare(
    `UPDATE action_execution_jobs
     SET total_issues = COALESCE(?, total_issues),
         processed_issues = COALESCE(?, processed_issues)
     WHERE id = ?`
  );
  stmt.run(totalIssues ?? null, processedIssues ?? null, id);
  const fetch = db.prepare<ActionExecutionJobRecord>(
    "SELECT * FROM action_execution_jobs WHERE id = ?"
  );
  return fetch.get(id);
}

export function listActionExecutionJobs(status?: string, limit = 50) {
  if (status) {
    const stmt = db.prepare<ActionExecutionJobRecord>(
      `SELECT * FROM action_execution_jobs
       WHERE status = ?
       ORDER BY created_at DESC
       LIMIT ?`
    );
    return stmt.all(status, limit);
  }
  const stmt = db.prepare<ActionExecutionJobRecord>(
    `SELECT * FROM action_execution_jobs
     ORDER BY created_at DESC
     LIMIT ?`
  );
  return stmt.all(limit);
}

export function listQueuedActionExecutionJobs(limit = 200) {
  const stmt = db.prepare<ActionExecutionJobRecord>(
    `SELECT * FROM action_execution_jobs
     WHERE status = 'queued'
     ORDER BY created_at ASC
     LIMIT ?`
  );
  return stmt.all(limit);
}

export function getRunningJobsCount() {
  const stmt = db.prepare<{ total: number }>(
    `SELECT COUNT(1) AS total FROM action_execution_jobs WHERE status = 'running'`
  );
  return stmt.get()?.total ?? 0;
}
