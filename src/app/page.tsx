import Image from "next/image";
import { ContentCard } from "@/components/cards/ContentCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { labDemos } from "@/data/labDemos";
import { profile, skills } from "@/data/profile";
import { projects } from "@/data/projects";
import { getContentItems } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const posts = getContentItems("blog").slice(0, 3);
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <div>
      <section className="mx-auto grid min-h-[calc(100vh-74px)] max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:py-20">
        <div className="mx-auto h-52 w-52 overflow-hidden rounded-full border border-[var(--line)] bg-[var(--surface)] shadow-sm lg:mx-0 lg:h-64 lg:w-64">
          <Image src="/miguel.jpg" alt="Miguel Joaquin A. Sanson" width={256} height={256} className="h-full w-full object-cover" priority />
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
            {profile.domain}
          </p>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-5 max-w-3xl text-xl text-[var(--muted)]">{profile.role}</p>
          <p className="mt-3 text-[var(--muted)]">
            📍 {profile.location} | {profile.educationLine}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/projects">View Projects</ButtonLink>
            <ButtonLink href={profile.resumeUrl} external variant="secondary">
              Download Resume
            </ButtonLink>
            <ButtonLink href="/lab" variant="secondary">
              Open Lab
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {skills.slice(0, 8).map((skill) => (
              <span key={skill} className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-sm font-bold text-[var(--muted)]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <SectionHeader title="Featured Projects" description="Interactive prototypes and practical technical work that represent what this site is growing into." />
        <div className="grid gap-5 md:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <SectionHeader title="Latest Notes" description="Short writing about migration work, homelab practice, and mock AI experiments." />
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <ContentCard
              key={post.slug}
              title={post.title}
              description={post.summary}
              href={`/blog/${post.slug}`}
              meta={formatDate(post.date)}
              tags={post.tags}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <SectionHeader title="Lab Demos" description="Mock frontend experiments built to be replaced later with real AI routes, storage, and user history only when needed." />
        <div className="grid gap-5 md:grid-cols-3">
          {labDemos.map((demo) => (
            <ContentCard
              key={demo.slug}
              title={demo.title}
              description={demo.description}
              href={`/lab/${demo.slug}`}
              tags={demo.tags}
              cta="Open demo"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
