import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin-data";
import { listBlogRecords } from "@/lib/blog-data";
import { getContentItems } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog posts",
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(value),
  );
}

export default async function AdminBlogPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/admin/blog&message=Log%20in%20with%20an%20admin%20account.");
  }
  if (!(await isAdminUser(session.user.id))) {
    notFound();
  }

  const records = await listBlogRecords();
  const files = getContentItems("blog");

  return (
    <PageShell
      eyebrow="Admin"
      title="Blog posts"
      description="Write and publish long-form posts. Markdown files in the repository are listed too, but are edited in code."
    >
      <div className="admin-toolbar">
        <Link className="ui-button ui-button--primary ui-button--md" href="/admin/blog/new">
          New post
        </Link>
      </div>

      <section aria-label="Editable posts">
        <div className="community-section-head">
          <h2>Written here</h2>
          <span>{records.length}</span>
        </div>
        {records.length > 0 ? (
          <div className="post-list">
            {records.map((record) => (
              <article className="post-card admin-post-row" key={record.id}>
                <div className="admin-post-main">
                  <Link href={`/admin/blog/${record.id}`} className="post-author">
                    {record.title}
                  </Link>
                  <span className="post-meta">
                    /blog/{record.slug} · {dateLabel(record.publishedAt ?? record.createdAt)}
                  </span>
                </div>
                <span className={`ui-badge ${record.status === "published" ? "ui-badge--solid" : "ui-badge--outline"}`}>
                  {record.status}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <p className="account-empty">No posts written here yet.</p>
        )}
      </section>

      <section aria-label="Repository posts" style={{ marginTop: "var(--space-10)" }}>
        <div className="community-section-head">
          <h2>In the repository</h2>
          <span>{files.length}</span>
        </div>
        <div className="post-list">
          {files.map((file) => (
            <article className="post-card admin-post-row" key={file.slug}>
              <div className="admin-post-main">
                <Link href={`/blog/${file.slug}`} className="post-author">
                  {file.title}
                </Link>
                <span className="post-meta">content/blog/{file.slug}.md</span>
              </div>
              <span className="ui-badge ui-badge--outline">file</span>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
