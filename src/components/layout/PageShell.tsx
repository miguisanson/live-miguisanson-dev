type PageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <>
      <header className="page-header">
        {eyebrow ? <div className="post-meta">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {description ? <div className="post-description">{description}</div> : null}
      </header>
      {children}
    </>
  );
}
