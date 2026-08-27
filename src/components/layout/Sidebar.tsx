import type { ReactNode } from "react";
import Link from "next/link";
import {
  AdminIcon,
  BlogIcon,
  ChangelogIcon,
  CloseIcon,
  CommunityIcon,
  MembersIcon,
  DocsIcon,
  GamesIcon,
  HomeIcon,
  ResumeIcon,
} from "./NavIcons";
import { projectPagesArePublic } from "@/lib/site-config";

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
    { href: "/members", label: "Members", icon: <MembersIcon />, match: "prefix" },
    { href: "/blog", label: "Blog", icon: <BlogIcon />, match: "prefix" },
  ];
  if (isAdmin) {
    items.push({ href: "/admin", label: "Admin", icon: <AdminIcon />, match: "prefix" });
  }

  // Project meta lives in its own group so it reads as reference material
  // rather than another destination alongside Games and Community.
  // Visibility is controlled by projectPagesArePublic in src/lib/site-config.ts.
  const metaItems: NavItem[] =
    projectPagesArePublic || isAdmin
      ? [
          { href: "/changelog", label: "Changelog", icon: <ChangelogIcon />, match: "prefix" },
          { href: "/docs", label: "Docs", icon: <DocsIcon />, match: "prefix" },
        ]
      : [];

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

        {metaItems.length > 0 ? (
          <>
            <p className="sidebar-group-label">Project</p>
            <ul>
              {metaItems.map((item) => {
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
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </nav>
    </aside>
  );
}
