type TagListProps = {
  tags: string[];
};

export function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--muted)]">
          {tag}
        </span>
      ))}
    </div>
  );
}
