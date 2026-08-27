import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { markdownToHtml } from "@/lib/content";
import { listRecentProfiles, searchProfiles, type ProfileCard } from "@/lib/profile-data";
import { listRecentPublicPosts } from "@/lib/posts-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community",
  description: "Browse and search miguisanson.dev member profiles and recent posts.",
  alternates: { canonical: "/community" },
};

type CommunityPageProps = {
  searchParams?: Promise<{ q?: string | string[] }>;
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function MemberCard({ card }: { card: ProfileCard }) {
  const initial = (card.displayName || card.username).slice(0, 1).toUpperCase();
  return (
    <Link href={`/u/${card.username}`} className="community-card">
      <span className="public-avatar community-card-avatar" aria-hidden="true">
        {card.avatarUrl ? <Image src={card.avatarUrl} alt="" width={48} height={48} /> : initial}
      </span>
      <span className="community-card-body">
        <span className="community-card-name">
          {card.displayName || card.username}
          {card.isAdmin ? (
            <span className="profile-badge">Admin</span>
          ) : card.emailVerified ? (
            <span className="profile-badge">Verified</span>
          ) : null}
        </span>
        <span className="post-meta">@{card.username}</span>
        {card.bio ? <span className="community-card-bio">{card.bio}</span> : null}
      </span>
    </Link>
  );
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const resolved = await searchParams;
  const qValue = resolved?.q;
  const q = (Array.isArray(qValue) ? qValue[0] : qValue ?? "").trim();

  const [profiles, recentPosts] = await Promise.all([
    q ? searchProfiles(q, 40) : listRecentProfiles(12),
    listRecentPublicPosts(10),
  ]);

  return (
    <PageShell
      title="Community"
      description="Find members, visit profiles, and see what people are posting."
    >
      <form className="community-search" role="search" action="/community">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search people by name or @username"
          aria-label="Search members"
        />
        <button className="account-small-button account-primary-action" type="submit">
          Search
        </button>
      </form>

      <section aria-label={q ? "Search results" : "Members"}>
        <div className="community-section-head">
          <h2>{q ? `Results for “${q}”` : "Members"}</h2>
          <span>{profiles.length}</span>
        </div>
        {profiles.length > 0 ? (
          <div className="community-grid">
            {profiles.map((card) => (
              <MemberCard key={card.username} card={card} />
            ))}
          </div>
        ) : (
          <p className="account-empty">No members found.</p>
        )}
      </section>

      {!q && recentPosts.length > 0 ? (
        <section aria-label="Recent posts">
          <div className="community-section-head">
            <h2>Recent posts</h2>
          </div>
          <div className="post-list">
            {recentPosts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-card-head">
                  <Link href={`/u/${post.username}`} className="post-author">
                    {post.displayName}
                  </Link>
                  <time dateTime={post.createdAt}>{dateLabel(post.createdAt)}</time>
                </div>
                <div className="post-card-body" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.body) }} />
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
