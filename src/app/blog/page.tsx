import { ContentCard } from "@/components/cards/ContentCard";
import { PageShell } from "@/components/layout/PageShell";
import { getContentItems } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const posts = getContentItems("blog");

  return (
    <PageShell
      eyebrow="Blog"
      title="Learning notes and build logs."
      description="Short posts about portfolio migration, homelab work, frontend prototypes, and future AI experiments."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ContentCard
            key={post.slug}
            title={post.title}
            description={post.summary}
            href={`/blog/${post.slug}`}
            meta={formatDate(post.date)}
            tags={post.tags}
          />
        ))}
      </div>
    </PageShell>
  );
}
