# Start here

@CONTEXT.md

The file above is the project handover — architecture, design rules, conventions
and the decisions on record. Read it before changing anything.

@AGENTS.md

The file above holds the rules every agent follows — Claude, Codex and the
cheaper subagents — and how work is split between them. `ROADMAP.md` is the only
work tracker; `CHANGELOG.md` gets a dated line whenever something ships.

Commands: **`/continue_live-miguisanson-dev`** — start every session with it.

## Claude-specific conventions

- **Never deploy.** Local development only; the owner deploys by hand.
- Read the installed Next.js docs in `node_modules/next/dist/docs/` before
  writing App Router code — this version differs from training data.
- `next dev` rewrites the `nextjs-agent-rules` block at the top of `AGENTS.md`.
  Commit that change with your work instead of reverting it.
- There is no test runner yet. Say "acceptance check-list, confirmed by the
  owner" rather than "tested".
