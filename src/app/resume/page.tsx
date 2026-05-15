import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TagList } from "@/components/ui/TagList";
import { certifications, education, experience, profile, skills } from "@/data/profile";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Resume",
};

export default function ResumePage() {
  return (
    <PageShell eyebrow="Resume" title="Miguel Joaquin A. Sanson" description={`${profile.location} | ${profile.educationLine}`}>
      <div className="buttons" style={{ justifyContent: "flex-start", marginBottom: 20 }}>
        <ButtonLink href={profile.resumeUrl} external>
          Download Resume
        </ButtonLink>
      </div>

      <article className="post-content">
        <h2>Experience</h2>
        {experience.map((item) => (
          <section key={`${item.organization}-${item.role}`} className="post-entry">
            <header className="entry-header">
              <h2>{item.organization}</h2>
            </header>
            <div className="entry-content">
              {item.role} | {item.period} | {item.location}
            </div>
            <footer className="entry-footer">{item.summary}</footer>
          </section>
        ))}

        <h2>Projects</h2>
        {projects.map((project) => (
          <section key={project.slug} className="post-entry">
            <header className="entry-header">
              <h2>{project.title}</h2>
            </header>
            <div className="entry-content">{project.description}</div>
          </section>
        ))}

        <h2>Skills</h2>
        <TagList tags={skills} />

        <h2>Certifications</h2>
        <ul>
          {certifications.map((certification) => (
            <li key={certification}>{certification}</li>
          ))}
        </ul>

        <h2>Education</h2>
        <ul>
          {education.map((item) => (
            <li key={item.school}>
              <strong>{item.school}</strong> - {item.detail} | {item.period} | {item.location}
            </li>
          ))}
        </ul>
      </article>
    </PageShell>
  );
}
