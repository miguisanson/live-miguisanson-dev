/continue_live-miguisanson-dev

## Autopilot, improvement mode — these rules override the command's roadmap loop

The roadmap is done (`.planning/ROADMAP_DONE`) and the owner has given the green
light (`.planning/IMPROVE_GO`). Keep making the site better until they drop
`.planning/AUTOPILOT_STOP`. Every rule in `.claude/autopilot-prompt.md` still
applies — read it first.

**Better means better for the five visitors in VISION §2** — a recruiter
deciding in ten seconds, an engineer reading a case study, a friend joining a
room, a member coming back, Migui running the place — not more code. Nothing in
VISION §8 or ROADMAP "Not planned" is ever built; ⏸️ rows stay parked.

### Each session

1. Read `.planning/IMPROVEMENTS.md`: a ranked backlog, one line per item — what
   is wrong or missing, the evidence, who it helps, the size. Remove items that
   are done or no longer true.
2. If the backlog has fewer than five items worth doing, **audit one area**,
   rotating through them (note which one you did at the top of the file):
   - **First impression:** screenshot `/` at 1366×768 and 375×812 in both
     themes; can a stranger say who this is and what he built in ten seconds?
     Compare against two sites from REFERENCES §1.
   - **A flow, end to end:** sign up → verify → profile → post → play, in
     Playwright with tracing; note every dead end, confusing message, layout
     jump or slow step.
   - **Security:** `/security-review` on the least-recently reviewed area;
     `npm audit`; headers and CSP on every route.
   - **Accessibility:** keyboard-only walkthrough of one flow; axe; contrast.
   - **Performance:** bytes per route, LCP element, image formats, caching
     headers.
   - **Code health:** `/code-review` (medium) on the least-reviewed module;
     Knip; duplicate CSS and components. Real problems only.
   - **Content:** read one page aloud; placeholder text, stale dates, claims
     the code no longer supports.
   - **Operations:** do the deploy dry-run, the restore drill and the health
     endpoint still pass?
   Add findings to the backlog, ranked.
3. Take the top one to three items and do them exactly like roadmap packets:
   failing check first, contract, delegate the implementation, review, gate,
   commit check and code together. Record each in STATE.md and both changelogs.
4. **Guardrails:** never delete or weaken a check or a feature to "simplify";
   no rewrites or renames for taste; no new dependency without a written reason
   in the commit; keep every change small and reversible. If a change would
   alter a decision in VISION or PROPOSALS §4, record the new decision there
   with the reasoning in the same commit.
5. **If nothing in the backlog is worth the tokens**, do not invent work: commit
   the updated backlog, create an empty `.planning/AUTOPILOT_IDLE`, and end. The
   runner rests six hours and a later session audits a different area.
