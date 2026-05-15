export type Game = {
  slug: string;
  title: string;
  description: string;
  status: "Idea" | "Prototype" | "Playable";
  stack: string[];
  playUrl?: string;
};

export const games: Game[] = [
  {
    slug: "browser-arcade-lab",
    title: "Browser Arcade Lab",
    description:
      "A placeholder slot for small HTML5 games and interaction experiments that can be embedded later.",
    status: "Idea",
    stack: ["Canvas", "TypeScript", "Game loop"],
  },
  {
    slug: "systems-sim",
    title: "Systems Simulation Game",
    description:
      "A future game concept about balancing server resources, incidents, and reliability decisions.",
    status: "Prototype",
    stack: ["Simulation", "Dashboards", "Resource management"],
  },
];

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug);
}
