---
description: Owner check-in while the autopilot builds — status, progress, and (only if asked) a paused review or change.
---

The owner is checking in. **The autopilot may be building this project
unattended** (`scripts/autopilot.mjs`; AGENTS.md "Autopilot"). This interactive
session must not build in parallel with it: two agents editing the repo corrupt
the run.

## 1. Report, read-only (keep it cheap)

Do not read whole files. Gather with a few commands:
- Is it running? `node.exe` processes with `autopilot.mjs` in the command line;
  `.planning/AUTOPILOT_STOP` present or not; the last ~6 lines of
  `logs/autopilot/runner.log`.
- What landed: `git log --oneline` since the owner's last check-in (or the last
  day), grouped into plain-language features.
- Progress: count `docs/ROADMAP.md` rows by mark (✅ 🔨 ⬜, and 👤 / ⏸️ — not
  counted as open), overall and per milestone; is `.planning/ROADMAP_DONE`
  present?
- Quality: the latest "Review N" entries in `.planning/STATE.md`.
- The `## Owner queue` in `.planning/STATE.md` — this is what the owner can
  actually do today; point at the matching steps in `docs/SETUP-OWNER.md`.
- Is the live site up? One request to `https://miguisanson.dev`.
- Helpers: Ollama up? Codex answering?

Tell the owner in plain words, short: running or not, what is new as features,
percent done, anything wrong (a stop, repeated crashes, stuck sessions, limits),
and what needs them. No lists of commit hashes.

## 2. Only if the owner asks for more

- **A review or a change:** first pause the autopilot — create
  `.planning/AUTOPILOT_STOP`, wait until no autopilot `node.exe` remains — then
  work, then delete the stop file and restart it with
  `scripts\autopilot-start.cmd`. Always restart it before ending unless the
  owner said to keep it stopped.
- **The roadmap is done** (`.planning/ROADMAP_DONE`): that stop is on purpose.
  Tell the owner the site is ready to look at and to deploy. Only when they say
  go: create `.planning/IMPROVE_GO`, commit it, and start the runner.
- **The runner is stopped or broken:** find out why from `runner.log` and the
  last transcript in `logs/autopilot/`, fix it, restart it, and confirm a new
  "Session N starting" line.
- **Pushing and deploying** happen only when the owner asks, in this session.
- Follow `AGENTS.md` for any code change.
