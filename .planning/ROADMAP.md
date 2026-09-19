# Roadmap: miguisanson.dev

## Overview

v0.8 is a full revamp of a working site: make the repo safe to build in (M0),
make the home server survive (M1), rebuild the design system (M2), then the
public face, members, community, games and launch quality (M3–M7). Every phase
below is exactly one `docs/ROADMAP.md` row.

**`docs/ROADMAP.md` remains the single source of truth for scope and order.**
This file tracks GSD execution against it and must never invent scope or
reorder work; each phase keeps its roadmap id and links back for the full
"Done when". The project finishes at Phase 61 / L-5.

## Milestones

- 🚧 **M0 — Ground: make the repo safe to build in** — Phases 1-11 (1/11 done)
- 📋 **M1 — Operations: a home server that survives** — Phases 12-21 (0/10 done)
- 📋 **M2 — Design system rebuild** — Phases 22-27 (0/6 done)
- 📋 **M3 — The public face** — Phases 28-35 (0/8 done)
- 📋 **M4 — Members and accounts** — Phases 36-41 (0/6 done)
- 📋 **M5 — Community, stage 1 (VISION §5)** — Phases 42-49 (0/8 done)
- 📋 **M6 — Games hub** — Phases 50-56 (0/7 done)
- 📋 **M7 — Launch quality** — Phases 57-61 (0/5 done)

**Phase Numbering:** integer phases are roadmap rows in milestone order. Decimal
phases (N.1) are urgent insertions (`/gsd-phase --insert`); none exist yet.

## Phases

#### M0 — Ground: make the repo safe to build in (Phases 1-11)

- [x] **Phase 1: G-1 — One branch, one truth**
- [ ] **Phase 2: G-2 — Bring the site back up** (owner queue)
- [ ] **Phase 3: G-11 — Dependency audit back to zero**
- [ ] **Phase 4: G-3 — Unit test runner**
- [ ] **Phase 5: G-4 — Browser tests**
- [ ] **Phase 6: G-5 — Accessibility and layout checks**
- [ ] **Phase 7: G-6 — Lint and one gate**
- [ ] **Phase 8: G-7 — Java tests stop being skipped**
- [ ] **Phase 9: G-8 — Environment validation**
- [ ] **Phase 10: G-9 — CI on GitHub's runners**
- [ ] **Phase 11: G-10 — Git hooks**

#### M1 — Operations: a home server that survives (Phases 12-21)

- [ ] **Phase 12: O-1 — Standalone build, release folders, instant rollback**
- [ ] **Phase 13: O-2 — systemd units in `deploy/`**
- [ ] **Phase 14: O-3 — Backups off the machine**
- [ ] **Phase 15: O-4 — Health and uptime**
- [ ] **Phase 16: O-5 — Real client IP**
- [ ] **Phase 17: O-6 — Uploads made safe**
- [ ] **Phase 18: O-7 — CSP enforced**
- [ ] **Phase 19: O-8 — Errors and analytics, privately**
- [ ] **Phase 20: O-9 — Staging**
- [ ] **Phase 21: O-10 — Pull-based deploy (optional)**

#### M2 — Design system rebuild (Phases 22-27)

- [ ] **Phase 22: D-1 — Layered CSS architecture**
- [ ] **Phase 23: D-2 — Tokens v2**
- [ ] **Phase 24: D-3 — Primitives, test-first**
- [ ] **Phase 25: D-4 — Two shells**
- [ ] **Phase 26: D-5 — Migrate page by page and delete as you go**
- [ ] **Phase 27: D-6 — Motion and transitions**

#### M3 — The public face (Phases 28-35)

- [ ] **Phase 28: P-1 — Home**
- [ ] **Phase 29: P-2 — Case-study template and five studies**
- [ ] **Phase 30: P-3 — Résumé**
- [ ] **Phase 31: P-4 — Blog**
- [ ] **Phase 32: P-5 — Small pages**
- [ ] **Phase 33: P-6 — Identity kit**
- [ ] **Phase 34: P-7 — Command menu**
- [ ] **Phase 35: P-8 — SEO**

#### M4 — Members and accounts (Phases 36-41)

- [ ] **Phase 36: A-1 — Profile as showcase**
- [ ] **Phase 37: A-2 — Account area**
- [ ] **Phase 38: A-3 — Stronger sign-in**
- [ ] **Phase 39: A-4 — Admin**
- [ ] **Phase 40: A-5 — Badges that mean something**
- [ ] **Phase 41: A-6 — Data export**

#### M5 — Community, stage 1 (VISION §5) (Phases 42-49)

- [ ] **Phase 42: C-1 — Post permalinks**
- [ ] **Phase 43: C-2 — Moderation minimums first**
- [ ] **Phase 44: C-3 — Flat comments**
- [ ] **Phase 45: C-4 — Reactions**
- [ ] **Phase 46: C-5 — Empty and sparse states**
- [ ] **Phase 47: C-6 — Notifications, in-site only**
- [ ] **Phase 48: C-7 — Stage 2** (parked)
- [ ] **Phase 49: C-8 — Stage 3** (parked)

#### M6 — Games hub (Phases 50-56)

- [ ] **Phase 50: H-1 — Game pages**
- [ ] **Phase 51: H-2 — Devlogs**
- [ ] **Phase 52: H-3 — Match and session history**
- [ ] **Phase 53: H-4 — Lobby polish**
- [ ] **Phase 54: H-5 — Here to Slay canvas client**
- [ ] **Phase 55: H-6 — DD Project player**
- [ ] **Phase 56: H-7 — One leaderboard per game** (parked)

#### M7 — Launch quality (Phases 57-61)

- [ ] **Phase 57: L-1 — Accessibility pass**
- [ ] **Phase 58: L-2 — Performance budgets**
- [ ] **Phase 59: L-3 — Content pass**
- [ ] **Phase 60: L-4 — Docs true to the system**
- [ ] **Phase 61: L-5 — Release v1.0** (owner queue)

## Phase Details

### Phase 1: G-1 — One branch, one truth
**Goal**: One branch, one truth. `v0.8` from `v0.7`, dev kit restored, docs written, `.planning/` seeded
**Depends on**: Nothing
**Requirements**: G-1
**Success Criteria** (what must be TRUE):
  1. `git log v0.8` contains the v0.7 revamp and the kit; `docs/VISION.md`, `ROADMAP.md`, `REFERENCES.md`, `PROPOSALS.md` exist; `/continue_live-miguisanson-dev` reads them
**Plans**: Complete (pre-GSD)
**Roadmap ref**: docs/ROADMAP.md → M0 → G-1

### Phase 2: G-2 — Bring the site back up
**Goal**: Bring the site back up. `cloudflared` as a systemd service with `Restart=always`; the app's service enabled at boot
**Depends on**: Phase 1
**Requirements**: G-2
**Success Criteria** (what must be TRUE):
  1. `curl -sI https://miguisanson.dev` returns 200 after a VM reboot with nobody logged in. Steps are in `docs/SETUP-OWNER.md`
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M0 → G-2

### Phase 3: G-11 — Dependency audit back to zero
**Goal**: Dependency audit back to zero. `npm audit --omit=dev` reported 2 on 2026-09-20 (`nodemailer` high, `baseline-browser-mapping` moderate). Upgrade, read the changelog for breaking changes in the mail path
**Depends on**: Phase 1
**Requirements**: G-11
**Success Criteria** (what must be TRUE):
  1. `npm audit --omit=dev` reports 0; typecheck and build green; the dev mail path (verification link logged to the terminal) still works — done before G-3 because it is small and it is mail security
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M0 → G-11

### Phase 4: G-3 — Unit test runner
**Goal**: Unit test runner. Vitest + Testing Library; `npm test`; first tests cover `src/lib/account-policy.ts`, `content.ts` (escape-before-format), `game-tickets.ts`, `game-rooms.ts`, and `scripts/autopilot-lib.mjs`
**Depends on**: Phase 3
**Requirements**: G-3
**Success Criteria** (what must be TRUE):
  1. `npm test` runs green in under 20 s; deleting the escape call in `markdownToHtml` turns a test red
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M0 → G-3

### Phase 5: G-4 — Browser tests
**Goal**: Browser tests. Playwright against `next build && next start` with a throwaway SQLite file; signed-in state reused via `storageState`; verification mail captured, never sent; `@smoke` tag for the fast subset
**Depends on**: Phase 4
**Requirements**: G-4
**Success Criteria** (what must be TRUE):
  1. `npm run test:e2e` signs up, verifies, logs in, posts, and launches a game page; `npm run smoke` finishes in under 90 s
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M0 → G-4

### Phase 6: G-5 — Accessibility and layout checks
**Goal**: Accessibility and layout checks inside Playwright: axe on every route; no horizontal overflow at 375 / 768 / 1024 / 1440; screenshot baselines for the public pages
**Depends on**: Phase 5
**Requirements**: G-5
**Success Criteria** (what must be TRUE):
  1. A deliberately too-wide element or a missing label fails the suite
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M0 → G-5

### Phase 7: G-6 — Lint and one gate
**Goal**: Lint and one gate. ESLint flat config (`eslint-config-next`), Stylelint for CSS (bans `!important` and raw colours outside the token layer), Knip report, `npm run gate` = typecheck → lint → test → build → smoke
**Depends on**: Phase 6
**Requirements**: G-6
**Success Criteria** (what must be TRUE):
  1. `npm run gate` exists and is green; adding `!important` or `#fff` in a component layer fails lint
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M0 → G-6

### Phase 8: G-7 — Java tests stop being skipped
**Goal**: Java tests stop being skipped. `npm run game:test`; room isolation and ticket expiry covered
**Depends on**: Phase 7
**Requirements**: G-7
**Success Criteria** (what must be TRUE):
  1. `mvn test` runs from an npm script and is part of the gate when `games/here-to-slay/**` changed
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M0 → G-7

### Phase 9: G-8 — Environment validation
**Goal**: Environment validation. One typed module reads and validates env at boot; production refuses to start without mail, secrets, Turnstile
**Depends on**: Phase 8
**Requirements**: G-8
**Success Criteria** (what must be TRUE):
  1. Starting with a missing `BETTER_AUTH_SECRET` exits with a plain message naming the variable; unit-tested
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M0 → G-8

### Phase 10: G-9 — CI on GitHub's runners
**Goal**: CI on GitHub's runners (never a self-hosted runner on this public repo): gate + `npm audit --omit=dev`; Dependabot; secret scanning on
**Depends on**: Phase 9
**Requirements**: G-9
**Success Criteria** (what must be TRUE):
  1. A pull request with a failing test shows a red check; the workflow never receives a production secret
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M0 → G-9

### Phase 11: G-10 — Git hooks
**Goal**: Git hooks (lefthook): pre-commit typecheck + lint on staged files; pre-push gate
**Depends on**: Phase 10
**Requirements**: G-10
**Success Criteria** (what must be TRUE):
  1. A commit that adds a type error is refused locally
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M0 → G-10

### Phase 12: O-1 — Standalone build, release folders, instant rollback
**Goal**: Standalone build, release folders, instant rollback. `output: "standalone"`; `deploy.sh` builds into `releases/<sha>`, copies `public/` and `.next/static`, health-checks on a spare port, swaps a `current` symlink, restarts; `rollback.sh` points back
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6)
**Requirements**: O-1
**Success Criteria** (what must be TRUE):
  1. `DRY_RUN=1 ./scripts/deploy.sh` prints the plan; a failing health check leaves `current` untouched; `rollback.sh` restores the previous release in under 10 s (shell-tested with bats or a Node test using a temp dir)
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M1 → O-1

### Phase 13: O-2 — systemd units in `deploy/`
**Goal**: systemd units in `deploy/` for web, lobby and `cloudflared`, with `Restart=always`, `TimeoutStopSec=30`, a non-root user, hardening flags
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 12
**Requirements**: O-2
**Success Criteria** (what must be TRUE):
  1. `systemd-analyze verify` passes on all units in CI
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M1 → O-2

### Phase 14: O-3 — Backups off the machine
**Goal**: Backups off the machine. Nightly `pg_dump` + uploads → restic → Cloudflare R2; 7 daily / 4 weekly; `restore-drill.sh` restores into a scratch database and compares row counts
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 13
**Requirements**: O-3
**Success Criteria** (what must be TRUE):
  1. The drill script exits 0 against a local Postgres container; the last successful backup time is shown on `/admin`
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M1 → O-3

### Phase 15: O-4 — Health and uptime
**Goal**: Health and uptime. `/api/health` (app, database, lobby reachability, disk free, last backup age); external uptime check on both hostnames (👤 creates the monitor)
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 14
**Requirements**: O-4
**Success Criteria** (what must be TRUE):
  1. The endpoint returns 503 with a reason when the database is unreachable; tested
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M1 → O-4

### Phase 16: O-5 — Real client IP
**Goal**: Real client IP. Rate limits and the audit log use `CF-Connecting-IP`, trusted only when the request came through the tunnel
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 15
**Requirements**: O-5
**Success Criteria** (what must be TRUE):
  1. Unit test: a spoofed header from a non-tunnel request is ignored
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M1 → O-5

### Phase 17: O-6 — Uploads made safe
**Goal**: Uploads made safe. Re-encode with `sharp` (strips EXIF), sniff the real type, cap dimensions, per-account quota, delete superseded avatars; stay under Cloudflare's 100 MB request cap
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 16
**Requirements**: O-6
**Success Criteria** (what must be TRUE):
  1. Uploading a `.png` that is really HTML is rejected; an image with GPS EXIF comes back without it
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M1 → O-6

### Phase 18: O-7 — CSP enforced
**Goal**: CSP enforced. Move from Report-Only to enforcing without nonces on static public pages (hash/SRI route); nonce only where a page is already dynamic; the DD Project route keeps its own policy
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 17
**Requirements**: O-7
**Success Criteria** (what must be TRUE):
  1. Playwright loads every route with zero CSP violations logged; the public pages stay statically rendered (checked in the build output)
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M1 → O-7

### Phase 19: O-8 — Errors and analytics, privately
**Goal**: Errors and analytics, privately. Error reports to a self-hosted GlitchTip or a log file viewer on `/admin`; Cloudflare Web Analytics (no cookies)
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 18
**Requirements**: O-8
**Success Criteria** (what must be TRUE):
  1. A thrown test error appears in the admin view with route and release id
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M1 → O-8

### Phase 20: O-9 — Staging
**Goal**: Staging. `staging.miguisanson.dev` behind Cloudflare Access, same deploy script, separate env and database (👤 creates the Access policy)
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 19
**Requirements**: O-9
**Success Criteria** (what must be TRUE):
  1. `deploy.sh --target staging` documented and dry-run tested
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M1 → O-9

### Phase 21: O-10 — Pull-based deploy (optional)
**Goal**: Pull-based deploy (optional). A systemd timer on the server checks for a signed tag `deploy/*` and runs `deploy.sh`; nothing inbound, no standing credential in GitHub
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 20
**Requirements**: O-10
**Success Criteria** (what must be TRUE):
  1. Dry-run test: an unsigned tag is ignored
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M1 → O-10

### Phase 22: D-1 — Layered CSS architecture
**Goal**: Layered CSS architecture. `src/styles/` with `@layer reset, tokens, base, layout, components, pages, utilities`; one file per layer/component; `globals.css` only imports
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6)
**Requirements**: D-1
**Success Criteria** (what must be TRUE):
  1. Stylelint enforces layer membership; no selector is defined in two files (scripted check)
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M2 → D-1

### Phase 23: D-2 — Tokens v2
**Goal**: Tokens v2. OKLCH colours with `light-dark()`, fluid type and space scales (Utopia-style clamp), radius, elevation, motion, z-index; a `/lab/tokens` page renders every token in both themes
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 22
**Requirements**: D-2
**Success Criteria** (what must be TRUE):
  1. Contrast check script: every text/background token pair meets WCAG AA in both themes
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M2 → D-2

### Phase 24: D-3 — Primitives, test-first
**Goal**: Primitives, test-first. Button, Card, Badge, Avatar, EmptyState (ported) + Tabs, Dialog (`<dialog>`), Menu (Popover API), Field set (input, textarea, select, checkbox, radio, label, hint, error), Skeleton, Toast/Alert, StatTile, ListRow, Icon set, Tooltip
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 23
**Requirements**: D-3
**Success Criteria** (what must be TRUE):
  1. Each primitive has a unit test for keyboard and ARIA behaviour and a `/lab/components` entry with an axe pass; Radix Primitives may replace a native one only if its test cannot pass natively (PROPOSALS D-4)
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M2 → D-3

### Phase 25: D-4 — Two shells
**Goal**: Two shells. `PublicShell` (top bar, footer) and `AppShell` (sidebar, drawer) as route-group layouts `(public)` and `(app)`
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 24
**Requirements**: D-4
**Success Criteria** (what must be TRUE):
  1. Playwright: `/`, `/resume`, `/blog` render no sidebar; `/community`, `/account` do; both pass at 375 px
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M2 → D-4

### Phase 26: D-5 — Migrate page by page and delete as you go
**Goal**: Migrate page by page and delete as you go. Pilot one page, review, then batch. Legacy and "revamp layer" rules are removed with each page
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 25
**Requirements**: D-5
**Success Criteria** (what must be TRUE):
  1. `globals.css` legacy sections are gone; total CSS shipped on `/` is under 30 KB gzipped; zero `!important`
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M2 → D-5

### Phase 27: D-6 — Motion and transitions
**Goal**: Motion and transitions. View transitions between list and detail, focus-visible rings, hover = colour/elevation only, reduced-motion honoured
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 26
**Requirements**: D-6
**Success Criteria** (what must be TRUE):
  1. Playwright with `reducedMotion: 'reduce'` finds no running animations
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M2 → D-6

### Phase 28: P-1 — Home
**Goal**: Home per VISION §3
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6)
**Requirements**: P-1
**Success Criteria** (what must be TRUE):
  1. Above the fold at 1366×768 and 375×812 shows name, role, pitch, first work card, résumé and contact (screenshot test); LCP element is text or a sized image
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M3 → P-1

### Phase 29: P-2 — Case-study template and five studies
**Goal**: Case-study template and five studies: this site, the home server, Here to Slay tabletop, capstone, iOS work
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 28
**Requirements**: P-2
**Success Criteria** (what must be TRUE):
  1. Each has all template sections, at least one diagram or screenshot, links, and `CreativeWork` structured data (👤 supplies facts and numbers; drafts are written from the repos and CV first)
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M3 → P-2

### Phase 30: P-3 — Résumé
**Goal**: Résumé re-set in the new system, print stylesheet, PDF link
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 29
**Requirements**: P-3
**Success Criteria** (what must be TRUE):
  1. `window.print()` layout fits one A4 page (Playwright PDF page count = 1)
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M3 → P-3

### Phase 31: P-4 — Blog
**Goal**: Blog: reading time, table of contents, code highlighting at build time, RSS + JSON feed, previous/next, per-post social image
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 30
**Requirements**: P-4
**Success Criteria** (what must be TRUE):
  1. Feed validates; each post has an `og:image` that renders its title
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M3 → P-4

### Phase 32: P-5 — Small pages
**Goal**: Small pages: `/now`, `/uses`, `/colophon`, public `/changelog` (no open security items — CONTEXT §7)
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 31
**Requirements**: P-5
**Success Criteria** (what must be TRUE):
  1. Pages exist, are linked from the footer, and are in the sitemap
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M3 → P-5

### Phase 33: P-6 — Identity kit
**Goal**: Identity kit: favicon, app icons, manifest, default OG image, dynamic OG for profiles, posts, games
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 32
**Requirements**: P-6
**Success Criteria** (what must be TRUE):
  1. Lighthouse "installable" basics pass; OG route unit-tested for long names
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M3 → P-6

### Phase 34: P-7 — Command menu
**Goal**: Command menu (Ctrl/⌘+K): pages, posts, games, members; keyboard-only operable
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 33
**Requirements**: P-7
**Success Criteria** (what must be TRUE):
  1. axe clean; works with JavaScript-disabled fallback link to `/search`
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M3 → P-7

### Phase 35: P-8 — SEO
**Goal**: SEO: `Person`, `ProfilePage`, `BlogPosting`, `VideoGame` JSON-LD; canonical URLs; sitemap covers new routes; private surfaces `noindex`
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 34
**Requirements**: P-8
**Success Criteria** (what must be TRUE):
  1. Structured-data unit tests; Here to Slay play surfaces are `noindex`
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M3 → P-8

### Phase 36: A-1 — Profile as showcase
**Goal**: Profile as showcase (VISION §4): header, pinned items, badges, games, posts
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6)
**Requirements**: A-1
**Success Criteria** (what must be TRUE):
  1. Works with an empty profile without looking broken (screenshot baseline for empty, sparse, full)
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M4 → A-1

### Phase 37: A-2 — Account area
**Goal**: Account area on the new primitives: settings, profile editor with preview, security, activity
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 36
**Requirements**: A-2
**Success Criteria** (what must be TRUE):
  1. Every form shows inline errors tied by `aria-describedby`; e2e covers change password and delete account
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M4 → A-2

### Phase 38: A-3 — Stronger sign-in
**Goal**: Stronger sign-in: Turnstile on, two-factor (TOTP), passkeys, session list with revoke
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 37
**Requirements**: A-3
**Success Criteria** (what must be TRUE):
  1. e2e with a virtual authenticator registers and uses a passkey
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M4 → A-3

### Phase 39: A-4 — Admin
**Goal**: Admin on the new primitives: responsive tables, user actions, audit log filters, server health and backup age
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 38
**Requirements**: A-4
**Success Criteria** (what must be TRUE):
  1. Usable at 375 px (no horizontal page scroll; tables scroll inside their card)
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M4 → A-4

### Phase 40: A-5 — Badges that mean something
**Goal**: Badges that mean something, computed server-side from real events
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 39
**Requirements**: A-5
**Success Criteria** (what must be TRUE):
  1. Unit tests per badge rule
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M4 → A-5

### Phase 41: A-6 — Data export
**Goal**: Data export: a member can download their posts and profile as JSON
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 40
**Requirements**: A-6
**Success Criteria** (what must be TRUE):
  1. e2e downloads and validates the file
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M4 → A-6

### Phase 42: C-1 — Post permalinks
**Goal**: Post permalinks `/community/p/[id]` with social image and back link
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6)
**Requirements**: C-1
**Success Criteria** (what must be TRUE):
  1. A post URL shared while signed out renders the post
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M5 → C-1

### Phase 43: C-2 — Moderation minimums first
**Goal**: Moderation minimums first: report flow, admin queue, remove/restore, ban, public moderation log, new-account limits (links, images, rate)
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 42
**Requirements**: C-2
**Success Criteria** (what must be TRUE):
  1. e2e: report → queue → remove → appears in log; a new account's third post in a minute is refused in words a person would use
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M5 → C-2

### Phase 44: C-3 — Flat comments
**Goal**: Flat comments on posts, same escape-before-format pipeline
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 43
**Requirements**: C-3
**Success Criteria** (what must be TRUE):
  1. XSS fixtures render inert (unit test)
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M5 → C-3

### Phase 45: C-4 — Reactions
**Goal**: Reactions (a small fixed set), shown without ranking anything
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 44
**Requirements**: C-4
**Success Criteria** (what must be TRUE):
  1. No count is displayed when it is zero
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M5 → C-4

### Phase 46: C-5 — Empty and sparse states
**Goal**: Empty and sparse states designed for 0 / 1 / 5 posts; "new since your last visit" marker
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 45
**Requirements**: C-5
**Success Criteria** (what must be TRUE):
  1. Screenshot baselines for all three
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M5 → C-5

### Phase 47: C-6 — Notifications, in-site only
**Goal**: Notifications, in-site only: replies and mentions, a bell with a list, no email nagging
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 46
**Requirements**: C-6
**Success Criteria** (what must be TRUE):
  1. e2e: reply creates one notification; reading clears it
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M5 → C-6

### Phase 48: C-7 — Stage 2
**Goal**: Stage 2: threaded replies, topics, sort new/active
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 47
**Requirements**: C-7
**Success Criteria** (what must be TRUE):
  1. Parked until VISION §5's threshold is met
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M5 → C-7

### Phase 49: C-8 — Stage 3
**Goal**: Stage 3: votes, score, top sort, member moderators
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 48
**Requirements**: C-8
**Success Criteria** (what must be TRUE):
  1. Parked
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M5 → C-8

### Phase 50: H-1 — Game pages
**Goal**: Game pages per VISION §6: description, screenshots, how to play, tech, devlog, play button
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6)
**Requirements**: H-1
**Success Criteria** (what must be TRUE):
  1. Signed-out visitors see the full page and a clear sign-in-to-play state
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M6 → H-1

### Phase 51: H-2 — Devlogs
**Goal**: Devlogs: dated entries per game (markdown or admin-authored), on the game page, home and RSS
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 50
**Requirements**: H-2
**Success Criteria** (what must be TRUE):
  1. Feed includes devlog entries
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M6 → H-2

### Phase 52: H-3 — Match and session history
**Goal**: Match and session history: the lobby reports finished rooms over a signed server-to-server call; DD Project records sessions; shown on profiles
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 51
**Requirements**: H-3
**Success Criteria** (what must be TRUE):
  1. Java + TS tests: an unsigned or replayed report is rejected
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M6 → H-3

### Phase 53: H-4 — Lobby polish
**Goal**: Lobby polish for Here to Slay rooms: room list for members of a room, reconnect, copy-invite, presence
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 52
**Requirements**: H-4
**Success Criteria** (what must be TRUE):
  1. e2e with two browser contexts joins the same room
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M6 → H-4

### Phase 54: H-5 — Here to Slay canvas client
**Goal**: Here to Slay canvas client: responsive board, readable cards on a laptop, card-move feedback (`game-ui-ux`, `game-feel`)
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 53
**Requirements**: H-5
**Success Criteria** (what must be TRUE):
  1. Written acceptance list verified in the running lobby; canvas never overflows at 1024 px
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M6 → H-5

### Phase 55: H-6 — DD Project player
**Goal**: DD Project player: fixed-aspect container, fullscreen, controls hint, focus capture and release
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 54
**Requirements**: H-6
**Success Criteria** (what must be TRUE):
  1. `scripts/testing/dd-project-smoke.mjs` passes and is wired as `npm run smoke:dd`
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M6 → H-6

### Phase 56: H-7 — One leaderboard per game
**Goal**: One leaderboard per game, server-observed results only
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 55
**Requirements**: H-7
**Success Criteria** (what must be TRUE):
  1. Parked until ≥ 20 finished matches by ≥ 5 members exist
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M6 → H-7

### Phase 57: L-1 — Accessibility pass
**Goal**: Accessibility pass: keyboard-only walkthrough of every flow, screen-reader labels, contrast, reduced motion
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6)
**Requirements**: L-1
**Success Criteria** (what must be TRUE):
  1. Zero serious/critical axe issues on all routes; the walkthrough checklist is committed with results
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M7 → L-1

### Phase 58: L-2 — Performance budgets
**Goal**: Performance budgets enforced: JS per public route < 120 KB, CSS < 30 KB gz, images AVIF/WebP and sized
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 57
**Requirements**: L-2
**Success Criteria** (what must be TRUE):
  1. A build script fails the gate when a budget is exceeded
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M7 → L-2

### Phase 59: L-3 — Content pass
**Goal**: Content pass: every page's copy read aloud once; no placeholder text; dates absolute
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 58
**Requirements**: L-3
**Success Criteria** (what must be TRUE):
  1. A grep for "lorem", "TODO", "coming soon" in `src/` and `content/` returns nothing
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M7 → L-3

### Phase 60: L-4 — Docs true to the system
**Goal**: Docs true to the system: README, CONTEXT, `/colophon`, `docs/SETUP-OWNER.md`
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 59
**Requirements**: L-4
**Success Criteria** (what must be TRUE):
  1. `gsd-doc-verifier` finds no false claims
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M7 → L-4

### Phase 61: L-5 — Release v1.0
**Goal**: Release v1.0: owner deploys, tags, announces
**Depends on**: Phase 4 (G-3), Phase 5 (G-4), Phase 6 (G-5), Phase 7 (G-6); Phase 60
**Requirements**: L-5
**Success Criteria** (what must be TRUE):
  1. The tag exists and the site serves the release id on `/api/health`
**Plans**: TBD
**Roadmap ref**: docs/ROADMAP.md → M7 → L-5

## Progress

**Execution Order:** numeric. M0 rows run strictly one at a time with no parallel
packets until G-3…G-6 are complete (AGENTS.md). Parked and owner-queue phases
are skipped, never waited on.

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|-----------------|--------|-----------|
| 1. G-1 One branch, one truth | M0 | - | Complete | 2026-09-20 |
| 2. G-2 Bring the site back up | M0 | 0/TBD | Owner queue | - |
| 3. G-11 Dependency audit back to zero | M0 | 0/TBD | Not started | - |
| 4. G-3 Unit test runner | M0 | 0/TBD | Not started | - |
| 5. G-4 Browser tests | M0 | 0/TBD | Not started | - |
| 6. G-5 Accessibility and layout checks | M0 | 0/TBD | Not started | - |
| 7. G-6 Lint and one gate | M0 | 0/TBD | Not started | - |
| 8. G-7 Java tests stop being skipped | M0 | 0/TBD | Not started | - |
| 9. G-8 Environment validation | M0 | 0/TBD | Not started | - |
| 10. G-9 CI on GitHub's runners | M0 | 0/TBD | Not started | - |
| 11. G-10 Git hooks | M0 | 0/TBD | Not started | - |
| 12. O-1 Standalone build, release folders, instant rollback | M1 | 0/TBD | Not started | - |
| 13. O-2 systemd units in `deploy/` | M1 | 0/TBD | Not started | - |
| 14. O-3 Backups off the machine | M1 | 0/TBD | Not started | - |
| 15. O-4 Health and uptime | M1 | 0/TBD | Not started | - |
| 16. O-5 Real client IP | M1 | 0/TBD | Not started | - |
| 17. O-6 Uploads made safe | M1 | 0/TBD | Not started | - |
| 18. O-7 CSP enforced | M1 | 0/TBD | Not started | - |
| 19. O-8 Errors and analytics, privately | M1 | 0/TBD | Not started | - |
| 20. O-9 Staging | M1 | 0/TBD | Not started | - |
| 21. O-10 Pull-based deploy (optional) | M1 | 0/TBD | Not started | - |
| 22. D-1 Layered CSS architecture | M2 | 0/TBD | Not started | - |
| 23. D-2 Tokens v2 | M2 | 0/TBD | Not started | - |
| 24. D-3 Primitives, test-first | M2 | 0/TBD | Not started | - |
| 25. D-4 Two shells | M2 | 0/TBD | Not started | - |
| 26. D-5 Migrate page by page and delete as you go | M2 | 0/TBD | Not started | - |
| 27. D-6 Motion and transitions | M2 | 0/TBD | Not started | - |
| 28. P-1 Home | M3 | 0/TBD | Not started | - |
| 29. P-2 Case-study template and five studies | M3 | 0/TBD | Not started | - |
| 30. P-3 Résumé | M3 | 0/TBD | Not started | - |
| 31. P-4 Blog | M3 | 0/TBD | Not started | - |
| 32. P-5 Small pages | M3 | 0/TBD | Not started | - |
| 33. P-6 Identity kit | M3 | 0/TBD | Not started | - |
| 34. P-7 Command menu | M3 | 0/TBD | Not started | - |
| 35. P-8 SEO | M3 | 0/TBD | Not started | - |
| 36. A-1 Profile as showcase | M4 | 0/TBD | Not started | - |
| 37. A-2 Account area | M4 | 0/TBD | Not started | - |
| 38. A-3 Stronger sign-in | M4 | 0/TBD | Not started | - |
| 39. A-4 Admin | M4 | 0/TBD | Not started | - |
| 40. A-5 Badges that mean something | M4 | 0/TBD | Not started | - |
| 41. A-6 Data export | M4 | 0/TBD | Not started | - |
| 42. C-1 Post permalinks | M5 | 0/TBD | Not started | - |
| 43. C-2 Moderation minimums first | M5 | 0/TBD | Not started | - |
| 44. C-3 Flat comments | M5 | 0/TBD | Not started | - |
| 45. C-4 Reactions | M5 | 0/TBD | Not started | - |
| 46. C-5 Empty and sparse states | M5 | 0/TBD | Not started | - |
| 47. C-6 Notifications, in-site only | M5 | 0/TBD | Not started | - |
| 48. C-7 Stage 2 | M5 | 0/TBD | Parked | - |
| 49. C-8 Stage 3 | M5 | 0/TBD | Parked | - |
| 50. H-1 Game pages | M6 | 0/TBD | Not started | - |
| 51. H-2 Devlogs | M6 | 0/TBD | Not started | - |
| 52. H-3 Match and session history | M6 | 0/TBD | Not started | - |
| 53. H-4 Lobby polish | M6 | 0/TBD | Not started | - |
| 54. H-5 Here to Slay canvas client | M6 | 0/TBD | Not started | - |
| 55. H-6 DD Project player | M6 | 0/TBD | Not started | - |
| 56. H-7 One leaderboard per game | M6 | 0/TBD | Parked | - |
| 57. L-1 Accessibility pass | M7 | 0/TBD | Not started | - |
| 58. L-2 Performance budgets | M7 | 0/TBD | Not started | - |
| 59. L-3 Content pass | M7 | 0/TBD | Not started | - |
| 60. L-4 Docs true to the system | M7 | 0/TBD | Not started | - |
| 61. L-5 Release v1.0 | M7 | 0/TBD | Owner queue | - |
