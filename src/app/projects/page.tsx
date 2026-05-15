import { ProjectCard } from "@/components/cards/ProjectCard";
import { PageShell } from "@/components/layout/PageShell";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <PageShell
      eyebrow="Projects"
      title="Project showcases and case studies."
      description="Interactive prototypes, infrastructure practice, and hands-on technical work. Prototype links open separate demo pages using static mock data."
    >
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </PageShell>
  );
}
