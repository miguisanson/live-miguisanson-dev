# Testing scripts

## `dd-project-smoke.mjs`

Drives the DD Project runtime in a real Chrome over the DevTools Protocol and
reports whether the game actually runs.

It exists because the game cannot be tested in a background or hidden page:
GameMaker's entire loop runs on `requestAnimationFrame`, which browsers throttle
to zero when `document.visibilityState` is `"hidden"`. A hidden page therefore
looks identical to a frozen game, which makes it useless for diagnosis.

```bash
# dev server must be running, and the account must exist
GAME_USER=migui GAME_PASS='...' node scripts/testing/dd-project-smoke.mjs
```

Reports frames per second, whether the rendered picture changes over time,
whether key presses reach GameMaker's own handler, audio state, canvas size and
aspect, and any network failure. Screenshots are written next to the script's
output directory.

Requires a Chrome binary; it uses the one Puppeteer caches at
`~/.cache/puppeteer/chrome/...`. Update `CHROME` in the script if that moves.
