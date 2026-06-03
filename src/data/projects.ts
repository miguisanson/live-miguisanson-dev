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
    slug: "consumer-iq",
    title: "P&G Consumer IQ Prototype",
    description:
      "A front-end concept app for consumer intelligence, competitor analytics, operations monitoring, incident handling, and mock AI-assisted insights.",
    status: "Prototype",
    tech: ["React", "TypeScript", "Vite", "Mock data", "Local persistence"],
    image: "/consumer_iq_preview.svg",
    liveUrl: "/prototypes/consumer-iq",
    featured: true,
  },
  {
    slug: "usls-graduate-lifecycle",
    title: "USLS Graduate Student Lifecycle Platform",
    description:
      "A thesis MVP concept for monitoring graduate student progress, tasks, documents, scheduling, alerts, analytics, and decision-support workflows.",
    status: "Prototype",
    tech: ["React", "TypeScript", "Analytics UI", "Mock data", "Decision support"],
    image: "/usls_lifecycle_preview.svg",
    liveUrl: "/prototypes/usls-graduate-lifecycle",
    featured: true,
  },
  {
    slug: "linux-home-server",
    title: "Linux Home Server",
    description:
      "A Linux-based home server environment for local hosting, database-backed apps, Cloudflare Tunnel testing, monitoring, and deployment practice.",
    status: "Case Study",
    tech: ["Linux", "Nginx", "MySQL", "Cloudflare Tunnel", "Monitoring"],
    image: "/homebrew_hosting.png",
    liveUrl: "/prototypes/home-server-lab",
    featured: true,
  },
  {
    slug: "hardware-repair-sales",
    title: "Hardware Repair and Sales",
    description:
      "Practical diagnostics, component replacement, and customer-facing hardware repair work for consoles and older PC hardware.",
    status: "External",
    tech: ["Diagnostics", "Repair", "Troubleshooting", "Customer support"],
    image: "/hardware_repair.png",
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
