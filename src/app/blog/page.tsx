import { ContentCard } from "@/components/cards/ContentCard";
import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { getContentItems } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const posts = getContentItems("blog");

  return (
    <PageShell eyebrow="Blog" title="Blog" description="Notes, build logs, and learning posts.">
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
