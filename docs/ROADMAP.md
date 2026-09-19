# Roadmap — what is built, what is next

**This file is the single source of truth for WHAT gets built and IN WHAT
ORDER.** [`VISION.md`](VISION.md) says why. `.planning/` tracks execution
against this file and must never invent scope or reorder it. When a row lands:
mark it here, add a dated entry to `CHANGELOG.md` **and**
`src/data/changelog.ts` (CONTEXT §8). There is no other tracker.

Marks: ✅ done · 🔨 in progress · ⬜ open · ⏸️ parked (only the owner unparks) ·
👤 waits on the owner (listed in `.planning/STATE.md` → Owner queue; build
around it, never wait on it).

Every row has a **Done when** — a falsifiable statement a check can prove.
Rows inside a milestone are in build order. Milestones run M0 → M7; M0 and M1
protect everything after them and are never reordered.

What shipped before this revamp (v0.1–v0.7) is kept in
[`ROADMAP-v0.7.md`](ROADMAP-v0.7.md) for history.

Last reviewed: **2026-09-20**

---

## M0 — Ground: make the repo safe to build in

Nothing else starts until G-1…G-6 are ✅. No parallel agents before G-3.

| Id | Item | Done when |
|---|---|---|
| G-1 ✅ | **One branch, one truth.** `v0.8` from `v0.7`, dev kit restored, docs written, `.planning/` seeded | `git log v0.8` contains the v0.7 revamp and the kit; `docs/VISION.md`, `ROADMAP.md`, `REFERENCES.md`, `PROPOSALS.md` exist; `/continue_live-miguisanson-dev` reads them |
| G-2 👤 | **Bring the site back up.** `cloudflared` as a systemd service with `Restart=always`; the app's service enabled at boot | `curl -sI https://miguisanson.dev` returns 200 after a VM reboot with nobody logged in. Steps are in `docs/SETUP-OWNER.md` |
| G-11 ⬜ | **Dependency audit back to zero.** `npm audit --omit=dev` reported 2 on 2026-09-20 (`nodemailer` high, `baseline-browser-mapping` moderate). Upgrade, read the changelog for breaking changes in the mail path | `npm audit --omit=dev` reports 0; typecheck and build green; the dev mail path (verification link logged to the terminal) still works — done before G-3 because it is small and it is mail security |
| G-3 ⬜ | **Unit test runner.** Vitest + Testing Library; `npm test`; first tests cover `src/lib/account-policy.ts`, `content.ts` (escape-before-format), `game-tickets.ts`, `game-rooms.ts`, and `scripts/autopilot-lib.mjs` | `npm test` runs green in under 20 s; deleting the escape call in `markdownToHtml` turns a test red |
| G-4 ⬜ | **Browser tests.** Playwright against `next build && next start` with a throwaway SQLite file; signed-in state reused via `storageState`; verification mail captured, never sent; `@smoke` tag for the fast subset | `npm run test:e2e` signs up, verifies, logs in, posts, and launches a game page; `npm run smoke` finishes in under 90 s |
| G-5 ⬜ | **Accessibility and layout checks** inside Playwright: axe on every route; no horizontal overflow at 375 / 768 / 1024 / 1440; screenshot baselines for the public pages | A deliberately too-wide element or a missing label fails the suite |
| G-6 ⬜ | **Lint and one gate.** ESLint flat config (`eslint-config-next`), Stylelint for CSS (bans `!important` and raw colours outside the token layer), Knip report, `npm run gate` = typecheck → lint → test → build → smoke | `npm run gate` exists and is green; adding `!important` or `#fff` in a component layer fails lint |
| G-7 ⬜ | **Java tests stop being skipped.** `npm run game:test`; room isolation and ticket expiry covered | `mvn test` runs from an npm script and is part of the gate when `games/here-to-slay/**` changed |
| G-8 ⬜ | **Environment validation.** One typed module reads and validates env at boot; production refuses to start without mail, secrets, Turnstile | Starting with a missing `BETTER_AUTH_SECRET` exits with a plain message naming the variable; unit-tested |
| G-9 ⬜ | **CI on GitHub's runners** (never a self-hosted runner on this public repo): gate + `npm audit --omit=dev`; Dependabot; secret scanning on | A pull request with a failing test shows a red check; the workflow never receives a production secret |
| G-10 ⬜ | **Git hooks** (lefthook): pre-commit typecheck + lint on staged files; pre-push gate | A commit that adds a type error is refused locally |

## M1 — Operations: a home server that survives

| Id | Item | Done when |
|---|---|---|
| O-1 ⬜ | **Standalone build, release folders, instant rollback.** `output: "standalone"`; `deploy.sh` builds into `releases/<sha>`, copies `public/` and `.next/static`, health-checks on a spare port, swaps a `current` symlink, restarts; `rollback.sh` points back | `DRY_RUN=1 ./scripts/deploy.sh` prints the plan; a failing health check leaves `current` untouched; `rollback.sh` restores the previous release in under 10 s (shell-tested with bats or a Node test using a temp dir) |
| O-2 ⬜ | **systemd units in `deploy/`** for web, lobby and `cloudflared`, with `Restart=always`, `TimeoutStopSec=30`, a non-root user, hardening flags | `systemd-analyze verify` passes on all units in CI |
| O-3 ⬜ | **Backups off the machine.** Nightly `pg_dump` + uploads → restic → Cloudflare R2; 7 daily / 4 weekly; `restore-drill.sh` restores into a scratch database and compares row counts | The drill script exits 0 against a local Postgres container; the last successful backup time is shown on `/admin` |
| O-4 ⬜ | **Health and uptime.** `/api/health` (app, database, lobby reachability, disk free, last backup age); external uptime check on both hostnames (👤 creates the monitor) | The endpoint returns 503 with a reason when the database is unreachable; tested |
| O-5 ⬜ | **Real client IP.** Rate limits and the audit log use `CF-Connecting-IP`, trusted only when the request came through the tunnel | Unit test: a spoofed header from a non-tunnel request is ignored |
| O-6 ⬜ | **Uploads made safe.** Re-encode with `sharp` (strips EXIF), sniff the real type, cap dimensions, per-account quota, delete superseded avatars; stay under Cloudflare's 100 MB request cap | Uploading a `.png` that is really HTML is rejected; an image with GPS EXIF comes back without it |
| O-7 ⬜ | **CSP enforced.** Move from Report-Only to enforcing without nonces on static public pages (hash/SRI route); nonce only where a page is already dynamic; the DD Project route keeps its own policy | Playwright loads every route with zero CSP violations logged; the public pages stay statically rendered (checked in the build output) |
| O-8 ⬜ | **Errors and analytics, privately.** Error reports to a self-hosted GlitchTip or a log file viewer on `/admin`; Cloudflare Web Analytics (no cookies) | A thrown test error appears in the admin view with route and release id |
| O-9 ⬜ | **Staging.** `staging.miguisanson.dev` behind Cloudflare Access, same deploy script, separate env and database (👤 creates the Access policy) | `deploy.sh --target staging` documented and dry-run tested |
| O-10 ⬜ | **Pull-based deploy (optional).** A systemd timer on the server checks for a signed tag `deploy/*` and runs `deploy.sh`; nothing inbound, no standing credential in GitHub | Dry-run test: an unsigned tag is ignored |

## M2 — Design system rebuild

Replaces the 5,000-line `globals.css` and its pasted-over "revamp layer".
Visual intent stays (CONTEXT §4); delivery changes. UI work loads
`ui-ux-pro-max`; each phase starts with `/gsd-ui-phase`.

| Id | Item | Done when |
|---|---|---|
| D-1 ⬜ | **Layered CSS architecture.** `src/styles/` with `@layer reset, tokens, base, layout, components, pages, utilities`; one file per layer/component; `globals.css` only imports | Stylelint enforces layer membership; no selector is defined in two files (scripted check) |
| D-2 ⬜ | **Tokens v2.** OKLCH colours with `light-dark()`, fluid type and space scales (Utopia-style clamp), radius, elevation, motion, z-index; a `/lab/tokens` page renders every token in both themes | Contrast check script: every text/background token pair meets WCAG AA in both themes |
| D-3 ⬜ | **Primitives, test-first.** Button, Card, Badge, Avatar, EmptyState (ported) + Tabs, Dialog (`<dialog>`), Menu (Popover API), Field set (input, textarea, select, checkbox, radio, label, hint, error), Skeleton, Toast/Alert, StatTile, ListRow, Icon set, Tooltip | Each primitive has a unit test for keyboard and ARIA behaviour and a `/lab/components` entry with an axe pass; Radix Primitives may replace a native one only if its test cannot pass natively (PROPOSALS D-4) |
| D-4 ⬜ | **Two shells.** `PublicShell` (top bar, footer) and `AppShell` (sidebar, drawer) as route-group layouts `(public)` and `(app)` | Playwright: `/`, `/resume`, `/blog` render no sidebar; `/community`, `/account` do; both pass at 375 px |
| D-5 ⬜ | **Migrate page by page and delete as you go.** Pilot one page, review, then batch. Legacy and "revamp layer" rules are removed with each page | `globals.css` legacy sections are gone; total CSS shipped on `/` is under 30 KB gzipped; zero `!important` |
| D-6 ⬜ | **Motion and transitions.** View transitions between list and detail, focus-visible rings, hover = colour/elevation only, reduced-motion honoured | Playwright with `reducedMotion: 'reduce'` finds no running animations |

## M3 — The public face

| Id | Item | Done when |
|---|---|---|
| P-1 ⬜ | **Home** per VISION §3 | Above the fold at 1366×768 and 375×812 shows name, role, pitch, first work card, résumé and contact (screenshot test); LCP element is text or a sized image |
| P-2 ⬜ | **Case-study template and five studies**: this site, the home server, Here to Slay tabletop, capstone, iOS work | Each has all template sections, at least one diagram or screenshot, links, and `CreativeWork` structured data (👤 supplies facts and numbers; drafts are written from the repos and CV first) |
| P-3 ⬜ | **Résumé** re-set in the new system, print stylesheet, PDF link | `window.print()` layout fits one A4 page (Playwright PDF page count = 1) |
| P-4 ⬜ | **Blog**: reading time, table of contents, code highlighting at build time, RSS + JSON feed, previous/next, per-post social image | Feed validates; each post has an `og:image` that renders its title |
| P-5 ⬜ | **Small pages**: `/now`, `/uses`, `/colophon`, public `/changelog` (no open security items — CONTEXT §7) | Pages exist, are linked from the footer, and are in the sitemap |
| P-6 ⬜ | **Identity kit**: favicon, app icons, manifest, default OG image, dynamic OG for profiles, posts, games | Lighthouse "installable" basics pass; OG route unit-tested for long names |
| P-7 ⬜ | **Command menu** (Ctrl/⌘+K): pages, posts, games, members; keyboard-only operable | axe clean; works with JavaScript-disabled fallback link to `/search` |
| P-8 ⬜ | **SEO**: `Person`, `ProfilePage`, `BlogPosting`, `VideoGame` JSON-LD; canonical URLs; sitemap covers new routes; private surfaces `noindex` | Structured-data unit tests; Here to Slay play surfaces are `noindex` |

## M4 — Members and accounts

| Id | Item | Done when |
|---|---|---|
| A-1 ⬜ | **Profile as showcase** (VISION §4): header, pinned items, badges, games, posts | Works with an empty profile without looking broken (screenshot baseline for empty, sparse, full) |
| A-2 ⬜ | **Account area** on the new primitives: settings, profile editor with preview, security, activity | Every form shows inline errors tied by `aria-describedby`; e2e covers change password and delete account |
| A-3 ⬜ | **Stronger sign-in**: Turnstile on, two-factor (TOTP), passkeys, session list with revoke | e2e with a virtual authenticator registers and uses a passkey |
| A-4 ⬜ | **Admin** on the new primitives: responsive tables, user actions, audit log filters, server health and backup age | Usable at 375 px (no horizontal page scroll; tables scroll inside their card) |
| A-5 ⬜ | **Badges that mean something**, computed server-side from real events | Unit tests per badge rule |
| A-6 ⬜ | **Data export**: a member can download their posts and profile as JSON | e2e downloads and validates the file |

## M5 — Community, stage 1 (VISION §5)

| Id | Item | Done when |
|---|---|---|
| C-1 ⬜ | **Post permalinks** `/community/p/[id]` with social image and back link | A post URL shared while signed out renders the post |
| C-2 ⬜ | **Moderation minimums first**: report flow, admin queue, remove/restore, ban, public moderation log, new-account limits (links, images, rate) | e2e: report → queue → remove → appears in log; a new account's third post in a minute is refused in words a person would use |
| C-3 ⬜ | **Flat comments** on posts, same escape-before-format pipeline | XSS fixtures render inert (unit test) |
| C-4 ⬜ | **Reactions** (a small fixed set), shown without ranking anything | No count is displayed when it is zero |
| C-5 ⬜ | **Empty and sparse states** designed for 0 / 1 / 5 posts; "new since your last visit" marker | Screenshot baselines for all three |
| C-6 ⬜ | **Notifications, in-site only**: replies and mentions, a bell with a list, no email nagging | e2e: reply creates one notification; reading clears it |
| C-7 ⏸️ | **Stage 2**: threaded replies, topics, sort new/active | Parked until VISION §5's threshold is met |
| C-8 ⏸️ | **Stage 3**: votes, score, top sort, member moderators | Parked |

## M6 — Games hub

| Id | Item | Done when |
|---|---|---|
| H-1 ⬜ | **Game pages** per VISION §6: description, screenshots, how to play, tech, devlog, play button | Signed-out visitors see the full page and a clear sign-in-to-play state |
| H-2 ⬜ | **Devlogs**: dated entries per game (markdown or admin-authored), on the game page, home and RSS | Feed includes devlog entries |
| H-3 ⬜ | **Match and session history**: the lobby reports finished rooms over a signed server-to-server call; DD Project records sessions; shown on profiles | Java + TS tests: an unsigned or replayed report is rejected |
| H-4 ⬜ | **Lobby polish** for Here to Slay rooms: room list for members of a room, reconnect, copy-invite, presence | e2e with two browser contexts joins the same room |
| H-5 ⬜ | **Here to Slay canvas client**: responsive board, readable cards on a laptop, card-move feedback (`game-ui-ux`, `game-feel`) | Written acceptance list verified in the running lobby; canvas never overflows at 1024 px |
| H-6 ⬜ | **DD Project player**: fixed-aspect container, fullscreen, controls hint, focus capture and release | `scripts/testing/dd-project-smoke.mjs` passes and is wired as `npm run smoke:dd` |
| H-7 ⏸️ | **One leaderboard per game**, server-observed results only | Parked until ≥ 20 finished matches by ≥ 5 members exist |

## M7 — Launch quality

| Id | Item | Done when |
|---|---|---|
| L-1 ⬜ | **Accessibility pass**: keyboard-only walkthrough of every flow, screen-reader labels, contrast, reduced motion | Zero serious/critical axe issues on all routes; the walkthrough checklist is committed with results |
| L-2 ⬜ | **Performance budgets** enforced: JS per public route < 120 KB, CSS < 30 KB gz, images AVIF/WebP and sized | A build script fails the gate when a budget is exceeded |
| L-3 ⬜ | **Content pass**: every page's copy read aloud once; no placeholder text; dates absolute | A grep for "lorem", "TODO", "coming soon" in `src/` and `content/` returns nothing |
| L-4 ⬜ | **Docs true to the system**: README, CONTEXT, `/colophon`, `docs/SETUP-OWNER.md` | `gsd-doc-verifier` finds no false claims |
| L-5 👤 | **Release v1.0**: owner deploys, tags, announces | The tag exists and the site serves the release id on `/api/health` |

---

## Parked — never built until the owner unparks (⏸️ → ⬜)

- **W-1 Workout planner.** Needs its own vision section, data model and routes first.
- **W-2 Direct messages.** After community stage 2.
- **W-3 Portal to Immich / Nextcloud** and single sign-on through a real identity provider (Pocket ID or Authentik — CONTEXT §3).
- **W-4 Webring / guest links page.**
- **W-5 Second game service host** (moving the lobby off the home VM).

## Not planned

Follower counts, engagement feeds, email digests, ads, a mobile app, a custom
photo/file store, Tailwind or any CSS framework, a self-hosted CI runner on the
public repository.
