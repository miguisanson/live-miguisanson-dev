import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { formatReleaseDate, releases } from "@/data/changelog";
import { inlineMarkdownToHtml } from "@/lib/content";
import { requireProjectPageAccess } from "@/lib/project-pages";

export const metadata: Metadata = {
  title: "Changelog",
  description: "A dated record of what changed on miguisanson.dev, newest first.",
  alternates: { canonical: "/changelog" },
};

export default async function ChangelogPage() {
  await requireProjectPageAccess();

  return (
    <PageShell
      eyebrow="Changelog"
      title="What changed"
      description="A dated record of every release, newest first. Mirrored from CHANGELOG.md in the repository."
    >
      <nav className="doc-nav" aria-label="Documentation">
        <a href="/docs">Documentation</a>
        {releases.map((release) => (
          <a key={release.date} href={`#${release.date}`}>
            {release.date}
          </a>
        ))}
      </nav>

      <div className="doc-page">
        {releases.map((release) => (
          <article className="release" key={release.date} id={release.date}>
            <header className="release-date">
              <time dateTime={release.date}>{formatReleaseDate(release.date)}</time>
              <span className="release-tag">{release.tag}</span>
            </header>

            <div className="release-body">
              <p className="doc-body" style={{ marginBottom: 0 }}>
                {release.summary}
              </p>

              {release.groups.map((group) => (
                <section className="release-group" key={group.area}>
                  <h3>{group.area}</h3>
                  <ul>
                    {group.items.map((item, index) => (
                      <li
                        key={index}
                        dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(item) }}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
