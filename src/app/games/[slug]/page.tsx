import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TagList } from "@/components/ui/TagList";
import { games, getGame } from "@/data/games";

type GamePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGame(slug);
  return {
    title: game?.title ?? "Game",
    description: game?.description,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) {
    notFound();
  }

  return (
    <PageShell eyebrow={game.status} title={game.title} description={game.description}>
      <div style={{ marginBottom: 20 }}>
        <TagList tags={game.stack} />
      </div>
      <div className="post-entry">
        <header className="entry-header">
          <h2>Playable area placeholder</h2>
        </header>
        <div className="entry-content">
          This page is ready for an embedded HTML game, iframe, or external playable link. Controls, screenshots, and release notes can be added here as each game becomes playable.
        </div>
        {game.playUrl ? (
          <div style={{ marginTop: 20 }}>
            <ButtonLink href={game.playUrl} external>
              Play
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
