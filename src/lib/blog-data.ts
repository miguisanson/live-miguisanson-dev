import { randomBytes } from "node:crypto";
import { dbAll, dbGet, dbRun } from "./app-db";
import { getContentItems, type ContentItem } from "./content";

/**
 * Blog posts come from two places:
 *
 *  - markdown files in `content/blog/`, version-controlled with the code
 *  - the `blogPost` table, written from the admin dashboard
 *
 * The index merges both and sorts by date. File-backed posts are read-only from
 * the web UI — editing them means editing the repository, which is the point.
 */

export type BlogStatus = "draft" | "published";

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  tags: string;
  status: BlogStatus;
  authorId: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogEntry = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  date: string;
  /** "file" entries live in the repository; "db" entries are editable in /admin. */
  source: "file" | "db";
  status: BlogStatus;
};

function blogId() {
  return randomBytes(18).toString("base64url");
}

/** Lowercase, hyphenated, safe in a URL path. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function fromFile(item: ContentItem): BlogEntry {
  return {
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    body: item.body,
    tags: item.tags,
    date: item.date ?? "",
    source: "file",
    status: "published",
  };
}

function fromRecord(row: BlogPostRecord): BlogEntry {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    body: row.body,
    tags: parseTags(row.tags),
    date: (row.publishedAt ?? row.createdAt).slice(0, 10),
    source: "db",
    status: row.status,
  };
}

async function listRecords(includeDrafts: boolean): Promise<BlogPostRecord[]> {
  const columns = `"id", "slug", "title", "summary", "body", "tags", "status", "authorId", "publishedAt", "createdAt", "updatedAt"`;
  if (includeDrafts) {
    return dbAll<BlogPostRecord>({
      sqlite: `SELECT ${columns} FROM "blogPost" ORDER BY COALESCE("publishedAt", "createdAt") DESC`,
      postgres: `SELECT ${columns} FROM "blogPost" ORDER BY COALESCE("publishedAt", "createdAt") DESC`,
    });
  }
  return dbAll<BlogPostRecord>({
    sqlite: `SELECT ${columns} FROM "blogPost" WHERE "status" = 'published' ORDER BY COALESCE("publishedAt", "createdAt") DESC`,
    postgres: `SELECT ${columns} FROM "blogPost" WHERE "status" = 'published' ORDER BY COALESCE("publishedAt", "createdAt") DESC`,
  });
}

/**
 * Every blog entry, newest first.
 *
 * Reads of the database are wrapped: the blog must still render if the table is
 * missing (a fresh checkout before migration) or the database is unreachable.
 */
export async function listBlogEntries(options: { includeDrafts?: boolean } = {}): Promise<BlogEntry[]> {
  const fileEntries = getContentItems("blog").map(fromFile);

  let dbEntries: BlogEntry[] = [];
  try {
    dbEntries = (await listRecords(Boolean(options.includeDrafts))).map(fromRecord);
  } catch {
    dbEntries = [];
  }

  // A database post wins over a file with the same slug, so a file-backed post
  // can be superseded without deleting it from the repository.
  const bySlug = new Map<string, BlogEntry>();
  for (const entry of fileEntries) {
    bySlug.set(entry.slug, entry);
  }
  for (const entry of dbEntries) {
    bySlug.set(entry.slug, entry);
  }

  return [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getBlogEntry(slug: string, options: { includeDrafts?: boolean } = {}) {
  const entries = await listBlogEntries(options);
  return entries.find((entry) => entry.slug === slug) ?? null;
}

export async function getBlogRecord(id: string) {
  return dbGet<BlogPostRecord>(
    {
      sqlite: `SELECT * FROM "blogPost" WHERE "id" = ?`,
      postgres: `SELECT * FROM "blogPost" WHERE "id" = $1`,
    },
    [id],
  );
}

export async function slugExists(slug: string, exceptId?: string) {
  const row = await dbGet<{ id: string }>(
    {
      sqlite: `SELECT "id" FROM "blogPost" WHERE "slug" = ?`,
      postgres: `SELECT "id" FROM "blogPost" WHERE "slug" = $1`,
    },
    [slug],
  );
  if (!row) {
    // A markdown file with this slug would also collide.
    return getContentItems("blog").some((item) => item.slug === slug);
  }
  return row.id !== exceptId;
}

export type BlogInput = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  tags: string;
  status: BlogStatus;
};

export async function createBlogPost(authorId: string, input: BlogInput) {
  const now = new Date().toISOString();
  const id = blogId();
  await dbRun(
    {
      sqlite: `INSERT INTO "blogPost" ("id","slug","title","summary","body","tags","status","authorId","publishedAt","createdAt","updatedAt")
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      postgres: `INSERT INTO "blogPost" ("id","slug","title","summary","body","tags","status","authorId","publishedAt","createdAt","updatedAt")
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    },
    [
      id,
      input.slug,
      input.title,
      input.summary,
      input.body,
      input.tags,
      input.status,
      authorId,
      input.status === "published" ? now : null,
      now,
      now,
    ],
  );
  return id;
}

export async function updateBlogPost(id: string, input: BlogInput) {
  const existing = await getBlogRecord(id);
  if (!existing) {
    return false;
  }
  const now = new Date().toISOString();
  // Keep the original publish date once set, so editing does not reorder the index.
  const publishedAt =
    input.status === "published" ? (existing.publishedAt ?? now) : null;

  await dbRun(
    {
      sqlite: `UPDATE "blogPost" SET "slug" = ?, "title" = ?, "summary" = ?, "body" = ?, "tags" = ?, "status" = ?, "publishedAt" = ?, "updatedAt" = ? WHERE "id" = ?`,
      postgres: `UPDATE "blogPost" SET "slug" = $1, "title" = $2, "summary" = $3, "body" = $4, "tags" = $5, "status" = $6, "publishedAt" = $7, "updatedAt" = $8 WHERE "id" = $9`,
    },
    [input.slug, input.title, input.summary, input.body, input.tags, input.status, publishedAt, now, id],
  );
  return true;
}

export async function deleteBlogPost(id: string) {
  await dbRun(
    {
      sqlite: `DELETE FROM "blogPost" WHERE "id" = ?`,
      postgres: `DELETE FROM "blogPost" WHERE "id" = $1`,
    },
    [id],
  );
}

/** Admin listing — includes drafts, newest first. */
export async function listBlogRecords() {
  try {
    return await listRecords(true);
  } catch {
    return [];
  }
}
