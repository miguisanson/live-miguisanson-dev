import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Pool } from "pg";

type SqlPair = {
  sqlite: string;
  postgres: string;
};

type QueryValue = string | number | null;

let sqliteDatabase: DatabaseSync | undefined;
let postgresPool: Pool | undefined;

export function getDatabaseDialect() {
  return process.env.DATABASE_URL ? "postgres" : "sqlite";
}

function getSqliteDatabase() {
  if (sqliteDatabase) {
    return sqliteDatabase;
  }

  const sqliteFilename = path.basename(process.env.AUTH_SQLITE_PATH ?? "auth.sqlite");
  const sqlitePath = path.join(process.cwd(), ".runtime", sqliteFilename);
  mkdirSync(path.dirname(sqlitePath), { recursive: true });
  sqliteDatabase = new DatabaseSync(sqlitePath);
  return sqliteDatabase;
}

function getPostgresPool() {
  if (postgresPool) {
    return postgresPool;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for PostgreSQL queries.");
  }

  postgresPool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  return postgresPool;
}

function sqlForDialect(sql: SqlPair) {
  return getDatabaseDialect() === "postgres" ? sql.postgres : sql.sqlite;
}

export async function dbAll<T>(sql: SqlPair, params: QueryValue[] = []) {
  if (getDatabaseDialect() === "postgres") {
    const result = await getPostgresPool().query(sql.postgres, params);
    return result.rows as T[];
  }

  return getSqliteDatabase().prepare(sql.sqlite).all(...params) as T[];
}

export async function dbGet<T>(sql: SqlPair, params: QueryValue[] = []) {
  if (getDatabaseDialect() === "postgres") {
    const result = await getPostgresPool().query(sql.postgres, params);
    return (result.rows[0] ?? null) as T | null;
  }

  return (getSqliteDatabase().prepare(sql.sqlite).get(...params) ?? null) as T | null;
}

export async function dbRun(sql: SqlPair, params: QueryValue[] = []) {
  if (getDatabaseDialect() === "postgres") {
    await getPostgresPool().query(sql.postgres, params);
    return;
  }

  getSqliteDatabase().prepare(sql.sqlite).run(...params);
}

export async function dbExec(sql: SqlPair) {
  if (getDatabaseDialect() === "postgres") {
    await getPostgresPool().query(sql.postgres);
    return;
  }

  getSqliteDatabase().exec(sqlForDialect(sql));
}
