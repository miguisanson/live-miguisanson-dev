import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { TagList } from "@/components/ui/TagList";
import { education, profile, skills } from "@/data/profile";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Technology, systems, and practical building."
      description="I am a BS Information Technology student focused on web development, Linux hosting, database-backed applications, hardware troubleshooting, and early AI product workflows."
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
          <SectionHeader title="About Me" />
          <div className="space-y-4 text-[var(--muted)]">
            <p>
              I build projects from concept to production with attention to reliable deployment, responsive UI, maintainable systems, and clear operational workflows.
            </p>
            <p>
              My interests sit around hardware, networking, Linux-based hosting, AI-assisted interfaces, dashboards, and web apps that help people understand or manage complex work.
            </p>
            <p>
              Based in {profile.location}. Currently studying {profile.educationLine}.
            </p>
          </div>
        </section>

        <aside className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
          <SectionHeader title="Skills" />
          <TagList tags={skills} />
        </aside>
      </div>

      <section className="mt-10">
        <SectionHeader title="Education" />
        <div className="grid gap-5 md:grid-cols-2">
          {education.map((item) => (
            <article key={item.school} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
              <h3 className="text-lg font-extrabold">{item.school}</h3>
              <p className="mt-2 font-bold text-[var(--muted)]">{item.detail}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {item.period} | {item.location}
              </p>
              {item.notes ? <p className="mt-3 text-sm text-[var(--muted)]">{item.notes}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
