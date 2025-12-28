import { db } from "@/lib/auth/database";

export type ActionRequestRecord = {
  id: number;
  action_type: string;
  filter_mode: string;
  filter_value: string;
  requested_status: string | null;
  payload: string | null;
  requester_id: number | null;
  requester_email: string | null;
  requester_name: string | null;
  status: string;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
  audit_notes: string | null;
};

type CreateActionRequestInput = {
  actionType: string;
  filterMode: string;
  filterValue: string;
  requestedStatus?: string;
  payload?: Record<string, unknown> | null;
  requester: {
    id: number;
    email: string;
    name: string;
  };
};

export function createActionRequest({
  actionType,
  filterMode,
  filterValue,
  requestedStatus,
  payload,
  requester,
}: CreateActionRequestInput): ActionRequestRecord {
  const insert = db.prepare(
    `INSERT INTO action_requests
      (action_type, filter_mode, filter_value, requested_status, payload, requester_id, requester_email, requester_name)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const payloadString = payload ? JSON.stringify(payload) : null;
  const result = insert.run(
    actionType,
    filterMode,
    filterValue,
    requestedStatus ?? null,
    payloadString,
    requester.id,
    requester.email,
    requester.name
  );

  const id = Number(result.lastInsertRowid);

  const fetch = db.prepare<ActionRequestRecord>(
    "SELECT * FROM action_requests WHERE id = ?"
  );
  const record = fetch.get(id);
  if (!record) {
    throw new Error("Falha ao registrar a ação.");
  }
  return record;
}

export function listRecentRequests(limit = 5) {
  const stmt = db.prepare<ActionRequestRecord>(
    `SELECT * FROM action_requests
     ORDER BY created_at DESC
     LIMIT ?`
  );
  return stmt.all(limit);
}

export function listPendingRequests(limit = 20) {
  const stmt = db.prepare<ActionRequestRecord>(
    `SELECT * FROM action_requests
     WHERE status = 'pending'
     ORDER BY created_at ASC
     LIMIT ?`
  );
  return stmt.all(limit);
}

export function listCompletedRequests(limit = 20) {
  const stmt = db.prepare<ActionRequestRecord>(
    `SELECT * FROM action_requests
     WHERE status IN ('approved', 'declined')
     ORDER BY approved_at DESC
     LIMIT ?`
  );
  return stmt.all(limit);
}

export function listUserRequests({
  userId,
  status,
  limit = 20,
}: {
  userId: number;
  status?: "pending" | "approved" | "declined" | "completed";
  limit?: number;
}) {
  if (status === "completed") {
    const stmt = db.prepare<ActionRequestRecord>(
      `SELECT * FROM action_requests
       WHERE requester_id = ?
         AND status IN ('approved', 'declined')
       ORDER BY approved_at DESC, created_at DESC
       LIMIT ?`
    );
    return stmt.all(userId, limit);
  }

  if (status === "pending" || status === "approved" || status === "declined") {
    const stmt = db.prepare<ActionRequestRecord>(
      `SELECT * FROM action_requests
       WHERE requester_id = ?
         AND status = ?
       ORDER BY created_at DESC
       LIMIT ?`
    );
    return stmt.all(userId, status, limit);
  }

  const stmt = db.prepare<ActionRequestRecord>(
    `SELECT * FROM action_requests
     WHERE requester_id = ?
     ORDER BY created_at DESC
     LIMIT ?`
  );
  return stmt.all(userId, limit);
}

export function updateActionRequestStatus({
  id,
  status,
  approverName,
  auditNotes,
}: {
  id: number;
  status: "approved" | "declined";
  approverName: string;
  auditNotes?: string;
}) {
  const stmt = db.prepare(
    `UPDATE action_requests
     SET status = ?,
         approved_at = CURRENT_TIMESTAMP,
         approved_by = ?,
         audit_notes = ?
     WHERE id = ?`
  );

  stmt.run(status, approverName, auditNotes ?? null, id);

  const fetch = db.prepare<ActionRequestRecord>(
    "SELECT * FROM action_requests WHERE id = ?"
  );

  return fetch.get(id);
}
