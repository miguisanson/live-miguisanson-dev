import { BackLink } from "./BackLink";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Parent route for a detail page. Renders a "Back to …" link above the title. */
  backHref?: string;
  /** Label for the back link. Defaults to a generic "Back". */
  backLabel?: string;
  children: React.ReactNode;
};

export function PageShell({ eyebrow, title, description, backHref, backLabel, children }: PageShellProps) {
  // An eyebrow that just repeats the title reads as the page name printed twice.
  // Drop it rather than relying on every call site to remember.
  const showEyebrow = Boolean(eyebrow) && eyebrow?.trim().toLowerCase() !== title.trim().toLowerCase();

  return (
    <>
      <header className="page-header">
        {backHref ? <BackLink href={backHref} label={backLabel ?? "Back"} /> : null}
        {showEyebrow ? <div className="post-meta">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {description ? <div className="post-description">{description}</div> : null}
      </header>
      {children}
    </>
  );
}
