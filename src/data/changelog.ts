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
    date: "2026-08-31",
    tag: "v0.8.1",
    summary: "Feed images, back links, and a pass over readability.",
    groups: [
      {
        area: "Games — DD Project freeze",
        items: [
          "**Fixed the page freezing and the dev server stalling on \"Compiling…\" as soon as the controls were touched.** GameMaker implements `file_exists()` as a *synchronous* XHR, and the title screen called it for three save files every frame — roughly **180 blocking requests a second**, each stalling the main thread for a full round trip. Measured 1561 requests in one short session.",
          "Game data files are now backed by **localStorage** through an `XMLHttpRequest` shim installed before the runtime loads. Measured after the fix: **0 requests**.",
          "**Saving now actually works.** Writes previously went to a static asset path, which could not persist anything. Keys are namespaced per account.",
          "Real game assets are untouched by the shim and still load over the network.",
        ],
      },
      {
        area: "Games — DD Project input",
        items: [
          "**Fixed the game freezing on the title screen with dead controls.** It was not frozen: GameMaker binds keyboard with `window.onkeydown` on the *iframe's* own window and clears both handlers on blur, so with focus in the parent document no key ever reached the game.",
          "**Added a \"Click to play\" gate inside the game frame.** One click supplies the user gesture that lets audio start, moves focus into the iframe, and focuses the canvas. Verified the `AudioContext` goes from `suspended` to `running`.",
          "The parent page now focuses the iframe on any click in the frame and after fullscreen, which previously stole focus back and killed input.",
          "**Fixed the game rendering at a 480×432 postage stamp** — it now fills its container at exactly the native 1.111 aspect, pixel grid intact.",
        ],
      },
      {
        area: "Community posts",
        items: [
          "**Removed the public/draft dropdown.** Member posts are always public; drafts were a concept borrowed from the blog that made no sense on a short feed.",
          "**Added image attachments, up to 5 per post**, in the Reddit style: pick images, watch them upload, remove any before posting. One image runs full width; several tile into a gallery. A post can now be images-only.",
          "New upload route at `/api/posts/media`. It **sniffs the file signature** rather than trusting the browser-reported MIME type, so renaming an HTML file to `.png` is rejected.",
          "Added a `post.images` column, with a migration safe to re-run on both SQLite and PostgreSQL.",
        ],
      },
      {
        area: "Navigation",
        items: [
          "**Added back links to every detail page** — blog posts, game details, project write-ups, the game player and the admin blog editors — as a `backHref` prop on `PageShell` so placement stays consistent.",
          "They are real links to the known parent, not `history.back()`, which sends people somewhere unrelated when a page is opened from a search result.",
        ],
      },
      {
        area: "Readability",
        items: [
          "**Fixed the leftover monochrome button.** `.account-primary-button` painted `--primary` on `--theme`, rendering as a white button with dark text in dark mode. It now uses the accent like every other primary action.",
          "**Résumé bullets were too faint** — moved from `--muted` to `--content`, taking contrast from about 5.4:1 to **13.8:1**.",
          "**Shortened the About Me lede** from roughly 70 words to 27.",
        ],
      },
      {
        area: "Blog",
        items: [
          "Posts support a `pdf:` front-matter field. When present, the post shows a companion-document card with an in-page reader and a download button, reusing the certificate viewer from the résumé.",
        ],
      },
    ],
  },
  {
    date: "2026-08-28",
    tag: "v0.8",
    summary:
      "Résumé refresh, blog rebuild with admin authoring, community restructure, and a fix for the DD Project game canvas.",
    groups: [
      {
        area: "Documentation",
        items: [
          "Added **`CONTEXT.md`** — a full project handover covering architecture, design rules, information architecture, security posture, working conventions and the decisions on record. `CLAUDE.md` imports it, so anyone with no prior knowledge of this project has everything that is not recoverable from the code.",
        ],
      },
      {
        area: "Résumé",
        items: [
          "Rewrote the résumé data against the current one-page CV: the Seven Seven Global Services internship, the Graduate Student Lifecycle capstone, grouped technical skills, and certifications with dates.",
          "Made `/resume` fully data-driven — experience, projects and certifications had been hardcoded in the page and had drifted from the data file.",
        ],
      },
      {
        area: "Blog",
        items: [
          "Removed the two placeholder posts; kept **What I use a Linux home server for** and rewrote it as a full article on Proxmox, tunnels versus port forwarding, and what actually broke.",
          "Added **Writing an iOS training manual: what teaching it taught me**, drawn from the 10-module training manual — including the UserDefaults-is-not-encrypted, `map`-does-not-search and `unowned` corrections.",
          "**Admin blog authoring**: a new `blogPost` table, an editor at `/admin/blog`, draft and published states, slug generation with collision checks, and a two-step delete. Drafts are previewable by admins at their real URL and 404 for everyone else.",
          "The blog index merges repository markdown with database posts; a database post supersedes a file with the same slug.",
        ],
      },
      {
        area: "Markdown renderer",
        items: [
          "Extended it to support `####` headings, ordered lists, blockquotes, rules, fenced code blocks, pipe tables, inline `code`, italics and links. Links are restricted to `http(s)`, `mailto:` and site-relative targets, so a `javascript:` URL cannot be smuggled in. Escaping still runs **before** any tag is added.",
          "**Fixed hard-wrapped paragraphs rendering as one paragraph per source line.** Lines are now buffered and joined.",
        ],
      },
      {
        area: "Community",
        items: [
          "**Split people from posts.** `/members` is the member directory and search; `/community` is the post feed, and the composer lives there.",
          "**Removed the composer from profile pages.** A profile displays a member; it is not an editor. Owners still see their drafts, with a link to where posts are written.",
        ],
      },
      {
        area: "Games",
        items: [
          "**Fixed the DD Project canvas being stretched to the full window at the wrong aspect ratio.** The GameMaker runtime absolutely-positions its own canvas, but the wrapper had no `position`, so it resolved against the viewport instead of its container — rendering at 1.52 aspect against a native 1.11, and many times more pixels than the game needs.",
          "The game frame now takes focus on any click inside it, so keyboard input is never silently dead.",
          "Gave the game route its **own CSP**. The GameMaker runtime uses `eval` and WebAssembly, which the site-wide policy forbids — enforcing it would have broken the game in production.",
        ],
      },
    ],
  },
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
        area: "Access control",
        items: [
          "**`/changelog` and `/docs` are now admin-only**, controlled by `projectPagesArePublic` in `src/lib/site-config.ts`. Both return **404** rather than 401, so their existence is not disclosed, and the *Project* group disappears from the sidebar. The gate runs in the page itself — hiding the links alone would have been cosmetic.",
          "Removed the *Known gaps* section from `/docs`, which enumerated exactly which security work was outstanding. That list was the real risk, not the page itself.",
          "`sitemap.xml` only lists the project pages when they are actually public.",
          "`admin:bootstrap` now accepts `ADMIN_PASSWORD` so a memorable password can be set from `.env.local` instead of the generated one. Not hardcoded — this repository is public.",
        ],
      },
      {
        area: "Fixes",
        items: [
          "**Fixed `admin:bootstrap`, which could not create an account at all.** Every insert into `account` omitted the NOT NULL `issuer` column Better Auth requires (`local:credential`), so the script failed on any fresh install.",
          "Page headers no longer print the page name twice. `PageShell` drops an eyebrow that merely repeats the title, and the redundant props were removed from `/blog`, `/community` and `/games`.",
        ],
      },
      {
        area: "Content",
        items: [
          "**Removed the Here to Slay card from the resume.** It is a game, not a portfolio case study, and it appeared identically on both pages.",
          "**Added preview images to the game cards.** Here to Slay uses its title art; DD Project uses a cutscene panel extracted from the game's own texture atlas, rendered with `image-rendering: pixelated` so the pixel grid stays crisp.",
          "Replaced the `as const` game objects with a proper `Game` type, so optional fields like `image` and `pixelArt` typecheck across the whole list.",
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
