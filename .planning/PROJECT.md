# miguisanson.dev

## What This Is

Migui's personal site: one Next.js 16 application that is a portfolio, an
accounts system with public profiles, a small community and a browser-games
hub, with a separate Java/Spring Boot WebSocket lobby for Here to Slay. It is
self-hosted on an Ubuntu VM (Proxmox mini PC) and published only through a
Cloudflare Tunnel at https://miguisanson.dev. The repository is public.

## Core Value

A developer's home on the internet that a recruiter understands in ten seconds
and a friend stays on for an hour — self-hosted, test-first, and itself the
flagship project.

**Success metric:** v1.0 released by the owner (docs/ROADMAP.md L-5): the site
stays up across a reboot, restores from backup, passes `npm run gate` and the
full browser suite, and a stranger can say who Migui is and what he built
within ten seconds of landing on `/`.

## Requirements

Full list with ids: `.planning/REQUIREMENTS.md`. The authoritative work queue,
with every row's "Done when", is `docs/ROADMAP.md` — this section only
summarises it.

### Validated

<!-- Shipped through v0.7 (2026-08-31); history in docs/ROADMAP-v0.7.md. -->

- Next.js 16 App Router, React 19, TypeScript strict; Hugo fully removed
- Better Auth: email + username, verification, reset, rate limits, audit log;
  SQLite (dev) / PostgreSQL (prod) through one Kysely layer; admin dashboard
- Token layer, three type roles, first primitives (Button, Card, Badge, Avatar,
  EmptyState), app shell, 375 px verified
- Home hub, games index, blog (markdown + admin-authored), community feed with
  image attachments, members directory, public profiles with badges, uploads
  and privacy
- Here to Slay private rooms with signed tickets; DD Project HTML5 player with
  account-isolated saves
- Security baseline: parameterised SQL, escape-before-format, session and
  ownership checks, media path guard, security headers, CSP Report-Only
- G-1: `v0.8` branch, dev kit, vision / roadmap / references / proposals

### Active

- **M0 Ground** — test runners, accessibility and layout checks, lint, one
  gate, CI, hooks, env validation; site back up (owner)
- **M1 Operations** — standalone releases with instant rollback, systemd units,
  off-machine backups with a restore drill, health, real client IP, safe
  uploads, enforced CSP, errors and analytics, staging
- **M2 Design system rebuild** — cascade layers, tokens v2, primitives, two
  shells, page-by-page migration deleting the legacy CSS
- **M3–M7** — public face, members, community stage 1, games hub, launch
  quality

### Out of Scope

- Growth mechanics (followers, engagement feeds, email digests) — VISION §8
- A Drive/Photos clone — Immich and Nextcloud on their own subdomains
- Tailwind or any CSS framework — standing owner decision
- Docker/PaaS layers, a self-hosted CI runner on the public repo — PROPOSALS §3
- Community stages 2 and 3, leaderboards, workout planner, DMs — parked behind
  thresholds or the owner (ROADMAP "Parked")
- Marketing Here to Slay as a product — it is a publisher's game (REFERENCES §5)

## Context

- **The seven VISION rules govern every phase:** two audiences / two shells /
  one system; ten-second clarity; one app, one identity; quiet by design;
  hand-written CSS from tokens with one owner per selector; checked before
  believed; the server is production and at home.
- **`v0.8` was cut from `v0.7` on 2026-09-20.** The v0.6 branch's PLAN.md and
  CHECKLIST.md are retired. `CONTEXT.md` remains the conventions handover.
- **State at the cut:** no test runner, no linter, no CI; `globals.css` is
  5,148 lines with a pasted-over "revamp layer"; deploy rebuilds in place; no
  backups; the live site returned Cloudflare error 1033 on 2026-09-19.
- **Team split (AGENTS.md "one owner per job"):** Claude architects, writes
  failing checks, reviews, and owns anything touching auth, uploads, CSP or
  deploy; Codex implements against a contract in git worktrees; Sonnet
  subagents cover for Codex and do research; the local Ollama model does
  mechanical text; GSD Core owns the phase loop and memory; Superpowers owns
  in-task discipline; `ui-ux-pro-max` owns UI craft.
- **The owner delegated design decisions** (2026-09-20): take the recommended
  option, record it, continue. The Owner queue is limited to the kinds of item
  in PROPOSALS §4 row 12.

## Constraints

- **Public repository**: no secrets, internal hostnames, or open security
  specifics in tracked files or public pages.
- **Agents never deploy, never push, never touch the server**; never read
  `.env*` files.
- **Styling**: hand-written CSS from tokens; no `!important`; no colour outside
  a token; both themes; one owner per selector.
- **Safety invariants**: escape before format; parameterised SQL; session and
  ownership checks on every action; the DD Project route keeps its own CSP.
- **Runtime**: Node 22+, npm; Java 21 for the lobby; Windows 11 for development,
  Ubuntu for production; Next.js 16 conventions (read
  `node_modules/next/dist/docs/`).
- **Process**: `docs/ROADMAP.md` is the single source of truth for WHAT and IN
  WHAT ORDER; `.planning/` tracks execution and must never invent scope.
- **Test-first**: every row gets a failing check before implementation; `npm run
  gate` must pass before a phase is done; no parallel packets before G-3…G-6.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| `v0.8` from `v0.7`; v0.6 trackers retired | v0.7 held the real latest work | ✓ Good (locked) |
| Portfolio first; site + homelab are the lead case studies | Recruiters skim; infrastructure is the differentiator | ✓ Good (locked) |
| Two shells (public top bar / member sidebar) | Standard split for dual-audience products | — Pending (D-4) |
| Community staged behind thresholds | An empty forum repels; moderation before growth | ✓ Good (locked) |
| Palette intent per CONTEXT §4; tokens move to OKLCH | Structure, not hue, explains the dissatisfaction | — Pending (D-2) |
| Native `<dialog>`/Popover first; Radix per component if a test fails natively | Fewer dependencies | — Pending (D-3) |
| systemd + standalone releases + pull-based deploy; no Docker, no self-hosted runner | One app, one VM, public repo | — Pending (O-1, O-10) |
| Autopilot only after G-3…G-6 | Unattended work needs a gate | ✓ Good (locked) |

Full table with reversal notes: `docs/PROPOSALS.md` §4.

---
*Last updated: 2026-09-20 at the v0.8 cut, from docs/VISION.md, docs/ROADMAP.md, docs/PROPOSALS.md, CONTEXT.md*
