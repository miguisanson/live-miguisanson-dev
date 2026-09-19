# Owner setup — the things only Migui can do

Agents never touch the server, the dashboards or secrets. This file holds the
exact steps for each line in the **Owner queue** (`.planning/STATE.md`). Agents
add a section here whenever they add a queue line. Nothing in this file may
contain a secret, an IP address, a tunnel id or an internal hostname — the
repository is public.

---

## G-2 — Bring the site back up (Cloudflare error 1033)

Error 1033 means Cloudflare cannot reach a running `cloudflared` on the server.
On the Ubuntu VM:

```bash
systemctl status cloudflared
```

```bash
journalctl -u cloudflared -n 50 --no-pager
```

If the service does not exist, install it from the tunnel's token (Cloudflare
dashboard → Zero Trust → Networks → Tunnels → your tunnel → Configure → the
install command shown there), then:

```bash
sudo systemctl enable --now cloudflared
```

Make it restart by itself. Run `sudo systemctl edit cloudflared` and add:

```ini
[Service]
Restart=always
RestartSec=5
```

Then check the app services start at boot too:

```bash
systemctl is-enabled miguisanson here-to-slay
```

**Done when:** reboot the VM, do not log in, and
`curl -sI https://miguisanson.dev` from another machine returns `200`.

## Which branch production runs

Keep production on `v0.7` until roadmap milestone M0 is green on `v0.8`. Then:

```bash
./scripts/deploy.sh v0.8
```

`DRY_RUN=1 ./scripts/deploy.sh v0.8` shows the plan first.

## G-9 — GitHub settings

Repository → Settings → Code security: turn on **Secret scanning**, **Push
protection** and **Dependabot alerts**. Settings → Actions → General: set
"Fork pull request workflows" to **require approval for all outside
collaborators**. Do **not** add a self-hosted runner to this public repository.

## O-3 — Backup target

1. Cloudflare dashboard → R2 → create a bucket for backups.
2. Create an API token limited to that bucket (Object Read & Write).
3. On the server only, put the keys and a long restic passphrase in the
   service's environment file (never in the repo). Store the passphrase
   somewhere off the server too — without it the backups cannot be read.
4. A second physical disk is still the first priority for the 8 TB USB drive
   (CONTEXT §9).

## O-4 / O-9 — Uptime check and staging

- Uptime: any external monitor (UptimeRobot, Better Stack, or Uptime Kuma on a
  *different* machine) hitting `https://miguisanson.dev/api/health` and the game
  hostname.
- Staging: Zero Trust → Access → Applications → add `staging.miguisanson.dev`
  with a policy allowing only your email; add the public hostname to the tunnel.

## Turnstile (A-3)

Cloudflare dashboard → Turnstile → add the site → put the site key and secret in
the server's environment (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
`TURNSTILE_SECRET_KEY`).

## Decisions waiting for you

- **Here to Slay** (PROPOSALS F-10): keep private and unlisted *(current)*, ask
  the publisher, or re-skin with original art.
- **Contact details** in `src/data/profile.ts`: phone number and personal email
  are public. Keep, or switch to an alias / contact form?
- **Palette:** v0.8 follows CONTEXT §4 (blue-tinted neutrals + emerald). Say if
  you want strict black/white/grey instead — it is one token change in D-2.
- **Case-study facts** (P-2): for each project — dates, your role, one number
  that shows the result, the hardest problem. Drafts will mark gaps with
  `[OWNER: confirm]`.

## Running the autopilot (only after roadmap rows G-3…G-6 are ✅)

```bash
scripts\autopilot-start.cmd
```

Stop it after the current session:

```bash
type nul > .planning\AUTOPILOT_STOP
```

Check in on it from a Claude session with `/checkin_live-miguisanson-dev`. It
builds on Sonnet, reviews every fifth session on the strong model, sleeps
through usage limits, never pushes and never deploys. It runs Claude with
permission prompts switched off, exactly as in rpg-gm — so only run it on this
PC, in this repo.

## Reddit and other references

Agent sessions cannot open reddit.com. Paste links or text you like into
`docs/reference-notes/` (any `.md` file) and the next session folds them into
`docs/REFERENCES.md`.
