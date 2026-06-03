"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "@/components/auth/AccountMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const resumeNavItems = [
  { href: "/resume#about", label: "About" },
  { href: "/resume#experience", label: "Experience" },
  { href: "/resume#projects", label: "Projects" },
  { href: "/resume#certifications", label: "Certifications" },
];

export function Header() {
  const pathname = usePathname();
  const isResumePage = pathname === "/resume";
  const navItems = isResumePage ? resumeNavItems : [];

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
          {navItems.length > 0
            ? navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} title={item.label}>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))
            : null}
          <li>
            <AccountMenu />
          </li>
        </ul>
      </nav>
    </header>
  );
}
