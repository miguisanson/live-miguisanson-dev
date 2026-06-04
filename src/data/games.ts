export const hereToSlayGame = {
  slug: "here-to-slay-online-tabletop",
  title: "Here to Slay Online Tabletop",
  description:
    "Play Here to Slay online with friends using a browser-based multiplayer virtual tabletop.",
  status: "Private Lobby",
  tech: ["Java 21", "Spring Boot", "WebSockets", "Browser tabletop"],
  playUrl: "/api/game/launch",
  playLabel: "Play Game",
} as const;

export const games = [hereToSlayGame] as const;

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug);
}
