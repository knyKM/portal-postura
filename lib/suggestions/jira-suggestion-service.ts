import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

export type JiraSuggestionRecord = {
  id: number;
  type: "sugestao" | "problema";
  title: string;
  description: string;
  status: "aberto" | "em_analise" | "em_execucao" | "concluido";
  requester_id: number | null;
  requester_name: string | null;
  requester_email: string | null;
  created_at: string;
  updated_at: string;
};

export type JiraSuggestionInput = {
  type: "sugestao" | "problema";
  title: string;
  description: string;
  requesterId?: number | null;
  requesterName?: string | null;
  requesterEmail?: string | null;
};

export function listJiraSuggestions() {
  return db
    .prepare<JiraSuggestionRecord>(
      `SELECT id, type, title, description, status, requester_id, requester_name,
              requester_email, created_at, updated_at
       FROM jira_suggestions
       ORDER BY created_at DESC`
    )
    .all();
}

export function createJiraSuggestion(input: JiraSuggestionInput) {
  const now = getLocalTimestamp();
  const record = db
    .prepare<JiraSuggestionRecord>(
      `INSERT INTO jira_suggestions
        (type, title, description, status, requester_id, requester_name, requester_email, created_at, updated_at)
       VALUES (?, ?, ?, 'aberto', ?, ?, ?, ?, ?)
       RETURNING id, type, title, description, status, requester_id, requester_name,
                 requester_email, created_at, updated_at`
    )
    .get(
      input.type,
      input.title,
      input.description,
      input.requesterId ?? null,
      input.requesterName ?? null,
      input.requesterEmail ?? null,
      now,
      now
    );
  return record;
}

export function updateJiraSuggestionStatus(
  id: number,
  status: JiraSuggestionRecord["status"]
) {
  const now = getLocalTimestamp();
  const record = db
    .prepare<JiraSuggestionRecord>(
      `UPDATE jira_suggestions
       SET status = ?, updated_at = ?
       WHERE id = ?
       RETURNING id, type, title, description, status, requester_id, requester_name,
                 requester_email, created_at, updated_at`
    )
    .get(status, now, id);
  return record;
}
