# Claude Code — project notes

**Read [`AGENTS.md`](AGENTS.md) first.** It holds the rules every agent
follows (check first, targeted checks, stay in scope, secrets/deploy
invariant) and how work is split between Claude, Codex and the local model.
Do not restate them here.

The work queue is [`PLAN.md`](PLAN.md) (mirrored in
[`CHECKLIST.md`](CHECKLIST.md), logged in [`CHANGELOG.md`](CHANGELOG.md)) —
there is no separate design doc for this project. `README.md` documents the
running system: setup, the auth flow, and both games.

Load domain skills per AGENTS.md's "The process: one owner per job" table
before the matching work:
- UI/UX work anywhere in `src/app/**` or `src/components/**` — `ui-ux-pro-max`.
- The Here to Slay canvas client
  (`games/here-to-slay/src/main/resources/static/js/**`) — `game-ui-ux` and
  `game-feel`.
- Everything else in `games/here-to-slay/src/main/java/**` is a normal Java
  Spring Boot service; no domain skill is needed, just the JUnit check in
  Rule 1's table.

Commands: `/continue_live-miguisanson-dev` (start any session with it).

## Claude-specific conventions

- **No test runner exists for TypeScript yet** (see AGENTS.md Rule 1). Don't
  invent `*.test.ts` files that nothing runs; either propose installing
  Vitest/Playwright (recommended, not installed) or use the acceptance-line
  + `npx tsc --noEmit`/`npm run build` pattern already in use.
- **Never read `.env.local` or any other `.env*` file** — use `.env.example`
  to see what variables exist. Never print secrets into chat, commits, or
  `PLAN.md`/`CHANGELOG.md`.
- **This is a personal, real, deployed site** — `miguisanson.dev` runs in
  production from this repo (see README's deploy section). Treat `v0.6` as
  live-adjacent: don't force-push, don't rewrite history, and run
  `npm run typecheck` (and `npm run build` for anything non-trivial) before
  telling the owner something is done.
- **Strict mono design system, hand-written CSS, no Tailwind.** Styling lives
  in `src/app/globals.css` as design tokens (spacing, type, radius, shadow,
  motion) plus a `ui-*` component CSS section — match that pattern rather
  than introducing a new styling approach or reaching for Tailwind classes
  (removed on purpose, per `CHANGELOG.md`).
- **Reusable UI primitives live in `src/components/ui/`** (`Button`,
  `ButtonLink`, `Card`/`LinkCard`, `Badge`, `Avatar`, `EmptyState`,
  `TagList`). Milestone 3 in `PLAN.md` is actively extracting more
  (`Tabs`, `Modal`, `Menu`, form fields, `Skeleton`, `Alert`) from ad-hoc
  implementations (`AccountTabs`, `UserMenu`, etc.) — check there before
  building a new one-off component.
- **Auth is Better Auth**, SQLite locally (`.runtime/auth.sqlite`) or
  Postgres in production. Account/session logic lives in `src/lib/auth.ts`
  and `src/lib/auth-client.ts`; don't hand-roll session checks elsewhere.
- **Path alias:** `@/*` maps to `src/*` (see `tsconfig.json`).
- `tsconfig.json` excludes `legacy`, `REFERENCES`, `themes`, `static` —
  `npx tsc --noEmit` does not check those paths.
