# miguisanson.dev

Miguel Joaquin A. Sanson's personal technology hub, now transitioning from a Hugo/PaperMod resume site into a Next.js portfolio web app.

## Active Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Markdown content for blog posts and project writeups
- Typed data files for projects, games, lab demos, profile, and resume-style content
- Static prototype bundles under `public/prototypes`

## Quick Start

Fully automated bootstrap from a fresh machine:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/bootstrap-windows.ps1
```

```bash
bash scripts/bootstrap-ubuntu.sh
```

If npm is already available, the same bootstrap scripts can also be run as:

```bash
npm run bootstrap:windows
npm run bootstrap:ubuntu
```

The bootstrap scripts install what they can: Node.js, Java 21, npm packages, `.env.local`, and auth migrations. Local account data defaults to a SQLite file at `.runtime/auth.sqlite`, so Docker is not required for normal development. Docker/PostgreSQL is only used if you explicitly set `MIGUISANSON_USE_DOCKER_POSTGRES=1` or provide a PostgreSQL `DATABASE_URL`.

If Node.js and npm are already installed:

```bash
npm install
npm run setup:local
npm run dev
```

Run the portfolio and your private Here to Slay lobby together:

```bash
npm run dev:all
```

`npm run setup:local` creates `.env.local`, installs missing npm packages, attempts to install Java 21 where the OS package manager supports it, creates a local SQLite auth database, and applies the account tables. For production or shared deployments, configure `DATABASE_URL` for hosted PostgreSQL and run `npm run auth:migrate`.

The first lobby launch downloads a private Maven runtime into `.runtime/maven/`, builds the local source in `games/here-to-slay/`, and caches the JAR in `.runtime/games/here-to-slay/`. Keep the terminal open while you play. The portfolio runs at `http://localhost:3000/` and the private lobby runs at `http://localhost:5000/`.

Create and verify an account from the portfolio header, then use the Here to Slay project card. The protected launch route issues a short-lived signed ticket and opens the lobby. The lobby verifies that ticket before accepting the WebSocket connection.

You can run `npm run dev:all` again if one service is already active. It leaves occupied ports alone and starts only the missing service.

Build production output:

```bash
npm run build
```

Run both production services after a successful build:

```bash
npm run start:all
```

## Private Here to Slay Lobby

The Here to Slay multiplayer lobby is a separate Java service. Java 21 or later is required. A system Maven installation is optional because the launcher downloads a private copy when needed.

Start only the private lobby:

```bash
npm run game:dev
```

Available commands:

```text
npm run game:setup   Build the customized lobby JAR if it is missing
npm run game:build   Rebuild the customized lobby JAR
npm run game:update  Alias for rebuilding the customized lobby JAR
npm run game:dev     Build if needed, then start the lobby on port 5000
npm run game:start   Production alias for starting the lobby
npm run dev:all      Start the Next.js dev server and private lobby together
npm run start:all    Start the production Next.js app and private lobby together
```

## Accounts

The portfolio uses Better Auth with a local SQLite database for development and PostgreSQL for hosted or production deployments. It supports:

- Signup with one normalized email and one normalized username per account
- Verification emails and resend support
- Login with username or email plus password
- Password reset emails
- Database-backed auth rate limits
- Optional Cloudflare Turnstile protection
- Verified-account tickets for Here to Slay player identities
- Admin-only `/admin` dashboard with account stats and audit logs

During local development, verification and reset links print in the Next.js terminal only when no email provider is configured. For production, use Resend with `RESEND_API_KEY` and `AUTH_EMAIL_FROM=miguisanson.dev <accounts@miguisanson.dev>`. Generic SMTP is still supported with `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `AUTH_EMAIL_FROM`. Set both `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` to enable Turnstile.

You can test the whole account flow on Windows at `http://localhost:3000`. Real internet users cannot use your Windows `localhost`; for public signups, deploy the Next.js app on the Ubuntu server or another public host, set `BETTER_AUTH_URL` to the public HTTPS site, and configure Resend or SMTP. In production, signup, resend verification, and password reset are blocked if no email provider is configured.

Account creation rules are intentionally simple:

- Email must be a normal public email address such as `name@gmail.com`, `name@outlook.com`, or `name@example.com`.
- Username must be 3-30 characters and can use letters, numbers, dots, and underscores.
- Password must be 12-128 characters, cannot start or end with a space, cannot be a common weak password, and cannot contain the username or email name.
- Email verification stays enabled. Unverified accounts cannot log in or launch Here to Slay.

### Admin Dashboard

Run this after `npm run auth:migrate` or `bash scripts/setup-ubuntu-server.sh` to create the first admin account:

```bash
npm run admin:bootstrap
```

By default this creates or promotes `accounts@miguisanson.dev`, marks it verified, grants admin access, and prints a generated username/password once. Store the password immediately. To reset the password for that existing admin account later:

```bash
ADMIN_RESET_PASSWORD=1 npm run admin:bootstrap
```

The dashboard is available at `/admin`. Unauthenticated users are sent to login; signed-in non-admin users receive a 404. Audit logging records signup, login, verification resend, password reset request, admin bootstrap, admin user changes, game access setting changes, and game launch events.

Admins can search users, manually verify email, approve or unapprove game access, ban or unban non-admin users, and clear a user's sessions. The **Game Access** controls enforce launch rules server-side:

- `Game open` controls whether normal users can launch the lobby.
- `Approved users only` requires an admin-approved account before launch.
- `Maintenance mode` blocks normal launches while still letting admins test.

### Resend with Cloudflare DNS

Use this for public account verification so the site does not depend on a personal mailbox.

1. Create a Resend account and add `miguisanson.dev` in the Resend Domains dashboard.
2. Resend will show DNS records for domain verification, usually SPF, DKIM, and return-path/bounce records.
3. In Cloudflare, open `miguisanson.dev`, go to **DNS > Records**, and add each record exactly as Resend shows it.
4. Wait for DNS to propagate, then click verify/check in Resend.
5. Create a Resend API key with sending access and put it in `.env.local` or the Ubuntu service environment:

```env
RESEND_API_KEY=re_your_resend_key_here
AUTH_EMAIL_FROM=miguisanson.dev <accounts@miguisanson.dev>
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
```

`accounts@miguisanson.dev` does not need to be a real mailbox just to send verification email through Resend after the domain is verified. If you want to receive replies or support messages at that address, create mailbox forwarding separately in Cloudflare Email Routing or another mailbox provider.

For a fallback local test with Gmail SMTP, use an App Password:

```env
AUTH_EMAIL_FROM=Miguel Sanson <miguelsanson21@gmail.com>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=miguelsanson21@gmail.com
SMTP_PASS=YOUR_16_CHARACTER_GMAIL_APP_PASSWORD
```

Normal Gmail account passwords will not work for SMTP. You need Google 2-Step Verification enabled and then create an App Password in your Google account.

Docker is not required for local accounts. To force the bundled Docker PostgreSQL container instead of SQLite, run setup with `MIGUISANSON_USE_DOCKER_POSTGRES=1`.

To use a different lobby port:

```bash
HERE_TO_SLAY_PORT=5050 npm run game:start
```

In PowerShell:

```powershell
$env:HERE_TO_SLAY_PORT = "5050"
npm run game:start
```

### Public Access

`localhost:5000` works only on the computer running Java. To let website visitors or friends join, expose the lobby through a stable Cloudflare Tunnel, reverse proxy, or another hosting provider. Before setup, create `.env.local` on the Ubuntu server:

```env
DATABASE_URL=postgresql://USER:PASSWORD@DATABASE_HOST:5432/DATABASE_NAME
BETTER_AUTH_SECRET=GENERATE_A_RANDOM_SECRET_WITH_AT_LEAST_32_CHARACTERS
BETTER_AUTH_URL=https://miguisanson.dev
NEXT_PUBLIC_SITE_URL=https://miguisanson.dev
BETTER_AUTH_TRUSTED_ORIGINS=https://miguisanson.dev,https://www.miguisanson.dev,https://game.miguisanson.dev
GAME_TICKET_SECRET=GENERATE_A_DIFFERENT_RANDOM_SECRET_WITH_AT_LEAST_32_CHARACTERS
NEXT_PUBLIC_HERE_TO_SLAY_URL=https://game.miguisanson.dev/
HERE_TO_SLAY_AUTH_REQUIRED=true
RESEND_API_KEY=re_...
AUTH_EMAIL_FROM=miguisanson.dev <accounts@miguisanson.dev>
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

Then set up the whole server with one command:

```bash
bash scripts/setup-ubuntu-server.sh
```

Run both services with one command:

```bash
npm run start:all
```

`start:all` starts Next.js on `PORT` or `3000` and the Java lobby on `HERE_TO_SLAY_PORT` or `5000`. Put a reverse proxy, Cloudflare Tunnel, or equivalent in front of those ports so `miguisanson.dev` points to the Next.js app and `game.miguisanson.dev` points to the lobby. If users can also reach the site through another hostname, add that full origin to `BETTER_AUTH_TRUSTED_ORIGINS`.

### Ubuntu Service

For a persistent boot service, use the setup command above first. Then install the example Java lobby service only if you want systemd to manage the lobby separately:

```bash
sudo cp deploy/here-to-slay.service.example /etc/systemd/system/here-to-slay.service
sudoedit /etc/systemd/system/here-to-slay.service
sudo systemctl daemon-reload
sudo systemctl enable --now here-to-slay
sudo systemctl status here-to-slay
```

Edit `YOUR_UBUNTU_USER`, `WorkingDirectory`, and `.env.local` before starting it. The service restarts the Java lobby automatically after failures or server reboots. Run the Next.js portfolio behind your normal reverse proxy and keep the same `.env.local` available to it.

## Current Structure

```text
src/
  app/                  # Next.js routes
  components/           # Layout, cards, UI, lab components
  data/                 # Typed static data for profile/projects/games/lab
  lib/                  # Markdown/frontmatter helpers
content/
  blog/                 # Markdown blog posts
  projects/             # Markdown project case studies
games/
  here-to-slay/          # Integrated Spring Boot game lobby source
public/
  certificates/         # Resume/certificate assets
  prototypes/           # Static demo builds for project showcases
legacy/
  hugo-public/          # Preserved generated Hugo output
REFERENCES/             # Source reference projects used for prototype migration
```

## Route Map

- `/` - portfolio homepage
- `/about` - about, interests, skills, education
- `/resume` - resume-style page
- `/blog` and `/blog/[slug]` - Markdown learning notes
- `/projects` - redirects to `/resume`
- `/projects/[slug]` - project case studies
- `/games` and `/games/[slug]` - game showcase placeholders
- `/lab` - frontend proof-of-concept demos
- `/lab/ai-workout-planner` - mock AI workout planner
- `/lab/ai-qa-helper` - mock AI QA helper
- `/lab/dashboard-demo` - mock analytics dashboard
- `/prototypes/consumer-iq/` - static P&G Consumer IQ prototype bundle
- `/prototypes/usls-graduate-lifecycle/` - static USLS graduate lifecycle prototype bundle

## Migration Notes

The previous Hugo/PaperMod source is still present for reference and should not be removed until the Next.js version is fully accepted. The old generated Hugo `public/` output was moved to `legacy/hugo-public/` because Next.js needs control of the root `public/` folder and would conflict with generated files like `public/index.html`.

Reusable assets from the old Hugo `static/` folder were copied into the new Next.js `public/` folder. The project cards now link to static prototype bundles built from the richer reference apps:

- `REFERENCES/PG-NEXT-MVP-main`
- `REFERENCES/CAPSTONE-USLS-MVP/References/MVP-FIGMA`

## PaperMod Parity Notes

The active Next.js app intentionally recreates the old PaperMod visual system instead of using a new portfolio design.

Recreated from the preserved Hugo output and source files:

- Header layout: `miguisanson.dev`, theme toggle, and the original About / Experience / Projects / Certifications anchor menu.
- Homepage profile mode: centered circular image, title, subtitle, social icons, and rounded profile buttons.
- Main content width, spacing, PaperMod CSS variables, light/dark theme colors, and mobile stacked navigation.
- About, experience timeline, project cards, certification cards, certificate modal, and scroll-to-top button.
- Blog/project list pages now use PaperMod-style `post-entry` cards.
- Article/case-study pages now use PaperMod-style page headers and `post-content` typography.

Known differences:

- This is a Next.js recreation, so generated Hugo metadata, RSS, taxonomy archive internals, and PaperMod's exact Hugo partial output are not byte-for-byte identical.
- The old Hugo footer was hidden through configuration; the Next.js recreation keeps that behavior and preserves the scroll-to-top control.
- Prototype pages are served as static Next public assets and are intentionally separate from the PaperMod-styled shell.

## Future Upgrade Path

Keep the site static-first until a feature truly needs backend state.

Possible future additions:

- Prisma for database modeling
- PostgreSQL, Supabase, or Neon for persisted data
- OpenAI or another LLM provider through Next.js route handlers
- Authentication only when private user data is introduced
- Saved workout plans or QA history
- Database-backed project logs and lab demo telemetry

The current lab demos intentionally use mock responses and local component state only.
