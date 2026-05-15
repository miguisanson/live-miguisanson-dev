import { ContentCard } from "@/components/cards/ContentCard";
import { PageShell } from "@/components/layout/PageShell";
import { labDemos } from "@/data/labDemos";

export const metadata = {
  title: "Lab",
};

export default function LabPage() {
  return (
    <PageShell
      eyebrow="Lab"
      title="Frontend experiments and future AI demos."
      description="These demos are intentionally mock-first. They help validate UI and workflow ideas before adding paid APIs, auth, Prisma, or a real database."
    >
      <div className="mb-8 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 text-sm text-[var(--muted)] shadow-sm">
        Future-ready notes: OpenAI or another LLM provider can be added through route handlers later; saved workout plans, test history, and project logs can be backed by Prisma with PostgreSQL, Supabase, or Neon when persistent data is actually needed.
      </div>
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
    </PageShell>
  );
}
