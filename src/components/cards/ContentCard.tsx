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
    <article className="post-entry">
      <header className="entry-header">
        <h2>{title}</h2>
      </header>
      <div className="entry-content">{description}</div>
      <footer className="entry-footer">{meta}</footer>
      {tags.length ? (
        <div style={{ marginTop: 12 }}>
          <TagList tags={tags} />
        </div>
      ) : null}
      <span className="entry-footer" style={{ display: "inline-block", marginTop: 12 }}>
        {cta}
      </span>
      <Link href={href} className="entry-link" aria-label={title} />
    </article>
  );
}
