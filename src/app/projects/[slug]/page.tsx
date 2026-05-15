import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TagList } from "@/components/ui/TagList";
import { getProject, projects } from "@/data/projects";
import { getContentItem, markdownToHtml } from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project?.title ?? "Project",
    description: project?.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  const writeup = getContentItem("projects", slug);

  if (!project || !writeup) {
    notFound();
  }

  return (
    <PageShell eyebrow={project.status} title={project.title} description={project.description}>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <TagList tags={project.tech} />
      </div>
      <div className="mb-8 flex flex-wrap gap-3">
        {project.liveUrl ? (
          <ButtonLink href={project.liveUrl} external={project.liveUrl.startsWith("http")}>
            View Page
          </ButtonLink>
        ) : null}
        {project.githubUrl ? (
          <ButtonLink href={project.githubUrl} external variant="secondary">
            GitHub
          </ButtonLink>
        ) : null}
      </div>
      <article className="prose-content max-w-3xl rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm" dangerouslySetInnerHTML={{ __html: markdownToHtml(writeup.body) }} />
    </PageShell>
  );
}
