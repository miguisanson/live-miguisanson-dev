const steps = [
  "Source/API",
  "Data Lake Landing",
  "ETL / Validation",
  "AI Inference",
  "Dashboard / API",
];

export function ArchitectureFlow(): React.ReactElement {
  return (
    <div className="rounded-xl border border-border/70 bg-[var(--bg-soft)] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-fg)]">
        End-to-End Insight Flow
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step: string, idx: number) => (
          <div key={step} className="flex items-center gap-2">
            <div className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-slate-800">
              {step}
            </div>
            {idx < steps.length - 1 ? (
              <span className="text-[var(--muted-fg)]" aria-hidden="true">
                {"->"}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-[var(--muted-fg)]">
        Observability is conceptually powered by Azure Monitor, Application Insights,
        Log Analytics, and Azure Alerts / Action Groups.
      </p>
    </div>
  );
}

