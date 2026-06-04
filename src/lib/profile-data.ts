import { dbAll, dbGet, dbRun } from "./app-db";

export type UserProfile = {
  bio: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  links: string;
};

export type PublicProfile = {
  username: string;
  displayName: string;
  createdAt: string;
  bio: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
};

export type GameLaunch = {
  createdAt: string;
  destination: string | null;
};

type PublicProfileRow = {
  username: string | null;
  displayUsername: string | null;
  name: string | null;
  createdAt: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
};

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  return dbGet<UserProfile>(
    {
      sqlite: `SELECT "bio", "avatarUrl", "bannerUrl", "links" FROM "userProfile" WHERE "userId" = ?`,
      postgres: `SELECT "bio", "avatarUrl", "bannerUrl", "links" FROM "userProfile" WHERE "userId" = $1`,
    },
    [userId],
  );
}

export async function upsertUserProfile(userId: string, input: { bio: string }) {
  const now = new Date().toISOString();
  await dbRun(
    {
      sqlite: `
        INSERT INTO "userProfile" ("userId", "bio", "createdAt", "updatedAt")
        VALUES (?, ?, ?, ?)
        ON CONFLICT ("userId") DO UPDATE SET "bio" = excluded."bio", "updatedAt" = excluded."updatedAt"
      `,
      postgres: `
        INSERT INTO "userProfile" ("userId", "bio", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("userId") DO UPDATE SET "bio" = excluded."bio", "updatedAt" = excluded."updatedAt"
      `,
    },
    [userId, input.bio, now, now],
  );
}

export async function updateUserDisplayName(userId: string, displayName: string) {
  await dbRun(
    {
      sqlite: `UPDATE "user" SET "displayUsername" = ?, "name" = ?, "updatedAt" = ? WHERE "id" = ?`,
      postgres: `UPDATE "user" SET "displayUsername" = $1, "name" = $2, "updatedAt" = $3 WHERE "id" = $4`,
    },
    [displayName, displayName, new Date().toISOString(), userId],
  );
}

export async function getPublicProfileByUsername(username: string): Promise<PublicProfile | null> {
  const row = await dbGet<PublicProfileRow>(
    {
      sqlite: `
        SELECT u."username", u."displayUsername", u."name", u."createdAt",
               COALESCE(p."bio", '') AS "bio", p."avatarUrl", p."bannerUrl"
        FROM "user" u
        LEFT JOIN "userProfile" p ON p."userId" = u."id"
        WHERE lower(u."username") = lower(?)
      `,
      postgres: `
        SELECT u."username", u."displayUsername", u."name", u."createdAt",
               COALESCE(p."bio", '') AS "bio", p."avatarUrl", p."bannerUrl"
        FROM "user" u
        LEFT JOIN "userProfile" p ON p."userId" = u."id"
        WHERE lower(u."username") = lower($1)
      `,
    },
    [username],
  );

  if (!row || !row.username) {
    return null;
  }

  return {
    username: row.username,
    displayName: row.displayUsername ?? row.name ?? row.username,
    createdAt: row.createdAt,
    bio: row.bio ?? "",
    avatarUrl: row.avatarUrl,
    bannerUrl: row.bannerUrl,
  };
}

export async function getUserGameLaunches(userId: string, limit = 25): Promise<GameLaunch[]> {
  const rows = await dbAll<{ createdAt: string; metadata: string }>(
    {
      sqlite: `
        SELECT "createdAt", "metadata" FROM "auditLog"
        WHERE "eventType" = 'game.launch' AND "actorUserId" = ? AND "metadata" LIKE '%"success":true%'
        ORDER BY "createdAt" DESC
        LIMIT ?
      `,
      postgres: `
        SELECT "createdAt", "metadata" FROM "auditLog"
        WHERE "eventType" = 'game.launch' AND "actorUserId" = $1 AND "metadata" LIKE '%"success":true%'
        ORDER BY "createdAt" DESC
        LIMIT $2
      `,
    },
    [userId, limit],
  );

  return rows.map((row) => {
    let destination: string | null = null;
    try {
      const parsed = JSON.parse(row.metadata) as { destination?: unknown };
      destination = typeof parsed.destination === "string" ? parsed.destination : null;
    } catch {
      destination = null;
    }
    return { createdAt: row.createdAt, destination };
  });
}
