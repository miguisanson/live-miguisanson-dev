---
gsd_state_version: '1.0'
status: executing
progress:
  # Counts docs/ROADMAP.md rows (✅ / all M0–M7 rows), not GSD plans — recount, never copy forward.
  total_phases: 61
  completed_phases: 1
  total_plans: 0
  completed_plans: 0
  percent: 2
---

# Project State

**Keep this file under about 120 lines.** Older session notes go to
`.planning/STATE-HISTORY.md`; `docs/ROADMAP.md` is the record of what is built.

## Project Reference

See `.planning/PROJECT.md`. **Core value:** a developer's home on the internet
that a recruiter understands in ten seconds and a friend stays on for an hour —
self-hosted, test-first, itself the flagship project.

**The owner delegated design decisions (2026-09-20):** take the recommended
option, record it in `docs/PROPOSALS.md` §4 or `docs/VISION.md`, carry on. Only
the Owner queue below waits for them.

## Current Position

- **Branch:** `v0.8`, cut from `v0.7` (61cd8a7e) on 2026-09-20. Pushed once, at
  the owner's request. Agents do not push again unless asked.
- **Done:** G-1.
- **Next action, first:** **G-11** — `npm audit --omit=dev` shows 2 (nodemailer
  high, baseline-browser-mapping moderate). Small; do it before G-3.
- **Then:** **G-3 — unit test runner.** Read Next.js's Vitest guide in
  `node_modules/next/dist/docs/` and Better Auth's test-utils docs (context7).
  First failing test: `src/lib/content.test.ts` proving `markdownToHtml`
  escapes `<script>` before formatting. Then `account-policy`, `game-tickets`,
  `game-rooms`, `scripts/autopilot-lib.mjs` (port rpg-gm's
  `scripts/autopilot-lib.test.ts`). **One packet at a time — no parallel work
  until G-3…G-6 are ✅.**
- **After that:** G-4 → G-5 → G-6 → G-7 → G-8 → G-9 → G-10, then M1.
- **In flight:** nothing. No worktrees.
- **Ladder rung:** Codex was at its usage limit until 2026-09-21; until it
  answers, implementation goes to `sonnet` subagents (rung 1).

## Lessons in force

- `next dev` rewrites the marked block at the top of `AGENTS.md` and the import
  in `next-env.d.ts`. Our text below the block survives (checked in
  `generate-agent-files.js`). Restore `next-env.d.ts` before committing.
- **`npm run build` dies with "memory allocation failed" / heap out of memory
  when the PC is low on memory** (ComfyUI alone held 12 GB on 2026-09-20; Next
  starts 15 build workers). It is not a code error. Do not close the owner's
  apps: run `CIRCLE_NODE_TOTAL=3 npm run build` (Next reads that variable for
  its worker count — `config-shared.js`). O-1 should set `experimental.cpus`
  for the small VM properly.
- reddit.com cannot be read from an agent session (fetcher and browser pane
  both refuse). REFERENCES §7 lists what was used instead.
- The v0.7 UI has not been looked at by the planning session. The first UI
  session should screenshot every route at 375 and 1440, both themes, before
  judging anything.

## Owner queue

Steps for each are in `docs/SETUP-OWNER.md`. The build never waits on these.

1. **G-2 — the site is down** (Cloudflare 1033, seen 2026-09-19): make
   `cloudflared` and the app services start at boot and restart on failure.
2. **Point the server at `v0.8` only when M0 is green** — until then production
   stays on `v0.7`.
3. **GitHub:** turn on secret scanning and Dependabot alerts (G-9).
4. **Here to Slay:** decide — keep private and unlisted (current decision), ask
   the publisher, or re-skin with original art (PROPOSALS F-10).
5. **`src/data/profile.ts` publishes a phone number and personal email** in a
   public repo and page. Keep, or replace with a contact form / alias?
6. **A second disk or off-site backup target** (R2 bucket + keys) for O-3.
7. **Facts for the case studies** (P-2): numbers, dates, what was hard.
8. **Reddit threads** you like → paste into `docs/reference-notes/`.
9. **Palette — please confirm before D-2.** In June you said the site is strictly
   mono and buttons must not be coloured. v0.7's CONTEXT §4 (Aug 27, written by
   an agent) introduced an emerald action colour. v0.8 follows CONTEXT for now,
   through tokens only, so switching back is one edit. Which do you want?

## Recent sessions

### 2026-09-20 — planning session (Fable, interactive) — G-1 ✅

Found the v0.7 revamp only on GitHub while local work sat on v0.6; cut `v0.8`
from v0.7; restored the dev kit (GSD config, `/continue_…`, gitignore block);
ported rpg-gm's autopilot (`scripts/autopilot*.mjs`, three prompts,
`/checkin_…`); wrote `docs/VISION.md`, `ROADMAP.md` (61 rows, M0–M7),
`REFERENCES.md` (~110 sources with licence verdicts), `PROPOSALS.md` (13
findings, 13 decisions), `SETUP-OWNER.md`; rewrote `AGENTS.md`, `CLAUDE.md`;
seeded `.planning/`. Research: seven Sonnet web passes. **Verified:** `npm ci`, `npm run typecheck` clean, `npm run build` green (with
`CIRCLE_NODE_TOTAL=3`), `autopilot-lib.mjs` imports. `npm audit --omit=dev` = **2 open** (row G-11). **Not verified:** the look of v0.7; any claim in
REFERENCES marked UNVERIFIED.
