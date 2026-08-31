import Link from "next/link";

/**
 * "Back to X" link shown at the top of a detail page.
 *
 * A real `Link` to the known parent rather than `router.back()` — history-based
 * navigation sends people wherever they happened to come from, which is wrong
 * when a page was opened from a search result or a shared URL.
 */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="back-link">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M19 12H5" strokeLinecap="round" />
        <path d="m12 19-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
