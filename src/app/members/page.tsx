import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { listRecentProfiles, searchProfiles, type ProfileCard } from "@/lib/profile-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Members",
  description: "Browse and search miguisanson.dev members.",
  alternates: { canonical: "/members" },
};

type MembersPageProps = {
  searchParams?: Promise<{ q?: string | string[] }>;
};

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

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const resolved = await searchParams;
  const qValue = resolved?.q;
  const q = (Array.isArray(qValue) ? qValue[0] : qValue ?? "").trim();

  const profiles = q ? await searchProfiles(q, 40) : await listRecentProfiles(24);

  return (
    <PageShell title="Members" description="Find people on miguisanson.dev and visit their profiles.">
      <form className="community-search" role="search" action="/members">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search people by name or @username"
          aria-label="Search members"
        />
        <button className="ui-button ui-button--primary ui-button--md" type="submit">
          Search
        </button>
      </form>

      <section aria-label={q ? "Search results" : "Members"}>
        <div className="community-section-head">
          <h2>{q ? `Results for “${q}”` : "All members"}</h2>
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
    </PageShell>
  );
}
