import type { ServiceHealth } from "../../types/models";
import { StatusChip } from "./status-chip";

export function HealthStrip({
  items,
}: {
  items: ServiceHealth[];
}): React.ReactElement {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item: ServiceHealth) => (
        <div
          key={item.id}
          className="rounded-lg border border-border/70 bg-[var(--bg-soft)] p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-fg)]">
              {item.label}
            </p>
            <StatusChip state={item.state} />
          </div>
          <p className="text-xs text-slate-700">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}

