import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { hereToSlayGame } from "@/data/games";

const navItems = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: hereToSlayGame.playUrl, label: "Play Game", external: true },
  { href: "/ai-research", label: "AI Research" },
  { href: "/#certifications", label: "Certifications" },
];

export function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <Link href="/" accessKey="h" title="miguisanson.dev (Alt + H)">
            miguisanson.dev
          </Link>
          <div className="logo-switches">
            <ThemeToggle />
          </div>
        </div>
        <ul id="menu">
          {navItems.map((item) => (
            <li key={item.href}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" title={item.label}>
                  <span>{item.label}</span>
                </a>
              ) : (
                <Link href={item.href} title={item.label}>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
