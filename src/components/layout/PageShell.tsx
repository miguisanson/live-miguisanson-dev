type PageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  // An eyebrow that just repeats the title reads as the page name printed twice.
  // Drop it rather than relying on every call site to remember.
  const showEyebrow = Boolean(eyebrow) && eyebrow?.trim().toLowerCase() !== title.trim().toLowerCase();

  return (
    <>
      <header className="page-header">
        {showEyebrow ? <div className="post-meta">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {description ? <div className="post-description">{description}</div> : null}
      </header>
      {children}
    </>
  );
}
