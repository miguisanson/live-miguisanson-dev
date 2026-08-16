import { dbAll, dbGet, dbRun } from "./app-db";
import { isAdminUser } from "./admin-data";

export type ProfileLinks = {
  status: string;
  quote: string;
  themeColor: string;
  bgPattern: string;
  favoriteGames: string[];
  isPublic: boolean;
  hideActivity: boolean;
};

export type UserProfile = ProfileLinks & {
  bio: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
};

export type PublicProfile = UserProfile & {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
  emailVerified: boolean;
  isAdmin: boolean;
};

export type ProfileCard = {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
};

export type Badge = {
  key: string;
  label: string;
  title: string;
};

export type GameLaunch = {
  createdAt: string;
  game: string;
};

const EARLY_MEMBER_LIMIT = 50;

const defaultLinks: ProfileLinks = {
  status: "",
  quote: "",
  themeColor: "",
  bgPattern: "none",
  favoriteGames: [],
  isPublic: true,
  hideActivity: false,
};

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseLinks(raw: string | null | undefined): ProfileLinks {
  if (!raw) {
    return { ...defaultLinks, favoriteGames: [] };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<ProfileLinks>;
    return {
      status: str(parsed.status),
      quote: str(parsed.quote),
      themeColor: str(parsed.themeColor),
      bgPattern: str(parsed.bgPattern) || "none",
      favoriteGames: Array.isArray(parsed.favoriteGames)
        ? parsed.favoriteGames.filter((item): item is string => typeof item === "string")
        : [],
      isPublic: parsed.isPublic !== false,
      hideActivity: parsed.hideActivity === true,
    };
  } catch {
    return { ...defaultLinks, favoriteGames: [] };
  }
}

function resolveGameName(metadata: string): string {
  try {
    const parsed = JSON.parse(metadata) as { game?: unknown; destination?: unknown };
    if (typeof parsed.game === "string" && parsed.game) {
      return parsed.game;
    }
    if (typeof parsed.destination === "string" && parsed.destination.includes("game.miguisanson.dev")) {
      return "Here to Slay";
    }
  } catch {
    // fall through
  }
  return "Game";
}

function boolVal(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || value === "t" || value === "true";
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const row = await dbGet<{ bio: string | null; avatarUrl: string | null; bannerUrl: string | null; links: string | null }>(
    {
      sqlite: `SELECT "bio", "avatarUrl", "bannerUrl", "links" FROM "userProfile" WHERE "userId" = ?`,
      postgres: `SELECT "bio", "avatarUrl", "bannerUrl", "links" FROM "userProfile" WHERE "userId" = $1`,
    },
    [userId],
  );
  const links = parseLinks(row?.links);
  return {
    ...links,
    bio: row?.bio ?? "",
    avatarUrl: row?.avatarUrl ?? null,
    bannerUrl: row?.bannerUrl ?? null,
  };
}

export async function upsertUserProfile(userId: string, input: { bio: string } & ProfileLinks) {
  const now = new Date().toISOString();
  const { bio, ...links } = input;
  const serialized = JSON.stringify(links);
  await dbRun(
    {
      sqlite: `
        INSERT INTO "userProfile" ("userId", "bio", "links", "createdAt", "updatedAt")
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT ("userId") DO UPDATE SET "bio" = excluded."bio", "links" = excluded."links", "updatedAt" = excluded."updatedAt"
      `,
      postgres: `
        INSERT INTO "userProfile" ("userId", "bio", "links", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT ("userId") DO UPDATE SET "bio" = excluded."bio", "links" = excluded."links", "updatedAt" = excluded."updatedAt"
      `,
    },
    [userId, bio, serialized, now, now],
  );
}

export async function updateProfileMedia(userId: string, kind: "avatar" | "banner", url: string) {
  const column = kind === "avatar" ? "avatarUrl" : "bannerUrl";
  const now = new Date().toISOString();
  await dbRun(
    {
      sqlite: `
        INSERT INTO "userProfile" ("userId", "bio", "links", "${column}", "createdAt", "updatedAt")
        VALUES (?, '', '{}', ?, ?, ?)
        ON CONFLICT ("userId") DO UPDATE SET "${column}" = excluded."${column}", "updatedAt" = excluded."updatedAt"
      `,
      postgres: `
        INSERT INTO "userProfile" ("userId", "bio", "links", "${column}", "createdAt", "updatedAt")
        VALUES ($1, '', '{}', $2, $3, $4)
        ON CONFLICT ("userId") DO UPDATE SET "${column}" = excluded."${column}", "updatedAt" = excluded."updatedAt"
      `,
    },
    [userId, url, now, now],
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

type PublicProfileRow = {
  id: string;
  username: string | null;
  displayUsername: string | null;
  name: string | null;
  emailVerified: number | boolean | null;
  createdAt: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  links: string | null;
};

export async function getPublicProfileByUsername(username: string): Promise<PublicProfile | null> {
  const row = await dbGet<PublicProfileRow>(
    {
      sqlite: `
        SELECT u."id", u."username", u."displayUsername", u."name", u."emailVerified", u."createdAt",
               COALESCE(p."bio", '') AS "bio", p."avatarUrl", p."bannerUrl", p."links"
        FROM "user" u
        LEFT JOIN "userProfile" p ON p."userId" = u."id"
        WHERE lower(u."username") = lower(?)
      `,
      postgres: `
        SELECT u."id", u."username", u."displayUsername", u."name", u."emailVerified", u."createdAt",
               COALESCE(p."bio", '') AS "bio", p."avatarUrl", p."bannerUrl", p."links"
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

  const links = parseLinks(row.links);
  return {
    ...links,
    id: row.id,
    username: row.username,
    displayName: row.displayUsername ?? row.name ?? row.username,
    createdAt: row.createdAt,
    emailVerified: boolVal(row.emailVerified),
    isAdmin: await isAdminUser(row.id),
    bio: row.bio ?? "",
    avatarUrl: row.avatarUrl,
    bannerUrl: row.bannerUrl,
  };
}

type CardRow = {
  username: string | null;
  displayUsername: string | null;
  name: string | null;
  emailVerified: number | boolean | null;
  isAdmin: number | boolean | null;
  bio: string | null;
  avatarUrl: string | null;
};

function toCard(row: CardRow): ProfileCard {
  return {
    username: row.username ?? "",
    displayName: row.displayUsername ?? row.name ?? row.username ?? "",
    bio: row.bio ?? "",
    avatarUrl: row.avatarUrl,
    emailVerified: boolVal(row.emailVerified),
    isAdmin: boolVal(row.isAdmin),
  };
}

const cardSelect = `
  u."username", u."displayUsername", u."name", u."emailVerified",
  CASE WHEN au."userId" IS NULL THEN 0 ELSE 1 END AS "isAdmin",
  COALESCE(p."bio", '') AS "bio", p."avatarUrl"
`;
// Members stay listed even when their profile is private; the profile page itself gates access.
const listableFilter = `u."username" IS NOT NULL`;
const indexableFilter = `u."username" IS NOT NULL AND (p."links" IS NULL OR p."links" NOT LIKE '%"isPublic":false%')`;

export async function searchProfiles(query: string, limit = 30): Promise<ProfileCard[]> {
  const like = `%${query.trim().toLowerCase()}%`;
  const rows = await dbAll<CardRow>(
    {
      sqlite: `
        SELECT ${cardSelect}
        FROM "user" u
        LEFT JOIN "userProfile" p ON p."userId" = u."id"
        LEFT JOIN "adminUser" au ON au."userId" = u."id"
        WHERE ${listableFilter}
          AND (lower(u."username") LIKE ? OR lower(COALESCE(u."displayUsername", u."name", '')) LIKE ?)
        ORDER BY u."createdAt" DESC
        LIMIT ?
      `,
      postgres: `
        SELECT ${cardSelect}
        FROM "user" u
        LEFT JOIN "userProfile" p ON p."userId" = u."id"
        LEFT JOIN "adminUser" au ON au."userId" = u."id"
        WHERE ${listableFilter}
          AND (lower(u."username") LIKE $1 OR lower(COALESCE(u."displayUsername", u."name", '')) LIKE $2)
        ORDER BY u."createdAt" DESC
        LIMIT $3
      `,
    },
    [like, like, limit],
  );
  return rows.map(toCard);
}

export async function listRecentProfiles(limit = 12): Promise<ProfileCard[]> {
  const rows = await dbAll<CardRow>(
    {
      sqlite: `
        SELECT ${cardSelect}
        FROM "user" u
        LEFT JOIN "userProfile" p ON p."userId" = u."id"
        LEFT JOIN "adminUser" au ON au."userId" = u."id"
        WHERE ${listableFilter}
        ORDER BY u."createdAt" DESC
        LIMIT ?
      `,
      postgres: `
        SELECT ${cardSelect}
        FROM "user" u
        LEFT JOIN "userProfile" p ON p."userId" = u."id"
        LEFT JOIN "adminUser" au ON au."userId" = u."id"
        WHERE ${listableFilter}
        ORDER BY u."createdAt" DESC
        LIMIT $1
      `,
    },
    [limit],
  );
  return rows.map(toCard);
}

export async function listPublicUsernames(): Promise<string[]> {
  const rows = await dbAll<{ username: string | null }>(
    {
      sqlite: `
        SELECT u."username"
        FROM "user" u
        LEFT JOIN "userProfile" p ON p."userId" = u."id"
        WHERE ${indexableFilter}
      `,
      postgres: `
        SELECT u."username"
        FROM "user" u
        LEFT JOIN "userProfile" p ON p."userId" = u."id"
        WHERE ${indexableFilter}
      `,
    },
    [],
  );
  return rows.map((row) => row.username).filter((value): value is string => Boolean(value));
}

async function countValue(sqlite: string, postgres: string, params: Array<string | number> = []) {
  const row = await dbGet<{ value: number | string | null }>({ sqlite, postgres }, params);
  return Number(row?.value ?? 0);
}

async function isEarlyMember(createdAt: string) {
  const rank = await countValue(
    `SELECT COUNT(*) AS "value" FROM "user" WHERE "createdAt" <= ?`,
    `SELECT COUNT(*) AS "value" FROM "user" WHERE "createdAt" <= $1`,
    [createdAt],
  );
  return rank <= EARLY_MEMBER_LIMIT;
}

export async function getProfileBadges(profile: PublicProfile): Promise<Badge[]> {
  const [launches, posts, early] = await Promise.all([
    countValue(
      `SELECT COUNT(*) AS "value" FROM "auditLog" WHERE "actorUserId" = ? AND "eventType" = 'game.launch' AND "metadata" LIKE '%"success":true%'`,
      `SELECT COUNT(*) AS "value" FROM "auditLog" WHERE "actorUserId" = $1 AND "eventType" = 'game.launch' AND "metadata" LIKE '%"success":true%'`,
      [profile.id],
    ),
    countValue(
      `SELECT COUNT(*) AS "value" FROM "post" WHERE "userId" = ? AND "visibility" = 'public'`,
      `SELECT COUNT(*) AS "value" FROM "post" WHERE "userId" = $1 AND "visibility" = 'public'`,
      [profile.id],
    ),
    isEarlyMember(profile.createdAt),
  ]);

  const profileComplete = Boolean(profile.bio) && Boolean(profile.avatarUrl);

  const badges: Badge[] = [];
  if (profile.isAdmin) {
    badges.push({ key: "admin", label: "Admin", title: "Site administrator" });
  }
  if (profile.emailVerified) {
    badges.push({ key: "verified", label: "Verified", title: "Verified email" });
  }
  if (early) {
    badges.push({ key: "early", label: "Early member", title: "One of the first members" });
  }
  if (launches > 0) {
    badges.push({ key: "player", label: "Game player", title: "Played a site game" });
  }
  if (posts > 0) {
    badges.push({ key: "writer", label: "Writer", title: "Published a post" });
  }
  if (profileComplete) {
    badges.push({ key: "complete", label: "Profile pro", title: "Completed their profile" });
  }
  return badges;
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

  return rows.map((row) => ({ createdAt: row.createdAt, game: resolveGameName(row.metadata) }));
}
