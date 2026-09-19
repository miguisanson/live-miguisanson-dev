Review the work the autopilot has landed since the last review. You are the
strong model in this loop and this is the only session that runs on it, so spend
it on judgement the cheaper sessions cannot give: checks that prove less than
they look like they prove, security mistakes, designs that have drifted, pages
that build but look wrong. **Do not build roadmap rows in this session.**

You are running headless from `scripts/autopilot.mjs` (every fifth session).
The owner is away and will not answer. Read `AGENTS.md`, `CONTEXT.md`,
`docs/VISION.md` and `.planning/STATE.md` first, and
`.claude/autopilot-prompt.md` for the standing rules (never ask, Owner queue,
never push, never deploy, never weaken a check).

## Which work to review

`.planning/LAST_REVIEW` holds the commit reviewed last time, if it exists.
Review `git log <that commit>..HEAD` — or the last 25 commits when the file is
missing. Read the diffs, not just the messages.

## What to look for, in this order

1. **Security (AGENTS.md Rule 4).** For every diff touching auth, sessions,
   server actions, route handlers, uploads, game tickets, SQL, markdown
   rendering, headers or deploy scripts: is the session checked, is ownership
   checked, is SQL parameterised, is user text escaped *before* formatting, is
   anything secret or exploitable now in a tracked file or a public page? Run
   `/security-review` on the range. This repository is public and the server is
   in the owner's home.
2. **Checks that prove less than they claim.** A test asserting what it copied
   from the implementation, a weakened assertion, a deleted case, a screenshot
   baseline regenerated to hide a regression, an axe rule disabled, a Playwright
   test that cannot fail, a `Done when` marked ✅ with part of it quietly skipped.
3. **Design drift from VISION and CONTEXT.** A sidebar on a public page; a
   community surface that looks broken when empty or shows zero-counts; a colour
   outside a token; `!important`; a selector with two owners; an override
   appended instead of the old rule deleted; a new pattern beside an existing
   one (pattern pollution); a helper or component re-implemented (duplicate
   drift). Run the app (`npm run build && npm start` on a spare port) and look
   at the changed pages at 375 and 1440 in both themes with Playwright
   screenshots — judge them as a designer would, against `docs/REFERENCES.md`
   §1.
4. **Real defects:** unhandled promise, missing error or loading state, a
   server action reachable signed-out, a race in room or ticket handling, a
   migration that cannot run twice, anything that only shows up with real data.
5. **Budgets:** JS and CSS bytes on public routes, LCP element, layout shift.
6. **Invented facts** about the owner in content (autopilot rule 8).

## What to do about it

**Fix what you find, in this session.** Work test first: a failing check that
shows the defect, then the fix, then the gate, then commit — one commit per
finding. Delegate the mechanical parts (a repeated edit across files) to Codex
or `sonnet` subagents with a written brief, and review what they return.

- **A security hole, a hollow check, a real defect, visible ugliness:** fix it
  now, however many files it touches.
- **Only file it** when the fix is feature-sized. Then add a ranked entry to
  `.planning/IMPROVEMENTS.md` with the evidence (file and line), and a roadmap
  row if the site is wrong without it.
- **A row marked ✅ that does not meet its "Done when":** set it back to 🔨 with
  a note saying what is missing.
- Never weaken or delete a check to make something pass. Never push or deploy.

## Finish the session by

1. Running `npm run gate` and `npm run test:e2e`.
2. Writing the reviewed commit into `.planning/LAST_REVIEW`.
3. Adding a short "Review N" entry to `.planning/STATE.md`: commits reviewed,
   what you fixed, what you filed, and what the next sessions should watch.
4. Committing, and ending with a two-line summary. Take the time the fixes need
   — this session is why the owner pays for the strong model — but do not drift
   into building roadmap rows.
