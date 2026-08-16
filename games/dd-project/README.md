# DD Project

DD Project is deployed from a GameMaker HTML5 export. The browser assets are stored in
`public/game-assets/dd-project/`, while Next.js supplies the authenticated player shell at
`/play/dd-project`.

The generated runner contains a small integration hook that adds an account-derived identifier to
GameMaker's local-storage prefix. This keeps save data separate when different miguisanson.dev
accounts use the same browser. Saves remain local to that browser and do not synchronize between
devices.

To update the game:

1. Export an HTML5 ZIP from GameMaker.
2. Replace `public/game-assets/dd-project/html5game/` with the ZIP's `html5game/` directory.
3. Reapply the account namespace hook in `DD-Project.js` where `_V9._U54=_Q54()` is assigned:
   append `(window.__MIGUISANSON_GAME_INSTANCE__||"guest")+"."` to that prefix.
4. Run `npm run typecheck` and `npm run build`.

Do not copy the exported `index.html` into `public`; the protected runtime endpoint generates the
player document after checking the signed-in account.
