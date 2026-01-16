import { db } from "@/lib/auth/database";
import { getLocalTimestamp } from "@/lib/utils/time";

export type NotificationRecord = {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  payload: string | null;
  is_read: number;
  created_at: string;
  read_at: string | null;
};

type CreateNotificationInput = {
  userId: number;
  type: string;
  title: string;
  message: string;
  payload?: Record<string, unknown> | null;
};

export function createNotification({
  userId,
  type,
  title,
  message,
  payload,
}: CreateNotificationInput): NotificationRecord {
  const insert = db.prepare(
    `INSERT INTO notifications (user_id, type, title, message, payload, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  const payloadString = payload ? JSON.stringify(payload) : null;
  const result = insert.run(
    userId,
    type,
    title,
    message,
    payloadString,
    getLocalTimestamp()
  );
  const insertedId = Number(result.lastInsertRowid);

  const fetch = db.prepare<NotificationRecord>(
    "SELECT * FROM notifications WHERE id = ?"
  );
  const record = fetch.get(insertedId);

  if (!record) {
    throw new Error("Falha ao registrar notificação.");
  }

  return record;
}

export function listUserNotifications(userId: number, limit = 20) {
  const stmt = db.prepare<NotificationRecord>(
    `SELECT * FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT ?`
  );
  return stmt.all(userId, limit);
}

export function countUnreadNotifications(userId: number) {
  const stmt = db.prepare<{ total: number }>(
    `SELECT COUNT(*) as total
     FROM notifications
     WHERE user_id = ? AND is_read = 0`
  );
  const row = stmt.get(userId);
  return row?.total ?? 0;
}

export function markNotificationsAsRead(
  userId: number,
  notificationIds?: number[]
) {
  if (notificationIds && notificationIds.length > 0) {
    const placeholders = notificationIds.map(() => "?").join(", ");
    const stmt = db.prepare(
      `UPDATE notifications
       SET is_read = 1,
           read_at = datetime('now','localtime')
       WHERE user_id = ?
         AND id IN (${placeholders})
         AND is_read = 0`
    );
    stmt.run(userId, ...notificationIds);
    return;
  }

  const stmt = db.prepare(
    `UPDATE notifications
     SET is_read = 1,
         read_at = datetime('now','localtime')
     WHERE user_id = ?
       AND is_read = 0`
  );
  stmt.run(userId);
}

export function deleteUserNotifications(userId: number) {
  const stmt = db.prepare(`DELETE FROM notifications WHERE user_id = ?`);
  stmt.run(userId);
}
