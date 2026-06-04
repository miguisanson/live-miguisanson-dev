import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProfileByUsername } from "@/lib/profile-data";

export const dynamic = "force-dynamic";

type PublicProfilePageProps = {
  params: Promise<{ username: string }>;
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(decodeURIComponent(username));
  if (!profile) {
    return { title: "User not found" };
  }
  return {
    title: `${profile.displayName} (@${profile.username})`,
    description: profile.bio || `${profile.displayName}'s miguisanson.dev profile.`,
  };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(decodeURIComponent(username));
  if (!profile) {
    notFound();
  }

  const initial = (profile.displayName || profile.username).slice(0, 1).toUpperCase();

  return (
    <section className="public-profile" aria-labelledby="public-profile-title">
      <article className="public-profile-card">
        <div className="public-profile-banner" />
        <div className="public-profile-body">
          <div className="public-avatar" aria-hidden="true">
            {initial}
          </div>
          <div>
            <p className="post-meta">@{profile.username}</p>
            <h1 id="public-profile-title">{profile.displayName}</h1>
            <p className="account-muted-text">Member since {dateLabel(profile.createdAt)}</p>
          </div>
        </div>
        <p className="public-profile-bio">{profile.bio || "No bio yet."}</p>
      </article>

      <section className="account-card">
        <div className="account-card-heading">
          <h2>Posts</h2>
          <span>0</span>
        </div>
        <p className="account-empty">No posts yet.</p>
      </section>

      <Link className="account-small-button" href="/blog">
        Browse community
      </Link>
    </section>
  );
}
