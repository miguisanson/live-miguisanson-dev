import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TagList } from "@/components/ui/TagList";
import { certifications, education, experience, profile, skills } from "@/data/profile";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Resume",
};

export default function ResumePage() {
  return (
    <PageShell
      eyebrow="Resume"
      title="Miguel Joaquin A. Sanson"
      description={`${profile.location} | ${profile.educationLine}`}
    >
      <div className="mb-8">
        <ButtonLink href={profile.resumeUrl} external>
          Download Resume
        </ButtonLink>
      </div>

      <section className="mb-10">
        <SectionHeader title="Experience" />
        <div className="space-y-5">
          {experience.map((item) => (
            <article key={`${item.organization}-${item.role}`} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
              <h3 className="text-xl font-extrabold">{item.organization}</h3>
              <p className="mt-1 font-bold">{item.role}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {item.period} | {item.location}
              </p>
              <p className="mt-3 text-[var(--muted)]">{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader title="Projects" />
        <div className="grid gap-5 md:grid-cols-2">
          {projects.slice(0, 4).map((project) => (
            <article key={project.slug} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
              <h3 className="text-lg font-extrabold">{project.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-10 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeader title="Skills" />
          <TagList tags={skills} />
        </div>
        <div>
          <SectionHeader title="Certifications" />
          <ul className="space-y-2 text-[var(--muted)]">
            {certifications.map((certification) => (
              <li key={certification}>{certification}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <SectionHeader title="Education" />
        <div className="space-y-4">
          {education.map((item) => (
            <article key={item.school}>
              <h3 className="font-extrabold">{item.school}</h3>
              <p className="text-sm text-[var(--muted)]">
                {item.detail} | {item.period} | {item.location}
              </p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
