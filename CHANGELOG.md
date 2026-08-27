# Changelog

A dated record of what changed on miguisanson.dev, newest first.

**Conventions**

- Every entry is headed by an absolute date: `## YYYY-MM-DD`. Never relative dates.
- Bullets are grouped by area so a reader can scan for what they care about.
- This file mirrors `src/data/changelog.ts`, which renders the public page at
  [/changelog](https://miguisanson.dev/changelog). Update both when you ship.

Dated tracking begins **2026-08-27**. Everything built before that is consolidated
into a single Pre-history entry at the bottom.

---

## 2026-08-27 — v0.7

Day one of tracked development. Full visual revamp, a security baseline, public
changelog and docs pages, and removal of the dead Hugo site.

### Design system

- Rebuilt the token layer in `globals.css`. Blue-biased neutrals replace flat greys,
  with an emerald action colour and a full set of status colours (success, warning,
  danger, info) defined for both themes.
- Introduced three type roles: **Archivo** for headings, **Geist** for body,
  **Geist Mono** for metadata, counts, tech chips and code. All self-hosted through
  `next/font`, so there is no external request and no font host in the CSP.
- Added a revamp layer restyling buttons, cards, badges, forms, the sidebar, the top
  bar, the home hub, community, posts, games and the resume — all by restyling
  existing classes, so no component markup had to change.
- Hover states now shift colour and elevation only, never transform, so grids no
  longer shift under the cursor.
- Active navigation is marked with a flat accent rail and tinted background instead
  of a font-weight change that reflowed the label.
- Resume sub-navigation gained a nesting rail and readable indentation.
- Replaced the emoji used as a location icon with a proper SVG.
- Removed all 11 inline `style` attributes from the resume page in favour of classes.
- Fixed a class collision: the games index uses `.card-grid` / `.game-card-v2`, while
  `.game-list` / `.game-card` belong to the favourite-games list on profiles. The
  grid now uses `auto-fit`, so a short catalogue fills the row instead of leaving
  empty columns.

### Security

- Resolved every dependency advisory — **7 vulnerabilities to 0**. Patched `tar`
  (critical), bumped Next.js 16.2.6 to 16.3.3 (four high `sharp`/libvips CVEs) and
  nodemailer to 9.0.5.
- Added a full security header set: HSTS, `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`.
- Added a Content Security Policy in Report-Only mode, with a single
  `enforceContentSecurityPolicy` flag in `next.config.ts` to switch it to enforcing
  once validated against production traffic.
- Removed the `x-powered-by` header, which advertised the framework and version.
- `/account` and `/admin` now send `no-store`.

### Pages

- Added **/changelog**, rendered from `src/data/changelog.ts`.
- Added **/docs** covering architecture, design system, accounts, community, games,
  security and deployment.
- Added **Blog** to the sidebar. The route already worked but was unreachable from
  navigation.
- Grouped Changelog and Docs under a "Project" heading in the sidebar so they read as
  reference material rather than another destination.
- Added both new routes to `sitemap.xml`.

### Documentation

- Rewrote `README.md` against the code as it actually exists.
- Replaced `PLAN.md` and `CHECKLIST.md` with a single `ROADMAP.md`. The old files had
  drifted out of sync — they listed Games, Blog and Home as unfinished placeholders
  in the same document that recorded them as completed.

### Tooling

- Added `scripts/deploy.sh`: preflight checks, fetch, install, migrate, build,
  restart, health check. The build runs before the restart, so a failed build never
  replaces a running site. Supports `DRY_RUN=1`.

### Assets

- Compressed the oversized images in `public/` — **9.05MB to 0.19MB, a 98% reduction**.
  They were photographs stored as lossless PNG, which is the wrong format for
  photographic content:
  - `homebrew_hosting.png` 6.7MB (3024×4032) → `homebrew_hosting.webp` 49KB (960×1280)
  - `hardware_repair.png` 2.4MB (1080×1920) → `hardware_repair.webp` 142KB (720×1280)
  - `css_logo.png` 57KB (1452×1675) → `css_logo.webp` 2KB (55×64)
  - `sql_logo.png` 59KB (443×420) → `sql_logo.webp` 4KB (64×61)
- Project previews render at 640×360 and skill chips at 16px, so sources are now
  capped at 2× the display size rather than shipping camera originals.
- Deleted `web_server.PNG` (1.9MB), which was referenced nowhere.

### Cleanup

- Removed the abandoned Hugo site left over from the previous version of this
  website: `hugo.toml`, `.hugo_build.lock`, `archetypes/`, `layouts/`, `assets/`,
  the `static/` tree (a 15MB duplicate of `public/`), `legacy/hugo-public/` (15MB of
  generated output) and the PaperMod theme submodule.
- Removed `run.py` and `setup.py`, which only ever drove Hugo builds.
- Removed four top-level Hugo content files (`about.md`, `certifications.md`,
  `experience.md`, `projects.md`) superseded by `src/data/profile.ts`. The
  `content/blog/` and `content/projects/` directories are still in use and were kept.
- Cleared a stale `.next/` cache that was reporting type errors for routes deleted in
  an earlier cleanup.

---

## 2026-06-29 — Pre-history

Everything built before dated tracking began, consolidated into one entry. The
platform moved from Hugo to Next.js and gained accounts, profiles, posts and games.

### Platform

- Migrated from a Hugo static site to Next.js with the App Router, React 19 and
  TypeScript.
- Built the app shell — sidebar navigation, top bar, collapsible desktop sidebar,
  mobile drawer, skip-to-content link and a z-index scale.
- Established a hand-written CSS design system with no Tailwind.

### Accounts

- Better Auth with email and username sign-in, required email verification, and
  password reset.
- Per-route rate limiting backed by the database, plus an audit log of authentication
  events.
- Email-verified account deletion.
- Admin dashboard at `/admin`, gated by a `customSession` exposing `isAdmin`.
- Cloudflare Turnstile support wired in, pending configuration.

### Profiles and community

- Public profiles at `/u/[username]` with display name, status, quote, bio, favourite
  games and computed badges.
- Avatar and banner uploads served through a path-traversal-guarded media route.
- Public and private profile visibility, plus an activity-hiding option.
- Markdown posts with public and draft states, shown on profiles and in the community
  feed.
- Community directory at `/community` with member search.

### Games

- Here to Slay online tabletop with private rooms, expiring invite codes and per-room
  server state isolation.
- DD Project, a GameMaker HTML5 build running in an authenticated in-site player with
  account-isolated save data.

### SEO

- `sitemap.xml` covering static routes, public profiles and blog posts; `robots.txt`;
  canonical URLs; per-profile metadata and `ProfilePage` JSON-LD.
