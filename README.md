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

```bash
npm install
npm run dev
```

Build production output:

```bash
npm run build
```

Run the production server after a successful build:

```bash
npm run start
```

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
- `/projects` and `/projects/[slug]` - project listing and case studies
- `/games` and `/games/[slug]` - game showcase placeholders
- `/lab` - frontend proof-of-concept demos
- `/lab/ai-workout-planner` - mock AI workout planner
- `/lab/ai-qa-helper` - mock AI QA helper
- `/lab/dashboard-demo` - mock analytics dashboard
- `/prototypes/consumer-iq/` - static P&G Consumer IQ prototype bundle
- `/prototypes/usls-graduate-lifecycle/` - static USLS graduate lifecycle prototype bundle
- `/prototypes/home-server-lab/` - static homelab dashboard placeholder

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
