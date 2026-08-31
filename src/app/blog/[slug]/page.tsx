import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { PageShell } from "@/components/layout/PageShell";
import { CertificateModal } from "@/components/sections/CertificateModal";
import { TagList } from "@/components/ui/TagList";
import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin-data";
import { getBlogEntry } from "@/lib/blog-data";
import { markdownToHtml } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogEntry(slug);
  return {
    title: post?.title ?? "Blog Post",
    description: post?.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Admins can preview drafts at their real URL; everyone else gets a 404.
  const session = await auth.api.getSession({ headers: await headers() });
  const admin = session ? await isAdminUser(session.user.id) : false;

  const post = await getBlogEntry(slug, { includeDrafts: admin });
  if (!post) {
    notFound();
  }

  return (
    <PageShell
      eyebrow={formatDate(post.date)}
      title={post.title}
      description={post.summary}
      backHref="/blog"
      backLabel="All posts"
    >
      {post.status === "draft" ? (
        <p className="draft-notice">Draft — only visible to admins.</p>
      ) : null}
      {post.tags.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <TagList tags={post.tags} />
        </div>
      ) : null}
      {post.pdf ? (
        <aside className="doc-attachment">
          <div className="doc-attachment-body">
            <span className="doc-attachment-label">Companion document</span>
            <strong>{post.title}</strong>
            <span className="doc-attachment-note">
              The full manual, exactly as written — code samples, diagrams and screenshots included.
            </span>
          </div>
          <div className="doc-attachment-actions">
            <button
              type="button"
              className="ui-button ui-button--primary ui-button--sm"
              data-pdf={post.pdf}
              data-title={post.title}
            >
              Read it here
            </button>
            <a className="ui-button ui-button--neutral ui-button--sm" href={post.pdf} download>
              Download PDF
            </a>
          </div>
        </aside>
      ) : null}

      <article className="post-content" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.body) }} />

      {/* Powers the in-page PDF reader for the button above. */}
      {post.pdf ? <CertificateModal /> : null}
    </PageShell>
  );
}
