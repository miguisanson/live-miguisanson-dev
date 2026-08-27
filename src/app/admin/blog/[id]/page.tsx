import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { DeleteBlogPostButton } from "@/components/admin/DeleteBlogPostButton";
import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin-data";
import { getBlogRecord } from "@/lib/blog-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Edit blog post" };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/admin/blog&message=Log%20in%20with%20an%20admin%20account.");
  }
  if (!(await isAdminUser(session.user.id))) {
    notFound();
  }

  const post = await getBlogRecord(id);
  if (!post) {
    notFound();
  }

  return (
    <PageShell eyebrow="Admin" title="Edit post" description={`/blog/${post.slug}`}>
      <BlogEditor post={post} />
      <DeleteBlogPostButton id={post.id} title={post.title} />
    </PageShell>
  );
}
