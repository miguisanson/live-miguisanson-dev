---
description: Run one roadmap row from docs/ROADMAP.md end to end. Pass the id, e.g. /packet G-3
argument-hint: [row-id]
---

Run roadmap row **$1**.

1. **Find it** in `docs/ROADMAP.md`. If `$1` is not there, or is ✅, ⏸️ or 👤,
   stop and say so. Rows G-3…G-6 come before everything else (AGENTS.md).
2. **Read the VISION section behind it** and only the files it needs. Load the
   skills `CLAUDE.md` lists for that area (`ui-ux-pro-max` and `/gsd-ui-phase`
   for UI rows).
3. **Write the check its "Done when" names, run it, and show it failing for
   the right reason.** AGENTS.md Rule 1 — no exceptions. The table there says
   which kind of check each area gets.
4. **Implement** until the targeted check passes (one file:
   `npx vitest run <file>` or `npx playwright test <spec>`). Hand Codex the
   failing check and the contract in its own worktree
   (`E:/Github_Projects/live-miguisanson-dev-wt/<short>`), else a `sonnet`
   subagent; review the whole diff. Rows under AGENTS.md Rule 4 (auth,
   sessions, accounts, uploads, tickets, CSP, deploy) get a security read and
   `/security-review` before committing.
5. **Run `/gate`.**
6. **Land it in one commit:** mark the row ✅ in `docs/ROADMAP.md` only when every
   *Done when* clause is true, add a dated entry to `CHANGELOG.md` **and**
   `src/data/changelog.ts`, update `.planning/STATE.md`. Report each clause and
   what makes it true.

Never push or deploy. List adjacent work you noticed in
`.planning/IMPROVEMENTS.md`; do not do it.
