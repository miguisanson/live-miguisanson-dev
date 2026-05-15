import Link from "next/link";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/games", label: "Games" },
  { href: "/lab", label: "Lab" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          miguisanson.dev
        </Link>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[var(--muted)]">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[var(--text)]">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
