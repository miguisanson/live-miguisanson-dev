import { randomBytes } from "node:crypto";
import { dbAll, dbGet, dbRun } from "./app-db";
import { isAdminUser } from "./admin-data";

export type PostVisibility = "public" | "draft";

export type Post = {
  id: string;
  userId: string;
  body: string;
  visibility: PostVisibility;
  createdAt: string;
  updatedAt: string;
};

export type FeedPost = Post & {
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

function postId() {
  return randomBytes(18).toString("base64url");
}

function normalizeVisibility(value: string): PostVisibility {
  return value === "draft" ? "draft" : "public";
}

export async function createPost(userId: string, body: string, visibility: string) {
  const now = new Date().toISOString();
  const id = postId();
  await dbRun(
    {
      sqlite: `INSERT INTO "post" ("id", "userId", "body", "visibility", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?)`,
      postgres: `INSERT INTO "post" ("id", "userId", "body", "visibility", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)`,
    },
    [id, userId, body, normalizeVisibility(visibility), now, now],
  );
  return id;
}

export async function getPost(id: string): Promise<Post | null> {
  return dbGet<Post>(
    {
      sqlite: `SELECT "id", "userId", "body", "visibility", "createdAt", "updatedAt" FROM "post" WHERE "id" = ?`,
      postgres: `SELECT "id", "userId", "body", "visibility", "createdAt", "updatedAt" FROM "post" WHERE "id" = $1`,
    },
    [id],
  );
}

export async function updatePost(id: string, userId: string, body: string, visibility: string) {
  const post = await getPost(id);
  if (!post || post.userId !== userId) {
    return false;
  }
  await dbRun(
    {
      sqlite: `UPDATE "post" SET "body" = ?, "visibility" = ?, "updatedAt" = ? WHERE "id" = ?`,
      postgres: `UPDATE "post" SET "body" = $1, "visibility" = $2, "updatedAt" = $3 WHERE "id" = $4`,
    },
    [body, normalizeVisibility(visibility), new Date().toISOString(), id],
  );
  return true;
}

export async function deletePost(id: string, actorUserId: string) {
  const post = await getPost(id);
  if (!post) {
    return false;
  }
  if (post.userId !== actorUserId && !(await isAdminUser(actorUserId))) {
    return false;
  }
  await dbRun(
    {
      sqlite: `DELETE FROM "post" WHERE "id" = ?`,
      postgres: `DELETE FROM "post" WHERE "id" = $1`,
    },
    [id],
  );
  return true;
}

export async function getUserPosts(userId: string, options: { includeDrafts?: boolean } = {}): Promise<Post[]> {
  if (options.includeDrafts) {
    return dbAll<Post>(
      {
        sqlite: `SELECT "id", "userId", "body", "visibility", "createdAt", "updatedAt" FROM "post" WHERE "userId" = ? ORDER BY "createdAt" DESC`,
        postgres: `SELECT "id", "userId", "body", "visibility", "createdAt", "updatedAt" FROM "post" WHERE "userId" = $1 ORDER BY "createdAt" DESC`,
      },
      [userId],
    );
  }
  return dbAll<Post>(
    {
      sqlite: `SELECT "id", "userId", "body", "visibility", "createdAt", "updatedAt" FROM "post" WHERE "userId" = ? AND "visibility" = 'public' ORDER BY "createdAt" DESC`,
      postgres: `SELECT "id", "userId", "body", "visibility", "createdAt", "updatedAt" FROM "post" WHERE "userId" = $1 AND "visibility" = 'public' ORDER BY "createdAt" DESC`,
    },
    [userId],
  );
}

export async function getPublicPostsByUser(userId: string, limit = 10): Promise<Post[]> {
  return dbAll<Post>(
    {
      sqlite: `SELECT "id", "userId", "body", "visibility", "createdAt", "updatedAt" FROM "post" WHERE "userId" = ? AND "visibility" = 'public' ORDER BY "createdAt" DESC LIMIT ?`,
      postgres: `SELECT "id", "userId", "body", "visibility", "createdAt", "updatedAt" FROM "post" WHERE "userId" = $1 AND "visibility" = 'public' ORDER BY "createdAt" DESC LIMIT $2`,
    },
    [userId, limit],
  );
}

export async function listRecentPublicPosts(limit = 15): Promise<FeedPost[]> {
  return dbAll<FeedPost>(
    {
      sqlite: `
        SELECT pt."id", pt."userId", pt."body", pt."visibility", pt."createdAt", pt."updatedAt",
               u."username", COALESCE(u."displayUsername", u."name", u."username") AS "displayName", p."avatarUrl"
        FROM "post" pt
        JOIN "user" u ON u."id" = pt."userId"
        LEFT JOIN "userProfile" p ON p."userId" = pt."userId"
        WHERE pt."visibility" = 'public'
        ORDER BY pt."createdAt" DESC
        LIMIT ?
      `,
      postgres: `
        SELECT pt."id", pt."userId", pt."body", pt."visibility", pt."createdAt", pt."updatedAt",
               u."username", COALESCE(u."displayUsername", u."name", u."username") AS "displayName", p."avatarUrl"
        FROM "post" pt
        JOIN "user" u ON u."id" = pt."userId"
        LEFT JOIN "userProfile" p ON p."userId" = pt."userId"
        WHERE pt."visibility" = 'public'
        ORDER BY pt."createdAt" DESC
        LIMIT $1
      `,
    },
    [limit],
  );
}
