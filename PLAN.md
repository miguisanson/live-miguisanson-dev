# PLAN

**Overall goal:** Fully revamp miguisanson.dev into a scalable, mobile-first, modern community
platform (strict black/white/gray, Geist, hand-CSS) and finish every unfinished section.

> Source of truth: this file mirrors [CHECKLIST.md](CHECKLIST.md) and is logged in
> [CHANGELOG.md](CHANGELOG.md). Work milestones top-to-bottom. After each sub-task: flip its
> `[ ]` to `[x]` here, add a CHANGELOG bullet under today's date, and overwrite **Current Task**.

---

## Milestone 1 — Foundation (design system)
- [x] Design tokens (spacing, type, radius, shadow, motion) in `globals.css`
- [x] Core components: `Button`/`ButtonLink`, `Card`/`LinkCard`, `Badge`, `Avatar`, `EmptyState`
- [x] CHANGELOG.md + CHECKLIST.md created

## Milestone 2 — Fix unfinished / IA
- [x] Home entry hub (greeting + section cards)
- [x] Games real index grid (status + tech + Play/Details)
- [x] DD Project HTML5 player (authenticated, account-isolated local saves)
- [x] Here to Slay private rooms (invite code + isolated server state)
- [x] Blog restored as article index; Community = people + feed (kept separate)
- [x] Remove AI Research / Consumer IQ / USLS cards from the resume

## Milestone 3 — Complete the component library
- [ ] Tabs (extract from `AccountTabs`)
- [ ] Modal (extract shared dialog; reuse `useFocusTrap`)
- [ ] Menu / dropdown (extract from `UserMenu`)
- [ ] Form field set (input, textarea, select, checkbox/radio, label, hint, error)
- [ ] Skeleton / loading placeholders
- [ ] Alert / toast (notice / error / success)
- [ ] StatTile + ListRow primitives
- [ ] Consolidated Icon set (`components/ui/Icon`)

## Milestone 4 — Apply system + responsive, page by page
- [ ] Community (`/community`) — member cards (Avatar/Badge), search, feed
- [ ] Public profile (`/u/[username]`) — modern social header + sections
- [ ] Account pages (settings / profile / activity / security)
- [ ] Admin (`/admin`) — adopt cards/badges + responsive tables (scroll/stack)
- [ ] Resume — spacing/hierarchy + component alignment

## Milestone 5 — Imagery (tasteful mono)
- [ ] Icon audit (single consistent SVG set)
- [ ] Favicon + web manifest + app icons
- [ ] Default OG/social image + dynamic OG for `/u/[username]`
- [ ] Empty-state line-art SVGs
- [ ] Grayscale/duotone photo treatment; `next/image` everywhere

## Milestone 6 — Mobile-first QA
- [ ] No horizontal overflow at 375 / 768 / 1024 / 1440
- [ ] Touch targets ≥44px, ≥8px spacing
- [ ] Admin tables usable on mobile

## Milestone 7 — Polish pass
- [ ] Micro-interactions + hover/transition consistency (150–300ms, no shift)
- [ ] Wire loading/skeleton + empty + toast states
- [ ] Final spacing/rhythm + cross-page consistency
- [ ] Full a11y pass (contrast, focus, aria, reduced-motion)

## Milestone 8 — Cleanup
- [x] Fully remove `/ai-research`, `/prototypes/*`, and their orphaned code/content/assets
- [ ] Prune orphaned content/data

## Milestone 9 — Workout planner (future, separate plan)
- [ ] Scope, data model, routes, UI

---

## Status
- Milestone 1: ✅ done
- Milestone 2: ✅ done
- Milestone 3: ⬜ not started
- Milestone 4: ⬜ not started
- Milestone 5: ⬜ not started
- Milestone 6: 🟡 partial (Home/Games verified at 375px)
- Milestone 7: ⬜ not started (scheduled "Polish Pass")
- Milestone 8: ✅ done
- Milestone 9: ⬜ future

## Current Task
Next: Milestone 4 — revamp Community + Public profile with the new component system (mobile-first).
