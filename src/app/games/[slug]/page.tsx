import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameLaunchButton } from "@/components/game/GameLaunchButton";
import { PageShell } from "@/components/layout/PageShell";
import { getGame } from "@/data/games";

type GamePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) {
    return { title: "Game not found" };
  }
  return {
    title: game.title,
    description: game.description,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) {
    notFound();
  }

  return (
    <PageShell eyebrow="Game" title={game.title} description={game.description}>
      <section className="account-card">
        <div className="account-card-heading">
          <h2>Status</h2>
          <span>{game.status}</span>
        </div>
        <div className="account-pill-list">
          {game.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="game-card-actions">
          <GameLaunchButton className="account-small-button account-primary-action">{game.playLabel}</GameLaunchButton>
          <Link className="account-small-button" href="/games">
            Back to games
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
