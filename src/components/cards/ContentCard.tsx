import Link from "next/link";
import { TagList } from "@/components/ui/TagList";

type ContentCardProps = {
  title: string;
  description: string;
  href: string;
  meta?: string;
  tags?: string[];
  cta?: string;
};

export function ContentCard({ title, description, href, meta, tags = [], cta = "Read more" }: ContentCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
      {meta ? <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">{meta}</p> : null}
      <h3 className="text-lg font-extrabold leading-snug">{title}</h3>
      <p className="mt-3 flex-1 text-sm text-[var(--muted)]">{description}</p>
      {tags.length ? (
        <div className="mt-4">
          <TagList tags={tags} />
        </div>
      ) : null}
      <Link href={href} className="mt-5 inline-flex w-max rounded-full bg-[var(--surface-muted)] px-4 py-2 text-sm font-bold transition hover:bg-[var(--line)]">
        {cta}
      </Link>
    </article>
  );
}
