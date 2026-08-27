# miguisanson.dev

Miguel Joaquin A. Sanson's personal platform — portfolio, member accounts, a community
feed, and a hub for browser games. One Next.js application, self-hosted on Ubuntu
behind a Cloudflare Tunnel.

- **Live:** <https://miguisanson.dev>
- **Changelog:** [CHANGELOG.md](CHANGELOG.md) · also published at `/changelog`
- **Roadmap:** [ROADMAP.md](ROADMAP.md)
- **Architecture notes:** published at `/docs`

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Auth | Better Auth — email + username, verification, resets, rate limits |
| Database | SQLite for development, PostgreSQL for production |
| Styling | Hand-written CSS with design tokens — **no Tailwind** |
| Fonts | Archivo, Geist, Geist Mono — all self-hosted via `next/font` |
| Email | Resend, or any SMTP provider |
| Games | Java 21 + Spring Boot (Here to Slay), GameMaker HTML5 (DD Project) |

---

## Quick start

```bash
npm run setup:local
npm run dev
```

`setup:local` writes `.env.local`, installs missing packages, creates the local SQLite
database and applies the account tables. The site runs at <http://localhost:3000>.

To work on the games as well:

```bash
npm run dev:all
```

This also starts the Java lobby at <http://localhost:5000>. The first launch downloads
a private Maven runtime into `.runtime/maven/` and builds the Java source — expect it
to take a few minutes.

### Requirements

- Node.js 20 or newer
- Java 21 (only if you are working on Here to Slay)
- Docker (only if you want PostgreSQL locally — `npm run db:up`)

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run dev:all` | Dev server plus the Java game lobby |
| `npm run build` | Production build |
| `npm run start` | Serve a production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run auth:migrate` | Apply account, admin and audit tables |
| `npm run admin:bootstrap` | Promote an existing account to admin |
| `npm run db:up` / `db:down` | Start or stop local PostgreSQL via Docker |
| `npm run game:setup` | Build the Here to Slay JAR |
| `npm run setup:server` | Provision an Ubuntu server |
| `./scripts/deploy.sh` | Deploy on the server (see below) |

---

## Environment

Copy `.env.example` to `.env.local` and fill it in. Production requires:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. Omit locally to use SQLite. |
| `BETTER_AUTH_SECRET` | Session signing key. `openssl rand -base64 48` |
| `BETTER_AUTH_URL` | Public HTTPS origin, e.g. `https://miguisanson.dev` |
| `NEXT_PUBLIC_SITE_URL` | Same origin, exposed to the browser |
| `GAME_TICKET_SECRET` | Signs game launch tickets. `openssl rand -base64 48` |
| `RESEND_API_KEY` *or* `SMTP_*` | Email delivery |
| `AUTH_EMAIL_FROM` | Sender address for account email |

Optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Bot protection on sign-up. Both required together. |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Extra allowed browser origins, comma-separated |
| `NEXT_PUBLIC_HERE_TO_SLAY_URL` | Public lobby URL |

> In production, sign-up, verification resend and password reset are **refused** if no
> email provider is configured. This is deliberate — accounts that cannot verify are
> worse than no accounts.

During local development, verification and reset links print to the terminal when no
provider is set.

---

## Accounts

- Sign in with either username or email.
- **Usernames:** 3–30 characters — letters, numbers, dots, underscores.
- **Passwords:** 12–128 characters, cannot be a known weak password, and cannot
  contain the username or the local part of the email.
- Email verification is required.
- Rate limits are per-route and stored in the database, so they survive restarts.
- Every authentication event is written to an audit log.
- Password reset revokes all existing sessions.
- Account deletion is self-service and confirmed by email.

### Admin

Promote an account after it has been created and verified. The target is read from
the `ADMIN_EMAIL` environment variable:

```bash
ADMIN_EMAIL=you@example.com npm run admin:bootstrap
```

Admins get `/admin`: account stats, user controls (verify, approve, ban, clear
sessions), game settings and the audit log.

---

## Project structure

```text
src/
  app/              # Routes (App Router)
    api/            # Auth, game launch, media upload
    account/        # Signed-in account area
    admin/          # Admin dashboard
    u/[username]/   # Public profiles
    changelog/      # Public changelog
    docs/           # Public architecture docs
  components/
    ui/             # Button, Card, Badge, Avatar, EmptyState
    layout/         # AppShell, Sidebar, TopBar, PageShell, icons
    auth/ account/ game/ sections/ landing/
  data/             # Static data: profile, projects, games, changelog
  lib/              # auth, app-db, profile-data, posts-data, content, email
content/
  blog/             # Markdown articles
  projects/         # Markdown project write-ups
games/
  here-to-slay/     # Java + Spring Boot lobby
  dd-project/       # GameMaker HTML5 packaging notes
scripts/            # Setup, migration, deploy
public/             # Static assets, including the DD Project runtime
```

### CSS

All styling lives in `src/app/globals.css`. The token block at the top is the single
source of truth for colour, type, spacing, radius, elevation and motion, defined once
for light and once for dark.

**Components must never hard-code a colour.** A component styled through tokens is
correct in both themes automatically. A colour defined only inside a `[data-theme]`
block is the classic unreadable-in-one-theme bug.

---

## Route map

| Route | Access | Notes |
| --- | --- | --- |
| `/` | Public | Greeting and section cards |
| `/resume` | Public | Portfolio, skills, education, certifications |
| `/projects`, `/projects/[slug]` | Public | Markdown write-ups |
| `/blog`, `/blog/[slug]` | Public | Markdown articles |
| `/games`, `/games/[slug]` | Public | Index; launching needs a verified account |
| `/play/dd-project` | Verified | In-site authenticated player |
| `/community` | Public | Member directory, search, post feed |
| `/u/[username]` | Public* | Public profiles. Private ones are owner/admin only. |
| `/account/**` | Signed in | Settings, profile, activity, security |
| `/admin` | Admin | Dashboard and audit log |
| `/changelog`, `/docs` | Public | Project reference |
| `/login` | Public | Sign in and sign up |

---

## Deployment

Deployment is manual and deliberate — there is no CI pipeline.

```bash
# on the Ubuntu server, from the repository root
./scripts/deploy.sh
```

The script runs preflight checks (Node version, required environment variables),
fetches the branch, installs, migrates, **builds, and only then restarts**. A failed
build never replaces a running site. It finishes with a health check.

```bash
./scripts/deploy.sh v0.7      # deploy a specific branch or tag
DRY_RUN=1 ./scripts/deploy.sh # show what would happen, change nothing
```

Override defaults with `DEPLOY_BRANCH`, `DEPLOY_SERVICE`, `DEPLOY_HEALTH_URL`.

### After deploying

**Purge the Cloudflare cache.** The homepage is served with a long `s-maxage`, so
without a purge the CDN keeps serving the previous build:

> Cloudflare dashboard → miguisanson.dev → Caching → Configuration → Purge Everything

### Email through Resend

1. Add `miguisanson.dev` in the Resend dashboard.
2. Add the SPF, DKIM and return-path records it shows to Cloudflare DNS.
3. Verify in Resend, then set `RESEND_API_KEY` and `AUTH_EMAIL_FROM`.

`accounts@miguisanson.dev` does not need to be a real mailbox to *send*. To receive
replies, set up forwarding separately via Cloudflare Email Routing.

### Games

`localhost:5000` only works on the machine running Java. To let visitors join, expose
the lobby through a Cloudflare Tunnel at `game.miguisanson.dev`. A systemd unit
example is in `deploy/here-to-slay.service.example`.

---

## Security

Verified as of 2026-08-27:

- Every database query is parameterized.
- User posts are escaped **before** formatting is applied — the ordering that makes a
  user-generated feed safe.
- Every server action checks the session; post edits and deletes verify ownership.
- The media route resolves and bounds paths before reading.
- Security headers on every response: HSTS, nosniff, frame protection, referrer and
  permissions policy.
- CSP is active in **Report-Only** mode. Flip `enforceContentSecurityPolicy` in
  `next.config.ts` once it is validated against production traffic.
- `npm audit` reports zero vulnerabilities.

Known gaps are tracked in [ROADMAP.md](ROADMAP.md) under Operations: uploads are still
trusted by their browser-reported type and are not re-encoded, there is no per-account
upload quota, and Turnstile is wired but not switched on.

---

## Contributing to this repository

When you ship something:

1. Add a dated entry to [CHANGELOG.md](CHANGELOG.md) under `## YYYY-MM-DD`.
2. Mirror it into `src/data/changelog.ts` so the public page matches.
3. Move the item to Done in [ROADMAP.md](ROADMAP.md).

Absolute dates only. No third tracker file.
