import type { ReactNode } from "react";
import Link from "next/link";
import {
  AdminIcon,
  CloseIcon,
  CommunityIcon,
  GamesIcon,
  HomeIcon,
  ResumeIcon,
} from "./NavIcons";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  match: "exact" | "prefix";
};

const resumeLinks = [
  { href: "/resume#about", label: "About" },
  { href: "/resume#experience", label: "Experience" },
  { href: "/resume#projects", label: "Projects" },
  { href: "/resume#certifications", label: "Certifications" },
];

type SidebarProps = {
  isAdmin: boolean;
  pathname: string;
  onClose: () => void;
};

export function Sidebar({ isAdmin, pathname, onClose }: SidebarProps) {
  const items: NavItem[] = [
    { href: "/", label: "Home", icon: <HomeIcon />, match: "exact" },
    { href: "/resume", label: "Resume", icon: <ResumeIcon />, match: "prefix" },
    { href: "/games", label: "Games", icon: <GamesIcon />, match: "prefix" },
    { href: "/community", label: "Community", icon: <CommunityIcon />, match: "prefix" },
  ];
  if (isAdmin) {
    items.push({ href: "/admin", label: "Admin", icon: <AdminIcon />, match: "prefix" });
  }

  const isActive = (item: NavItem) =>
    item.match === "exact" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const showResumeLinks = pathname === "/resume" || pathname.startsWith("/resume/");

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Link href="/" className="sidebar-brand" onClick={onClose}>
          miguisanson.dev
        </Link>
        <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close menu">
          <CloseIcon />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        <ul>
          {items.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`sidebar-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
                {item.href === "/resume" && showResumeLinks ? (
                  <ul className="sidebar-subnav" aria-label="Resume sections">
                    {resumeLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} onClick={onClose}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
