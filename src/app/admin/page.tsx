import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { auth } from "@/lib/auth";
import { getAdminDashboardData, isAdminUser } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  description: "Private server statistics and audit logs for miguisanson.dev.",
};

function dateLabel(value: string) {
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

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login?account=login&next=/admin&message=Log%20in%20with%20an%20admin%20account.");
  }

  if (!(await isAdminUser(session.user.id))) {
    notFound();
  }

  const data = await getAdminDashboardData();
  const statCards = [
    ["Users", data.stats.totalUsers],
    ["Verified", data.stats.verifiedUsers],
    ["Unverified", data.stats.unverifiedUsers],
    ["Admins", data.stats.adminUsers],
    ["Active sessions", data.stats.activeSessions],
    ["Game launches", data.stats.gameLaunches],
    ["Logins 24h", data.stats.signIns24h],
    ["Failed logins 24h", data.stats.failedSignIns24h],
  ];

  return (
    <PageShell
      eyebrow="Private Admin"
      title="Server Dashboard"
      description="Account activity, launch metrics, and recent audit events for miguisanson.dev."
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
            <p className="admin-empty">No audit events recorded in the last 24 hours.</p>
          )}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <h2>Recent Users</h2>
          <span>{data.recentUsers.length} newest accounts</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {data.recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.displayUsername ?? user.username ?? user.name}</strong>
                    {user.isAdmin ? <span className="admin-badge">Admin</span> : null}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.emailVerified ? "Verified" : "Unverified"}</td>
                  <td>{dateLabel(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
