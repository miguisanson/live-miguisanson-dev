import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResendVerificationButton } from "@/components/account/ResendVerificationButton";
import { auth } from "@/lib/auth";

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
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/account&message=Log%20in%20to%20manage%20your%20account.");
  }

  const user = session.user as SessionUser;
  const resolvedSearchParams = await searchParams;
  const messageValue = resolvedSearchParams?.message;
  const message = Array.isArray(messageValue) ? messageValue[0] : messageValue;
  const displayName = user.displayUsername ?? user.name ?? user.username ?? user.email;

  return (
    <div className="account-dashboard">
      {message ? (
        <p className="account-notice" aria-live="polite">
          {message}
        </p>
      ) : null}

      <section className="account-card">
        <div className="account-card-heading">
          <h2>Account</h2>
          <span className={`account-status${user.emailVerified ? " is-good" : ""}`}>
            {user.emailVerified ? "Verified" : "Unverified"}
          </span>
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
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Joined</dt>
            <dd>{dateLabel(user.createdAt)}</dd>
          </div>
        </dl>
        {!user.emailVerified ? <ResendVerificationButton email={user.email} /> : null}
      </section>
    </div>
  );
}
