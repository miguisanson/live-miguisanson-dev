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
      <div className="mb-8">
        <TagList tags={post.tags} />
      </div>
      <article className="prose-content max-w-3xl rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.body) }} />
    </PageShell>
  );
}
