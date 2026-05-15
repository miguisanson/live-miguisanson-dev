import { ContentCard } from "@/components/cards/ContentCard";
import { PageShell } from "@/components/layout/PageShell";
import { games } from "@/data/games";

export const metadata = {
  title: "Games",
};

export default function GamesPage() {
  return (
    <PageShell
      eyebrow="Games"
      title="Game showcase."
      description="A space for browser games, small interaction experiments, and future playable embeds."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {games.map((game) => (
          <ContentCard
            key={game.slug}
            title={game.title}
            description={game.description}
            href={`/games/${game.slug}`}
            meta={game.status}
            tags={game.stack}
            cta="View game"
          />
        ))}
      </div>
    </PageShell>
  );
}
