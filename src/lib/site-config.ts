/**
 * Site-wide switches that change what visitors can reach.
 *
 * Keep these as plain constants rather than environment variables — they change
 * the shape of the site, so they belong in version control where a change is
 * reviewable and shows up in the changelog.
 */

/**
 * Whether /changelog and /docs are readable by everyone.
 *
 * `true`  — public. Good for a portfolio: a visible engineering record is
 *           evidence of how you work, and public changelogs are normal practice.
 * `false` — admin only. Both pages 404 for everyone else, and the "Project"
 *           group disappears from the sidebar.
 *
 * Note that hiding these pages is not by itself a security control. The
 * protection that matters is not publishing exploitable specifics — see the
 * comment on `docs/page.tsx` about what belongs on a public docs page.
 */
export const projectPagesArePublic = false;
