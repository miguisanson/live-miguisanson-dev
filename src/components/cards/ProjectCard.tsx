import Image from "next/image";
import Link from "next/link";
import { Project } from "@/data/projects";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TagList } from "@/components/ui/TagList";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)] shadow-sm">
      {project.image ? (
        <div className="relative h-48 bg-[var(--surface-muted)]">
          <Image src={project.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">{project.status}</p>
        <h3 className="text-lg font-extrabold leading-snug">{project.title}</h3>
        <p className="mt-3 flex-1 text-sm text-[var(--muted)]">{project.description}</p>
        <div className="mt-4">
          <TagList tags={project.tech.slice(0, 4)} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href={`/projects/${project.slug}`} variant="secondary">
            Case study
          </ButtonLink>
          {project.liveUrl ? (
            <ButtonLink href={project.liveUrl} external={project.liveUrl.startsWith("http")} variant="secondary">
              View Page
            </ButtonLink>
          ) : null}
          {project.githubUrl ? (
            <Link href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full px-2 py-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--text)]">
              GitHub
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
