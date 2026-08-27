/**
 * Structured changelog for miguisanson.dev.
 *
 * This is the single source of truth for the public /changelog page and it is
 * mirrored in CHANGELOG.md at the repository root. When you ship a change, add
 * a dated release here first, then mirror the bullets into CHANGELOG.md.
 *
 * Conventions:
 *  - `date` is an absolute ISO date (YYYY-MM-DD). Never relative.
 *  - Newest release first.
 *  - Group bullets by area so a reader can scan for what they care about.
 */

export type ChangeGroup = {
  area: string;
  items: string[];
};

export type Release = {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** Short version or milestone label shown beside the date. */
  tag: string;
  /** One line describing the release as a whole. */
  summary: string;
  groups: ChangeGroup[];
};

export const releases: Release[] = [
  {
    date: "2026-08-27",
    tag: "v0.7",
    summary:
      "Day one of tracked development. Full visual revamp, a security baseline, public changelog and docs pages, and removal of the dead Hugo site.",
    groups: [
      {
        area: "Design system",
        items: [
          "Rebuilt the token layer in `globals.css` — blue-biased neutrals replace flat greys, with an emerald action colour and a full set of status colours (success, warning, danger, info) defined for both themes.",
          "Introduced three type roles: **Archivo** for headings, **Geist** for body, **Geist Mono** for metadata, counts, tech chips and code. All self-hosted through `next/font`, so no external request and no font host in the CSP.",
          "Added a revamp layer restyling buttons, cards, badges, forms, the sidebar, the top bar, the home hub, community, posts, games and the resume — all by restyling existing classes, so no component markup had to change.",
          "Hover states now shift colour and elevation only, never transform, so grids no longer shift under the cursor.",
          "Active navigation is marked with a flat accent rail and tinted background instead of a font-weight change that reflowed the label.",
          "Resume sub-navigation gained a nesting rail and readable indentation.",
          "Replaced the emoji used as a location icon with a proper SVG.",
          "Removed all 11 inline `style` attributes from the resume page in favour of classes.",
          "Fixed a class collision: the games index uses `.card-grid` / `.game-card-v2`, while `.game-list` / `.game-card` belong to the favourite-games list on profiles. The grid now uses `auto-fit`, so a short catalogue fills the row instead of leaving empty columns.",
        ],
      },
      {
        area: "Security",
        items: [
          "Resolved every dependency advisory — **7 vulnerabilities to 0**. Patched `tar` (critical), bumped Next.js 16.2.6 to 16.3.3 (four high `sharp`/libvips CVEs) and nodemailer to 9.0.5.",
          "Added a full security header set: HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`.",
          "Added a Content Security Policy in Report-Only mode, with a single flag in `next.config.ts` to switch it to enforcing once verified in production.",
          "Removed the `x-powered-by` header, which advertised the framework and version.",
          "`/account` and `/admin` now send `no-store`, so authenticated pages are never held by a CDN or browser cache.",
        ],
      },
      {
        area: "Pages",
        items: [
          "Added **/changelog**, rendered from a typed source so the release history is visible on the site rather than only in the repository.",
          "Added **/docs** covering architecture, design system, accounts, community, games, security and deployment.",
          "Added **Blog** to the sidebar. The route already worked but was unreachable from navigation.",
          "Grouped Changelog and Docs under a *Project* heading in the sidebar so they read as reference material rather than another destination.",
          "Added both new routes to `sitemap.xml`.",
        ],
      },
      {
        area: "Documentation",
        items: [
          "Rewrote `README.md` against the code as it actually exists — it had listed Tailwind in the active stack and carried whole sections on Hugo/PaperMod parity.",
          "Adopted absolute-date changelog entries (`YYYY-MM-DD`) as the standing convention, with 2026-08-27 as day one.",
          "Replaced `PLAN.md` and `CHECKLIST.md` with a single `ROADMAP.md`. The old pair listed Games, Blog and Home as unfinished placeholders in the same document that recorded them as completed.",
        ],
      },
      {
        area: "Tooling",
        items: [
          "Added `scripts/deploy.sh`: preflight checks, fetch, install, migrate, build, restart, health check. The build runs before the restart, so a failed build never replaces a running site. Supports `DRY_RUN=1`.",
        ],
      },
      {
        area: "Assets",
        items: [
          "Compressed the oversized images in `public/` — **9.05MB to 0.19MB, a 98% reduction**. They were photographs stored as lossless PNG, which is the wrong format for photographic content.",
          "`homebrew_hosting` went from 6.7MB at 3024×4032 to 49KB at 960×1280; `hardware_repair` from 2.4MB to 142KB. The skill-chip logos went from ~58KB each to 2–4KB.",
          "Sources are now capped at 2× their display size — project previews render at 640×360 and skill chips at 16px — instead of shipping camera originals.",
          "Deleted `web_server.PNG` (1.9MB), which was referenced nowhere.",
        ],
      },
      {
        area: "Cleanup",
        items: [
          "Removed the abandoned Hugo site left over from the previous version: `hugo.toml`, `archetypes/`, `layouts/`, `assets/`, the `static/` tree (a 15MB duplicate of `public/`), `legacy/hugo-public/` (15MB of generated output) and the PaperMod theme submodule.",
          "Removed `run.py` and `setup.py`, which only ever drove Hugo builds.",
          "Removed four top-level Hugo content files superseded by `src/data/profile.ts`. The `content/blog/` and `content/projects/` directories are still in use and were kept.",
          "Cleared a stale `.next/` cache that was reporting type errors for routes deleted in an earlier cleanup.",
        ],
      },
    ],
  },
  {
    date: "2026-06-29",
    tag: "Pre-history",
    summary:
      "Everything built before dated tracking began, consolidated into one entry. The platform moved from Hugo to Next.js and gained accounts, profiles, posts and games.",
    groups: [
      {
        area: "Platform",
        items: [
          "Migrated from a Hugo static site to Next.js with the App Router, React 19 and TypeScript.",
          "Built the app shell — sidebar navigation, top bar, collapsible desktop sidebar, mobile drawer, skip-to-content link and a z-index scale.",
          "Established a hand-written CSS design system with no Tailwind.",
        ],
      },
      {
        area: "Accounts",
        items: [
          "Better Auth with email and username sign-in, required email verification, and password reset.",
          "Per-route rate limiting backed by the database, plus an audit log of authentication events.",
          "Email-verified account deletion.",
          "Admin dashboard at `/admin` with account stats, gated by a `customSession` that exposes `isAdmin`.",
          "Cloudflare Turnstile support wired in, pending configuration.",
        ],
      },
      {
        area: "Profiles and community",
        items: [
          "Public profiles at `/u/[username]` with display name, status, quote, bio, favourite games and computed badges.",
          "Avatar and banner uploads served through a path-traversal-guarded media route.",
          "Public and private profile visibility, plus an activity-hiding option.",
          "Markdown posts with public and draft states, shown on profiles and in the community feed.",
          "Community directory at `/community` with member search.",
        ],
      },
      {
        area: "Games",
        items: [
          "Here to Slay online tabletop with private rooms, expiring invite codes and per-room server state isolation.",
          "DD Project, a GameMaker HTML5 build running in an authenticated in-site player with account-isolated save data.",
        ],
      },
      {
        area: "SEO",
        items: [
          "`sitemap.xml` covering static routes, public profiles and blog posts; `robots.txt`; canonical URLs; per-profile metadata and `ProfilePage` JSON-LD.",
        ],
      },
    ],
  },
];

/** Formats an ISO date as e.g. "27 August 2026". */
export function formatReleaseDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
