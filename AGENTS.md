# Rules for any agent working on this repo

These apply to every agent — Claude Code, Codex, a local model, or a human.
miguisanson.dev is Migui's personal site: a Next.js portfolio/community app
(the active stack) that is replacing a legacy Hugo resume site, plus two
embedded games — Here to Slay (a Java/Spring Boot lobby developed in this
repo) and DD Project (a GameMaker HTML5 export, not developed here). The work
queue is [`PLAN.md`](PLAN.md), mirrored in [`CHECKLIST.md`](CHECKLIST.md) and
logged in [`CHANGELOG.md`](CHANGELOG.md) — there is no separate design doc;
`README.md` documents the running system.

---

## Rule 1 — The check comes first. Always.

> **Never write a check after the implementation.**

A check written after the code passes that code and proves nothing.

**Honest state of this repo: there is no test runner for the Next.js/TypeScript
code yet.** `package.json` has no `test` or `lint` script, and no test files
exist under `src/`. The one real test in the repo is
`games/here-to-slay/src/test/java/org/example/security/GameTicketVerifierTest.java`
(JUnit, via Maven) — and even that is skipped by the build script
(`npm run game:setup` runs `mvn ... -DskipTests`), so it only runs if you
invoke it yourself.

Until a runner exists, "the check" means one of:
- **A build/type check**: `npx tsc --noEmit` (whole-project, strict mode) and,
  for anything that could break the production build, `npm run build`.
- **A written acceptance check-list**, verified by hand in the browser: state
  the specific, falsifiable thing you expect ("`/games` shows a Play button
  only for verified accounts", "no horizontal scroll at 375px") *before*
  touching code, then verify it after. `PLAN.md`/`CHECKLIST.md` already work
  this way for the UI/UX revamp — extend that pattern instead of inventing a
  new one.
- **The existing JUnit test**, for anything in the Java lobby.

1. Read the goal — the PLAN.md/CHECKLIST.md item.
2. Write the check from that goal (a type, a build assumption, an acceptance
   line, or a JUnit test) before writing the implementation.
3. Where a check can fail before the code exists (types, JUnit), **run it and
   watch it fail** for the right reason. Show the output. A hand-verified
   acceptance line instead gets confirmed false against the current UI first.
4. Implement until it passes. Re-run the same check.
5. Then the gate.

Do not skip a check to move faster. If you cannot state a falsifiable check
for the goal, stop and say so — the goal is underspecified.

**First item to pick up: choose a test runner.** Recommendation (not
installed, this is only a recommendation) — **Vitest** for `src/lib/**`,
`scripts/**`, and component logic (TS/ESM-native, fast, no extra config
beyond Next's SWC/Turbopack setup), plus **Playwright** for route-level smoke
tests across `src/app/**` (it can log in through Better Auth and click
through real pages, which a unit runner can't). Both are common, well-
supported choices for a Next.js App Router project this size.

| Work | Check you write first |
|---|---|
| `src/lib/**`, `scripts/**`, API routes (`src/app/api/**`) | `npx tsc --noEmit` must reflect the intended types before you implement; once a runner exists, a unit test beside the file |
| `src/app/**`, `src/components/**` | A written acceptance line (rendered state, breakpoint, error-free) verified in the browser; once Playwright exists, a route smoke test |
| `games/here-to-slay/src/main/java/**` | Extend or add a JUnit test under `games/here-to-slay/src/test/java/`, run it with `mvn test` (system Maven, or the copy `npm run game:setup` downloads into `.runtime/maven/`) — **not** `npm run game:setup`, which skips tests |
| `games/here-to-slay/src/main/resources/static/js/**` | A written acceptance line, verified by opening a local lobby (`npm run game:dev`) and playing the interaction |
| `public/game-assets/dd-project/**` | Nothing to test here beyond `npm run build` — this is an imported build artifact, not source; see Rule 3 |
| Hugo (`hugo.toml`, `layouts/`, `content/`, `themes/`, `archetypes/`) | Legacy, being replaced by Next.js (see README). Don't add new checks here; if you must touch it, confirm `python run.py --build` still exits 0 |

## Rule 2 — Run only the checks that matter

`npx tsc --noEmit` is whole-project only — it has no per-file targeting.
Run it after a change and read the errors near the files you touched; a
pre-existing error elsewhere is not yours to fix mid-task. For the Java
lobby, target one class: `cd games/here-to-slay && mvn test -Dtest=GameTicketVerifierTest`.
For a UI change, load only the one route you changed in the browser, not the
whole site. Run `npm run build` (the closest thing to a full gate) once, at
the end.

## Rule 3 — Stay inside the item

Do the item you were given. Noticing adjacent work is good; doing it is not —
list it at the end. Read the files the item needs, not the whole repo. In
particular: `games/dd-project/` holds packaging notes, not game source — the
actual GameMaker project lives outside this repo and is exported by hand (see
`games/dd-project/README.md`); don't try to "fix" the built JS/texture files
under `public/game-assets/dd-project/html5game/` directly except to reapply
the documented account-namespace hook after a fresh export.

## Rule 4 — Secrets never enter git; the deployed build never breaks

`.gitignore` already blocks `.env`, `.env.local`/`.env*.local`, and
`.runtime/` — never `git add -f` one of those, never paste a real secret
into a tracked file (`.env.example` stays placeholder-only), and never read
or print `.env.local` contents. The production Ubuntu host runs `npm run
build` then `npm run start:all` from this exact repo (see README's deploy
section and `deploy/here-to-slay.service.example`) — a build that fails
locally fails production. Before any commit touching `src/`, `scripts/`,
`next.config.ts`, `package.json`, or `games/here-to-slay/`, run
`npm run typecheck` and, if the change is not trivially local, `npm run
build`. Both are enforced only by you running them — there is no CI or
pre-commit hook in this repo yet.

## Rule 5 — Leave the repo ready for whoever comes next

Any session can end without warning (usage limit, crash, the owner switching
agents), so an agent never waits until the end to write things down. Keep
`PLAN.md`'s **Current Task** line and `CHECKLIST.md` current as you go:

- **After every step that lands** (a check written, an implementation
  passing, a review done, a commit), flip the item's `[ ]` to `[x]` in
  `PLAN.md` and `CHECKLIST.md`, add a `CHANGELOG.md` bullet under today's
  date, and overwrite **Current Task** in `PLAN.md` with the exact next
  action and anything learned that isn't obvious from the code.
- **Before a long or risky step** (a big refactor, a run in the background),
  write down first what you are about to do and where the output will go, so
  a session that dies halfway through can be picked up.
- **Never leave work only in your context.** Half-finished code gets a WIP
  commit on a branch (not `v0.6` directly, unless the owner says otherwise)
  or a note in `PLAN.md`'s Current Task naming the files it touched.

The next agent starts with `/continue_live-miguisanson-dev`, or, outside
Claude, by reading this file, `PLAN.md`, and `CHECKLIST.md`, and running
`git status`.

---

## The gate

```bash
npm run typecheck   # tsc --noEmit — must be clean
npm run build       # production Next.js build — run before anything that
                     # touches config, routing, auth, or many files
```

There is no `lint` or `test` script yet (see Rule 1). For the Java lobby:
`cd games/here-to-slay && mvn test`.

## How the team splits work

| Agent | Does | Does not |
|---|---|---|
| **Claude** | Architecture, types and contracts, writing the failing checks, reviewing and merging, anything touching auth, accounts, or secrets | Grind through bulk mechanical work |
| **Codex** | Makes a written failing check pass; implements a page, component, or module against a stated contract; works in its own git worktree | Change a check to match its code; widen scope |
| **Local model** (Ollama, `mcp__ollama__ask_local`) | Mechanical work: boilerplate, summaries of long text, commit messages, docstrings | Design, multi-file reasoning, anything unverified |

The failing check is the handoff: a precise, falsifiable spec (a type, a
build assumption, an acceptance line, or a JUnit test). Every delegated
result is reviewed and gated before it merges.

### When an agent is unavailable — the fallback ladder

Best is all three. If one is out — Codex at its usage limit or erroring,
Ollama not running — the work moves down the ladder instead of stopping:

1. **Codex unavailable:** implementation goes to a **Claude subagent on a
   cheaper model** (`Agent` with `model: "sonnet"`) in the same worktree, with
   the same brief Codex would get. Independent packets run in parallel.
   The main Claude session keeps to checks, contracts, review and the gate.
2. **Local model unavailable:** its mechanical work goes to a Claude subagent
   on `haiku` (or `sonnet` when it needs judgement).
3. **Both unavailable:** Claude subagents do both, cheapest model that can.
4. **Only the main session:** it implements inline, in the smallest packets.

Every rung keeps the same shape: failing check first, review, gate, commit
check and implementation together. Return to Codex as soon as it is back.
Note in `PLAN.md`'s Current Task which rung a packet used.

- **Pilot before a batch.** Repetitive delegated work (e.g. applying the
  component library page by page, per Milestone 4) goes out as one page
  first; the rest follow only after that one is reviewed.
- **Escalate, don't retry.** If a packet fails twice, or passing it would
  change a locked type or contract, it comes back to Claude.

### Parallel Codex packets

```bash
git worktree add -b <branch> E:/Github_Projects/live-miguisanson-dev-wt/<short> HEAD
codex exec -C "E:/Github_Projects/live-miguisanson-dev-wt/<short>" -s workspace-write \
  --add-dir "E:/Github_Projects/live-miguisanson-dev/.git" --skip-git-repo-check \
  -o <short>.out.md - < <short>.prompt.md
```

The prompt starts with: read `AGENTS.md`; the check is the spec, **do not
modify it**; stop and explain if something looks wrong; touch only the named
files. **Codex's sandbox cannot spawn processes** — it cannot run
`npm run build` or `mvn test`. Always run them yourself before landing a
packet. Remove the worktree after landing.

### The process: one owner per job

Several installed skill sets overlap if used naively, so every job has
exactly one owner. When a skill's default disagrees with this file, this
file wins.

| Job | Owner | Not used for this job |
|---|---|---|
| Memory across sessions, the phase loop, context rot | **GSD Core** (local install, `budget` model profile, already installed — `.planning/config.json`). `/gsd-progress` or `/gsd-resume-work` to start; per phase `/gsd-discuss-phase` → `/gsd-plan-phase` → `/gsd-execute-phase` → `/gsd-verify-work`; `/gsd-pause-work` to stop; `/gsd-complete-milestone` | Superpowers `brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`; hand-written handoff files |
| Discipline inside a task: check first, debugging, proving it works, code review, worktrees, closing a branch | **Superpowers**: `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `requesting-code-review`, `receiving-code-review`, `using-git-worktrees`, `finishing-a-development-branch` | GSD `/gsd-add-tests`, `/gsd-debug`, `/gsd-code-review`, `/gsd-audit-fix` |
| Stress-testing a design decision that is the owner's to make | **grill-me** (user-level skill, never committed: it has no licence) | ad-hoc question batches |
| Writing implementation code | **Codex**, else the fallback ladder above | Claude subagents writing implementations while Codex is available, including GSD's executor |
| Mechanical text work | **Local model** (Ollama) | Opus |
| UI/UX design craft for the Next.js site (layout, palette, typography, component patterns, a11y, responsive) | `ui-ux-pro-max` (installed under `.claude/skills/`) — its stack list includes `nextjs`, and its guidance (mono palette, no emoji icons, responsive breakpoints, contrast) matches what `CHECKLIST.md` already asks for | — |
| Domain craft for the Here to Slay tabletop client (`games/here-to-slay/src/main/resources/static/js/**`: canvas board, card/item rendering, sidebar, interactions) | `game-ui-ux` (board/HUD layout, responsive canvas, menu/dropdown state — this client has a real board, sidebar, and context menu built in-repo) and `game-feel` (juice on card moves/plays) | `audio-design`, `save-systems`, `create-game-assets`, `threejs-scene-setup`/`threejs-materials-lighting` — no evidence any of these apply: no audio in the lobby, room state is server-held in-memory (not a save-file system), card art is pre-existing (not something to generate), and rendering is 2D canvas, not three.js |

**Why game skills apply at all:** `games/here-to-slay/` is not a built
artifact — it is real Java/Spring Boot source (`src/main/java/org/example/**`)
with its own test (`src/test/java/...GameTicketVerifierTest.java`) plus a
hand-built 2D canvas game client (`bindCanvas.js`, `boardInterface.js`,
`itemClasses.js`, `itemFactory.js`) the owner develops here. `games/dd-project/`
is the opposite — only packaging notes and an imported GameMaker export live
in this repo (see Rule 3), so no game-dev skill applies there.

**The task shape inside `/gsd-execute-phase` is fixed:** (1) Claude writes
the failing check and watches it fail for the right reason (or, until a
runner exists, states the acceptance line and confirms it's currently
false); (2) Claude writes the contract and hands implementation to Codex in
a worktree; (3) Claude runs the targeted check and the gate itself; (4)
`requesting-code-review` on the diff; (5) `verification-before-completion`;
(6) commit check and implementation together. If GSD's executor starts
writing the implementation in a Claude subagent while Codex is available,
stop and route the task to Codex.

## Where things are

```
src/app/         Next.js App Router routes (pages + API routes under app/api/)
src/components/  layout (AppShell/Sidebar/TopBar), ui/ (design-system primitives),
                 auth/, account/, game/, cards/, sections/, landing/, lab/
src/data/        typed static data: profile.ts, projects.ts, games.ts
src/lib/         auth (Better Auth), db, email, game tickets/rooms, content, utils
scripts/         bootstrap, setup, auth migration, admin bootstrap, dev-all/start-all,
                 here-to-slay.mjs (builds/runs the Java lobby)
games/here-to-slay/  Java/Spring Boot multiplayer lobby — real source, developed here
games/dd-project/    packaging notes only; source lives outside this repo
public/game-assets/dd-project/  the imported GameMaker HTML5 build (generated, not source)
deploy/          systemd unit example for the Here to Slay service
legacy/hugo-public/  a frozen static export of the old Hugo site, kept for reference
hugo.toml, layouts/, content/, themes/, archetypes/, i18n/  the legacy Hugo site
                 (excluded from tsconfig; run.py/setup.py still build it standalone,
                 but it is not part of the Next.js deploy path)
.claude/skills/ui-ux-pro-max/  UI/UX design reference (see table above)
```

## Traps

- **No test/lint script exists** (`package.json` has only `dev`, `build`,
  `start`, `typecheck`, plus the setup/bootstrap/game scripts). Don't assume
  `npm test` or `npm run lint` do anything — they don't exist yet.
- **`npm run game:setup`/`game:build` skip the Java tests** (`-DskipTests`).
  A green build of the lobby says nothing about `GameTicketVerifierTest`;
  run `mvn test` yourself when you touch `security/`.
- **`.next/`, `.runtime/`, `node_modules/`, and `games/*/target/` are
  build/cache output** — gitignored, don't hand-edit or commit into them.
- **Hugo is legacy, not dead code to delete outright.** The owner is
  mid-migration (README: "now transitioning from a Hugo/PaperMod resume site
  into a Next.js portfolio web app"); `legacy/hugo-public/` is the frozen
  static export kept for reference. Don't delete Hugo files without asking —
  but also don't spend effort maintaining them; new work goes into `src/`.
- **`tsconfig.json` excludes `legacy`, `REFERENCES`, `themes`, `static`** —
  `npx tsc --noEmit` will not catch anything you break in those paths, so
  don't rely on it there.
- **DD Project's runner document is generated, not static.** Don't copy the
  GameMaker export's `index.html` into `public/` — the authenticated
  `/play/dd-project` route generates the player document after checking the
  signed-in account (see `games/dd-project/README.md`).
- **`.env.local` and every other `.env*` file are off-limits to read.** Use
  `.env.example` to see what variables exist; never open `.env.local`.
