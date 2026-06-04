import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GameLaunchButton } from "@/components/game/GameLaunchButton";
import { auth } from "@/lib/auth";
import { getUserGameLaunches } from "@/lib/profile-data";

export const dynamic = "force-dynamic";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AccountActivityPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?account=login&next=/account/activity&message=Log%20in%20to%20view%20activity.");
  }

  const launches = await getUserGameLaunches(session.user.id, 25);

  return (
    <div className="account-dashboard">
      <section className="account-card">
        <div className="account-card-heading">
          <h2>Game Launch History</h2>
          <Link href="/games">Games</Link>
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

      <section className="account-card account-compact-action">
        <h2>Here to Slay</h2>
        <GameLaunchButton className="account-small-button account-primary-action">Launch game</GameLaunchButton>
      </section>
    </div>
  );
}
