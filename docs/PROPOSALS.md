# Proposals — the v0.8 review, the verdicts, and the decisions taken

Written 2026-09-20 by the planning session that opened `v0.8`. The owner gave
that session full authority over the revamp ("I leave it up to you"), so §4
records **decisions**, not questions. Every decision names how to reverse it.
Anything the owner wants changed: edit §4, then the matching VISION section and
ROADMAP row in the same commit.

**How this was checked.** Read: `CONTEXT.md`, `README.md`, the v0.7 `ROADMAP.md`
and `CHANGELOG.md`, `package.json`, `scripts/deploy.sh`, `scripts/testing/`,
the route and component tree, `src/data/*`, and the v0.6 `PLAN.md` /
`AGENTS.md`. Measured: `src/app/globals.css` on v0.7 is **5,148 lines with 16
`!important`**. Loaded: https://miguisanson.dev on 2026-09-19 18:53 UTC —
**Cloudflare error 1033** (tunnel down). **Not done:** the v0.7 site was not
looked at in a browser (the owner interrupted that step), so nothing below is a
judgement of how v0.7 *looks*; `npm run build` was not run on v0.8 in that
session beyond the gate noted in `.planning/STATE.md`. Research: seven web
passes, sources in [`REFERENCES.md`](REFERENCES.md).

---

## 1. Summary — the six changes worth the most

1. **Make the site stay up and recoverable.** It was down when checked, there
   are no backups, and one USB disk holds everything. Nothing else matters
   more. (G-2, O-1…O-4.)
2. **Give the repo a gate.** No tests, no linter, no CI means every agent
   session is a gamble and parallel agents are unsafe. (G-3…G-10.)
3. **Split the two audiences.** One sidebar shell currently serves a recruiter
   and a logged-in member alike. Public pages get a plain top bar and
   ten-second clarity; the sidebar is for members. (D-4, P-1.)
4. **Rebuild the stylesheet instead of layering over it.** A "revamp layer"
   pasted over legacy rules is why specificity fights and collisions keep
   happening. Cascade layers, one owner per selector, delete-as-you-migrate.
   (D-1…D-5.)
5. **Turn projects into case studies, and the homelab into the lead one.**
   Self-hosting behind a tunnel with auth, security headers and backups is the
   differentiator for a networking-and-cloud junior. (P-2.)
6. **Size the community to the people actually in it.** Guestbook-scale first,
   moderation before growth, forum features parked behind real thresholds.
   (VISION §5, C-1…C-6.)

## 2. Review findings

| # | Finding | Evidence |
|---|---|---|
| F-1 | **Work was split across two branches.** The v0.7 revamp (Aug 27–31) existed only on GitHub; the local `v0.6` carried an older `PLAN.md` plus the dev kit committed on top, so its rules described a repo that no longer existed (Hugo, Tailwind-era README) | `git log v0.6..origin/v0.7` — 8 commits, 145 files |
| F-2 | **Production was down**, and nothing would have said so | Error 1033; no uptime check; `cloudflared` not supervised |
| F-3 | **No automated check of any kind.** No `test` or `lint` script; one JUnit test, skipped by the build script; one manual Chrome smoke script | `package.json`; `scripts/here-to-slay.mjs` (`-DskipTests`) |
| F-4 | **CSS debt is structural**: legacy sections + a bottom "revamp layer" that wins by order; documented specificity traps and one class-collision bug already | CONTEXT §4; commit `1de4dd9d` "Fix three CSS specificity collisions" |
| F-5 | **Deploy rebuilds in place**; rollback means rebuilding an old commit on a small VM | `scripts/deploy.sh` |
| F-6 | **No backups; single USB HDD** | CONTEXT §2, §9 |
| F-7 | **CSP is Report-Only; Turnstile is off; uploads trust the client's MIME type** | v0.7 ROADMAP "Operations" |
| F-8 | **Rate limits and the audit log may see Cloudflare's address, not the visitor's** (to verify in O-5) | No `CF-Connecting-IP` handling found by search |
| F-9 | **The forum plan outruns the community.** v0.7's next milestone was votes, scores and topics for a site with a handful of members | v0.7 ROADMAP "Community as a real forum" |
| F-10 | **Here to Slay uses a publisher's name and art** on a public, indexed site | `src/data/games.ts`, `public/here_to_slay_preview.webp` |
| F-11 | **Trackers had drifted before and would again**: PLAN, CHECKLIST, ROADMAP, CHANGELOG ×2 | v0.7 ROADMAP preface |
| F-12 | **`AGENTS.md` is partly machine-owned.** `next dev` upserts a marked block into it (it does *not* overwrite the rest — checked in `generate-agent-files.js`) | `<!-- BEGIN:nextjs-agent-rules -->` |
| F-13 | **Phone number and personal email are in a public repo and page** | `src/data/profile.ts` — owner's call (Owner queue) |

## 3. Tech-stack verdict

**Keep:** Next.js 16 App Router, React 19, TypeScript strict, Better Auth,
Kysely with SQLite (dev) and PostgreSQL (prod), hand-written CSS, the separate
Spring Boot lobby, Cloudflare Tunnel, systemd. None of these is the problem.

**Add:** Vitest, Testing Library, Playwright (+ axe), ESLint, Stylelint, Knip,
lefthook, Zod at action boundaries, a typed env module, `sharp` + `file-type`
for uploads, restic + R2 for backups, GitHub Actions on GitHub-hosted runners.

**Considered and declined:**

| Option | Why not |
|---|---|
| Tailwind / shadcn | Standing owner decision; the problem is structure, not the absence of utilities |
| CSS Modules everywhere | Cascade layers + one file per component give the same isolation without changing how styles are written |
| Docker / Coolify / Dokploy / Kamal | One app on one VM; systemd already supervises the lobby. Another layer to patch for no gain |
| Self-hosted GitHub runner | On a **public** repo a fork's pull request can run code on the home server |
| Push-based deploy with a Cloudflare service token in GitHub | A standing credential into the home network in a public repo's CI. Pull-based (O-10) or the owner's hand |
| Radix / React Aria for every primitive | Native `<dialog>` and Popover are Baseline; a dependency only where a test proves the native one fails |
| Lighthouse CI | Flaky scores on shared runners; explicit byte budgets (L-2) are deterministic |
| Biome / oxlint | `eslint-config-next` still carries the Next- and React-specific rules |
| MDX | Posts are markdown plus database rows through one escape-first renderer; MDX would add a second, unsafe-by-default path |
| Discord as the community | Unsearchable, unarchived, off-site (REFERENCES §7) |

## 4. Decisions (2026-09-20)

| # | Decision | Why | To reverse |
|---|---|---|---|
| 1 | **`v0.8` is cut from `v0.7`**; v0.6's PLAN/CHECKLIST are retired; the dev kit is carried forward | v0.7 is the real latest work | — |
| 2 | **Positioning: portfolio first**, community and games one click deeper; the site itself and the homelab are the lead case studies | Recruiters skim; the infrastructure is the differentiator | Edit VISION §1–§3 |
| 3 | **Two shells** (public top bar / member sidebar) | Standard split for dual-audience products | Drop D-4; revert P-1's acceptance |
| 4 | **Community is staged**; votes, topics and threading are parked behind VISION §5's thresholds | An empty forum repels; moderation must precede growth | Unpark C-7 / C-8 |
| 5 | **Palette intent stays as CONTEXT §4** (blue-biased neutrals, one emerald action colour) — the newer of two conflicting records; the owner's June instruction (strictly mono, no coloured buttons) conflicts with it, so this is **provisional and in the Owner queue**. Tokens move to OKLCH; colour only through tokens | The owner's unhappiness is better explained by structure and layout than by hue; hue is one token edit away | Change the accent token in D-2 |
| 6 | **Native first for primitives**; Radix Primitives allowed per component when a written test cannot pass natively | Fewer dependencies, smaller public pages | — |
| 7 | **`/changelog` becomes public again; `/docs` stays admin-only.** Neither ever lists open security work | It is portfolio evidence | `projectPagesArePublic` flag |
| 8 | **Games stay off the résumé page** (CONTEXT §6) **but appear on Home** and may have engineering case studies | The CV mirror stays exact; the games are still the memorable hook | — |
| 9 | **Here to Slay surfaces are `noindex`, private-room, never marketed** | F-10 | Owner queue item: re-skin or permission |
| 10 | **One tracker:** `docs/ROADMAP.md`. `.planning/` tracks execution only. Both changelogs stay (CONTEXT §8) | F-11 | — |
| 11 | **Agents never deploy and never push** (the owner asked for the single `v0.8` setup push on 2026-09-20; that does not carry forward) | CONTEXT §8 | Owner says so in a session |
| 12 | **The Owner queue holds only:** server access, Cloudflare/GitHub dashboard actions, secrets and keys, money, facts about Migui's life and work, and legal calls. Everything else the agent decides with the recommended option and records here or in VISION | Same rule that keeps rpg-gm's autopilot moving | — |
| 13 | **Autopilot may run only after G-3…G-6 are ✅** | Unattended sessions without a gate would ship unverified work | — |

## 5. Ideas adopted into the roadmap

From REFERENCES: `/now`, `/uses`, `/colophon`, blogroll (P-5); version number
in the footer → `/changelog` (P-5); copy-email button, mono dates, read time
(P-1, P-4); generated per-post thumbnails (P-4, P-6); pinned-items profile
(A-1); tabbed profile sections (A-1); public moderation log (C-2); typed posts
— Ask / Show / Discussion (C-1); fixed reaction set (C-4); devlogs and the
game-page sidebar block (H-1, H-2); controls hint and fixed-aspect player
(H-6); live server-status widget as the site's "heartbeat" (O-4 → P-1).

## 6. Later — ranked, not scheduled (feeds `.planning/IMPROVEMENTS.md`)

1. A message wall ("Whispers") on Home — the friendliest first community act.
2. TIL / notes tier for short writing.
3. Interactive network diagram in the homelab case study.
4. Theme accent variants (a small picker).
5. "Most read" list on the blog.
6. A small daily widget on `/games`.
7. Webmentions.
8. JSON Feed and `llms.txt`.
9. Public status page (Uptime Kuma) on a subdomain.
10. Per-game achievements (after H-3 has real data).
