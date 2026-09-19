---
description: Run the full gate — typecheck, lint, tests, build, smoke — and report each stage.
---

Run in the **main checkout, in the foreground** (never in a worktree), in order,
and stop at the first failure:

```bash
npm run gate          # typecheck → lint → test → build → smoke   (exists from G-6)
npm audit --omit=dev  # must report 0 vulnerabilities
```

Until G-6 lands there is no `gate` script; run instead:

```bash
npm run typecheck
npm run build
npm audit --omit=dev
```

Add `npm run game:test` when `games/here-to-slay/**` changed (from G-7), and
`npm run test:e2e` before closing a milestone.

If the build dies with "memory allocation failed" or "heap out of memory", the
PC is low on memory — not a code error. Re-run with `CIRCLE_NODE_TOTAL=3 npm run
build`; never close the owner's apps.

Report which stages passed. If anything failed, show the actual output and fix
the cause, not the symptom. Nothing is committed until every stage is green.
