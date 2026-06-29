"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/account", label: "Account settings" },
  { href: "/account/profile", label: "Edit profile" },
  { href: "/account/activity", label: "Activity" },
  { href: "/account/security", label: "Security" },
];

export function AccountTabs() {
  const pathname = usePathname();

  return (
    <nav className="account-tabs" aria-label="Account sections">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`account-tab${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
