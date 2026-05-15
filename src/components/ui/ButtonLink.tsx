import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ href, children, external = false, variant = "primary" }: ButtonLinkProps) {
  const classes = variant === "primary" ? "button primary-button" : "button";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={classes}
      >
        <span className="button-inner">{children}</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      <span className="button-inner">{children}</span>
    </Link>
  );
}
