import { db } from "@/lib/auth/database";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export type UserRecord = {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  password_hash: string;
  role: string;
  is_active: number;
  mfa_secret: string | null;
  mfa_enabled: number;
  last_seen_at: string | null;
  created_at: string;
};

const seedUser = {
  email: "admin@postura.com",
  password: "cyber123",
  name: "Administrador Postura SM",
  avatar: "/logo_vivo_sem_fundo.png",
  role: "admin",
};

let isSeeded = false;

function seedAdmin() {
  if (isSeeded) return;
  const stmt = db.prepare(
    "SELECT id, role, is_active FROM users WHERE email = ?"
  );
  const existing = stmt.get(seedUser.email) as
    | { id: number; role?: string | null; is_active?: number | null }
    | undefined;

  if (!existing) {
    const insert = db.prepare(
      "INSERT INTO users (email, password_hash, name, avatar, role, is_active) VALUES (?, ?, ?, ?, ?, 1)"
    );
    insert.run(
      seedUser.email,
      hashPassword(seedUser.password),
      seedUser.name,
      seedUser.avatar,
      seedUser.role
    );
  } else if (existing.role !== seedUser.role || existing.is_active !== 1) {
    const update = db.prepare(
      "UPDATE users SET role = ?, is_active = 1 WHERE id = ?"
    );
    update.run(seedUser.role, existing.id);
  }

  isSeeded = true;
}

export function findUserByEmail(email: string): UserRecord | undefined {
  seedAdmin();
  const stmt = db.prepare(
    "SELECT id, email, name, avatar, password_hash, role, is_active, mfa_secret, mfa_enabled, last_seen_at, created_at FROM users WHERE email = ?"
  );
  return stmt.get(email);
}

export function validateUserCredentials(
  email: string,
  password: string
): UserRecord | null {
  const user = findUserByEmail(email);
  if (!user) return null;

  const isValid = verifyPassword(password, user.password_hash);
  if (!isValid) {
    return null;
  }

  if (!user.is_active) {
    return null;
  }

  return user;
}

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string | null;
};

export function createUser({
  name,
  email,
  password,
  role,
  avatar = null,
}: CreateUserInput): UserRecord {
  seedAdmin();
  const normalizedEmail = email.trim().toLowerCase();

  const insert = db.prepare(
    "INSERT INTO users (name, email, password_hash, role, avatar, is_active) VALUES (?, ?, ?, ?, ?, 1)"
  );

  const result = insert.run(
    name.trim(),
    normalizedEmail,
    hashPassword(password),
    role,
    avatar
  );

  const insertedId = Number(result.lastInsertRowid);

  const fetchNew = db.prepare<UserRecord>(
    "SELECT id, email, name, avatar, password_hash, role, is_active, mfa_secret, mfa_enabled, last_seen_at, created_at FROM users WHERE id = ?"
  );
  const created = fetchNew.get(insertedId);

  if (!created) {
    throw new Error("Falha ao criar usuário.");
  }

  return created;
}

type BasicAdmin = {
  id: number;
  name: string;
  email: string;
};

export function listAdmins(): BasicAdmin[] {
  seedAdmin();
  const stmt = db.prepare<BasicAdmin>(
    "SELECT id, name, email FROM users WHERE role = 'admin'"
  );
  return stmt.all();
}

export type UserSummary = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  is_active: number;
  last_seen_at: string | null;
};

export function listUsers(): UserSummary[] {
  seedAdmin();
  const stmt = db.prepare<UserSummary>(
    "SELECT id, name, email, role, created_at, is_active, last_seen_at FROM users ORDER BY created_at DESC"
  );
  return stmt.all();
}

export function updateUserActiveStatus(
  userId: number,
  isActive: boolean
): UserRecord | null {
  seedAdmin();
  const update = db.prepare(
    "UPDATE users SET is_active = ? WHERE id = ?"
  );
  const result = update.run(isActive ? 1 : 0, userId);

  if (result.changes === 0) {
    return null;
  }

  const fetch = db.prepare<UserRecord>(
    "SELECT id, email, name, avatar, password_hash, role, is_active, mfa_secret, mfa_enabled, last_seen_at, created_at FROM users WHERE id = ?"
  );
  return fetch.get(userId) ?? null;
}

export function findUserById(id: number): UserRecord | undefined {
  seedAdmin();
  const stmt = db.prepare<UserRecord>(
    "SELECT id, email, name, avatar, password_hash, role, is_active, mfa_secret, mfa_enabled, last_seen_at, created_at FROM users WHERE id = ?"
  );
  return stmt.get(id);
}

export function upsertUserMfaSecret(userId: number, secret: string) {
  const stmt = db.prepare(
    "UPDATE users SET mfa_secret = ?, mfa_enabled = 0 WHERE id = ?"
  );
  stmt.run(secret, userId);
}

export function enableUserMfa(userId: number) {
  const stmt = db.prepare(
    "UPDATE users SET mfa_enabled = 1 WHERE id = ?"
  );
  stmt.run(userId);
}

export function updateUserLastSeen(userId: number) {
  seedAdmin();
  const stmt = db.prepare(
    "UPDATE users SET last_seen_at = CURRENT_TIMESTAMP WHERE id = ?"
  );
  stmt.run(userId);
}

export type OnlineAdmin = {
  id: number;
  name: string;
  email: string;
  last_seen_at: string | null;
};

export function listOnlineAdmins(withinMinutes = 5): OnlineAdmin[] {
  seedAdmin();
  const stmt = db.prepare<OnlineAdmin>(
    "SELECT id, name, email, last_seen_at FROM users WHERE role = 'admin' AND last_seen_at IS NOT NULL AND datetime(last_seen_at) >= datetime('now', ?) ORDER BY datetime(last_seen_at) DESC"
  );
  return stmt.all(`-${withinMinutes} minutes`);
}
