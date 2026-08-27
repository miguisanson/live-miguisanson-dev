import { hereToSlayGame } from "@/data/games";

export type Project = {
  slug: string;
  title: string;
  description: string;
  status: "Prototype" | "Case Study" | "Live Demo" | "External";
  tech: string[];
  image?: string;
  liveUrl?: string;
  liveLabel?: string;
  githubUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "linux-home-server",
    title: "Linux Home Server",
    description:
      "A Linux-based home server environment for local hosting, database-backed apps, Cloudflare Tunnel testing, monitoring, and deployment practice.",
    status: "Case Study",
    tech: ["Linux", "Nginx", "MySQL", "Cloudflare Tunnel", "Monitoring"],
    image: "/homebrew_hosting.webp",
    liveLabel: "View Page",
    featured: true,
  },
  {
    slug: "hardware-repair-sales",
    title: "Hardware Repair and Sales",
    description:
      "Practical diagnostics, component replacement, and customer-facing hardware repair work for consoles and older PC hardware.",
    status: "External",
    tech: ["Diagnostics", "Repair", "Troubleshooting", "Customer support"],
    image: "/hardware_repair.webp",
    liveUrl: "https://www.carousell.ph/u/sanmig02/",
  },
  {
    slug: "here-to-slay-online-tabletop",
    title: hereToSlayGame.title,
    description:
      "Play Here to Slay online with friends using a browser-based multiplayer virtual tabletop.",
    status: "Live Demo",
    tech: ["Java 21", "Spring Boot", "WebSockets", "Docker", "JavaScript"],
    image: "/here_to_slay_preview.webp",
    liveUrl: hereToSlayGame.playUrl,
    liveLabel: "Play Game",
    featured: true,
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
