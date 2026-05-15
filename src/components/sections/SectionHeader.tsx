type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="page-header">
      {eyebrow ? <div className="post-meta">{eyebrow}</div> : null}
      <h1>{title}</h1>
      {description ? <div className="post-description">{description}</div> : null}
    </div>
  );
}
