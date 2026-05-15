import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { TagList } from "@/components/ui/TagList";
import { getContentItem, getContentItems, markdownToHtml } from "@/lib/content";
import { formatDate } from "@/lib/utils";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getContentItems("blog").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getContentItem("blog", slug);
  return {
    title: post?.title ?? "Blog Post",
    description: post?.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getContentItem("blog", slug);
  if (!post) {
    notFound();
  }

  return (
    <PageShell eyebrow={formatDate(post.date)} title={post.title} description={post.summary}>
      <div style={{ marginBottom: 20 }}>
        <TagList tags={post.tags} />
      </div>
      <article className="post-content" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.body) }} />
    </PageShell>
  );
}
