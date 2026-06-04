import { randomBytes } from "node:crypto";
import { dbAll, dbGet, dbRun } from "./app-db";

export type AuditEventType =
  | "admin.bootstrap"
  | "admin.settings.update"
  | "admin.user.approve"
  | "admin.user.ban"
  | "admin.user.clear_sessions"
  | "admin.user.verify"
  | "auth.sign_up"
  | "auth.sign_in"
  | "auth.verification_requested"
  | "auth.password_reset_requested"
  | "account.update"
  | "account.delete"
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

type SettingKey = "gameOpen" | "approvedOnly" | "maintenanceMode";

export type GameSettings = Record<SettingKey, boolean>;

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  displayUsername: string | null;
  emailVerified: number | boolean;
  createdAt: string;
  isAdmin: number | boolean;
  approved: number | null;
  banned: number | null;
  activeSessions: number | string;
  lastGameLaunch: string | null;
};

export type AdminDashboardData = {
  stats: {
    totalUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    adminUsers: number;
    approvedUsers: number;
    bannedUsers: number;
    activeSessions: number;
    gameLaunches: number;
    signIns24h: number;
    failedSignIns24h: number;
  };
  gameSettings: GameSettings;
  users: Array<{
    id: string;
    name: string;
    email: string;
    username: string | null;
    displayUsername: string | null;
    emailVerified: boolean;
    createdAt: string;
    isAdmin: boolean;
    approved: boolean;
    banned: boolean;
    activeSessions: number;
    lastGameLaunch: string | null;
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

const defaultGameSettings: GameSettings = {
  gameOpen: true,
  approvedOnly: false,
  maintenanceMode: false,
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

function booleanSetting(value: string | undefined, fallback: boolean) {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return fallback;
}

function getRequestIp(request?: Request) {
  if (!request) {
    return null;
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return request.headers.get("cf-connecting-ip") ?? forwarded ?? request.headers.get("x-real-ip") ?? null;
}

function getUserAgent(request?: Request) {
  return request?.headers.get("user-agent") ?? null;
}

async function count(sqlite: string, postgres: string, params: Array<string | number | null> = []) {
  return numberValue(await dbGet<CountRow>({ sqlite, postgres }, params));
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

export async function getUserById(userId: string) {
  return dbGet<{
    id: string;
    email: string;
    name: string;
    username: string | null;
    displayUsername: string | null;
    emailVerified: number | boolean;
  }>(
    {
      sqlite: `SELECT "id", "email", "name", "username", "displayUsername", "emailVerified" FROM "user" WHERE "id" = ?`,
      postgres: `SELECT "id", "email", "name", "username", "displayUsername", "emailVerified" FROM "user" WHERE "id" = $1`,
    },
    [userId],
  );
}

export async function getGameSettings(): Promise<GameSettings> {
  const rows = await dbAll<{ key: SettingKey; value: string }>({
    sqlite: `SELECT "key", "value" FROM "siteSetting" WHERE "key" IN ('gameOpen', 'approvedOnly', 'maintenanceMode')`,
    postgres: `SELECT "key", "value" FROM "siteSetting" WHERE "key" IN ('gameOpen', 'approvedOnly', 'maintenanceMode')`,
  });
  const values = new Map(rows.map((row) => [row.key, row.value]));

  return {
    gameOpen: booleanSetting(values.get("gameOpen"), defaultGameSettings.gameOpen),
    approvedOnly: booleanSetting(values.get("approvedOnly"), defaultGameSettings.approvedOnly),
    maintenanceMode: booleanSetting(values.get("maintenanceMode"), defaultGameSettings.maintenanceMode),
  };
}

export async function updateGameSettings(settings: GameSettings, actor: SessionUser) {
  const now = new Date().toISOString();
  for (const [key, value] of Object.entries(settings) as Array<[SettingKey, boolean]>) {
    await dbRun(
      {
        sqlite: `
          INSERT INTO "siteSetting" ("key", "value", "updatedAt", "updatedBy")
          VALUES (?, ?, ?, ?)
          ON CONFLICT ("key") DO UPDATE SET "value" = excluded."value", "updatedAt" = excluded."updatedAt", "updatedBy" = excluded."updatedBy"
        `,
        postgres: `
          INSERT INTO "siteSetting" ("key", "value", "updatedAt", "updatedBy")
          VALUES ($1, $2, $3, $4)
          ON CONFLICT ("key") DO UPDATE SET "value" = excluded."value", "updatedAt" = excluded."updatedAt", "updatedBy" = excluded."updatedBy"
        `,
      },
      [key, String(value), now, actor.id ?? null],
    );
  }

  await recordAuditEvent({
    eventType: "admin.settings.update",
    actor,
    metadata: settings,
  });
}

async function setAccessFlag(userId: string, key: "approved" | "banned", value: boolean, actor: SessionUser) {
  const now = new Date().toISOString();
  await dbRun(
    {
      sqlite: `
        INSERT INTO "userAccess" ("userId", "approved", "banned", "updatedAt", "updatedBy")
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT ("userId") DO UPDATE SET "${key}" = excluded."${key}", "updatedAt" = excluded."updatedAt", "updatedBy" = excluded."updatedBy"
      `,
      postgres: `
        INSERT INTO "userAccess" ("userId", "approved", "banned", "updatedAt", "updatedBy")
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT ("userId") DO UPDATE SET "${key}" = excluded."${key}", "updatedAt" = excluded."updatedAt", "updatedBy" = excluded."updatedBy"
      `,
    },
    [userId, key === "approved" && value ? 1 : 0, key === "banned" && value ? 1 : 0, now, actor.id ?? null],
  );
}

export async function setUserVerified(userId: string, verified: boolean, actor: SessionUser) {
  const target = await getUserById(userId);
  if (!target) {
    return;
  }

  await dbRun(
    {
      sqlite: `UPDATE "user" SET "emailVerified" = ?, "updatedAt" = ? WHERE "id" = ?`,
      postgres: `UPDATE "user" SET "emailVerified" = $1, "updatedAt" = $2 WHERE "id" = $3`,
    },
    [verified ? 1 : 0, new Date().toISOString(), userId],
  );
  await recordAuditEvent({
    eventType: "admin.user.verify",
    actor,
    targetUserId: userId,
    targetEmail: target.email,
    metadata: { verified },
  });
}

export async function setUserApproved(userId: string, approved: boolean, actor: SessionUser) {
  const target = await getUserById(userId);
  if (!target) {
    return;
  }

  await setAccessFlag(userId, "approved", approved, actor);
  await recordAuditEvent({
    eventType: "admin.user.approve",
    actor,
    targetUserId: userId,
    targetEmail: target.email,
    metadata: { approved },
  });
}

export async function setUserBanned(userId: string, banned: boolean, actor: SessionUser) {
  const target = await getUserById(userId);
  if (!target || (await isAdminUser(userId))) {
    return;
  }

  await setAccessFlag(userId, "banned", banned, actor);
  await dbRun(
    {
      sqlite: `DELETE FROM "session" WHERE "userId" = ?`,
      postgres: `DELETE FROM "session" WHERE "userId" = $1`,
    },
    [userId],
  );
  await recordAuditEvent({
    eventType: "admin.user.ban",
    actor,
    targetUserId: userId,
    targetEmail: target.email,
    metadata: { banned, sessionsCleared: banned },
  });
}

export async function clearUserSessions(userId: string, actor: SessionUser) {
  const target = await getUserById(userId);
  if (!target) {
    return;
  }

  await dbRun(
    {
      sqlite: `DELETE FROM "session" WHERE "userId" = ?`,
      postgres: `DELETE FROM "session" WHERE "userId" = $1`,
    },
    [userId],
  );
  await recordAuditEvent({
    eventType: "admin.user.clear_sessions",
    actor,
    targetUserId: userId,
    targetEmail: target.email,
  });
}

export async function getGameLaunchAccess(user: SessionUser) {
  const settings = await getGameSettings();
  const isAdmin = await isAdminUser(user.id);
  const access = user.id
    ? await dbGet<{ approved: number | null; banned: number | null }>(
        {
          sqlite: `SELECT "approved", "banned" FROM "userAccess" WHERE "userId" = ?`,
          postgres: `SELECT "approved", "banned" FROM "userAccess" WHERE "userId" = $1`,
        },
        [user.id],
      )
    : null;

  if (Boolean(access?.banned)) {
    return { allowed: false, reason: "banned", message: "This account cannot launch the game." };
  }

  if (isAdmin) {
    return { allowed: true, reason: "admin" };
  }

  if (!settings.gameOpen) {
    return { allowed: false, reason: "game_closed", message: "The game lobby is closed right now." };
  }

  if (settings.maintenanceMode) {
    return { allowed: false, reason: "maintenance", message: "The game lobby is in maintenance mode." };
  }

  if (settings.approvedOnly && !Boolean(access?.approved)) {
    return { allowed: false, reason: "not_approved", message: "This account has not been approved for game access yet." };
  }

  return { allowed: true, reason: "allowed" };
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

export async function getAdminDashboardData(search = ""): Promise<AdminDashboardData> {
  const now = new Date().toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const normalizedSearch = search.trim().toLowerCase();
  const likeSearch = `%${normalizedSearch}%`;

  const [
    totalUsers,
    verifiedUsers,
    adminUsers,
    approvedUsers,
    bannedUsers,
    activeSessions,
    gameLaunches,
    signIns24h,
    failedSignIns24h,
    gameSettings,
    users,
    recentAudit,
    eventCounts24h,
  ] = await Promise.all([
    count(`SELECT COUNT(*) AS "value" FROM "user"`, `SELECT COUNT(*) AS "value" FROM "user"`),
    count(
      `SELECT COUNT(*) AS "value" FROM "user" WHERE "emailVerified" = 1`,
      `SELECT COUNT(*) AS "value" FROM "user" WHERE "emailVerified" = true`,
    ),
    count(`SELECT COUNT(*) AS "value" FROM "adminUser"`, `SELECT COUNT(*) AS "value" FROM "adminUser"`),
    count(`SELECT COUNT(*) AS "value" FROM "userAccess" WHERE "approved" = 1`, `SELECT COUNT(*) AS "value" FROM "userAccess" WHERE "approved" = 1`),
    count(`SELECT COUNT(*) AS "value" FROM "userAccess" WHERE "banned" = 1`, `SELECT COUNT(*) AS "value" FROM "userAccess" WHERE "banned" = 1`),
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
    getGameSettings(),
    dbAll<AdminUserRow>(
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
            CASE WHEN au."userId" IS NULL THEN 0 ELSE 1 END AS "isAdmin",
            ua."approved",
            ua."banned",
            (SELECT COUNT(*) FROM "session" s WHERE s."userId" = u."id" AND s."expiresAt" > ?) AS "activeSessions",
            (
              SELECT MAX(al."createdAt")
              FROM "auditLog" al
              WHERE al."actorUserId" = u."id" AND al."eventType" = 'game.launch' AND al."metadata" LIKE '%"success":true%'
            ) AS "lastGameLaunch"
          FROM "user" u
          LEFT JOIN "adminUser" au ON au."userId" = u."id"
          LEFT JOIN "userAccess" ua ON ua."userId" = u."id"
          WHERE (? = '' OR lower(u."email") LIKE ? OR lower(u."name") LIKE ? OR lower(COALESCE(u."username", '')) LIKE ?)
          ORDER BY u."createdAt" DESC
          LIMIT 20
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
            CASE WHEN au."userId" IS NULL THEN 0 ELSE 1 END AS "isAdmin",
            ua."approved",
            ua."banned",
            (SELECT COUNT(*) FROM "session" s WHERE s."userId" = u."id" AND s."expiresAt" > $1) AS "activeSessions",
            (
              SELECT MAX(al."createdAt")
              FROM "auditLog" al
              WHERE al."actorUserId" = u."id" AND al."eventType" = 'game.launch' AND al."metadata" LIKE '%"success":true%'
            ) AS "lastGameLaunch"
          FROM "user" u
          LEFT JOIN "adminUser" au ON au."userId" = u."id"
          LEFT JOIN "userAccess" ua ON ua."userId" = u."id"
          WHERE ($2 = '' OR lower(u."email") LIKE $3 OR lower(u."name") LIKE $4 OR lower(COALESCE(u."username", '')) LIKE $5)
          ORDER BY u."createdAt" DESC
          LIMIT 20
        `,
      },
      [now, normalizedSearch, likeSearch, likeSearch, likeSearch],
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
      approvedUsers,
      bannedUsers,
      activeSessions,
      gameLaunches,
      signIns24h,
      failedSignIns24h,
    },
    gameSettings,
    users: users.map((user) => ({
      ...user,
      emailVerified: Boolean(user.emailVerified),
      isAdmin: Boolean(user.isAdmin),
      approved: Boolean(user.approved),
      banned: Boolean(user.banned),
      activeSessions: Number(user.activeSessions),
    })),
    recentAudit,
    eventCounts24h: eventCounts24h.map((event) => ({
      eventType: event.eventType,
      count: Number(event.count),
    })),
  };
}
