# UI/UX Revamp Checklist

Living checklist for the full revamp. Re-evaluate every session (check items, add new ones,
re-prioritize). Pairs with [CHANGELOG.md](CHANGELOG.md) — log what ships, check it here.

Legend: `[ ]` todo · `[~]` partial/exists-but-needs-work · `[x]` done

---

## 0. Foundation — design system (scalability first)
- [~] CSS design tokens consolidated: spacing scale, type scale, radii, shadows, borders, motion
- [ ] Document tokens (a short `design-system` note or comments block)
- [ ] Consistent component class-naming convention
- [x] Strict mono palette (black/white/gray), Geist font, no Tailwind
- [x] z-index scale, `prefers-reduced-motion`, skip-link

## 1. Premade components (reusable library)
- [~] Button (variants: primary/neutral/ghost/danger, sizes, loading, icon-only)
- [~] Card (base + interactive/hover)
- [~] Badge / tag / chip
- [~] Avatar (image + initial fallback, sizes)
- [~] Tabs / segmented nav (active state)
- [ ] Form field set: input, textarea, select, checkbox/radio, label, hint, error
- [~] Modal / dialog (focus trap, esc, backdrop)
- [~] Dropdown / menu
- [~] Empty state
- [ ] Skeleton / loading placeholders
- [ ] Toast / inline alert (notice / error / success)
- [x] Page header (eyebrow / title / description) — `PageShell`
- [~] Stat / metric tile (admin)
- [ ] List row / item primitive

## 2. Imagery
- [ ] Icon system audit — single consistent SVG set (Lucide-style, 24px viewBox)
- [ ] OG / social-share images (default + dynamic per profile/page)
- [ ] Empty-state graphics (mono line illustrations)
- [ ] Section / hero imagery (grayscale or duotone photos / abstract mono art)
- [x] Avatar + banner uploads (with initial/empty fallbacks)
- [ ] Favicon, app icons, web manifest
- [~] `next/image` everywhere (lazy, sized, no CLS)

## 3. Layout & responsive (mobile-first)
- [ ] Mobile-first audit at 375 / 768 / 1024 / 1440
- [x] Sidebar → drawer on mobile; collapsible on desktop
- [ ] Touch targets ≥44px, ≥8px spacing between them
- [ ] Admin tables → horizontal scroll / card layout on mobile
- [ ] No horizontal overflow at 375px on any page
- [x] Consistent content-column width

## 4. Accessibility
- [~] Contrast ≥4.5:1, visible focus, aria labels, keyboard nav, semantic landmarks, alt text, form labels

## 5. Fix unfinished / information architecture
- [ ] Home: replace bare greeting with a real dashboard / entry hub
- [ ] Games: real index grid (sidebar links to a placeholder right now)
- [ ] Blog vs Community: decide IA (merge / rename / keep) and implement
- [ ] Resume: spacing + hierarchy polish
- [ ] Admin: responsive + consistency
- [~] AI-research: light consistency

## 6. Per-page revamp pass
- [ ] Home · Resume · Games (+ detail) · Community · Profile `/u` · Account (+ subpages) · Admin · Blog · AI-research · Login

## 7. Polish pass (scheduled: next prompt)
- [ ] Micro-interactions + hover/transition consistency (150–300ms, no layout shift)
- [ ] Wire loading/skeleton + empty states
- [ ] Final spacing/rhythm + cross-page consistency
- [ ] Full a11y + responsive QA at all breakpoints

## 8. Workout planner (future — separate plan)
- [ ] Scope + data model + routes (after revamp)

## Process
- [x] CHANGELOG.md created
- [x] CHECKLIST.md created
- [ ] Append a dated CHANGELOG entry after each change
- [ ] Re-evaluate this checklist each session
