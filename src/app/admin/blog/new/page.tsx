import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "New blog post" };

export default async function NewBlogPostPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/admin/blog/new&message=Log%20in%20with%20an%20admin%20account.");
  }
  if (!(await isAdminUser(session.user.id))) {
    notFound();
  }

  return (
    <PageShell eyebrow="Admin" title="New post" description="Write a post in markdown, then publish it or keep it as a draft.">
      <BlogEditor />
    </PageShell>
  );
}
