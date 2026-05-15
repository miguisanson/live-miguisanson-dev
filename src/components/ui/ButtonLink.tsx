import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ href, children, external = false, variant = "primary" }: ButtonLinkProps) {
  const classes =
    variant === "primary"
      ? "bg-[var(--text)] text-[var(--surface)] hover:bg-[var(--accent-strong)]"
      : "bg-[var(--surface-muted)] text-[var(--text)] hover:bg-[var(--line)]";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold transition ${classes}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold transition ${classes}`}
    >
      {children}
    </Link>
  );
}
