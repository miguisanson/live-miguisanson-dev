import type { ReactNode } from "react";

type BadgeTone = "neutral" | "solid" | "outline";

export function Badge({ children, tone = "neutral", title }: { children: ReactNode; tone?: BadgeTone; title?: string }) {
  return (
    <span className={`ui-badge ui-badge--${tone}`} title={title}>
      {children}
    </span>
  );
}
