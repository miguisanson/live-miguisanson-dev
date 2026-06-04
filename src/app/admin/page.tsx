import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { auth } from "@/lib/auth";
import { getAdminDashboardData, isAdminUser } from "@/lib/admin-data";
import {
  approveUserAction,
  banUserAction,
  clearSessionsAction,
  saveGameSettingsAction,
  verifyUserAction,
} from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  description: "Private server statistics and audit logs for miguisanson.dev.",
};

type AdminPageProps = {
  searchParams?: Promise<{ q?: string | string[] }>;
};

function dateLabel(value: string | null) {
  if (!value) {
    return "Never";
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function metadataSummary(value: string) {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return Object.entries(parsed)
      .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null && entryValue !== "")
      .map(([key, entryValue]) => `${key}: ${String(entryValue)}`)
      .join(" | ");
  } catch {
    return value;
  }
}

function hiddenUserId(userId: string) {
  return <input type="hidden" name="userId" value={userId} />;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login?account=login&next=/admin&message=Log%20in%20with%20an%20admin%20account.");
  }

  if (!(await isAdminUser(session.user.id))) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const queryValue = resolvedSearchParams?.q;
  const query = Array.isArray(queryValue) ? queryValue[0] ?? "" : queryValue ?? "";
  const data = await getAdminDashboardData(query);
  const statCards = [
    ["Users", data.stats.totalUsers],
    ["Verified", data.stats.verifiedUsers],
    ["Unverified", data.stats.unverifiedUsers],
    ["Admins", data.stats.adminUsers],
    ["Approved", data.stats.approvedUsers],
    ["Banned", data.stats.bannedUsers],
    ["Sessions", data.stats.activeSessions],
    ["Launches", data.stats.gameLaunches],
  ];

  return (
    <PageShell
      eyebrow="Private Admin"
      title="Server Dashboard"
      description="Account controls, launch rules, and audit activity."
    >
      <section className="admin-stat-grid" aria-label="Server statistics">
        {statCards.map(([label, value]) => (
          <article className="admin-stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>Game Access</h2>
          <span>Launch rules</span>
        </div>
        <form className="admin-settings-form" action={saveGameSettingsAction}>
          <label>
            <input type="checkbox" name="gameOpen" defaultChecked={data.gameSettings.gameOpen} />
            <span>Game open</span>
          </label>
          <label>
            <input type="checkbox" name="approvedOnly" defaultChecked={data.gameSettings.approvedOnly} />
            <span>Approved users only</span>
          </label>
          <label>
            <input type="checkbox" name="maintenanceMode" defaultChecked={data.gameSettings.maintenanceMode} />
            <span>Maintenance mode</span>
          </label>
          <button className="admin-small-button admin-primary-action" type="submit">
            Save
          </button>
        </form>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>User Management</h2>
          <span>{data.users.length} shown</span>
        </div>
        <form className="admin-search" action="/admin">
          <input type="search" name="q" defaultValue={query} placeholder="Search users" />
          <button className="admin-small-button" type="submit">
            Search
          </button>
        </form>
        <div className="admin-table-wrap">
          <table className="admin-table admin-user-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Activity</th>
                <th>Controls</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.displayUsername ?? user.username ?? user.name}</strong>
                    <span className="admin-cell-subtext">{user.email}</span>
                    {user.isAdmin ? <span className="admin-badge">Admin</span> : null}
                  </td>
                  <td>
                    <div className="admin-status-list">
                      <span>{user.emailVerified ? "Verified" : "Unverified"}</span>
                      <span>{user.approved ? "Approved" : "Not approved"}</span>
                      {user.banned ? <span className="admin-danger-text">Banned</span> : null}
                    </div>
                  </td>
                  <td>
                    <div className="admin-status-list">
                      <span>{user.activeSessions} active sessions</span>
                      <span>Launch: {dateLabel(user.lastGameLaunch)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-action-grid">
                      {!user.emailVerified ? (
                        <form action={verifyUserAction}>
                          {hiddenUserId(user.id)}
                          <button className="admin-small-button" type="submit">
                            Verify
                          </button>
                        </form>
                      ) : null}
                      <form action={approveUserAction}>
                        {hiddenUserId(user.id)}
                        <input type="hidden" name="approved" value={user.approved ? "0" : "1"} />
                        <button className="admin-small-button" type="submit">
                          {user.approved ? "Unapprove" : "Approve"}
                        </button>
                      </form>
                      {!user.isAdmin ? (
                        <form action={banUserAction}>
                          {hiddenUserId(user.id)}
                          <input type="hidden" name="banned" value={user.banned ? "0" : "1"} />
                          <button className="admin-small-button admin-danger-action" type="submit">
                            {user.banned ? "Unban" : "Ban"}
                          </button>
                        </form>
                      ) : null}
                      <form action={clearSessionsAction}>
                        {hiddenUserId(user.id)}
                        <button className="admin-small-button" type="submit">
                          Clear sessions
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>Activity Last 24 Hours</h2>
          <span>{data.eventCounts24h.length} event types</span>
        </div>
        <div className="admin-event-grid">
          {data.eventCounts24h.length > 0 ? (
            data.eventCounts24h.map((event) => (
              <article className="admin-event-card" key={event.eventType}>
                <span>{event.eventType}</span>
                <strong>{event.count}</strong>
              </article>
            ))
          ) : (
            <p className="admin-empty">No audit events in the last 24 hours.</p>
          )}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>Audit Log</h2>
          <span>{data.recentAudit.length} recent events</span>
        </div>
        <div className="admin-audit-list">
          {data.recentAudit.length > 0 ? (
            data.recentAudit.map((event) => (
              <article className="admin-audit-item" key={event.id}>
                <div>
                  <strong>{event.eventType}</strong>
                  <time dateTime={event.createdAt}>{dateLabel(event.createdAt)}</time>
                </div>
                <p>{metadataSummary(event.metadata) || "No metadata"}</p>
                <footer>
                  <span>{event.actorUsername ?? event.actorEmail ?? event.targetEmail ?? "system"}</span>
                  {event.ipAddress ? <span>{event.ipAddress}</span> : null}
                </footer>
              </article>
            ))
          ) : (
            <p className="admin-empty">No audit events recorded yet.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
