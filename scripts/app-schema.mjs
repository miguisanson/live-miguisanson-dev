import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Pool } from "pg";

function sqlitePath(repoRoot) {
  const sqliteFilename = path.basename(process.env.AUTH_SQLITE_PATH ?? "auth.sqlite");
  return path.join(repoRoot, ".runtime", sqliteFilename);
}

function getDatabase(repoRoot) {
  if (process.env.DATABASE_URL) {
    return {
      dialect: "postgres",
      pool: new Pool({ connectionString: process.env.DATABASE_URL }),
    };
  }

  const dbPath = sqlitePath(repoRoot);
  mkdirSync(path.dirname(dbPath), { recursive: true });
  return {
    dialect: "sqlite",
    database: new DatabaseSync(dbPath),
  };
}

async function exec(db, sqliteSql, postgresSql = sqliteSql) {
  if (db.dialect === "postgres") {
    await db.pool.query(postgresSql);
    return;
  }

  db.database.exec(sqliteSql);
}

export async function ensureAppSchema(repoRoot) {
  const db = getDatabase(repoRoot);

  try {
    await exec(
      db,
      `
        CREATE TABLE IF NOT EXISTS "adminUser" (
          "userId" text not null primary key references "user" ("id") on delete cascade,
          "role" text not null default 'admin',
          "createdAt" text not null,
          "createdBy" text
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS "adminUser" (
          "userId" text not null primary key references "user" ("id") on delete cascade,
          "role" text not null default 'admin',
          "createdAt" timestamptz not null,
          "createdBy" text
        );
      `,
    );

    await exec(
      db,
      `
        CREATE TABLE IF NOT EXISTS "auditLog" (
          "id" text not null primary key,
          "eventType" text not null,
          "actorUserId" text,
          "actorEmail" text,
          "actorUsername" text,
          "targetUserId" text,
          "targetEmail" text,
          "metadata" text not null default '{}',
          "ipAddress" text,
          "userAgent" text,
          "createdAt" text not null
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS "auditLog" (
          "id" text not null primary key,
          "eventType" text not null,
          "actorUserId" text,
          "actorEmail" text,
          "actorUsername" text,
          "targetUserId" text,
          "targetEmail" text,
          "metadata" text not null default '{}',
          "ipAddress" text,
          "userAgent" text,
          "createdAt" timestamptz not null
        );
      `,
    );

    await exec(
      db,
      `
        CREATE TABLE IF NOT EXISTS "userAccess" (
          "userId" text not null primary key references "user" ("id") on delete cascade,
          "approved" integer not null default 0,
          "banned" integer not null default 0,
          "note" text,
          "updatedAt" text not null,
          "updatedBy" text
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS "userAccess" (
          "userId" text not null primary key references "user" ("id") on delete cascade,
          "approved" integer not null default 0,
          "banned" integer not null default 0,
          "note" text,
          "updatedAt" timestamptz not null,
          "updatedBy" text
        );
      `,
    );

    await exec(
      db,
      `
        CREATE TABLE IF NOT EXISTS "siteSetting" (
          "key" text not null primary key,
          "value" text not null,
          "updatedAt" text not null,
          "updatedBy" text
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS "siteSetting" (
          "key" text not null primary key,
          "value" text not null,
          "updatedAt" timestamptz not null,
          "updatedBy" text
        );
      `,
    );

    await exec(
      db,
      `
        CREATE TABLE IF NOT EXISTS "userProfile" (
          "userId" text not null primary key references "user" ("id") on delete cascade,
          "bio" text not null default '',
          "avatarUrl" text,
          "bannerUrl" text,
          "links" text not null default '{}',
          "createdAt" text not null,
          "updatedAt" text not null
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS "userProfile" (
          "userId" text not null primary key references "user" ("id") on delete cascade,
          "bio" text not null default '',
          "avatarUrl" text,
          "bannerUrl" text,
          "links" text not null default '{}',
          "createdAt" timestamptz not null,
          "updatedAt" timestamptz not null
        );
      `,
    );

    await exec(db, `CREATE INDEX IF NOT EXISTS "idx_auditLog_createdAt" ON "auditLog" ("createdAt");`);
    await exec(db, `CREATE INDEX IF NOT EXISTS "idx_auditLog_eventType" ON "auditLog" ("eventType");`);
    await exec(db, `CREATE INDEX IF NOT EXISTS "idx_auditLog_actorUserId" ON "auditLog" ("actorUserId");`);
    await exec(db, `CREATE INDEX IF NOT EXISTS "idx_session_expiresAt" ON "session" ("expiresAt");`);
    console.log("[app] Admin and audit schema ready.");
  } finally {
    if (db.dialect === "postgres") {
      await db.pool.end();
    } else {
      db.database.close();
    }
  }
}
