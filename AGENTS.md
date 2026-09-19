<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Rules for any agent working on this repo

These apply to every agent — Claude Code, Codex, a local model, or a human.
(The block above is written by `next dev`; leave it exactly as it is. It only
manages the text between its markers — everything below is ours and durable.)

miguisanson.dev is Migui's personal site: **one** Next.js 16 application that is
a portfolio, an accounts system with public profiles, a small community and a
browser-games hub, plus a separate Java/Spring Boot WebSocket lobby for Here to
Slay. It runs on an Ubuntu VM at home behind a Cloudflare Tunnel. **The
repository is public.**

Read, in this order: [`CONTEXT.md`](CONTEXT.md) (conventions and decisions on
record) → [`docs/VISION.md`](docs/VISION.md) (the design and its seven rules) →
[`docs/ROADMAP.md`](docs/ROADMAP.md) (the only work queue) →
`.planning/STATE.md` (where the work stands right now).
[`docs/REFERENCES.md`](docs/REFERENCES.md) says what may be copied from where;
[`docs/PROPOSALS.md`](docs/PROPOSALS.md) records why things were decided.

---

## Rule 1 — The check comes first. Always.

> **Never write a check after the implementation.**

A check written after the code passes that code and proves nothing.

1. Read the roadmap row and its **Done when**.
2. Write the check from that sentence, before any implementation.
3. **Run it and watch it fail for the right reason.** Show the output.
4. Implement until it passes. Re-run the same check.
5. Then the gate.

| Work | Check you write first |
|---|---|
| `src/lib/**`, `scripts/**`, server actions, route handlers | Vitest unit test beside the file (`*.test.ts`), `// @vitest-environment node`; database code against an in-memory SQLite; Better Auth through its test-utils plugin |
| Client components and primitives (`src/components/**`) | Vitest + Testing Library: keyboard, focus and ARIA behaviour |
| Pages, flows, anything an async Server Component renders | Playwright test in `e2e/` (async Server Components cannot be unit-rendered — Next.js docs) |
| Layout, responsive behaviour, visual change | Playwright: no horizontal overflow at 375 / 768 / 1024 / 1440, axe scan, and a screenshot baseline |
| CSS rules and tokens | Stylelint rule or the contrast script; a colour outside a token or an `!important` must fail |
| `games/here-to-slay/src/main/java/**` | JUnit test under `src/test/java/`, run with `npm run game:test` (**not** `game:setup`, which skips tests) |
| Here to Slay canvas client (`.../static/js/**`), DD Project player | A written acceptance list confirmed **false** first, verified in the running lobby or with `scripts/testing/dd-project-smoke.mjs` |
| `deploy/**`, `scripts/*.sh` | Dry-run test in a temp directory; `systemd-analyze verify` for units |
| Docs and content | Links resolve; facts checked against the code (say what was verified and what was inferred) |

**Until G-3…G-6 land** the runners do not exist: G-3 and G-4 are therefore the
first build items, and each is itself done test-first (the first test is the
one that proves the runner runs). For anything built before then, the check is
`npm run typecheck`, `npm run build`, and a written acceptance line confirmed
false beforehand. Never invent a test file that nothing runs.

Do not skip a check to move faster. If you cannot state a falsifiable check,
the row is underspecified — fix the row in `docs/ROADMAP.md` first.

## Rule 2 — Run only the checks that matter

While working: the one test file (`npx vitest run src/lib/content.test.ts`),
the one spec (`npx playwright test e2e/community.spec.ts`), the one Java class
(`mvn -q test -Dtest=GameTicketVerifierTest`). The full gate once, at the end.
A pre-existing failure elsewhere is not yours to fix mid-task — note it.

## Rule 3 — Stay inside the row, and follow the pattern that exists

Do the row you were given. Noticing adjacent work is good; doing it is not —
list it at the end or add it to `.planning/IMPROVEMENTS.md`.

Agent-built code rots in two known ways; both are review failures here:
- **Pattern pollution** — averaging two existing conventions into a third. Find
  the one current pattern (primitives in `src/components/ui/`, styles in the
  layer that owns them, data access in `src/lib/app-db.ts`) and follow it
  exactly. If two patterns exist, stop and ask which one survives.
- **Duplicate drift** — re-implementing a helper, component or CSS rule that
  already exists. Search before you write. One selector has one owner file.

`games/dd-project/` holds packaging notes only; the GameMaker source is outside
this repo. Never hand-edit the export under `public/game-assets/dd-project/`
except to reapply the documented account-namespace hook.

## Rule 4 — Production is at home and the repo is public

- **Secrets never enter git.** Never read, print or commit `.env`, `.env.local`
  or any `.env*` file — `.env.example` shows what exists. No credentials, IP
  addresses, tunnel ids or hostnames of internal services in tracked files.
- **Never publish exploitable specifics.** Open security work lives in
  `docs/ROADMAP.md` as neutral rows; `/docs`, `/changelog` and case studies
  never enumerate what is unfixed (CONTEXT §7).
- **A failing build never replaces a running site**, and **agents never
  deploy, never push, never touch the server.** The owner does those.
- **User text is escaped before it is formatted.** Never reorder that, never
  add a renderer that emits raw HTML (CONTEXT §6). Every SQL query is
  parameterised. Every server action checks the session; every mutation checks
  ownership.
- Anything touching auth, sessions, accounts, uploads, tickets, CSP or the
  deploy path is **Claude's own work and gets a security read of the diff** —
  it is not delegated without a review.

## Rule 5 — The design system is law

Hand-written CSS from tokens. No Tailwind or CSS framework, no `!important`, no
colour outside a token, both themes always, hover changes colour and elevation
only, no emoji as icons, touch targets ≥ 44 px, `prefers-reduced-motion`
honoured (CONTEXT §4, VISION §7). Styles live in cascade layers with **one
owner per selector**: to change how something looks, edit its owner — never
append an override, and delete what you replace. UI work loads `ui-ux-pro-max`
and starts a phase with `/gsd-ui-phase`.

## Rule 6 — Leave the repo ready for whoever comes next

Any session can end without warning (usage limit, crash, the owner switching
agents). Keep `.planning/STATE.md` current **as you go**:

- **After every step that lands** — what landed, what is in flight in which
  worktree, the exact next action, anything learned that is not obvious.
- **Before a long or risky step**, write down what you are about to do and
  where its output will go.
- **Never leave work only in your context.** Half-finished work gets a WIP
  commit on a branch or a named worktree in STATE.md.
- Keep STATE.md **under ~120 lines**; move notes older than the last three
  sessions to `.planning/STATE-HISTORY.md`.
- When a row lands: mark it in `docs/ROADMAP.md`, add a dated entry to
  `CHANGELOG.md` **and** `src/data/changelog.ts`, in the same commit.

---

## The gate

```bash
npm run gate        # typecheck → lint → test → build → smoke   (exists from G-6)
npm run test:e2e    # the full browser suite — before closing a milestone
npm run game:test   # when games/here-to-slay/** changed          (from G-7)
npm audit --omit=dev
```

Until G-6: `npm run typecheck && npm run build`. Run the gate in the **main
checkout, in the foreground** — never inside a worktree, never in Codex's
sandbox.

## How the team splits work

| Agent | Does | Does not |
|---|---|---|
| **Claude, main session** (Opus/Fable interactively; Sonnet under the autopilot) | Picks the row, writes the failing check and the contract, reviews every diff, runs the gate, commits, keeps STATE.md; owns anything under Rule 4 | Grind through bulk implementation |
| **Codex** (`mcp__codex__codex` for one packet; `codex exec` in worktrees for several) | Makes a written failing check pass against a stated contract, in its own worktree | Change a check to fit its code; widen scope; run the gate (its sandbox cannot spawn processes) |
| **Sonnet subagents** (`Agent`, `model: "sonnet"`) | Codex's job when Codex is out; research; codebase mapping; independent packets in parallel | Decide design; touch Rule 4 areas unreviewed |
| **Local model** (`mcp__ollama__ask_local`, qwen2.5-coder:7b) — else `haiku` | Commit messages, changelog wording, docstrings, summarising a long file before a paid model reads it | Multi-file reasoning, anything unverified |
| **Strong-model review** (every fifth autopilot session) | Finds what cheap sessions miss — hollow tests, drift from VISION, security mistakes — and **fixes** it | Build roadmap rows |

The failing check **is** the handoff: a precise, machine-checkable spec.

### The task loop

```
Claude   writes the failing check + the contract        → watches it fail
Codex    implements in its own git worktree             → (cannot run tests)
Claude   runs the targeted check, then the gate         → reviews the diff, not just "green"
Claude   commits check and implementation together      → updates ROADMAP, CHANGELOG ×2, STATE
```

A contract names: the files that may be touched, the exported signatures, the
class names and tokens to use, the states to handle (empty, loading, error,
long text, both themes, 375 px), and what is out of scope.

### Parallel packets

```bash
git worktree add -b <branch> E:/Github_Projects/live-miguisanson-dev-wt/<short> HEAD
codex exec -C "E:/Github_Projects/live-miguisanson-dev-wt/<short>" -s workspace-write \
  --add-dir "E:/Github_Projects/live-miguisanson-dev/.git" --skip-git-repo-check \
  -o prompts/<short>.out.md - < prompts/<short>.md
```

Every prompt starts: read `AGENTS.md`; the check is the spec — **do not modify
it**; stop and explain if something looks wrong; touch only the named files.
Remove the worktree after landing.

- **No parallel packets before G-3…G-6 are ✅.** Without a gate, parallel work
  cannot be merged safely.
- **Pilot before a batch.** Repetitive work (D-5's page-by-page migration)
  goes out as one page first; the rest follow only after it is reviewed.
- **Two packets never share a file.** `src/styles/**` tokens and any shared
  primitive are changed by one packet at a time.
- **Escalate, don't retry.** A packet that fails twice, or that would change a
  locked check or contract, comes back to Claude.

### When an agent is unavailable — the fallback ladder

1. **Codex out** → the same brief goes to `Agent` with `model: "sonnet"` in the
   same worktree; independent packets in parallel.
2. **Local model out** → `haiku` subagent (`sonnet` if it needs judgement).
3. **Both out** → Claude subagents do both, cheapest model that can.
4. **Only the main session** → implement inline, in the smallest packets.

Every rung keeps the shape: failing check, review, gate, commit together. Note
the rung used in STATE.md. If handing work off costs more than doing it, do it
yourself.

### One owner per job

When a skill's default disagrees with this file, this file wins.

| Job | Owner | Not used for it |
|---|---|---|
| Memory across sessions, the phase loop | **GSD Core** (`budget` profile): `/gsd-progress` → `/gsd-discuss-phase` → `/gsd-plan-phase` → `/gsd-execute-phase` → `/gsd-verify-work`; `/gsd-ui-phase` before UI phases; `/gsd-pause-work` to stop | Superpowers brainstorming / writing-plans / executing-plans / subagent-driven-development; hand-written handoff files |
| Discipline inside a task | **Superpowers**: `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `requesting-code-review`, `receiving-code-review`, `using-git-worktrees`, `finishing-a-development-branch` | GSD `/gsd-add-tests`, `/gsd-debug`, `/gsd-code-review` |
| A decision that is genuinely the owner's (PROPOSALS §4 row 12 lists the only kinds) | **grill-me** interactively; under the autopilot, the Owner queue | Guessing; ad-hoc question batches |
| Every other design decision | The agent: take the recommended option, record it in `docs/PROPOSALS.md` §4 or VISION, continue | Waiting |
| Implementation code | **Codex**, else the ladder | Claude subagents while Codex answers, including GSD's executor |
| Mechanical text | **Local model** | Opus |
| UI/UX craft in `src/app/**`, `src/components/**`, `src/styles/**` | `ui-ux-pro-max` | — |
| Here to Slay canvas client | `game-ui-ux`, `game-feel` | `audio-design`, `save-systems`, `create-game-assets`, `threejs-*` |
| Library and framework facts | `context7` docs and `node_modules/next/dist/docs/` — **Next.js 16 differs from training data** (no `next lint`, `proxy.ts`, Turbopack builds) | Memory |

**The shape inside `/gsd-execute-phase` is fixed:** (1) failing check, watched
failing; (2) contract → Codex in a worktree; (3) targeted check and gate, run
by Claude; (4) `requesting-code-review` on the diff; (5)
`verification-before-completion`; (6) one commit with check and implementation.

## Autopilot

`scripts/autopilot.mjs` runs headless sessions of `/continue_live-miguisanson-dev`
back to back (Sonnet builds; every fifth session is a strong-model review that
fixes what it finds), sleeps through usage limits, and stops on
`.planning/AUTOPILOT_STOP`, on six sessions without a commit, or when the
roadmap is done (`.planning/ROADMAP_DONE`). Its rules are in
`.claude/autopilot-prompt.md`, `autopilot-review-prompt.md` and
`autopilot-improve-prompt.md`. **It must not be started before G-3…G-6 are ✅**
(PROPOSALS §4 row 13). Start: `scripts\autopilot-start.cmd`. Stop:
`type nul > .planning\AUTOPILOT_STOP`. While it runs, an interactive session
uses `/checkin_live-miguisanson-dev` and does not build beside it.

## Where things are

```
src/app/            routes (App Router) and route handlers under app/api/
src/components/     layout/ (shells), ui/ (primitives), auth/, account/, admin/, game/, …
src/styles/         the layered design system (from D-1; until then src/app/globals.css)
src/data/           typed static content: profile, projects, games, changelog
src/lib/            auth (Better Auth), app-db (Kysely), content, email, game tickets/rooms, site-config
content/            markdown: blog/, projects/
e2e/                Playwright specs (from G-4)
scripts/            setup, migrate, deploy.sh, here-to-slay.mjs, autopilot*.mjs, testing/
games/here-to-slay/ the Java/Spring Boot lobby — real source, developed here
games/dd-project/   packaging notes only
deploy/             systemd units and server-side scripts
docs/               VISION, ROADMAP, REFERENCES, PROPOSALS, SETUP-OWNER
.planning/          GSD execution state — committed
```

## Traps

- **`next dev` rewrites the marked block at the top of this file** and the
  import in `next-env.d.ts`. Commit the block as it is; `git checkout --
  next-env.d.ts` before committing if only that import changed.
- **Next.js 16 is not the Next.js in your training data.** Read
  `node_modules/next/dist/docs/` for the API you are about to use.
- **`npm run game:setup` / `game:build` skip the Java tests.**
- **The `account` table's `issuer` column is NOT NULL** — credential accounts
  use `local:credential` (CONTEXT §3).
- **`.game-list` / `.game-card` belong to the profile favourites**, the games
  index uses `.card-grid` / `.game-card-v2` (until D-5 removes both).
- **DD Project's runner document is generated** by the authenticated route, and
  that route has its own CSP. Do not copy the export's `index.html` to
  `public/`; do not widen the site-wide policy for it.
- **A hidden browser tab freezes GameMaker** (`requestAnimationFrame` is
  throttled to zero) — test it with `scripts/testing/dd-project-smoke.mjs`.
- **A build that dies with "memory allocation failed" or "heap out of memory"**
  on this PC is low system memory (ComfyUI, games), not your code. Never close
  the owner's apps; run `CIRCLE_NODE_TOTAL=3 npm run build` to use two workers.
- **Windows and worktrees:** never run `npm install` or the gate inside a
  worktree; call binaries from the main checkout's `node_modules`.
- **`.next/`, `.runtime/`, `node_modules/`, `games/*/target/`, `logs/`** are
  build or cache output — never edit or commit them.
- **`src/data/profile.ts` must mirror the one-page CV**; games are not résumé
  projects (CONTEXT §6).
