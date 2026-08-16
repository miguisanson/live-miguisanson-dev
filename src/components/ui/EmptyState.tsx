import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="ui-empty">
      {icon ? (
        <span className="ui-empty-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <p className="ui-empty-title">{title}</p>
      {description ? <p className="ui-empty-desc">{description}</p> : null}
      {action ? <div className="ui-empty-action">{action}</div> : null}
    </div>
  );
}
