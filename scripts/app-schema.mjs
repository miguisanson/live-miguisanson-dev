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

/**
 * Adds a column only when it is not already present.
 *
 * PostgreSQL has ADD COLUMN IF NOT EXISTS; SQLite does not, so its table info is
 * inspected first. Both paths are idempotent.
 */
async function addColumnIfMissing(db, table, column, definition) {
  if (db.dialect === "postgres") {
    await db.pool.query(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${column}" ${definition};`);
    return;
  }

  const columns = db.database.prepare(`PRAGMA table_info("${table}")`).all();
  if (columns.some((entry) => entry.name === column)) {
    return;
  }
  db.database.exec(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${definition};`);
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

    await exec(
      db,
      `
        CREATE TABLE IF NOT EXISTS "post" (
          "id" text not null primary key,
          "userId" text not null references "user" ("id") on delete cascade,
          "body" text not null,
          "visibility" text not null default 'public',
          "createdAt" text not null,
          "updatedAt" text not null
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS "post" (
          "id" text not null primary key,
          "userId" text not null references "user" ("id") on delete cascade,
          "body" text not null,
          "visibility" text not null default 'public',
          "createdAt" timestamptz not null,
          "updatedAt" timestamptz not null
        );
      `,
    );

    // Long-form blog posts written from the admin dashboard. Separate from
    // "post", which holds short member posts for the community feed — different
    // authors, different lifecycle, different page.
    await exec(
      db,
      `
        CREATE TABLE IF NOT EXISTS "blogPost" (
          "id" text not null primary key,
          "slug" text not null unique,
          "title" text not null,
          "summary" text not null default '',
          "body" text not null,
          "tags" text not null default '',
          "status" text not null default 'draft',
          "authorId" text not null references "user" ("id") on delete cascade,
          "publishedAt" text,
          "createdAt" text not null,
          "updatedAt" text not null
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS "blogPost" (
          "id" text not null primary key,
          "slug" text not null unique,
          "title" text not null,
          "summary" text not null default '',
          "body" text not null,
          "tags" text not null default '',
          "status" text not null default 'draft',
          "authorId" text not null references "user" ("id") on delete cascade,
          "publishedAt" timestamptz,
          "createdAt" timestamptz not null,
          "updatedAt" timestamptz not null
        );
      `,
    );

    await exec(
      db,
      `
        CREATE TABLE IF NOT EXISTS "gameRoom" (
          "code" text not null primary key,
          "gameSlug" text not null,
          "ownerUserId" text not null references "user" ("id") on delete cascade,
          "createdAt" text not null,
          "expiresAt" text not null
        );
      `,
      `
        CREATE TABLE IF NOT EXISTS "gameRoom" (
          "code" text not null primary key,
          "gameSlug" text not null,
          "ownerUserId" text not null references "user" ("id") on delete cascade,
          "createdAt" timestamptz not null,
          "expiresAt" timestamptz not null
        );
      `,
    );

    // Attached images on community posts, added after "post" already existed in
    // production. SQLite has no ADD COLUMN IF NOT EXISTS, so check first; both
    // branches are safe to run repeatedly.
    await addColumnIfMissing(db, "post", "images", "text not null default ''");

    await exec(db, `CREATE INDEX IF NOT EXISTS "idx_auditLog_createdAt" ON "auditLog" ("createdAt");`);
    await exec(db, `CREATE INDEX IF NOT EXISTS "idx_auditLog_eventType" ON "auditLog" ("eventType");`);
    await exec(db, `CREATE INDEX IF NOT EXISTS "idx_auditLog_actorUserId" ON "auditLog" ("actorUserId");`);
    await exec(db, `CREATE INDEX IF NOT EXISTS "idx_session_expiresAt" ON "session" ("expiresAt");`);
    await exec(db, `CREATE INDEX IF NOT EXISTS "idx_post_userId" ON "post" ("userId");`);
    await exec(db, `CREATE INDEX IF NOT EXISTS "idx_post_visibility_createdAt" ON "post" ("visibility", "createdAt");`);
    await exec(db, `CREATE INDEX IF NOT EXISTS "idx_gameRoom_expiresAt" ON "gameRoom" ("expiresAt");`);
    console.log("[app] Admin and audit schema ready.");
  } finally {
    if (db.dialect === "postgres") {
      await db.pool.end();
    } else {
      db.database.close();
    }
  }
}
