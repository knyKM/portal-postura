import { db } from "@/lib/auth/database";

export type SuggestionRecord = {
  id: number;
  user_id: number;
  user_email: string;
  user_name: string;
  content: string;
  status: string;
  implementation_stage: string | null;
  created_at: string;
};

type CreateSuggestionInput = {
  userId: number;
  userEmail: string;
  userName: string;
  content: string;
};

type ListSuggestionsOptions = {
  status?: "pending" | "approved";
  limit?: number;
};

function getSuggestionById(id: number): SuggestionRecord | null {
  const query = db.prepare<SuggestionRecord>(
    "SELECT * FROM idea_suggestions WHERE id = ?"
  );
  return query.get(id) ?? null;
}

export function createSuggestion({
  userId,
  userEmail,
  userName,
  content,
}: CreateSuggestionInput): SuggestionRecord {
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    throw new Error("O conteúdo da sugestão não pode estar vazio.");
  }

  const stmt = db.prepare(
    `INSERT INTO idea_suggestions (user_id, user_email, user_name, content)
     VALUES (?, ?, ?, ?)`
  );
  const result = stmt.run(userId, userEmail, userName, trimmedContent);
  const insertedId = Number(result.lastInsertRowid);

  const record = getSuggestionById(insertedId);

  if (!record) {
    throw new Error("Falha ao registrar sugestão.");
  }

  return record;
}

export function listSuggestions(
  options: ListSuggestionsOptions = {}
): SuggestionRecord[] {
  const limit = options.limit ?? 100;
  if (options.status) {
    const stmt = db.prepare<SuggestionRecord>(
      `SELECT *
       FROM idea_suggestions
       WHERE status = ?
       ORDER BY created_at DESC
       LIMIT ?`
    );
    return stmt.all(options.status, limit);
  }

  const stmt = db.prepare<SuggestionRecord>(
    `SELECT * FROM idea_suggestions
     ORDER BY created_at DESC
     LIMIT ?`
  );
  return stmt.all(limit);
}

export function updateSuggestionStatus(
  id: number,
  status: "pending" | "approved",
  implementationStage?: string
): SuggestionRecord {
  const stmt = db.prepare(
    `UPDATE idea_suggestions
     SET status = ?, implementation_stage = COALESCE(?, implementation_stage)
     WHERE id = ?`
  );
  stmt.run(status, implementationStage ?? null, id);

  const record = getSuggestionById(id);
  if (!record) {
    throw new Error("Sugestão não encontrada para atualização.");
  }
  return record;
}

export function updateSuggestionStage(id: number, stage: string): SuggestionRecord {
  const normalizedStage = stage.trim();
  if (!normalizedStage) {
    throw new Error("Defina uma etapa válida para a sugestão.");
  }
  const stmt = db.prepare(
    `UPDATE idea_suggestions
     SET implementation_stage = ?
     WHERE id = ?`
  );
  stmt.run(normalizedStage, id);

  const record = getSuggestionById(id);
  if (!record) {
    throw new Error("Sugestão não encontrada para atualização.");
  }
  return record;
}

export function deleteSuggestion(id: number) {
  const stmt = db.prepare("DELETE FROM idea_suggestions WHERE id = ?");
  stmt.run(id);
}
