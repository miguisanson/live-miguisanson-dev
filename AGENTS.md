<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Rules for any agent working on this repo

> The block above is written and re-added by `next dev`. Leave it alone — removing
> it from a diff only re-creates the uncommitted change. Everything below is ours.

These apply to every agent — Claude Code, Codex, a local model, or a human.

**miguisanson.dev** — one Next.js App Router application serving four purposes at
once: portfolio, accounts, a community feed, and browser games. It is deliberately
*one app*, not four; a member signs in once and that identity carries everywhere.
React 19, TypeScript, Better Auth, Kysely + Postgres.

Read [CONTEXT.md](CONTEXT.md) first — it is the project handover and records the
decisions that are not recoverable from the code. [ROADMAP.md](ROADMAP.md) is the
single source of truth for what is done and what is next;
[CHANGELOG.md](CHANGELOG.md) gets a dated line whenever something ships.

---

## Rule 1 — Write the check first. Always.

**There is no test runner in this project yet.** That does not suspend the rule —
it changes what "the test" is. Whatever the check is, it is written from the goal,
**run and watched failing first**, and never written afterwards to describe what
you built.

1. Read the goal of the item.
2. Write the check from that goal.
3. **Run it and watch it fail** for the right reason. Show the output.
4. Implement until it passes. Run the same check again.
5. Then the gate.

| Work | The check you write first |
|---|---|
| A type, a schema, a data shape | `npm run typecheck`, with the new type in place and the call sites not yet updated — the errors are the failing test |
| A database change | A Kysely query written against the new schema that fails to compile, or a migration run against a scratch database asserting the rows |
| A route, page or server action | A written acceptance check-list in the item: exact URL, exact input, exact expected response and status — including the signed-out and unauthorised cases |
| Auth, permissions, rate limits | The **negative** case first: the request that must be rejected. Confirm it is currently allowed before you fix it |
| A UI change | An acceptance check-list the owner confirms in the browser at `npm run dev` |
| A bug | The reproduction, written down and confirmed failing, before the fix |

**Adding a real test runner is an early roadmap item.** Until it lands, never say
a change is "tested" — say which check-list was run and who confirmed it.

## Rule 2 — Run only the checks that matter

```bash
npm run typecheck        # fast, run this constantly
```

`npm run build` is the slow one. Once, at the end.

## Rule 3 — Stay inside the item

Do the item you were given. Noticing adjacent work is good; doing it is not —
list it at the end. Read the files the item needs, not the whole repo.

## Rule 4 — One app, one identity, one tracker

Three invariants, each of which has already been broken once here:

- **It is one application.** Do not split portfolio, accounts, community and
  games into separate products, separate auth, or separate deployments.
- **Better Auth owns identity.** Sessions, verification, resets and the audit log
  go through it. Never hand-roll a second path to "just check if they're logged in".
- **`ROADMAP.md` is the only tracker.** It exists because `PLAN.md` and
  `CHECKLIST.md` tracked the same work in two places and drifted until the same
  document called a feature both done and unstarted. Do not add a third tracker,
  and do not let `.planning/` drift from `ROADMAP.md` — when they disagree,
  `ROADMAP.md` wins and `.planning/` gets corrected.

What enforces it: `npm run typecheck` catches the auth and data-shape half; the
tracker rule is enforced in review, so call it out when you see it slipping.
## Rule 5 — Leave the repo ready for whoever comes next

Any session can end without warning (usage limit, crash, the owner switching
agents), so an agent never waits until the end to write things down. Keep
`.planning/STATE.md` current as you go:

- **After every step that lands** (a check written, an implementation passing,
  a review done, a commit), update STATE.md's *Current Position*: what is
  done, what is in progress and on which branch or worktree, the exact next
  action, and anything learned that is not obvious from the code. Commit it
  with the work, or on its own if nothing else changed.
- **Before a long or risky step** (a delegated packet, a big refactor, a run
  in the background), write down first what you are about to do and where the
  output will go, so a session that dies halfway through can be picked up.
- **Never leave work only in your context.** Half-finished code gets a WIP
  commit on a branch (not the main branch) or a note in STATE.md naming the
  files it touched. Worktrees and background jobs are listed by path.
- **If you know the session is ending**, run `/gsd-pause-work` (Claude) or
  write the same thing by hand into STATE.md (any other agent).

The next agent starts with `/continue_live-miguisanson-dev`, or, outside Claude, by reading
this file and `.planning/STATE.md` and running `git status`.

---

## The gate

Nothing merges that has not passed both:

```bash
npm run typecheck
npm run build
```

Plus the item's acceptance check-list, confirmed by the owner.

## Where things are

| | |
|---|---|
| `CONTEXT.md` | **The handover.** Architecture, conventions, decisions on record. Read first. |
| `ROADMAP.md` | The only work tracker. Done / next / deliberately not started. |
| `CHANGELOG.md` | A dated line per shipped thing. |
| `src/` | The Next.js app: App Router pages, server actions, components. |
| `content/` | Site content. |
| `games/` | Browser games hosted on the site. |
| `scripts/` | Setup, bootstrap, migrations, the dev orchestrators. |
| `deploy/`, `compose.yaml` | Server and Postgres setup. |

## Traps

- **Deployment is not yours.** Develop locally only. The live site runs on an
  Ubuntu VM behind a Cloudflare Tunnel and is deployed by hand, by the owner.
  Never deploy, never push to the server, never touch the tunnel.
- **This is not the Next.js in your training data.** Read the version's own docs
  in `node_modules/next/dist/docs/` before writing App Router code. The block at
  the top of this file says so for a reason.
- `next dev` rewrites the `nextjs-agent-rules` block at the top of this file.
  Commit that change with your work rather than fighting it.
- A private file/photo area is **deliberately not being built**. The decision on
  record is to run Immich and Nextcloud on subdomains and make this site the
  portal in front of them. See CONTEXT.md §9 before proposing storage features.
- Never read or commit `.env*`. Database URLs and auth secrets live there.

## How the team splits work

| Agent | Does | Does not |
|---|---|---|
| **Claude** | Architecture, types and contracts, writing the failing check, reviewing and merging, anything touching security, data or licensing | Grind through bulk mechanical work |
| **Codex** | Makes a written failing check pass; implements a module or screen against a stated contract; works in its own git worktree | Change a check to match its code; widen scope |
| **Local model** (Ollama, `mcp__ollama__ask_local`, qwen2.5-coder:7b) | Free mechanical work: boilerplate, summaries of long text, commit messages, docstrings | Design, multi-file reasoning, anything unverified |

All three run on both machines — the MacBook (M3, 16 GB) and the Windows PC both
serve qwen2.5-coder:7b through Ollama. The failing check is the handoff: a precise,
checkable spec. Every delegated result is reviewed and gated before it merges.

### When an agent is unavailable — the fallback ladder

If one is out — Codex at its usage limit or erroring, Ollama not running — the
work moves down the ladder instead of stopping:

1. **Codex unavailable:** implementation goes to a **Claude subagent on a
   cheaper model** (`Agent` with `model: "sonnet"`) in the same worktree, with
   the same brief Codex would get. Independent packets run in parallel.
   The main Claude session keeps to checks, contracts, review and the gate.
2. **Local model unavailable** (Ollama not running, or the model not pulled):
   its mechanical work goes to a Claude subagent on `haiku` (or `sonnet` when it
   needs judgement). Start it with `open -a Ollama` before falling back.
3. **Both unavailable:** Claude subagents do both, cheapest model that can.
4. **Only the main session:** it implements inline, in the smallest packets.

Every rung keeps the same shape: failing check first, review, gate, commit the
check and the implementation together. Return to Codex as soon as it is back.
Note in `.planning/STATE.md` which rung a packet used.

- **Pilot before a batch.** Repetitive delegated work goes out as one item
  first; the rest follow only after that one is reviewed.
- **Escalate, don't retry.** If a packet fails twice, or passing it would
  change a locked type, contract or check, it comes back to Claude.

### Parallel Codex packets

```bash
git worktree add -b <branch> /Users/miguelsanson/Projects/live-miguisanson-dev-wt/<short> HEAD
codex exec -C "/Users/miguelsanson/Projects/live-miguisanson-dev-wt/<short>" -s workspace-write \
  --add-dir "/Users/miguelsanson/Projects/live-miguisanson-dev/.git" --skip-git-repo-check \
  -o <short>.out.md - < <short>.prompt.md
```

The prompt starts with: read `AGENTS.md`; the check is the spec, **do not modify
it**; stop and explain if something looks wrong; touch only the named files.
**Codex's sandbox cannot spawn processes** — it cannot run the checks. Always run
them yourself before landing a packet. Remove the worktree after landing.

### The process: one owner per job

Several installed skill sets overlap if used naively, so every job has exactly
one owner. When a skill's default disagrees with this file, this file wins.

| Job | Owner | Not used for this job |
|---|---|---|
| Memory across sessions, the phase loop, context rot | **GSD Core** (local install, `budget` model profile). `/gsd-progress` or `/gsd-resume-work` to start; per phase `/gsd-discuss-phase` → `/gsd-plan-phase` → `/gsd-execute-phase` → `/gsd-verify-work`; `/gsd-pause-work` to stop; `/gsd-complete-milestone` | Superpowers `brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`; hand-written handoff files |
| Discipline inside a task: check first, debugging, proving it works, code review, worktrees, closing a branch | **Superpowers**: `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `requesting-code-review`, `receiving-code-review`, `using-git-worktrees`, `finishing-a-development-branch` | GSD `/gsd-add-tests`, `/gsd-debug`, `/gsd-code-review`, `/gsd-audit-fix` |
| Stress-testing a design decision that is the owner's to make | **grill-me** (user-level skill, never committed: it has no licence) | ad-hoc question batches |
| Writing implementation code | **Codex**, else the fallback ladder above | Claude subagents writing implementations while Codex is available, including GSD's executor |
| Mechanical text work | **Local model** (Ollama, `mcp__ollama__ask_local`); a `haiku` subagent only if Ollama is down | Opus |


**The task shape inside `/gsd-execute-phase` is fixed:** (1) Claude writes the
failing check and watches it fail for the right reason; (2) Claude writes the
contract and hands implementation to Codex in a worktree; (3) Claude runs the
targeted checks and the gate itself; (4) `requesting-code-review` on the diff;
(5) `verification-before-completion`; (6) commit the check and the implementation
together. If GSD's executor starts writing the implementation in a Claude
subagent while Codex is available, stop and route the task to Codex.
