import { PageShell } from "@/components/layout/PageShell";
import { TagList } from "@/components/ui/TagList";
import { education, profile, skills } from "@/data/profile";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="About Me"
      description="BS Information Technology student focused on web development, Linux hosting, databases, and hardware repair."
    >
      <article className="post-content">
        <p>
          I am a BS Information Technology student at De La Salle University with hands-on experience in web development, Linux-based hosting, database-backed applications, and practical hardware repair. I build projects from concept to production with a focus on reliable deployment, responsive UI, and maintainable systems.
        </p>
        <p>
          Based in {profile.location}. Currently studying {profile.educationLine}.
        </p>

        <h2>Skills</h2>
        <TagList tags={skills} />

        <h2>Education</h2>
        {education.map((item) => (
          <section key={item.school} className="post-entry">
            <header className="entry-header">
              <h2>{item.school}</h2>
            </header>
            <div className="entry-content">
              {item.detail} | {item.period} | {item.location}
            </div>
            {item.notes ? <footer className="entry-footer">{item.notes}</footer> : null}
          </section>
        ))}
      </article>
    </PageShell>
  );
}
