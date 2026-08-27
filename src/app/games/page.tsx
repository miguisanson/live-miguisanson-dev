import type { Metadata } from "next";
import Image from "next/image";
import { GameLaunchButton } from "@/components/game/GameLaunchButton";
import { PageShell } from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { games } from "@/data/games";

export const metadata: Metadata = {
  title: "Games",
  description: "Browser games and tabletop experiments for miguisanson.dev accounts.",
};

export default function GamesPage() {
  return (
    <PageShell
      title="Games"
      description="Browser games and tabletop experiments. Launching requires a verified account."
    >
      {games.length > 0 ? (
        <div className="card-grid">
          {games.map((game) => (
            <Card key={game.slug} className="game-card-v2">
              {game.image ? (
                <div className={`game-card-media${game.pixelArt ? " is-pixel-art" : ""}`}>
                  <Image
                    src={game.image}
                    alt={`${game.title} preview`}
                    width={640}
                    height={360}
                    sizes="(max-width: 720px) 100vw, 480px"
                  />
                </div>
              ) : null}
              <div className="row-between">
                <h2 className="ui-card-title">{game.title}</h2>
                <Badge>{game.status}</Badge>
              </div>
              <p className="muted">{game.description}</p>
              <div className="game-card-tech">
                {game.tech.map((tech) => (
                  <Badge key={tech} tone="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="game-card-actions">
                <GameLaunchButton
                  className="ui-button ui-button--primary ui-button--md"
                  launchPath={game.playUrl}
                >
                  {game.playLabel}
                </GameLaunchButton>
                <ButtonLink href={`/games/${game.slug}`} size="md">
                  Details
                </ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No games yet" description="Playable games will appear here." />
      )}
    </PageShell>
  );
}
