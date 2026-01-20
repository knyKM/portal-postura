import { randomUUID } from "node:crypto";
import { db } from "@/lib/auth/database";
import { hashPassword } from "@/lib/auth/password";
import { getLocalTimestamp } from "@/lib/utils/time";

type PasswordResetRecord = {
  token: string;
  user_id: number;
  expires_at: string;
  used_at: string | null;
  created_at: string;
};

export function createPasswordResetToken(userId: number, expiresAt: string) {
  const token = randomUUID();
  db.prepare(
    `INSERT INTO password_reset_tokens (token, user_id, expires_at, created_at)
     VALUES (?, ?, ?, ?)`
  ).run(token, userId, expiresAt, getLocalTimestamp());
  return token;
}

export function getPasswordResetToken(token: string) {
  return db
    .prepare<PasswordResetRecord>(
      `SELECT token, user_id, expires_at, used_at, created_at
       FROM password_reset_tokens
       WHERE token = ?`
    )
    .get(token);
}

export function markPasswordResetUsed(token: string) {
  db.prepare(
    `UPDATE password_reset_tokens
     SET used_at = ?
     WHERE token = ?`
  ).run(getLocalTimestamp(), token);
}

export function updateUserPassword(userId: number, password: string) {
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
    hashPassword(password),
    userId
  );
}
