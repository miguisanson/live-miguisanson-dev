import type { Metadata } from "next";
import Link from "next/link";
import { GameLaunchButton } from "@/components/game/GameLaunchButton";
import { PageShell } from "@/components/layout/PageShell";
import { games } from "@/data/games";

export const metadata: Metadata = {
  title: "Games",
  description: "Playable browser games and tabletop experiments for miguisanson.dev accounts.",
};

export default function GamesPage() {
  return (
    <PageShell
      eyebrow="Games"
      title="Playable spaces."
      description="Small browser-based games and tabletop experiments connected to verified miguisanson.dev accounts."
    >
      <div className="game-list">
        {games.map((game) => (
          <article className="game-card" key={game.slug}>
            <div>
              <div className="account-card-heading">
                <h2>{game.title}</h2>
                <span>{game.status}</span>
              </div>
              <p>{game.description}</p>
              <div className="account-pill-list">
                {game.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
            <div className="game-card-actions">
              <GameLaunchButton className="account-small-button account-primary-action">{game.playLabel}</GameLaunchButton>
              <Link className="account-small-button" href={`/games/${game.slug}`}>
                Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
