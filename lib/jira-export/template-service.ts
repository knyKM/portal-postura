import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

export type JiraExportTemplateRecord = {
  id: number;
  user_id: number;
  name: string;
  fields_json: string;
  created_at: string;
};

export function listJiraExportTemplates(userId: number) {
  return db
    .prepare<JiraExportTemplateRecord>(
      `SELECT id, user_id, name, fields_json, created_at
       FROM jira_export_templates
       WHERE user_id = ?
       ORDER BY created_at DESC`
    )
    .all(userId);
}

export function createJiraExportTemplate({
  userId,
  name,
  fields,
}: {
  userId: number;
  name: string;
  fields: string[];
}) {
  const now = getLocalTimestamp();
  const fieldsJson = JSON.stringify(fields);
  const record = db
    .prepare<JiraExportTemplateRecord>(
      `INSERT INTO jira_export_templates
       (user_id, name, fields_json, created_at)
       VALUES (?, ?, ?, ?)
       RETURNING id, user_id, name, fields_json, created_at`
    )
    .get(userId, name.trim(), fieldsJson, now);
  return record;
}

export function deleteJiraExportTemplate(id: number, userId: number) {
  const result = db
    .prepare("DELETE FROM jira_export_templates WHERE id = ? AND user_id = ?")
    .run(id, userId);
  return result.changes > 0;
}
