import { randomBytes } from "node:crypto";
import { dbAll, dbGet, dbRun } from "./app-db";

export type AuditEventType =
  | "admin.bootstrap"
  | "auth.sign_up"
  | "auth.sign_in"
  | "auth.verification_requested"
  | "auth.password_reset_requested"
  | "game.launch";

type SessionUser = {
  id?: string;
  email?: string | null;
  username?: string | null;
  displayUsername?: string | null;
  name?: string | null;
};

type AuditEventInput = {
  eventType: AuditEventType;
  actor?: SessionUser | null;
  targetUserId?: string | null;
  targetEmail?: string | null;
  metadata?: Record<string, unknown>;
  request?: Request;
};

type CountRow = {
  value: number | string | null;
};

export type AdminDashboardData = {
  stats: {
    totalUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    adminUsers: number;
    activeSessions: number;
    gameLaunches: number;
    signIns24h: number;
    failedSignIns24h: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    username: string | null;
    displayUsername: string | null;
    emailVerified: boolean;
    createdAt: string;
    isAdmin: boolean;
  }>;
  recentAudit: Array<{
    id: string;
    eventType: string;
    actorEmail: string | null;
    actorUsername: string | null;
    targetEmail: string | null;
    metadata: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
  }>;
  eventCounts24h: Array<{
    eventType: string;
    count: number;
  }>;
};

function auditId() {
  return randomBytes(24).toString("base64url");
}

function numberValue(row: CountRow | null) {
  return Number(row?.value ?? 0);
}

function actorUsername(actor?: SessionUser | null) {
  return actor?.displayUsername ?? actor?.username ?? actor?.name ?? null;
}

function getRequestIp(request?: Request) {
  if (!request) {
    return null;
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    request.headers.get("cf-connecting-ip") ??
    forwarded ??
    request.headers.get("x-real-ip") ??
    null
  );
}

function getUserAgent(request?: Request) {
  return request?.headers.get("user-agent") ?? null;
}

export async function isAdminUser(userId?: string | null) {
  if (!userId) {
    return false;
  }

  const row = await dbGet<CountRow>(
    {
      sqlite: `SELECT COUNT(*) AS "value" FROM "adminUser" WHERE "userId" = ? AND "role" = 'admin'`,
      postgres: `SELECT COUNT(*) AS "value" FROM "adminUser" WHERE "userId" = $1 AND "role" = 'admin'`,
    },
    [userId],
  );
  return numberValue(row) > 0;
}

export async function recordAuditEvent(input: AuditEventInput) {
  try {
    const now = new Date().toISOString();
    await dbRun(
      {
        sqlite: `
          INSERT INTO "auditLog" (
            "id", "eventType", "actorUserId", "actorEmail", "actorUsername", "targetUserId",
            "targetEmail", "metadata", "ipAddress", "userAgent", "createdAt"
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        postgres: `
          INSERT INTO "auditLog" (
            "id", "eventType", "actorUserId", "actorEmail", "actorUsername", "targetUserId",
            "targetEmail", "metadata", "ipAddress", "userAgent", "createdAt"
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
      },
      [
        auditId(),
        input.eventType,
        input.actor?.id ?? null,
        input.actor?.email ?? null,
        actorUsername(input.actor),
        input.targetUserId ?? null,
        input.targetEmail ?? null,
        JSON.stringify(input.metadata ?? {}),
        getRequestIp(input.request),
        getUserAgent(input.request),
        now,
      ],
    );
  } catch (error) {
    console.error(`[audit] Unable to record ${input.eventType}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function count(sqlite: string, postgres: string, params: Array<string | number | null> = []) {
  return numberValue(await dbGet<CountRow>({ sqlite, postgres }, params));
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    totalUsers,
    verifiedUsers,
    adminUsers,
    activeSessions,
    gameLaunches,
    signIns24h,
    failedSignIns24h,
    recentUsers,
    recentAudit,
    eventCounts24h,
  ] = await Promise.all([
    count(`SELECT COUNT(*) AS "value" FROM "user"`, `SELECT COUNT(*) AS "value" FROM "user"`),
    count(
      `SELECT COUNT(*) AS "value" FROM "user" WHERE "emailVerified" = 1`,
      `SELECT COUNT(*) AS "value" FROM "user" WHERE "emailVerified" = true`,
    ),
    count(`SELECT COUNT(*) AS "value" FROM "adminUser"`, `SELECT COUNT(*) AS "value" FROM "adminUser"`),
    count(
      `SELECT COUNT(*) AS "value" FROM "session" WHERE "expiresAt" > ?`,
      `SELECT COUNT(*) AS "value" FROM "session" WHERE "expiresAt" > $1`,
      [now],
    ),
    count(
      `SELECT COUNT(*) AS "value" FROM "auditLog" WHERE "eventType" = 'game.launch'`,
      `SELECT COUNT(*) AS "value" FROM "auditLog" WHERE "eventType" = 'game.launch'`,
    ),
    count(
      `SELECT COUNT(*) AS "value" FROM "auditLog" WHERE "eventType" = 'auth.sign_in' AND "createdAt" >= ? AND "metadata" LIKE '%"success":true%'`,
      `SELECT COUNT(*) AS "value" FROM "auditLog" WHERE "eventType" = 'auth.sign_in' AND "createdAt" >= $1 AND "metadata" LIKE '%"success":true%'`,
      [yesterday],
    ),
    count(
      `SELECT COUNT(*) AS "value" FROM "auditLog" WHERE "eventType" = 'auth.sign_in' AND "createdAt" >= ? AND "metadata" LIKE '%"success":false%'`,
      `SELECT COUNT(*) AS "value" FROM "auditLog" WHERE "eventType" = 'auth.sign_in' AND "createdAt" >= $1 AND "metadata" LIKE '%"success":false%'`,
      [yesterday],
    ),
    dbAll<AdminDashboardData["recentUsers"][number] & { isAdmin: number | boolean }>(
      {
        sqlite: `
          SELECT
            u."id",
            u."name",
            u."email",
            u."username",
            u."displayUsername",
            u."emailVerified",
            u."createdAt",
            CASE WHEN a."userId" IS NULL THEN 0 ELSE 1 END AS "isAdmin"
          FROM "user" u
          LEFT JOIN "adminUser" a ON a."userId" = u."id"
          ORDER BY u."createdAt" DESC
          LIMIT 8
        `,
        postgres: `
          SELECT
            u."id",
            u."name",
            u."email",
            u."username",
            u."displayUsername",
            u."emailVerified",
            u."createdAt",
            CASE WHEN a."userId" IS NULL THEN false ELSE true END AS "isAdmin"
          FROM "user" u
          LEFT JOIN "adminUser" a ON a."userId" = u."id"
          ORDER BY u."createdAt" DESC
          LIMIT 8
        `,
      },
    ),
    dbAll<AdminDashboardData["recentAudit"][number]>(
      {
        sqlite: `
          SELECT "id", "eventType", "actorEmail", "actorUsername", "targetEmail", "metadata", "ipAddress", "userAgent", "createdAt"
          FROM "auditLog"
          ORDER BY "createdAt" DESC
          LIMIT 30
        `,
        postgres: `
          SELECT "id", "eventType", "actorEmail", "actorUsername", "targetEmail", "metadata", "ipAddress", "userAgent", "createdAt"
          FROM "auditLog"
          ORDER BY "createdAt" DESC
          LIMIT 30
        `,
      },
    ),
    dbAll<{ eventType: string; count: number | string }>(
      {
        sqlite: `
          SELECT "eventType", COUNT(*) AS "count"
          FROM "auditLog"
          WHERE "createdAt" >= ?
          GROUP BY "eventType"
          ORDER BY "count" DESC, "eventType" ASC
        `,
        postgres: `
          SELECT "eventType", COUNT(*) AS "count"
          FROM "auditLog"
          WHERE "createdAt" >= $1
          GROUP BY "eventType"
          ORDER BY "count" DESC, "eventType" ASC
        `,
      },
      [yesterday],
    ),
  ]);

  return {
    stats: {
      totalUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      adminUsers,
      activeSessions,
      gameLaunches,
      signIns24h,
      failedSignIns24h,
    },
    recentUsers: recentUsers.map((user) => ({
      ...user,
      emailVerified: Boolean(user.emailVerified),
      isAdmin: Boolean(user.isAdmin),
    })),
    recentAudit,
    eventCounts24h: eventCounts24h.map((event) => ({
      eventType: event.eventType,
      count: Number(event.count),
    })),
  };
}
