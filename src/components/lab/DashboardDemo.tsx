const metrics = [
  { label: "Prototype views", value: "1,284", change: "+18%" },
  { label: "Project clicks", value: "326", change: "+11%" },
  { label: "Lab interactions", value: "74", change: "+24%" },
  { label: "Open follow-ups", value: "6", change: "Review" },
];

const actions = [
  "Promote the USLS prototype after replacing the bare sample bundle.",
  "Write a project case study for Consumer IQ operations workflows.",
  "Add screenshots to game pages once playable builds exist.",
];

export function DashboardDemo() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
            <p className="text-sm font-bold text-[var(--muted)]">{metric.label}</p>
            <p className="mt-3 text-3xl font-extrabold">{metric.value}</p>
            <p className="mt-1 text-sm font-bold text-[var(--accent)]">{metric.change}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
          <h2 className="text-2xl font-extrabold">Traffic trend placeholder</h2>
          <div className="mt-5 flex h-64 items-end gap-3 rounded-lg bg-[var(--surface-muted)] p-4">
            {[28, 42, 36, 58, 64, 72, 86].map((height, index) => (
              <div key={index} className="flex-1 rounded-t bg-[var(--accent)]" style={{ height: `${height}%` }} />
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
          <h2 className="text-2xl font-extrabold">Recommended actions</h2>
          <ul className="mt-5 space-y-3">
            {actions.map((action) => (
              <li key={action} className="rounded-lg bg-[var(--surface-muted)] p-4 text-sm font-medium">
                {action}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-[var(--muted)]">
            Future hook: replace these local recommendations with database-backed project logs and optional AI summaries.
          </p>
        </section>
      </div>
    </div>
  );
}
