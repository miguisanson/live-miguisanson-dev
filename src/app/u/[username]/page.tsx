import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PostComposer } from "@/components/account/PostComposer";
import { PostList } from "@/components/account/PostList";
import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin-data";
import { markdownToHtml } from "@/lib/content";
import { getGame } from "@/data/games";
import { getProfileBadges, getPublicProfileByUsername, getUserGameLaunches } from "@/lib/profile-data";
import { getPublicPostsByUser, getUserPosts } from "@/lib/posts-data";

export const dynamic = "force-dynamic";

type PublicProfilePageProps = {
  params: Promise<{ username: string }>;
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(value));
}

function shortDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(decodeURIComponent(username));
  if (!profile) {
    return { title: "User not found", robots: { index: false, follow: false } };
  }
  if (!profile.isPublic) {
    return { title: `@${profile.username}`, robots: { index: false, follow: false } };
  }
  const description = profile.bio || profile.status || `${profile.displayName}'s profile on miguisanson.dev.`;
  return {
    title: `${profile.displayName} (@${profile.username})`,
    description,
    alternates: { canonical: `/u/${profile.username}` },
    openGraph: {
      type: "profile",
      title: `${profile.displayName} (@${profile.username})`,
      description,
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : undefined,
    },
  };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(decodeURIComponent(username));
  if (!profile) {
    notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const viewerId = session?.user?.id;
  const isOwner = Boolean(viewerId && viewerId === profile.id);
  const canViewPrivate = isOwner || Boolean(viewerId && (await isAdminUser(viewerId)));

  if (!profile.isPublic && !canViewPrivate) {
    return (
      <section className="public-profile">
        <article className="public-profile-card">
          <div className="public-profile-body">
            <span className="public-avatar" aria-hidden="true">
              {(profile.displayName || profile.username).slice(0, 1).toUpperCase()}
            </span>
            <div className="public-profile-identity">
              <p className="post-meta">@{profile.username}</p>
              <h1>This profile is private</h1>
              <p className="account-muted-text">This member has chosen to keep their profile private.</p>
            </div>
          </div>
        </article>
      </section>
    );
  }

  const [badges, launches] = await Promise.all([
    getProfileBadges(profile),
    profile.hideActivity ? Promise.resolve([]) : getUserGameLaunches(profile.id, 5),
  ]);

  const ownPosts = isOwner ? await getUserPosts(profile.id, { includeDrafts: true }) : [];
  const publicPosts = isOwner ? [] : await getPublicPostsByUser(profile.id, 10);
  const ownViews = ownPosts.map((post) => ({
    id: post.id,
    body: post.body,
    html: markdownToHtml(post.body),
    visibility: post.visibility,
    createdAt: post.createdAt,
  }));

  const initial = (profile.displayName || profile.username).slice(0, 1).toUpperCase();
  const themeStyle = profile.themeColor ? ({ ["--profile-accent" as string]: profile.themeColor }) : undefined;
  const favoriteGames = profile.favoriteGames
    .map((slug) => ({ slug, title: getGame(slug)?.title ?? slug }))
    .filter((game) => game.title);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: profile.createdAt,
    mainEntity: {
      "@type": "Person",
      name: profile.displayName,
      alternateName: profile.username,
      description: profile.bio || undefined,
    },
  };

  return (
    <section className="public-profile" aria-labelledby="public-profile-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className={`public-profile-card profile-bg-${profile.bgPattern || "none"}`} style={themeStyle}>
        <div className={`public-profile-banner${profile.bannerUrl ? " has-image" : ""}`}>
          {profile.bannerUrl ? <Image src={profile.bannerUrl} alt="" fill sizes="(max-width: 720px) 100vw, 720px" style={{ objectFit: "cover" }} /> : null}
        </div>
        <div className="public-profile-body">
          <span className="public-avatar" aria-hidden="true">
            {profile.avatarUrl ? <Image src={profile.avatarUrl} alt="" width={76} height={76} /> : initial}
          </span>
          <div className="public-profile-identity">
            <p className="post-meta">@{profile.username}</p>
            <h1 id="public-profile-title">{profile.displayName}</h1>
            {profile.status ? <p className="profile-status">{profile.status}</p> : null}
            <p className="account-muted-text">Member since {dateLabel(profile.createdAt)}</p>
          </div>
        </div>

        {badges.length > 0 ? (
          <ul className="profile-badges" aria-label="Badges">
            {badges.map((badge) => (
              <li key={badge.key} className="profile-badge" title={badge.title}>
                {badge.label}
              </li>
            ))}
          </ul>
        ) : null}

        {profile.quote ? <blockquote className="profile-quote">{profile.quote}</blockquote> : null}
        <p className="public-profile-bio">{profile.bio || "No bio yet."}</p>

        {favoriteGames.length > 0 ? (
          <div className="profile-game-chips" aria-label="Favorite games">
            {favoriteGames.map((game) => (
              <Link key={game.slug} href={`/games/${game.slug}`} className="tag-chip">
                {game.title}
              </Link>
            ))}
          </div>
        ) : null}
      </article>

      {isOwner ? (
        <section className="account-card">
          <h2>Your posts</h2>
          <PostComposer />
          <p className="field-hint">Public posts show here and in the community feed. Drafts are only visible to you.</p>
          <PostList posts={ownViews} />
        </section>
      ) : publicPosts.length > 0 ? (
        <section className="account-card">
          <div className="account-card-heading">
            <h2>Posts</h2>
            <span>{publicPosts.length}</span>
          </div>
          <div className="post-list">
            {publicPosts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-card-head">
                  <time dateTime={post.createdAt}>{shortDate(post.createdAt)}</time>
                </div>
                <div className="post-card-body" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.body) }} />
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!profile.hideActivity && launches.length > 0 ? (
        <section className="account-card">
          <div className="account-card-heading">
            <h2>Recent game activity</h2>
            <span>{launches.length}</span>
          </div>
          <div className="account-history-list">
            {launches.map((launch) => (
              <div className="account-history-item" key={launch.createdAt}>
                <span>{shortDate(launch.createdAt)}</span>
                <strong>{launch.game}</strong>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
