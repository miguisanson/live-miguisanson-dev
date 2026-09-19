# Vision — what miguisanson.dev is

**A developer's home on the internet that a recruiter understands in ten
seconds and a friend stays on for an hour.** The front is a fast, hand-crafted
portfolio: who Migui is, what he has built, proof that he runs real
infrastructure. One click deeper is a small members' place — profiles, a quiet
community, and browser games he made or hosts — all behind one account.

It runs at home: an Ubuntu VM on a Proxmox mini PC, published only through a
Cloudflare Tunnel. **The site is itself the flagship project.** Self-hosting,
auth, security headers, backups, a multiplayer game service and a test-first
multi-agent workflow are the case study; the pages are how visitors see it.

This document is the design. [`ROADMAP.md`](ROADMAP.md) says what is built and
what is next. [`REFERENCES.md`](REFERENCES.md) lists every site and repository
we borrow from and what may be copied. [`PROPOSALS.md`](PROPOSALS.md) records
the review behind this revamp and the decisions taken. [`../CONTEXT.md`](../CONTEXT.md)
is the handover of conventions that cannot be read from the code.

---

## 1. The seven rules that do not change

1. **Two audiences, two shells, one design system.** Public pages (home,
   résumé, projects, blog, a game's public page) use a plain top-bar layout
   with no sidebar and no sign-in friction. Member pages (community, members,
   profiles while signed in, account, admin, play) use the sidebar app shell.
   Both draw from the same tokens and primitives, so it never feels like two
   sites. A recruiter must never need an account for anything they came for.
2. **Ten-second clarity.** Above the fold on `/`: name, role, one-line pitch,
   the two or three strongest pieces of work, résumé and contact. No greeting
   screen, no loading animation, no scroll required.
3. **One app, one identity.** Portfolio, accounts, community and games stay in
   one Next.js application. A member signs in once. Other services (Immich,
   Nextcloud) keep their own subdomains; this site is only the portal to them.
4. **Quiet by design, never fake-busy.** The community is tiny and will be for
   a long time. Every community surface must look intentional with zero, one or
   five items: no vote counters showing "0", no sort tabs over three posts, no
   empty leaderboards. A feature that needs a crowd is parked until the crowd
   exists (§5 gives the thresholds).
5. **Hand-written CSS from tokens.** No Tailwind, no CSS framework, no
   `!important`, no colour outside a token, both themes always. Styles live in
   cascade layers with one owner per selector — never a "revamp layer" pasted
   over an older one. If a rule must be overridden, the older rule is deleted.
6. **Checked before it is believed.** Every change starts from a failing check
   (unit test, browser test, accessibility scan or screenshot) and ends at
   `npm run gate`. Nothing is "done" because it looks right in one browser.
7. **The server is production, and it is at home.** Secrets never enter the
   public repository. A build that fails never replaces a running site.
   Rollback takes seconds. The database and uploads are backed up off the
   machine, and the restore has been rehearsed. Agents never deploy.

Refusals and empty states speak like a person — *"Nobody has posted yet. Say
hello."* — never "No data", "Error" or "null".

## 2. Who it is for

| Visitor | Arrives from | Needs within | Must find |
|---|---|---|---|
| **Recruiter / hiring manager** | CV link, LinkedIn | 10–30 seconds | Role, stack, 2–3 case studies with outcomes, résumé download, contact |
| **Engineer reviewing a candidate** | Recruiter forward, GitHub | 2–5 minutes | How things were built: architecture, trade-offs, the homelab, the repo |
| **Friend / player** | A shared room code | Seconds | Sign in, join the room, play; later a profile worth having |
| **Member** | Habit | — | What is new since last visit; a place to post; their games and history |
| **Migui** | — | — | Write a post, moderate, see that the server is healthy, deploy safely |

When two audiences conflict, the recruiter wins on public pages and the member
wins inside the shell.

## 3. The public face

- **Home.** Identity block (name, role, location, one sentence), then
  *Selected work* (three cards at most, each a case study), then *What I run*
  (the homelab, as a diagram-and-numbers strip), then *Play* (the games, as the
  memorable hook), then *Writing* (latest three), then contact. One accent
  colour, one motif carried through — metadata set in mono as data.
- **Case studies** (`/projects/[slug]`) follow one template: context → problem
  → constraints → what I built → decisions and trade-offs → outcome (numbers
  where they exist) → what I would change → links. This site, the home server,
  the Here to Slay tabletop, the capstone and the iOS work are the first five.
- **Résumé** mirrors the one-page CV exactly (CONTEXT §6) and offers the PDF.
- **Blog** is long-form and owner-authored, with RSS, reading time, per-post
  social images and `BlogPosting` structured data.
- **Small pages that make a site feel alive:** `/now`, `/uses`, `/changelog`
  (public again — it is portfolio evidence; it never lists open security work),
  `/colophon` (how the site is built and hosted).
- **A command menu** (Ctrl/⌘+K) for navigation and search, and view
  transitions where the browser supports them. Both are enhancements; every
  page works without JavaScript for reading.

## 4. Members, profiles and accounts

- A profile is a **showcase, not a form dump**: header (avatar, name, handle,
  status), pinned items the member chose, badges earned, games played with
  history, recent posts. Borrowed shape: GitHub's pinned items, Steam's
  showcases, read.cv's restraint.
- Accounts stay on Better Auth: email + username, verification required,
  Turnstile on, rate limits keyed on the visitor's real IP
  (`CF-Connecting-IP`), two-factor and passkeys offered, sessions listable and
  revocable, deletion verified by email.
- Privacy defaults are conservative: a private profile is invisible to
  everyone but its owner and admins.

## 5. Community — sized for the people actually here

Blog ≠ Community ≠ Members (CONTEXT §5) stays. What changes is the ambition
curve — features unlock when the community earns them:

| Stage | Unlocks when | What exists |
|---|---|---|
| **1 · Guestbook-scale** (now) | — | Post feed, per-post permalinks, flat comments, reactions without counts-as-scores, report button, admin removal with a public moderation log |
| **2 · Forum-scale** | ≥ 25 members who have posted **and** ≥ 100 posts | Threaded replies, topics, sort by new / active |
| **3 · Aggregator-scale** | ≥ 150 active members | Votes and score, top sorting, member moderators |

Moderation minimums ship **before** anything that increases posting: report,
remove, ban, rate limits, link and image rules for new accounts, an audit
trail. User text is always escaped before it is formatted (CONTEXT §6).

## 6. Games

- Each game has a **public page** (what it is, screenshots, how to play,
  devlog, tech) and a **play surface** behind a verified account.
- **Devlogs** are the itch.io idea: dated build notes attached to a game, which
  also feed the home page and RSS.
- **History before leaderboards.** Record finished matches and sessions to the
  member's profile first. One leaderboard per game appears only once there are
  enough real results to fill it, and only for results the server itself
  observed — never a client-reported score.
- Here to Slay stays a **private-room** tabletop for friends: its card art and
  name belong to their publisher, so it is never promoted as a public product
  or indexed as one (REFERENCES §4).
- The GameMaker runtime keeps its own looser CSP on its own route, never
  site-wide (CONTEXT §7).

## 7. Look and feel

Blue-biased neutrals, one emerald action colour, status colours kept separate;
Archivo for display, Geist for text, Geist Mono for data (CONTEXT §4). The
revamp does not change the palette's intent — it rebuilds how it is delivered:
tokens in OKLCH with `light-dark()`, cascade layers (`reset, tokens, base,
layout, components, pages, utilities`), native nesting, container queries for
cards, `<dialog>` and the Popover API for modals and menus, fluid type and
space scales. Motion is 150–300 ms, colour and elevation only, and respects
`prefers-reduced-motion`. Touch targets are at least 44 px.

**Budgets that are part of the design:** LCP under 2.5 s and INP under 200 ms
on a mid-range phone, CLS under 0.1, no horizontal scroll at 375 / 768 / 1024 /
1440, zero serious or critical axe violations, public pages under 120 KB of
JavaScript.

## 8. What this site is not

- Not a social network to be grown. No feeds engineered for engagement, no
  notifications begging for return visits, no follower counts.
- Not a Drive or Photos clone — Immich and Nextcloud do that on their own
  subdomains (CONTEXT §9).
- Not a template. Nothing here should look like the default output of a
  component kit.
- Not a place for another company's assets presented as Migui's product.
- Not deployed by agents, and not dependent on any paid service to stay up.

## 9. How it is built

Test first, by a small team of agents with one owner per job:
[`../AGENTS.md`](../AGENTS.md). The strongest model architects and reviews;
Codex and Sonnet subagents implement against a failing check in their own
worktrees; the local model does mechanical text; an unattended autopilot can
run the roadmap with a strong-model review every fifth session.
