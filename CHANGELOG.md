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

## 2026-08-31 — v0.8.1

Feed images, back links, and a pass over readability.

### Community posts

- **Removed the public/draft dropdown.** Member posts are always public; drafts
  were a concept borrowed from the blog that made no sense on a short feed. The
  per-post "Make draft" toggle and the Public/Draft pill are gone too.
- **Added image attachments, up to 5 per post**, in the Reddit style: pick
  images, see thumbnails while they upload, remove any before posting. One image
  renders full width; several tile into a gallery. A post can now be images-only
  with no text.
- New upload route at `/api/posts/media`. It **sniffs the file signature** rather
  than trusting the browser-reported MIME type, so renaming an HTML file to
  `.png` is rejected. Verified: real images accepted, spoofed types rejected with
  400, unauthenticated requests rejected with 401.
- `post.images` column added, with a migration that is safe to re-run on both
  SQLite and PostgreSQL.

### Navigation

- **Added back links to every detail page** — blog posts, game details, project
  write-ups, the DD Project player, and the admin blog editors. Implemented as a
  `backHref` prop on `PageShell` so the placement stays consistent.
- They are real links to the known parent, not `history.back()`, which sends
  people somewhere unrelated when a page is opened from a search result.

### Readability

- **Fixed the leftover monochrome button.** `.account-primary-button` painted
  `--primary` on `--theme`, which rendered as a **white button with dark text**
  in dark mode — the odd-looking Post and Log in buttons. It now uses the accent,
  matching every other primary action. Its `translateY` hover was also removed.
- **Résumé bullets were too faint.** They used `--muted`; they now use
  `--content`, taking contrast from about 5.4:1 to **13.8:1**.
- **Shortened the About Me lede** from roughly 70 words to 27. The detail already
  lives in Experience and Projects; the intro is the hook, not the summary.

### Blog

- Blog posts support a `pdf:` front-matter field. When present, the post shows a
  companion-document card with an in-page reader and a download button, reusing
  the certificate viewer from the résumé. The buttons do not render when the file
  is absent.
- The iOS training manual post is wired to
  `/documents/ios-development-training-manual.pdf`.

---

## 2026-08-28

Résumé refresh, blog rebuild with admin authoring, community restructure, and a
fix for the DD Project game canvas.

### Documentation

- Added **`CONTEXT.md`** — a full project handover covering architecture, design
  rules, information architecture, security posture, working conventions and the
  decisions on record. `CLAUDE.md` imports it, so an agent or developer with no
  prior knowledge of this project has everything that is not recoverable from the
  code. This is the file to update when a convention changes.

### Résumé

- Rewrote `src/data/profile.ts` against the current one-page CV: the Seven Seven
  Global Services internship, the Graduate Student Lifecycle capstone, grouped
  technical skills, and certifications with dates.
- Made `/resume` fully data-driven — experience, projects and certifications had
  been hardcoded in the page and drifted from the data file.

### Blog

- Removed the two placeholder posts; kept **What I use a Linux home server for**
  and rewrote it as a full article on Proxmox, tunnels vs port forwarding, and
  what actually broke.
- Added **Writing an iOS training manual: what teaching it taught me** — a
  long-form post drawn from the 10-module training manual, including the
  UserDefaults-is-not-encrypted, `map`-does-not-search and `unowned` corrections.
- **Admin blog authoring**: new `blogPost` table, an editor at `/admin/blog`,
  draft and published states, slug generation with collision checks, and
  two-step delete. Drafts are previewable by admins at their real URL and 404
  for everyone else.
- The blog index merges repository markdown with database posts. A database post
  supersedes a file with the same slug.

### Markdown renderer

- Extended it to support `####` headings, ordered lists, blockquotes, horizontal
  rules, fenced code blocks, pipe tables, inline `code`, *italics* and links.
  Links are restricted to `http(s)`, `mailto:` and site-relative targets, so a
  `javascript:` URL cannot be smuggled in. Escaping still runs **before** any tag
  is added.
- **Fixed hard-wrapped paragraphs rendering as one `<p>` per source line.**
  Paragraph lines are now buffered and joined.

### Community

- **Split people from posts.** `/members` is the member directory and search;
  `/community` is the post feed, and the composer lives there.
- **Removed the composer from profile pages.** A profile displays a member; it is
  not an editor. Owners still see their drafts, with a link to where posts are
  written.

### Games

- **Fixed the DD Project canvas being stretched to the full window at the wrong
  aspect ratio.** The GameMaker runtime absolutely-positions its own canvas, but
  the wrapper had no `position`, so it resolved against the viewport instead of
  its container — rendering at 1.52 aspect against a native 1.11, and many times
  more pixels than the game needs.
- The game frame now takes focus on any click inside it, so keyboard input is
  never silently dead.
- Gave the game route its **own CSP**. The GameMaker runtime uses `eval` and
  WebAssembly, which the site-wide policy forbids — enforcing it would have
  broken the game in production.


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

### Access control

- **`/changelog` and `/docs` are now admin-only**, controlled by
  `projectPagesArePublic` in `src/lib/site-config.ts`. Both routes return **404**
  (not 401) to everyone else, so their existence is not disclosed, and the
  "Project" group disappears from the sidebar. The gate runs in the page itself —
  hiding the links alone would have been cosmetic.
- Removed the "Known gaps" section from `/docs`, which enumerated exactly which
  security work was outstanding. That list was the real risk, not the page.
  Outstanding items live in `ROADMAP.md` instead.
- `sitemap.xml` only lists the project pages when they are actually public.
- `admin:bootstrap` now accepts `ADMIN_PASSWORD` so a memorable password can be
  set from `.env.local` instead of using the generated one. **Not hardcoded** —
  this repository is public.

### Fixes

- **Fixed `admin:bootstrap`, which could not create an account at all.** Every
  insert into `account` omitted the NOT NULL `issuer` column that Better Auth
  requires (`local:credential`), so the script failed on any fresh install.
- Page headers no longer print the page name twice. `PageShell` drops an eyebrow
  that merely repeats the title, and the redundant props were removed from
  `/blog`, `/community` and `/games`.

### Content

- **Removed the Here to Slay card from the resume.** It is a game, not a
  portfolio case study, and it appeared identically on both pages.
- **Added preview images to the game cards.** Here to Slay uses its title art;
  DD Project uses a cutscene panel extracted from the game's own texture atlas,
  rendered with `image-rendering: pixelated` so the pixel grid stays crisp.
- Replaced the `as const` game objects with a proper `Game` type, so optional
  fields like `image` and `pixelArt` typecheck across the whole list.

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
