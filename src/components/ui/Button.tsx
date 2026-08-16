import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "neutral" | "ghost" | "danger";
type Size = "sm" | "md";

function buttonClass(variant: Variant, size: Size, className?: string) {
  return ["ui-button", `ui-button--${variant}`, `ui-button--${size}`, className].filter(Boolean).join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export function Button({ variant = "neutral", size = "md", loading = false, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className="ui-spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ href, variant = "neutral", size = "md", external = false, className, children }: ButtonLinkProps) {
  const cn = buttonClass(variant, size, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn}>
      {children}
    </Link>
  );
}
