---
description: Start of any session in live-miguisanson-dev — pick up where the project stands and keep building down docs/ROADMAP.md until done or blocked on the owner.
---

Continue building miguisanson.dev on your own. Work through the open rows in
`docs/ROADMAP.md` one after another until the roadmap is done or every
remaining row waits on the owner.

## Ground rules (these override any skill's defaults)

1. Read `CLAUDE.md`, `AGENTS.md` and `.planning/STATE.md` first; `CONTEXT.md`
   and `docs/VISION.md` when the row touches design or conventions. AGENTS.md
   "One owner per job" decides which skill does which job. Use every skill that
   owns a job; do **not** use the ones it marks as not used.
2. **`docs/ROADMAP.md` is the single source of truth for what to build and in
   what order.** Milestones M0 → M7, rows top to bottom. M0 and M1 are never
   reordered or skipped. ⏸️ rows are never built; 👤 rows are built around, never
   waited on. `.planning/` tracks execution only.
3. **Keep the strong model's usage low.** You write checks and contracts,
   review, run the gate and commit. **Codex writes implementations**
   (`mcp__codex__codex` for one packet; `codex exec` in worktrees for several).
   The **local model** (`mcp__ollama__ask_local`) does mechanical text. When
   either is out, follow the fallback ladder in AGENTS.md instead of stopping.
   GSD stays on the `budget` profile. Keep replies to the owner short.
4. **Decide, don't ask.** Only the kinds of question in `docs/PROPOSALS.md` §4
   row 12 go to the owner. For everything else take the recommended option,
   record it (PROPOSALS §4 or VISION) and continue.

## Start of every session

1. If `.planning/AUTOPILOT_STOP` is absent and an autopilot runner is alive
   (`logs/autopilot/runner.lock` names a live pid) and **you are an interactive
   session**: stop, and use `/checkin_live-miguisanson-dev` instead.
2. Run `/gsd-progress` (or `/gsd-resume-work` if a pause handoff exists). If
   GSD reports missing artefacts, rebuild them from `docs/` with
   `/gsd-ingest-docs` — never by inventing scope.
3. `git status`, `git worktree list`, then the gate from AGENTS.md. If it is
   red, `superpowers:systematic-debugging` before anything else. Land or
   explain any leftover worktree.
4. **Recover from a hard stop:** if STATE.md, the roadmap marks and
   `git status` / WIP branches / worktrees disagree, the last session ended
   abruptly. Work out what that work was, finish or discard it, and make
   STATE.md true before starting anything new.
5. Check the helpers once, cheaply: one tiny Codex call, one tiny
   `ask_local` call. Note in STATE.md which rung of the ladder this session
   is on.

## The loop — repeat until done

Pick the next ⬜ row in `docs/ROADMAP.md`.

a. **Who decides?** Owner-only matter (PROPOSALS §4 row 12): interactive →
   **grill-me**; autopilot → Owner queue line, build around it. Otherwise
   `/gsd-discuss-phase` with your own recommended answers.
b. **Load the domain skills** AGENTS.md names — `ui-ux-pro-max` and
   `/gsd-ui-phase` for UI rows; `game-ui-ux` / `game-feel` for the Here to Slay
   canvas client. Read the REFERENCES rows the roadmap row cites, and the
   current docs for any library you are about to use (`context7`,
   `node_modules/next/dist/docs/`).
c. `/gsd-plan-phase`, then `/gsd-execute-phase`. Every task keeps the fixed
   shape in AGENTS.md:
   1. Write the failing check from the row's **Done when**; watch it fail.
   2. Write the contract (files, signatures, class names and tokens, states,
      out of scope).
   3. Implementation to Codex in a worktree (`superpowers:using-git-worktrees`).
      Independent packets in parallel **only once G-3…G-6 are ✅**; pilot one
      before a batch; two packets never share a file.
   4. Run the targeted check and then the gate yourself, in the main checkout.
   5. `superpowers:requesting-code-review`, then `receiving-code-review`.
      Anything under AGENTS.md Rule 4 also gets a security read
      (`/security-review` on the diff).
   6. `superpowers:verification-before-completion`.
   7. One commit with check and implementation; then
      `superpowers:finishing-a-development-branch` to clean up the worktree.
d. `/gsd-verify-work`. Mark the row in `docs/ROADMAP.md`; add the dated entry
   to `CHANGELOG.md` **and** `src/data/changelog.ts`; update
   `.planning/STATE.md`; commit.
e. When a milestone's rows are all ✅ or 👤: run `npm run test:e2e`, then
   `/gsd-audit-milestone` and `/gsd-complete-milestone`, then the next
   milestone.

## When to stop

- Your context is getting full: `/gsd-pause-work`, commit, report in three
  lines where things stand.
- Interactive only: you need server access, a dashboard action, a secret, money,
  a fact about the owner's life or work, or a legal call — ask, briefly.
- **Never:** weaken, skip or delete a check to get green; read or commit
  `.env*`; deploy; push (unless the owner asks in this session); force-push or
  `reset --hard`; publish open security specifics; add Tailwind or a CSS
  framework; use `!important`; copy code from a repository REFERENCES marks
  "no".

## Keeping this command current

Edit this file when the owner asks, or when a session shows a step is wrong,
missing or obsolete. Rules for every agent belong in `AGENTS.md`; where the work
stands belongs in `.planning/STATE.md` — never here. Replace the step a change
supersedes instead of appending beside it, and commit it on its own
(`chore(continue): …`).

Start now with "Start of every session".
