---
description: Start of any session in live-miguisanson-dev — pick up where the project stands and keep building down PLAN.md until done or blocked on the owner.
---

Continue building miguisanson.dev on your own. Work through the open items
in `PLAN.md` one after another until the work is done or you are blocked on
something only the owner can do.

## Ground rules (these override any skill's defaults)

1. Read `CLAUDE.md` and `AGENTS.md` first. AGENTS.md "The process: one owner
   per job" decides which skill does which job. Use every skill that owns a
   job. Do **not** use the ones it marks as not used.
2. **`PLAN.md` is the single source of truth for what to build and in what
   order** — it mirrors `CHECKLIST.md` and is logged in `CHANGELOG.md`. Work
   milestones top-to-bottom (currently Milestone 3, the component library,
   per `PLAN.md`'s Current Task). `.planning/` holds GSD's working plan for
   the current phase only; it must never become a second roadmap that
   drifts from `PLAN.md`.
3. Keep Opus usage low. You write the checks and contracts, review, run the
   gate and commit. **Codex writes implementations** (`mcp__codex__codex`
   for one packet; `codex exec` in git worktrees for several at once). The
   **local Ollama model** (`mcp__ollama__ask_local`) does mechanical text
   work. If Codex or the local model is unavailable, follow the fallback
   ladder in AGENTS.md (Claude subagents on Sonnet/Haiku) instead of
   stopping. GSD stays on the `budget` profile. Keep replies to the owner
   short.

## Start of every session

1. **Onboarding check.** If `.planning/PROJECT.md` or `.planning/ROADMAP.md`
   is missing, GSD was installed but never onboarded: run `/gsd-onboard` (it
   maps the codebase with parallel agents, reads `PLAN.md`/`CHECKLIST.md`/
   `README.md`, and asks the owner about goals), then continue below. Don't
   invent goals — `PLAN.md` already states them.
2. Run `/gsd-progress` (or `/gsd-resume-work` if a pause handoff exists).
3. Run `git status`, `git worktree list`, and the gate from AGENTS.md
   (`npm run typecheck`; `npm run build` if anything config/routing/auth
   related changed since the last session). If the gate is red, use
   `superpowers:systematic-debugging` before anything else. If worktrees are
   left over, land them or say why you can't.
4. Recover from a hard stop: if GSD's STATE.md, `PLAN.md`'s Current Task, or
   `git status`/WIP branches/worktrees show changes that don't agree with
   each other, the last session ended abruptly. Work out what that work was,
   finish or discard it, and reconcile `PLAN.md`'s Current Task before
   starting anything new.

## The loop — repeat until done

Pick the next unchecked item in `PLAN.md`, top to bottom within the current
milestone.

a. **Decide who decides.** If the item changes the design-token/component
   contracts, the auth/data model, or what a game's rules are, run
   **grill-me** with the owner before planning. Never guess their answer.
   Otherwise `/gsd-discuss-phase`.
b. **Load the domain skills** AGENTS.md's table names for the item —
   `ui-ux-pro-max` for anything in `src/app/**`/`src/components/**`;
   `game-ui-ux`/`game-feel` only for the Here to Slay canvas client under
   `games/here-to-slay/src/main/resources/static/js/**`.
c. `/gsd-plan-phase`, then `/gsd-execute-phase`. Every task follows the
   fixed shape in AGENTS.md:
   1. Write the check first (a type, a JUnit test, or — until a runner
      exists — a stated acceptance line confirmed false first) per AGENTS.md
      Rule 1's table.
   2. Write the contract.
   3. Implementation to Codex in a worktree (`superpowers:using-git-worktrees`).
      Independent packets in parallel; pilot one before a batch (e.g. one
      page of Milestone 4's per-page revamp before the rest).
   4. Run the targeted check and the gate yourself (Codex's sandbox cannot
      run `npm run build` or `mvn test`).
   5. `superpowers:requesting-code-review`, then
      `superpowers:receiving-code-review`.
   6. `superpowers:verification-before-completion`.
   7. Commit check and implementation together, then
      `superpowers:finishing-a-development-branch` to clean up the worktree.
d. `/gsd-verify-work`. Flip the item's `[ ]` to `[x]` in both `PLAN.md` and
   `CHECKLIST.md`, add a `CHANGELOG.md` bullet under today's date, overwrite
   `PLAN.md`'s **Current Task**, and commit.
e. When a milestone's items are all done: `/gsd-audit-milestone`, then
   `/gsd-complete-milestone`, then move to the next milestone in `PLAN.md`.

## When to stop and ask the owner

- Your context is getting full: `/gsd-pause-work`, commit, report in three
  lines where things stand.
- You need a design decision, credentials or API keys, a deploy, a git push,
  a history rewrite, or anything that deletes user data or accounts: ask.
- **Never:** weaken or skip a check to get green; commit secrets (`.env*`)
  or read `.env.local`; force-push or `reset --hard`; delete Hugo legacy
  files without asking (see AGENTS.md Traps); copy the DD Project export's
  `index.html` into `public/` instead of using the generated runtime route.

## Keeping this command current

Edit this file when the owner asks, or when a session shows a step is wrong,
missing or obsolete. Rules for every agent belong in `AGENTS.md`; where the
work stands belongs in `PLAN.md`'s Current Task and GSD's `STATE.md` — never
here. Replace the step a change supersedes instead of appending beside it,
and commit it on its own (`chore(continue): …`).

Start now with "Start of every session".
