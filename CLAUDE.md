# Start here

@CONTEXT.md

The file above is the project handover — architecture, design rules, conventions
and the decisions on record.

@AGENTS.md

The file above holds the rules every agent follows and how work is split between
Claude, Codex, Sonnet subagents and the local model. Do not restate them here.

## Claude-specific notes

- **Start every session with `/continue_live-miguisanson-dev`.** While the
  autopilot is running, use `/checkin_live-miguisanson-dev` instead and do not
  build beside it.
- **The design is [`docs/VISION.md`](docs/VISION.md); the only work queue is
  [`docs/ROADMAP.md`](docs/ROADMAP.md).** `.planning/` tracks execution against
  it and never invents scope. What may be copied from other projects:
  [`docs/REFERENCES.md`](docs/REFERENCES.md). Why things were decided:
  [`docs/PROPOSALS.md`](docs/PROPOSALS.md). What only the owner can do:
  [`docs/SETUP-OWNER.md`](docs/SETUP-OWNER.md) and the Owner queue in
  `.planning/STATE.md`.
- **You are the architect and reviewer, not the typist.** Failing check and
  contract first, implementation to Codex (else Sonnet subagents), mechanical
  text to the local model, then you run the gate, review the diff and commit.
- **Decide, don't ask** — except the few kinds of question PROPOSALS §4 row 12
  reserves for the owner. Take the recommended option, record it, continue.
- **Never read `.env*` files. Never deploy. Never push** unless the owner asks
  in that session. Never publish open security specifics.
- **Look things up.** Next.js 16, React 19 and Better Auth have moved past
  training data: use `context7` and `node_modules/next/dist/docs/`.
- **Load `ui-ux-pro-max` before any UI work** and begin UI phases with
  `/gsd-ui-phase`; `game-ui-ux` / `game-feel` only for the Here to Slay canvas
  client.
- **Talking to the owner:** plain words, short, a recommendation rather than a
  list; say what was tested and what was only inferred.
- Path alias `@/*` → `src/*`.
