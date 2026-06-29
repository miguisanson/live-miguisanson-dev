# Changelog

A running log of notable changes to miguisanson.dev. Newest entries on top.
Date format: **Month D, YYYY (Weekday)**. Add a new dated section whenever a set of
changes lands; keep bullets short and grouped.

---

## June 29, 2026 (Monday)

### Platform foundation
- Removed Tailwind entirely; the site uses hand-written CSS in `globals.css` with a strict
  black/white/gray palette and the **Geist** font (`next/font`).
- Built a left-sidebar **app shell** (`AppShell`, `Sidebar`, `TopBar`): brand top-left, nav
  (Home, Resume, Games, Community, Admin [admin-only]), account controls + theme toggle
  top-right, collapsible sidebar, mobile drawer, skip-to-content link, `prefers-reduced-motion`,
  z-index scale.
- Neutral/inverted button system (mono); on-card buttons use an inverted fill for contrast.
- Fixed content-column width so pages no longer size to their content (profiles are a
  consistent 720px regardless of username length).

### Accounts & auth
- better-auth with email + username, email verification, password reset, Cloudflare Turnstile
  captcha, per-route rate limiting, and an audit log.
- Email-verified **account deletion** flow.
- Admin dashboard with `customSession` exposing `isAdmin` to the client.
- Account area reorganized into **Account settings** + **Edit profile** (plus Activity,
  Security) with proper active-tab states; removed the redundant "Overview".

### Profiles & community
- Public profiles at `/u/[username]`: display name, status, favorite quote, bio, favorite
  games, computed **badges** (Admin, Verified, Early member, Here to Slay player, Writer,
  Profile pro), member-since, recent game activity, recent posts.
- **Avatar + banner uploads** (`POST /api/profile/media`, served via `/media/[...path]` with a
  path-traversal guard); per-profile **accent color + background pattern** (scoped to the
  profile card only).
- **Privacy:** public/private toggle + hide-activity. Private profiles still appear in
  community listings but the profile page itself is gated to the owner/admins.
- Edit Profile: full editor with a **Preview** modal (view unsaved changes before saving).
- **Posts (mini-blog):** markdown, public/draft, written on your own profile page; public posts
  appear on the profile and in the community feed. Admins can delete any post.
- **Community** (`/community`): member directory + search + recent-posts feed.

### Games
- Here to Slay launch flow (HMAC-derived player id + short-lived signed ticket).
- Game activity is now labeled by name ("Here to Slay") instead of the raw URL, and the launch
  records the game name for future scalability.

### SEO & performance
- `sitemap.xml` (static routes + public profiles + blog posts), `robots.txt`, `metadataBase`,
  per-profile metadata + `ProfilePage` JSON-LD, canonical URLs.
- `next/image` for local images; immutable cache headers on prototype + uploaded media; shared
  a single DB pool between better-auth and the app; focus-trapped modals; alt text; contrast pass.

### Known unfinished (carried into next work)
- `/games` index is a placeholder while the sidebar links to it; `/games/[slug]` detail is
  orphaned.
- `/blog` index is a placeholder; the markdown articles at `/blog/[slug]` are not linked from
  nav. Blog-vs-Community information architecture needs a decision.
- Home (`/`) is a bare greeting with no dashboard/quick links.

---

## Planned / Upcoming
- **Workout planner** app (new section) — not started.
- Finish the Games index (real grid + launch), reconcile Blog vs Community, and rebuild the Home
  dashboard.
- Deferred community features: DMs/comments, detailed match history, full moderation/reporting,
  image resizing/CDN.
