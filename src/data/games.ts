export const hereToSlayGame = {
  slug: "here-to-slay-online-tabletop",
  title: "Here to Slay Online Tabletop",
  description:
    "Play Here to Slay online with friends using a browser-based multiplayer virtual tabletop.",
  status: "Private Lobby",
  tech: ["Java 21", "Spring Boot", "WebSockets", "Browser tabletop"],
  playUrl: "/api/game/launch",
  playLabel: "Play Game",
  launchMode: "rooms",
} as const;

export const ddProjectGame = {
  slug: "dd-project",
  title: "DD Project",
  description:
    "Explore a pixel-art fantasy RPG in a private browser instance with account-isolated local progress.",
  status: "Single-player",
  tech: ["GameMaker", "HTML5", "Account-isolated saves"],
  playUrl: "/play/dd-project",
  playLabel: "Play Game",
  launchMode: "account-instance",
} as const;

export const games = [hereToSlayGame, ddProjectGame] as const;

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug);
}
