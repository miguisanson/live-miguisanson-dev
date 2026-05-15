type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-[var(--muted)]">{description}</p> : null}
    </div>
  );
}
