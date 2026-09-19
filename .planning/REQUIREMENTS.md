# Requirements: miguisanson.dev

**Defined:** 2026-09-20
**Core Value:** A developer's home on the internet that a recruiter understands in
ten seconds and a friend stays on for an hour — self-hosted, test-first, and
itself the flagship project.

Requirement ids are `docs/ROADMAP.md` ids (G-, O-, D-, P-, A-, C-, H-, L-).
`docs/ROADMAP.md` owns WHAT and IN WHAT ORDER and each row's "Done when";
this file only references its ids. Recount from the roadmap — never copy
forward. Marks there: ✅ 🔨 ⬜ ⏸️ (parked) 👤 (owner queue).

## v1 Requirements

All 61 rows through M7 / L-5 are v1. Parked rows are listed but not open.

### M0 — Ground: make the repo safe to build in

- [x] **G-1**: One branch, one truth
- [ ] **G-2**: Bring the site back up (owner queue)
- [ ] **G-11**: Dependency audit back to zero
- [ ] **G-3**: Unit test runner
- [ ] **G-4**: Browser tests
- [ ] **G-5**: Accessibility and layout checks
- [ ] **G-6**: Lint and one gate
- [ ] **G-7**: Java tests stop being skipped
- [ ] **G-8**: Environment validation
- [ ] **G-9**: CI on GitHub's runners
- [ ] **G-10**: Git hooks

### M1 — Operations: a home server that survives

- [ ] **O-1**: Standalone build, release folders, instant rollback
- [ ] **O-2**: systemd units in `deploy/`
- [ ] **O-3**: Backups off the machine
- [ ] **O-4**: Health and uptime
- [ ] **O-5**: Real client IP
- [ ] **O-6**: Uploads made safe
- [ ] **O-7**: CSP enforced
- [ ] **O-8**: Errors and analytics, privately
- [ ] **O-9**: Staging
- [ ] **O-10**: Pull-based deploy (optional)

### M2 — Design system rebuild

- [ ] **D-1**: Layered CSS architecture
- [ ] **D-2**: Tokens v2
- [ ] **D-3**: Primitives, test-first
- [ ] **D-4**: Two shells
- [ ] **D-5**: Migrate page by page and delete as you go
- [ ] **D-6**: Motion and transitions

### M3 — The public face

- [ ] **P-1**: Home
- [ ] **P-2**: Case-study template and five studies
- [ ] **P-3**: Résumé
- [ ] **P-4**: Blog
- [ ] **P-5**: Small pages
- [ ] **P-6**: Identity kit
- [ ] **P-7**: Command menu
- [ ] **P-8**: SEO

### M4 — Members and accounts

- [ ] **A-1**: Profile as showcase
- [ ] **A-2**: Account area
- [ ] **A-3**: Stronger sign-in
- [ ] **A-4**: Admin
- [ ] **A-5**: Badges that mean something
- [ ] **A-6**: Data export

### M5 — Community, stage 1 (VISION §5)

- [ ] **C-1**: Post permalinks
- [ ] **C-2**: Moderation minimums first
- [ ] **C-3**: Flat comments
- [ ] **C-4**: Reactions
- [ ] **C-5**: Empty and sparse states
- [ ] **C-6**: Notifications, in-site only
- [ ] **C-7**: Stage 2 (parked)
- [ ] **C-8**: Stage 3 (parked)

### M6 — Games hub

- [ ] **H-1**: Game pages
- [ ] **H-2**: Devlogs
- [ ] **H-3**: Match and session history
- [ ] **H-4**: Lobby polish
- [ ] **H-5**: Here to Slay canvas client
- [ ] **H-6**: DD Project player
- [ ] **H-7**: One leaderboard per game (parked)

### M7 — Launch quality

- [ ] **L-1**: Accessibility pass
- [ ] **L-2**: Performance budgets
- [ ] **L-3**: Content pass
- [ ] **L-4**: Docs true to the system
- [ ] **L-5**: Release v1.0 (owner queue)

## Out of Scope

See `docs/ROADMAP.md` "Parked" (W-1…W-5) and "Not planned", and `docs/VISION.md` §8.

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| G-1 | 1 | Complete |
| G-2 | 2 | Owner queue |
| G-11 | 3 | Not started |
| G-3 | 4 | Not started |
| G-4 | 5 | Not started |
| G-5 | 6 | Not started |
| G-6 | 7 | Not started |
| G-7 | 8 | Not started |
| G-8 | 9 | Not started |
| G-9 | 10 | Not started |
| G-10 | 11 | Not started |
| O-1 | 12 | Not started |
| O-2 | 13 | Not started |
| O-3 | 14 | Not started |
| O-4 | 15 | Not started |
| O-5 | 16 | Not started |
| O-6 | 17 | Not started |
| O-7 | 18 | Not started |
| O-8 | 19 | Not started |
| O-9 | 20 | Not started |
| O-10 | 21 | Not started |
| D-1 | 22 | Not started |
| D-2 | 23 | Not started |
| D-3 | 24 | Not started |
| D-4 | 25 | Not started |
| D-5 | 26 | Not started |
| D-6 | 27 | Not started |
| P-1 | 28 | Not started |
| P-2 | 29 | Not started |
| P-3 | 30 | Not started |
| P-4 | 31 | Not started |
| P-5 | 32 | Not started |
| P-6 | 33 | Not started |
| P-7 | 34 | Not started |
| P-8 | 35 | Not started |
| A-1 | 36 | Not started |
| A-2 | 37 | Not started |
| A-3 | 38 | Not started |
| A-4 | 39 | Not started |
| A-5 | 40 | Not started |
| A-6 | 41 | Not started |
| C-1 | 42 | Not started |
| C-2 | 43 | Not started |
| C-3 | 44 | Not started |
| C-4 | 45 | Not started |
| C-5 | 46 | Not started |
| C-6 | 47 | Not started |
| C-7 | 48 | Parked |
| C-8 | 49 | Parked |
| H-1 | 50 | Not started |
| H-2 | 51 | Not started |
| H-3 | 52 | Not started |
| H-4 | 53 | Not started |
| H-5 | 54 | Not started |
| H-6 | 55 | Not started |
| H-7 | 56 | Parked |
| L-1 | 57 | Not started |
| L-2 | 58 | Not started |
| L-3 | 59 | Not started |
| L-4 | 60 | Not started |
| L-5 | 61 | Owner queue |
