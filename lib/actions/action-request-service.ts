import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

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
  error_status_code: number | null;
};

export type ActionRequestEventRecord = {
  id: number;
  request_id: number;
  type: string;
  message: string | null;
  actor_name: string | null;
  created_at: string;
};

export type ApprovalHistoryRecord = {
  id: number;
  request_id: number;
  type: string;
  message: string | null;
  actor_name: string | null;
  created_at: string;
  action_type: string | null;
  requester_name: string | null;
  requester_email: string | null;
  requested_status: string | null;
  filter_mode: string | null;
  filter_value: string | null;
};

export type ActionRequestMessageRecord = {
  id: number;
  request_id: number;
  sender_id: number | null;
  sender_name: string | null;
  sender_role: string | null;
  message: string;
  created_at: string;
};

type TableInfoRow = {
  name: string;
};

const messageTableInfo = db
  .prepare("PRAGMA table_info(action_request_messages)")
  .all() as TableInfoRow[];
const hasMessageSenderId = messageTableInfo.some(
  (column) => column.name === "sender_id"
);
const hasMessageSenderName = messageTableInfo.some(
  (column) => column.name === "sender_name"
);
const hasMessageSenderRole = messageTableInfo.some(
  (column) => column.name === "sender_role"
);
const hasMessageAuthorId = messageTableInfo.some(
  (column) => column.name === "author_id"
);
const hasMessageAuthorName = messageTableInfo.some(
  (column) => column.name === "author_name"
);
const hasMessageAuthorRole = messageTableInfo.some(
  (column) => column.name === "author_role"
);

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
      (action_type, filter_mode, filter_value, requested_status, payload, requester_id, requester_email, requester_name, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
    requester.name,
    getLocalTimestamp()
  );

  const id = Number(result.lastInsertRowid);

  const fetch = db.prepare<ActionRequestRecord>(
    "SELECT * FROM action_requests WHERE id = ?"
  );
  const record = fetch.get(id);
  if (!record) {
    throw new Error("Falha ao registrar a ação.");
  }
  createActionRequestEvent({
    requestId: record.id,
    type: "created",
    actorName: requester.name,
  });
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

export function listActionRequestsByStatuses(statuses: string[], limit = 50) {
  if (!statuses.length) {
    return [];
  }
  const placeholders = statuses.map(() => "?").join(", ");
  const stmt = db.prepare<ActionRequestRecord>(
    `SELECT * FROM action_requests
     WHERE status IN (${placeholders})
     ORDER BY created_at DESC
     LIMIT ?`
  );
  return stmt.all(...statuses, limit);
}

export function getActionRequestById(id: number) {
  const stmt = db.prepare<ActionRequestRecord>(
    "SELECT * FROM action_requests WHERE id = ?"
  );
  return stmt.get(id);
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
     WHERE status IN ('completed', 'failed', 'declined', 'returned', 'cancelled')
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
  status?:
    | "pending"
    | "approved"
    | "declined"
    | "returned"
    | "completed"
    | "queued"
    | "running"
    | "paused"
    | "failed"
    | "cancelled";
  limit?: number;
}) {
  if (status === "completed") {
    const stmt = db.prepare<ActionRequestRecord>(
      `SELECT * FROM action_requests
       WHERE requester_id = ?
         AND status IN ('completed', 'failed', 'declined', 'returned', 'cancelled')
       ORDER BY approved_at DESC, created_at DESC
       LIMIT ?`
    );
    return stmt.all(userId, limit);
  }

  if (
    status === "pending" ||
    status === "approved" ||
    status === "declined" ||
    status === "returned" ||
    status === "queued" ||
    status === "running" ||
    status === "failed" ||
    status === "cancelled"
  ) {
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
  eventType,
}: {
  id: number;
  status:
    | "approved"
    | "declined"
    | "returned"
    | "queued"
    | "running"
    | "completed"
    | "failed"
    | "cancelled";
  approverName: string;
  auditNotes?: string;
  eventType?: string;
}) {
  const stmt = db.prepare(
    `UPDATE action_requests
     SET status = ?,
         approved_at = datetime('now','localtime'),
         approved_by = ?,
         audit_notes = ?
     WHERE id = ?`
  );

  stmt.run(status, approverName, auditNotes ?? null, id);
  createActionRequestEvent({
    requestId: id,
    type: eventType ?? status,
    actorName: approverName,
    message: auditNotes ?? null,
  });

  const fetch = db.prepare<ActionRequestRecord>(
    "SELECT * FROM action_requests WHERE id = ?"
  );

  return fetch.get(id);
}

export function updateActionRequestExecutionStatus({
  id,
  status,
  errorMessage,
  errorStatusCode,
}: {
  id: number;
  status: "queued" | "running" | "paused" | "completed" | "failed" | "frozen";
  errorMessage?: string | null;
  errorStatusCode?: number | null;
}) {
  const stmt = db.prepare(
    `UPDATE action_requests
     SET status = ?,
         audit_notes = COALESCE(?, audit_notes),
         error_status_code = COALESCE(?, error_status_code)
     WHERE id = ?`
  );
  stmt.run(status, errorMessage ?? null, errorStatusCode ?? null, id);
  createActionRequestEvent({
    requestId: id,
    type: status,
    actorName: "Sistema",
    message: errorMessage ?? null,
  });
  const fetch = db.prepare<ActionRequestRecord>(
    "SELECT * FROM action_requests WHERE id = ?"
  );
  return fetch.get(id);
}

export function updateActionRequestFilterValue({
  id,
  filterMode,
  filterValue,
  actorName,
  message,
}: {
  id: number;
  filterMode: string;
  filterValue: string;
  actorName: string;
  message?: string | null;
}) {
  const stmt = db.prepare(
    `UPDATE action_requests
     SET filter_mode = ?,
         filter_value = ?
     WHERE id = ?`
  );
  stmt.run(filterMode, filterValue, id);
  createActionRequestEvent({
    requestId: id,
    type: "filtered",
    actorName,
    message: message ?? null,
  });
  const fetch = db.prepare<ActionRequestRecord>(
    "SELECT * FROM action_requests WHERE id = ?"
  );
  return fetch.get(id);
}

export function deleteActionRequest(id: number) {
  const remove = db.transaction(() => {
    db.prepare("DELETE FROM action_request_messages WHERE request_id = ?").run(id);
    db.prepare("DELETE FROM action_request_events WHERE request_id = ?").run(id);
    db.prepare("DELETE FROM action_execution_jobs WHERE request_id = ?").run(id);
    const result = db.prepare("DELETE FROM action_requests WHERE id = ?").run(id);
    return result.changes > 0;
  });
  return remove();
}

export function updateActionRequestByRequester({
  id,
  requesterId,
  actionType,
  filterMode,
  filterValue,
  requestedStatus,
  payload,
}: {
  id: number;
  requesterId: number;
  actionType: string;
  filterMode: string;
  filterValue: string;
  requestedStatus?: string | null;
  payload?: Record<string, unknown> | null;
}) {
  const stmt = db.prepare(
    `UPDATE action_requests
     SET action_type = ?,
         filter_mode = ?,
         filter_value = ?,
         requested_status = ?,
         payload = ?,
         status = 'pending',
         approved_at = NULL,
         approved_by = NULL,
         audit_notes = NULL
     WHERE id = ? AND requester_id = ?`
  );
  const payloadString = payload ? JSON.stringify(payload) : null;
  stmt.run(
    actionType,
    filterMode,
    filterValue,
    requestedStatus ?? null,
    payloadString,
    id,
    requesterId
  );
  createActionRequestEvent({
    requestId: id,
    type: "resubmitted",
    actorName: null,
  });

  const fetch = db.prepare<ActionRequestRecord>(
    "SELECT * FROM action_requests WHERE id = ?"
  );
  return fetch.get(id);
}

export function cancelActionRequestByRequester({
  id,
  requesterId,
}: {
  id: number;
  requesterId: number;
}) {
  const stmt = db.prepare(
    `UPDATE action_requests
     SET status = 'cancelled',
         approved_at = datetime('now','localtime'),
         approved_by = NULL,
         audit_notes = NULL
     WHERE id = ?
       AND requester_id = ?
       AND status IN ('pending', 'returned')`
  );
  const result = stmt.run(id, requesterId);
  if (result.changes === 0) {
    return null;
  }
  createActionRequestEvent({
    requestId: id,
    type: "cancelled",
    actorName: null,
  });
  const fetch = db.prepare<ActionRequestRecord>(
    "SELECT * FROM action_requests WHERE id = ?"
  );
  return fetch.get(id);
}

export function createActionRequestEvent({
  requestId,
  type,
  message,
  actorName,
}: {
  requestId: number;
  type: string;
  message?: string | null;
  actorName?: string | null;
}) {
  const stmt = db.prepare(
    `INSERT INTO action_request_events (request_id, type, message, actor_name, created_at)
     VALUES (?, ?, ?, ?, ?)`
  );
  stmt.run(requestId, type, message ?? null, actorName ?? null, getLocalTimestamp());
}

export function listActionRequestEvents(requestId: number) {
  const stmt = db.prepare<ActionRequestEventRecord>(
    `SELECT * FROM action_request_events
     WHERE request_id = ?
     ORDER BY created_at ASC`
  );
  return stmt.all(requestId);
}

export function listApprovalHistory(limit = 100) {
  const stmt = db.prepare<ApprovalHistoryRecord>(
    `SELECT
        action_request_events.id,
        action_request_events.request_id,
        action_request_events.type,
        action_request_events.message,
        action_request_events.actor_name,
        action_request_events.created_at,
        action_requests.action_type,
        action_requests.requester_name,
        action_requests.requester_email,
        action_requests.requested_status,
        action_requests.filter_mode,
        action_requests.filter_value
     FROM action_request_events
     LEFT JOIN action_requests ON action_requests.id = action_request_events.request_id
     WHERE action_request_events.type IN ('approved', 'returned', 'declined')
     ORDER BY action_request_events.created_at DESC
     LIMIT ?`
  );
  return stmt.all(limit);
}

export function createActionRequestMessage({
  requestId,
  senderId,
  senderName,
  senderRole,
  message,
}: {
  requestId: number;
  senderId: number | null;
  senderName: string | null;
  senderRole: string | null;
  message: string;
}) {
  const safeSenderId = senderId ?? 0;
  const safeSenderName = senderName ?? "Usuário";
  const safeSenderRole = senderRole ?? "usuario";
  const columns = ["request_id"];
  const values: Array<string | number | null> = [requestId];

  if (hasMessageAuthorId) {
    columns.push("author_id");
    values.push(safeSenderId);
  } else if (hasMessageSenderId) {
    columns.push("sender_id");
    values.push(safeSenderId);
  }

  if (hasMessageAuthorName) {
    columns.push("author_name");
    values.push(safeSenderName);
  } else if (hasMessageSenderName) {
    columns.push("sender_name");
    values.push(safeSenderName);
  }

  if (hasMessageAuthorRole) {
    columns.push("author_role");
    values.push(safeSenderRole);
  } else if (hasMessageSenderRole) {
    columns.push("sender_role");
    values.push(safeSenderRole);
  }

  columns.push("message");
  values.push(message);

  columns.push("created_at");
  values.push(getLocalTimestamp());

  const placeholders = columns.map(() => "?").join(", ");
  const stmt = db.prepare(
    `INSERT INTO action_request_messages (${columns.join(", ")})
     VALUES (${placeholders})`
  );
  const result = stmt.run(...values);
  const fetch = db.prepare<ActionRequestMessageRecord>(
    "SELECT * FROM action_request_messages WHERE id = ?"
  );
  return fetch.get(Number(result.lastInsertRowid));
}

export function listActionRequestMessages(requestId: number) {
  const columns = ["id", "request_id", "message", "created_at"];
  const nameExpr =
    hasMessageAuthorName && hasMessageSenderName
      ? "COALESCE(NULLIF(author_name, ''), NULLIF(sender_name, ''), 'Usuário') AS sender_name"
      : hasMessageAuthorName
      ? "COALESCE(NULLIF(author_name, ''), 'Usuário') AS sender_name"
      : hasMessageSenderName
      ? "COALESCE(NULLIF(sender_name, ''), 'Usuário') AS sender_name"
      : "'Usuário' AS sender_name";
  const roleExpr =
    hasMessageAuthorRole && hasMessageSenderRole
      ? "COALESCE(NULLIF(author_role, ''), NULLIF(sender_role, ''), 'usuario') AS sender_role"
      : hasMessageAuthorRole
      ? "COALESCE(NULLIF(author_role, ''), 'usuario') AS sender_role"
      : hasMessageSenderRole
      ? "COALESCE(NULLIF(sender_role, ''), 'usuario') AS sender_role"
      : "'usuario' AS sender_role";
  const idExpr =
    hasMessageAuthorId && hasMessageSenderId
      ? "COALESCE(author_id, sender_id, 0) AS sender_id"
      : hasMessageAuthorId
      ? "COALESCE(author_id, 0) AS sender_id"
      : hasMessageSenderId
      ? "COALESCE(sender_id, 0) AS sender_id"
      : "0 AS sender_id";
  columns.push(idExpr, nameExpr, roleExpr);

  const stmt = db.prepare<ActionRequestMessageRecord>(
    `SELECT ${columns.join(", ")} FROM action_request_messages
     WHERE request_id = ?
     ORDER BY created_at ASC`
  );
  return stmt.all(requestId);
}
