import Link from "next/link";
import type { ReactNode } from "react";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={`ui-card${className ? ` ${className}` : ""}`}>{children}</div>;
}

export function LinkCard({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={`ui-card ui-card--link${className ? ` ${className}` : ""}`}>
      {children}
    </Link>
  );
}

export function CardHeader({ title, action }: { title: ReactNode; action?: ReactNode }) {
  return (
    <div className="ui-card-header">
      <h2 className="ui-card-title">{title}</h2>
      {action ? <div className="ui-card-action">{action}</div> : null}
    </div>
  );
}
