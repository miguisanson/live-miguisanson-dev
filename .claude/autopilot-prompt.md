/continue_live-miguisanson-dev

## Autopilot mode — these rules override the command's "ask the owner" steps

You are running headless from `scripts/autopilot.mjs`. The owner is away and
nobody will answer. When this session ends, the runner starts a fresh one.

0. **Precondition.** If roadmap rows G-3, G-4, G-5 and G-6 are not all ✅, build
   only those rows, one at a time, with **no parallel packets**. Without a gate
   nothing else can be trusted.
1. **Never ask and never wait.** For a design gate (grill-me, GSD approvals,
   "recommended option" questions) take the option you would mark
   (Recommended), record it in `docs/PROPOSALS.md` §4 or `docs/VISION.md`, and
   continue.
2. **The Owner queue holds only these kinds of line**, and the build never waits
   on any of them: something on the server or in the Cloudflare / GitHub /
   Resend dashboards; a secret or key; spending money; a fact about Migui's
   life, work or CV; a legal or licensing call. If a row truly needs one, build
   everything around it, make it degrade cleanly without it, add **one line** to
   `## Owner queue` in `.planning/STATE.md`, put the exact steps in
   `docs/SETUP-OWNER.md`, mark the row 👤, and move on. Never stop the run for
   one blocked row.
3. **Short sessions save tokens.** Land one to three roadmap packets, then:
   update `.planning/STATE.md` (what landed, what is in flight in which
   worktree, what is next), make sure the branch is committed and the gate is
   green, and end with a two-line summary. The runner restarts you with a clean
   context. End this way too if your context is getting long.
4. **Token discipline** (AGENTS.md): you write checks and contracts, review and
   commit. Implementations go to Codex when it answers (it may be at its limit —
   test with one tiny call and fall back), else to `Agent` subagents on
   `model: "sonnet"`; mechanical text to the local Ollama model, else `haiku`.
   Run independent packets in parallel worktrees once rule 0 is satisfied. Do
   small things yourself when delegating costs more.
5. **Worktrees:** never run `npm install`, the gate or Playwright inside one;
   call `node node_modules/...` binaries from the main checkout. Run
   `npm run gate` only in the main checkout, in the foreground. If
   `node_modules` looks broken, run `npm ci` in main when no subagent is
   running.
6. **Never:** push, force-push, `reset --hard`, rewrite history, deploy, touch
   the server, read or write any `.env*` file, weaken or delete a check to get
   green, publish open security specifics, add Tailwind or a CSS framework,
   use `!important`, or copy code from a repository `docs/REFERENCES.md` marks
   "no".
7. **Rows under AGENTS.md Rule 4** (auth, sessions, accounts, uploads, game
   tickets, CSP, deploy scripts) are never delegated unreviewed: read the whole
   diff yourself and run `/security-review` on it before committing. If you are
   not confident, leave the row 🔨 with a precise note in STATE.md for the next
   strong-model review session rather than marking it ✅.
8. **Content about the owner is never invented.** Case studies, the résumé,
   `/now`, `/uses`: draft only from `src/data/*`, `content/`, the repositories
   and the CV file; mark every sentence you could not source with `[OWNER:
   confirm]` and add one Owner queue line per page. Never make up a number, an
   employer, a date or a result.
9. **UI rows:** load `ui-ux-pro-max`, write the UI spec with `/gsd-ui-phase`,
   and prove the result with Playwright screenshots at 375 and 1440 in both
   themes plus an axe pass. "It built" is not evidence that it looks right.
10. **When everything left in `docs/ROADMAP.md` is ✅, ⏸️ or 👤**, write
    `.planning/ROADMAP_DONE` with a short summary of what is done and what waits
    on the owner, commit it, and end. The runner then stops; improvement work
    starts only on the owner's green light (`.planning/IMPROVE_GO`). Never
    create that file yourself.
11. If `.planning/AUTOPILOT_STOP` exists, finish the packet in hand, commit, and
    end the session.
12. **Keep `.planning/STATE.md` under about 120 lines.** Every session pays to
    read it. When you add your note, move notes older than the last three
    sessions to the end of `.planning/STATE-HISTORY.md`. Do not read the history
    file unless you are hunting a specific past decision.
13. **⏸️ rows are never built** and never count as open. Only the owner unparks
    a row. The thresholds in VISION §5 and H-7 are checked against real data by
    the owner, not assumed.
