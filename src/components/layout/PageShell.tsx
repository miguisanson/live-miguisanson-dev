type PageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:py-16">
      <header className="mb-10 max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-lg text-[var(--muted)]">{description}</p>
        ) : null}
      </header>
      {children}
    </div>
  );
}
