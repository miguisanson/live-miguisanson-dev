# Roadmap

What is done, what is next, and what is deliberately not started.

This file replaces the previous `PLAN.md` and `CHECKLIST.md`, which tracked the same
work in two places and had drifted apart — both listed Games, Blog and Home as
unfinished placeholders in the same document that recorded them as completed.

**Rule:** when something ships, move it to Done here *and* add a dated entry to
[CHANGELOG.md](CHANGELOG.md). One line each. Do not keep a third tracker.

Last reviewed: **2026-08-28**

---

## Done

### Platform
- [x] Next.js App Router, React 19, TypeScript
- [x] Better Auth: email + username, verification, reset, rate limits, audit log
- [x] SQLite for development, PostgreSQL for production, one query layer for both
- [x] Admin dashboard with account controls
- [x] Hugo remnants fully removed

### Design
- [x] Token layer: colour, type, space, radius, elevation, motion — both themes
- [x] Three type roles (Archivo / Geist / Geist Mono), all self-hosted
- [x] Component primitives: Button, Card, Badge, Avatar, EmptyState
- [x] App shell: sidebar, drawer, top bar, skip link, z-index scale
- [x] Revamp pass across shell, home, games, community, posts, resume
- [x] Mobile verified at 375px with no horizontal overflow

### Content
- [x] Home entry hub
- [x] Games index with real cards
- [x] Blog index and articles, reachable from navigation
- [x] Community: member directory, search, post feed
- [x] Public profiles with badges, uploads and privacy controls
- [x] Public changelog and docs pages (now admin-gated)
- [x] Admin blog authoring with drafts (done 2026-08-28)
- [x] Members split from the community feed (done 2026-08-28)
- [x] Project handover in `CONTEXT.md` (done 2026-08-28)

### Security
- [x] Parameterized SQL throughout
- [x] Escape-before-format rendering for user posts
- [x] Session checks on every server action; ownership checks on post mutations
- [x] Path traversal guard on the media route
- [x] Full security header set
- [x] Zero dependency vulnerabilities

---

## Next

### Community as a real forum
The current feed is flat. Making it work like a forum needs schema, not styling.

- [ ] `parentId` on posts for threaded comments
- [ ] `score` column plus a votes table
- [ ] `topic` column for sub-communities
- [ ] Per-post permalinks — posts currently only exist inside a profile page
- [ ] Sorting: new / top / active
- [ ] Report flow, and admin removal wired into the existing audit log

### Identity
- [ ] Favicon, app icons, web manifest
- [ ] Default OG image, plus dynamic OG cards for `/u/[username]`
- [ ] Empty-state illustrations

### Component library
Extract the remaining ad-hoc patterns into reusable primitives.

- [ ] Tabs (currently inline in `AccountTabs`)
- [ ] Modal (focus trap exists in `useFocusTrap`, dialogs are still ad-hoc)
- [ ] Menu / dropdown (currently inline in `UserMenu`)
- [ ] Form field set: input, textarea, select, checkbox, label, hint, error
- [ ] Skeleton loading placeholders
- [ ] Toast / inline alert

### Operations
- [ ] Re-encode uploads server-side; stop trusting client-reported MIME types
- [ ] Per-account upload quota; delete superseded avatars
- [ ] Enable Turnstile (code path exists, needs two environment variables)
- [ ] Switch CSP from Report-Only to enforcing
- [ ] Automated PostgreSQL backups
- [x] Compress oversized images in `public/` (done 2026-08-27 — 9.05MB to 0.19MB)

---

## Not started

- **Workout planner.** A separate application section. Needs its own scope, data
  model and routes before any work begins.
- **Direct messages.** Deliberately deferred until the forum layer is settled.
- **Detailed game match history.** Currently only launch events are recorded.
