import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { PageShell } from "@/components/layout/PageShell";
import { PostComposer } from "@/components/account/PostComposer";
import { PostGallery } from "@/components/account/PostGallery";
import { auth } from "@/lib/auth";
import { markdownToHtml } from "@/lib/content";
import { listRecentPublicPosts, postImages } from "@/lib/posts-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community",
  description: "Posts from miguisanson.dev members.",
  alternates: { canonical: "/community" },
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

export default async function CommunityPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const posts = await listRecentPublicPosts(50);

  return (
    <PageShell
      title="Community"
      description="What members are posting. Write something and it appears here."
    >
      {session ? (
        <section className="community-composer" aria-label="Write a post">
          <PostComposer />
        </section>
      ) : (
        <section className="community-signin-prompt">
          <p>
            <Link href="/login?account=login&next=/community">Log in</Link> or{" "}
            <Link href="/login?account=signup&next=/community">create an account</Link> to post.
          </p>
        </section>
      )}

      <section aria-label="Recent posts">
        <div className="community-section-head">
          <h2>Recent posts</h2>
          <span>{posts.length}</span>
        </div>

        {posts.length > 0 ? (
          <div className="post-list">
            {posts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-card-head">
                  <Link href={`/u/${post.username}`} className="post-author-link">
                    <span className="public-avatar post-avatar" aria-hidden="true">
                      {post.avatarUrl ? (
                        <Image src={post.avatarUrl} alt="" width={32} height={32} />
                      ) : (
                        (post.displayName || post.username).slice(0, 1).toUpperCase()
                      )}
                    </span>
                    <span className="post-author">{post.displayName}</span>
                  </Link>
                  <time dateTime={post.createdAt}>{dateLabel(post.createdAt)}</time>
                </div>
                {post.body ? (
                  <div
                    className="post-card-body"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(post.body) }}
                  />
                ) : null}
                <PostGallery images={postImages(post)} alt={`Post by ${post.displayName}`} />
              </article>
            ))}
          </div>
        ) : (
          <p className="account-empty">No posts yet. Be the first.</p>
        )}
      </section>
    </PageShell>
  );
}
