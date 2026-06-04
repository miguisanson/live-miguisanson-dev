import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResendVerificationButton } from "@/components/account/ResendVerificationButton";
import { auth } from "@/lib/auth";
import { getUserGameLaunches, getUserProfile } from "@/lib/profile-data";

export const dynamic = "force-dynamic";

type AccountPageProps = {
  searchParams?: Promise<{ message?: string | string[] }>;
};

type SessionUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string | null;
  username?: string | null;
  displayUsername?: string | null;
  createdAt?: Date | string;
};

function dateLabel(value?: Date | string | null) {
  if (!value) {
    return "Unknown";
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function publicProfileHref(username?: string | null) {
  return username ? `/u/${encodeURIComponent(username)}` : "/account/profile";
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/account&message=Log%20in%20to%20manage%20your%20account.");
  }

  const user = session.user as SessionUser;
  const [profile, launches, resolvedSearchParams] = await Promise.all([
    getUserProfile(user.id),
    getUserGameLaunches(user.id, 3),
    searchParams,
  ]);
  const messageValue = resolvedSearchParams?.message;
  const message = Array.isArray(messageValue) ? messageValue[0] : messageValue;
  const displayName = user.displayUsername ?? user.name ?? user.username ?? user.email;

  return (
    <div className="account-dashboard">
      {message ? <p className="account-notice">{message}</p> : null}

      <section className="account-grid" aria-label="Account overview">
        <article className="account-card">
          <div className="account-card-heading">
            <h2>Profile</h2>
            <Link href={publicProfileHref(user.username)}>View public</Link>
          </div>
          <dl className="account-detail-list">
            <div>
              <dt>Display name</dt>
              <dd>{displayName}</dd>
            </div>
            <div>
              <dt>Username</dt>
              <dd>{user.username ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Bio</dt>
              <dd>{profile?.bio || "Not added"}</dd>
            </div>
          </dl>
          <Link className="account-small-button" href="/account/profile">
            Edit profile
          </Link>
        </article>

        <article className="account-card">
          <div className="account-card-heading">
            <h2>Account</h2>
            <Link href="/account/security">Security</Link>
          </div>
          <dl className="account-detail-list">
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className={`account-status${user.emailVerified ? " is-good" : ""}`}>
                  {user.emailVerified ? "Verified" : "Unverified"}
                </span>
              </dd>
            </div>
            <div>
              <dt>Joined</dt>
              <dd>{dateLabel(user.createdAt)}</dd>
            </div>
          </dl>
          {!user.emailVerified ? <ResendVerificationButton email={user.email} /> : null}
        </article>
      </section>

      <section className="account-card">
        <div className="account-card-heading">
          <h2>Recent Game Launches</h2>
          <Link href="/account/activity">View all</Link>
        </div>
        <div className="account-history-list">
          {launches.length > 0 ? (
            launches.map((launch) => (
              <div className="account-history-item" key={launch.createdAt}>
                <span>{dateLabel(launch.createdAt)}</span>
                <strong>{launch.destination ?? "Here to Slay"}</strong>
              </div>
            ))
          ) : (
            <p className="account-empty">No game launches yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
