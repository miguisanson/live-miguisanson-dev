import Link from "next/link";
import { Project } from "@/data/projects";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TagList } from "@/components/ui/TagList";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      {project.image ? <img src={project.image} alt={`${project.title} preview`} /> : null}
      <div className="project-card-body">
        <h3 className="text-lg font-extrabold leading-snug">{project.title}</h3>
        <p>{project.description}</p>
        <div style={{ marginTop: 12 }}>
          <TagList tags={project.tech.slice(0, 4)} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          <ButtonLink href={`/projects/${project.slug}`} variant="secondary">
            Case study
          </ButtonLink>
          {project.liveUrl ? (
            <ButtonLink href={project.liveUrl} external={project.liveUrl.startsWith("http")} variant="secondary">
              {project.liveLabel ?? "View Page"}
            </ButtonLink>
          ) : null}
          {project.githubUrl ? (
            <Link href={project.githubUrl} target="_blank" rel="noreferrer" className="project-view-button">
              GitHub
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
