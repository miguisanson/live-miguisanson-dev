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
];
// Here to Slay lives on the Games page, not here. It is a game, not a portfolio
// case study, and listing it in both places duplicated the same card.

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
