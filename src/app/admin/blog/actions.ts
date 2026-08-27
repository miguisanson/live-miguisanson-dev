"use server";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { isAdminUser, recordAuditEvent } from "@/lib/admin-data";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogRecord,
  slugExists,
  slugify,
  updateBlogPost,
  type BlogInput,
  type BlogStatus,
} from "@/lib/blog-data";

export type BlogFormState = {
  ok: boolean;
  message: string;
};

const limits = {
  titleMax: 140,
  summaryMax: 300,
  bodyMax: 200_000,
  tagsMax: 200,
};

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/admin/blog&message=Log%20in%20with%20an%20admin%20account.");
  }
  if (!(await isAdminUser(session.user.id))) {
    notFound();
  }
  return session.user;
}

function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function normalizeStatus(value: string): BlogStatus {
  return value === "published" ? "published" : "draft";
}

// Discriminated on `ok` so TypeScript narrows `input` on the success branch.
type ParsedInput = { ok: false; error: string } | { ok: true; input: BlogInput };

async function readInput(formData: FormData, exceptId?: string): Promise<ParsedInput> {
  const title = field(formData, "title");
  const body = String(formData.get("body") ?? "").trim();
  const summary = field(formData, "summary");
  const tags = field(formData, "tags");
  const status = normalizeStatus(field(formData, "status"));
  const slug = slugify(field(formData, "slug") || title);

  if (!title) return { ok: false, error: "A title is required." };
  if (title.length > limits.titleMax) return { ok: false, error: `Title must be ${limits.titleMax} characters or fewer.` };
  if (!body) return { ok: false, error: "The post body cannot be empty." };
  if (body.length > limits.bodyMax) return { ok: false, error: "That post is too long." };
  if (summary.length > limits.summaryMax) return { ok: false, error: `Summary must be ${limits.summaryMax} characters or fewer.` };
  if (tags.length > limits.tagsMax) return { ok: false, error: "Too many tags." };
  if (!slug) return { ok: false, error: "Could not build a URL from that title. Add a slug." };
  if (await slugExists(slug, exceptId)) {
    return { ok: false, error: `The URL "${slug}" is already used by another post.` };
  }

  return { ok: true, input: { title, slug, summary, body, tags, status } };
}

export async function createBlogPostAction(
  _prev: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const admin = await requireAdmin();
  const parsed = await readInput(formData);
  if (!parsed.ok) {
    return { ok: false, message: parsed.error };
  }

  await createBlogPost(admin.id, parsed.input);
  await recordAuditEvent({
    eventType: "blog.create",
    actor: admin,
    metadata: { slug: parsed.input.slug, status: parsed.input.status },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath(`/blog/${parsed.input.slug}`);
  return { ok: true, message: parsed.input.status === "published" ? "Published." : "Saved as draft." };
}

export async function updateBlogPostAction(
  _prev: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const admin = await requireAdmin();
  const id = field(formData, "id");
  const existing = await getBlogRecord(id);
  if (!existing) {
    return { ok: false, message: "That post no longer exists." };
  }

  const parsed = await readInput(formData, id);
  if (!parsed.ok) {
    return { ok: false, message: parsed.error };
  }

  await updateBlogPost(id, parsed.input);
  await recordAuditEvent({
    eventType: "blog.update",
    actor: admin,
    metadata: { slug: parsed.input.slug, status: parsed.input.status },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath(`/blog/${existing.slug}`);
  revalidatePath(`/blog/${parsed.input.slug}`);
  return { ok: true, message: "Saved." };
}

export async function deleteBlogPostAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const existing = await getBlogRecord(id);
  if (!existing) {
    return;
  }

  await deleteBlogPost(id);
  await recordAuditEvent({
    eventType: "blog.delete",
    actor: admin,
    metadata: { slug: existing.slug },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath(`/blog/${existing.slug}`);
  redirect("/admin/blog");
}
