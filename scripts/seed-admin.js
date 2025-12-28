/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Database = require("better-sqlite3");

const dataDir = path.join(process.cwd(), "data");
const dbFile = path.join(dataDir, "auth.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbFile);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'analista',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const columns = db
  .prepare("PRAGMA table_info(users)")
  .all()
  .map((col) => col.name);

if (!columns.includes("role")) {
  db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'analista'");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const adminUser = {
  email: "admin@postura.com",
  password: "cyber123",
  name: "Administrador Postura SM",
  avatar: "/logo_vivo_sem_fundo.png",
  role: "admin",
};

const existing = db
  .prepare("SELECT id FROM users WHERE email = ?")
  .get(adminUser.email);

if (existing) {
  console.log("Admin já existe no banco.");
  process.exit(0);
}

const insert = db.prepare(
  "INSERT INTO users (email, password_hash, name, avatar, role) VALUES (?, ?, ?, ?, ?)"
);

insert.run(
  adminUser.email,
  hashPassword(adminUser.password),
  adminUser.name,
  adminUser.avatar,
  adminUser.role
);

console.log("Admin criado com sucesso em data/auth.db");
