#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { Pool } from "pg";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { captcha, username } from "better-auth/plugins";
import { getMigrations } from "better-auth/db/migration";
import { loadLocalEnv } from "./env.mjs";
import { ensureAppSchema } from "./app-schema.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadLocalEnv(repoRoot);
let sqliteDatabase;

function getDatabase() {
  if (process.env.DATABASE_URL) {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  const sqliteFilename = path.basename(process.env.AUTH_SQLITE_PATH ?? "auth.sqlite");
  const sqlitePath = path.join(repoRoot, ".runtime", sqliteFilename);
  mkdirSync(path.dirname(sqlitePath), { recursive: true });
  sqliteDatabase = new DatabaseSync(sqlitePath);
  return sqliteDatabase;
}

function normalizeSqliteSchema() {
  if (!sqliteDatabase) {
    return;
  }

  const columns = sqliteDatabase.prepare("PRAGMA table_info('rateLimit')").all();
  const hasExpectedColumns =
    columns.length === 4 &&
    columns.some((column) => column.name === "id") &&
    columns.some((column) => column.name === "key") &&
    columns.some((column) => column.name === "count") &&
    columns.some((column) => column.name === "lastRequest");
  const lastRequestColumn = columns.find((column) => column.name === "lastRequest");

  if (!hasExpectedColumns || lastRequestColumn?.type?.toLowerCase() !== "bigint") {
    return;
  }

  sqliteDatabase.exec("PRAGMA foreign_keys = OFF");
  try {
    sqliteDatabase.exec(`
      BEGIN IMMEDIATE;
      DROP TABLE IF EXISTS "_rateLimit_normalized";
      CREATE TABLE "_rateLimit_normalized" (
        "id" text not null primary key,
        "key" text not null unique,
        "count" integer not null,
        "lastRequest" integer not null
      );
      INSERT INTO "_rateLimit_normalized" ("id", "key", "count", "lastRequest")
        SELECT "id", "key", "count", "lastRequest" FROM "rateLimit";
      DROP TABLE "rateLimit";
      ALTER TABLE "_rateLimit_normalized" RENAME TO "rateLimit";
      COMMIT;
    `);
    console.log("[auth] Normalized local SQLite auth schema.");
  } catch (error) {
    try {
      sqliteDatabase.exec("ROLLBACK");
    } catch {
      // The original migration error is more useful than a rollback failure.
    }
    throw error;
  } finally {
    sqliteDatabase.exec("PRAGMA foreign_keys = ON");
  }
}

const auth = betterAuth({
  appName: "miguisanson.dev",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: getDatabase(),
  disabledPaths: ["/is-username-available"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendOnSignUp: true,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: {
      "/sign-up/email": { window: 60, max: 5 },
      "/sign-in/email": { window: 10, max: 3 },
      "/sign-in/username": { window: 10, max: 3 },
      "/send-verification-email": { window: 60, max: 3 },
      "/request-password-reset": { window: 60, max: 3 },
    },
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,
      usernameValidator: (value) => /^[a-zA-Z0-9_.]+$/.test(value),
    }),
    ...(process.env.TURNSTILE_SECRET_KEY
      ? [
          captcha({
            provider: "cloudflare-turnstile",
            secretKey: process.env.TURNSTILE_SECRET_KEY,
          }),
        ]
      : []),
    nextCookies(),
  ],
});

try {
  normalizeSqliteSchema();
  const migrations = await getMigrations(auth.options);
  await migrations.runMigrations();
  normalizeSqliteSchema();
  await ensureAppSchema(repoRoot);
  console.log("[auth] Migrations applied.");
} catch (error) {
  console.error(`[auth] Unable to run Better Auth migrations: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
