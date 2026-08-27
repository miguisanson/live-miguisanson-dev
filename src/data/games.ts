export type Game = {
  slug: string;
  title: string;
  description: string;
  status: string;
  /** Card preview image served from /public. */
  image?: string;
  /** Render the preview without smoothing — for pixel-art sources. */
  pixelArt?: boolean;
  tech: readonly string[];
  playUrl: string;
  playLabel: string;
  launchMode: "rooms" | "account-instance";
};

export const hereToSlayGame = {
  slug: "here-to-slay-online-tabletop",
  title: "Here to Slay Online Tabletop",
  description:
    "Play Here to Slay online with friends using a browser-based multiplayer virtual tabletop.",
  status: "Private Lobby",
  image: "/here_to_slay_preview.webp",
  tech: ["Java 21", "Spring Boot", "WebSockets", "Browser tabletop"],
  playUrl: "/api/game/launch",
  playLabel: "Play Game",
  launchMode: "rooms",
} satisfies Game;

export const ddProjectGame = {
  slug: "dd-project",
  title: "DD Project",
  description:
    "Explore a pixel-art fantasy RPG in a private browser instance with account-isolated local progress.",
  status: "Single-player",
  // A cutscene panel lifted from the game's own texture atlas. pixelArt keeps the
  // browser from smoothing the pixel grid when the card scales it up.
  image: "/dd_project_preview.webp",
  pixelArt: true,
  tech: ["GameMaker", "HTML5", "Account-isolated saves"],
  playUrl: "/play/dd-project",
  playLabel: "Play Game",
  launchMode: "account-instance",
} satisfies Game;

export const games: Game[] = [hereToSlayGame, ddProjectGame];

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug);
}
