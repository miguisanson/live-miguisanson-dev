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
      <div style={{ marginBottom: 20 }}>
        <TagList tags={project.tech} />
      </div>
      <div className="buttons" style={{ justifyContent: "flex-start", marginBottom: 20 }}>
        {project.liveUrl ? (
          <ButtonLink href={project.liveUrl} external={project.liveUrl.startsWith("http")}>
            {project.liveLabel ?? "View Page"}
          </ButtonLink>
        ) : null}
        {project.githubUrl ? (
          <ButtonLink href={project.githubUrl} external variant="secondary">
            GitHub
          </ButtonLink>
        ) : null}
      </div>
      <article className="post-content" dangerouslySetInnerHTML={{ __html: markdownToHtml(writeup.body) }} />
    </PageShell>
  );
}
