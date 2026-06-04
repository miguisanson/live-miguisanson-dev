#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { Pool } from "pg";
import { hashPassword } from "better-auth/crypto";
import { ensureAppSchema } from "./app-schema.mjs";
import { loadLocalEnv } from "./env.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadLocalEnv(repoRoot);

function randomId() {
  return randomBytes(24).toString("base64url");
}

function randomUsername() {
  return `admin_${randomBytes(8).toString("hex")}`;
}

function randomPassword() {
  return randomBytes(30).toString("base64url");
}

function getSqlitePath() {
  const sqliteFilename = path.basename(process.env.AUTH_SQLITE_PATH ?? "auth.sqlite");
  return path.join(repoRoot, ".runtime", sqliteFilename);
}

function getDatabase() {
  if (process.env.DATABASE_URL) {
    return {
      dialect: "postgres",
      pool: new Pool({ connectionString: process.env.DATABASE_URL }),
    };
  }

  return {
    dialect: "sqlite",
    database: new DatabaseSync(getSqlitePath()),
  };
}

async function getOne(db, sqliteSql, postgresSql, params = []) {
  if (db.dialect === "postgres") {
    const result = await db.pool.query(postgresSql, params);
    return result.rows[0] ?? null;
  }

  return db.database.prepare(sqliteSql).get(...params) ?? null;
}

async function run(db, sqliteSql, postgresSql, params = []) {
  if (db.dialect === "postgres") {
    await db.pool.query(postgresSql, params);
    return;
  }

  db.database.prepare(sqliteSql).run(...params);
}

async function close(db) {
  if (db.dialect === "postgres") {
    await db.pool.end();
  } else {
    db.database.close();
  }
}

const email = (process.env.ADMIN_EMAIL || "accounts@miguisanson.dev").trim().toLowerCase();
const username = (process.env.ADMIN_USERNAME || randomUsername()).trim();
const shouldResetPassword = process.env.ADMIN_RESET_PASSWORD === "1";
const now = new Date().toISOString();

await ensureAppSchema(repoRoot);

const db = getDatabase();

try {
  let user = await getOne(
    db,
    `SELECT "id", "username" FROM "user" WHERE "email" = ?`,
    `SELECT "id", "username" FROM "user" WHERE "email" = $1`,
    [email],
  );
  const password = randomPassword();
  const passwordHash = await hashPassword(password);
  let passwordWasSet = false;

  if (!user) {
    const userId = randomId();
    await run(
      db,
      `
        INSERT INTO "user" ("id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt", "username", "displayUsername")
        VALUES (?, ?, ?, 1, NULL, ?, ?, ?, ?)
      `,
      `
        INSERT INTO "user" ("id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt", "username", "displayUsername")
        VALUES ($1, $2, $3, true, NULL, $4, $5, $6, $7)
      `,
      [userId, username, email, now, now, username, username],
    );
    await run(
      db,
      `
        INSERT INTO "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
        VALUES (?, ?, 'credential', ?, ?, ?, ?)
      `,
      `
        INSERT INTO "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
        VALUES ($1, $2, 'credential', $3, $4, $5, $6)
      `,
      [randomId(), userId, userId, passwordHash, now, now],
    );
    user = { id: userId, username };
    passwordWasSet = true;
  } else if (shouldResetPassword) {
    const account = await getOne(
      db,
      `SELECT "id" FROM "account" WHERE "userId" = ? AND "providerId" = 'credential' LIMIT 1`,
      `SELECT "id" FROM "account" WHERE "userId" = $1 AND "providerId" = 'credential' LIMIT 1`,
      [user.id],
    );

    if (account) {
      await run(
        db,
        `UPDATE "account" SET "password" = ?, "updatedAt" = ? WHERE "id" = ?`,
        `UPDATE "account" SET "password" = $1, "updatedAt" = $2 WHERE "id" = $3`,
        [passwordHash, now, account.id],
      );
    } else {
      await run(
        db,
        `
          INSERT INTO "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
          VALUES (?, ?, 'credential', ?, ?, ?, ?)
        `,
        `
          INSERT INTO "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
          VALUES ($1, $2, 'credential', $3, $4, $5, $6)
        `,
        [randomId(), user.id, user.id, passwordHash, now, now],
      );
    }
    passwordWasSet = true;
  }

  await run(
    db,
    `UPDATE "user" SET "emailVerified" = 1, "updatedAt" = ? WHERE "id" = ?`,
    `UPDATE "user" SET "emailVerified" = true, "updatedAt" = $1 WHERE "id" = $2`,
    [now, user.id],
  );

  await run(
    db,
    `
      INSERT INTO "adminUser" ("userId", "role", "createdAt", "createdBy")
      VALUES (?, 'admin', ?, 'bootstrap')
      ON CONFLICT ("userId") DO UPDATE SET "role" = 'admin'
    `,
    `
      INSERT INTO "adminUser" ("userId", "role", "createdAt", "createdBy")
      VALUES ($1, 'admin', $2, 'bootstrap')
      ON CONFLICT ("userId") DO UPDATE SET "role" = 'admin'
    `,
    [user.id, now],
  );

  await run(
    db,
    `
      INSERT INTO "auditLog" ("id", "eventType", "actorUserId", "actorEmail", "actorUsername", "targetUserId", "targetEmail", "metadata", "createdAt")
      VALUES (?, 'admin.bootstrap', ?, ?, ?, ?, ?, ?, ?)
    `,
    `
      INSERT INTO "auditLog" ("id", "eventType", "actorUserId", "actorEmail", "actorUsername", "targetUserId", "targetEmail", "metadata", "createdAt")
      VALUES ($1, 'admin.bootstrap', $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      randomId(),
      user.id,
      email,
      user.username ?? username,
      user.id,
      email,
      JSON.stringify({ passwordReset: passwordWasSet, source: "bootstrap-admin" }),
      now,
    ],
  );

  console.log("");
  console.log("[admin] Admin account is ready.");
  console.log(`[admin] Email: ${email}`);
  console.log(`[admin] Username: ${user.username ?? username}`);
  if (passwordWasSet) {
    console.log(`[admin] Password: ${password}`);
    console.log("[admin] Store this password now. It is only printed this time.");
  } else {
    console.log("[admin] Existing admin account found. Password was not changed.");
    console.log("[admin] To reset it, run: ADMIN_RESET_PASSWORD=1 npm run admin:bootstrap");
  }
  console.log("[admin] Dashboard: /admin");
  console.log("");
} finally {
  await close(db);
}
