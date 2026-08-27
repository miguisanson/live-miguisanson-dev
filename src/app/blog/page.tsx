import { ContentCard } from "@/components/cards/ContentCard";
import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { listBlogEntries } from "@/lib/blog-data";
import { formatDate } from "@/lib/utils";

// Reads the database, so it cannot be static.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const posts = await listBlogEntries();

  return (
    <PageShell title="Blog" description="Notes, build logs, and learning posts.">
      {posts.length > 0 ? (
        <div className="content-list">
          {posts.map((post) => (
            <ContentCard
              key={post.slug}
              title={post.title}
              description={post.summary}
              href={`/blog/${post.slug}`}
              meta={formatDate(post.date)}
              tags={post.tags}
              cta="Read post"
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No posts yet" description="Articles will appear here." />
      )}
    </PageShell>
  );
}
