# Here to Slay Online Tabletop

This folder is the integrated Java/Spring Boot game lobby for the miguisanson.dev portfolio.

## Layout

- `src/main/java` - Spring Boot server, WebSocket handling, and account ticket verification.
- `src/main/resources/static` - browser tabletop client and game assets.
- `overlay` - optional static HTML override used by the root launcher.
- `Dockerfile` - container build path for standalone lobby deployments.

## Local Commands

Run from the repository root:

```bash
npm run game:setup
npm run game:start
```

`npm run game:setup` builds this local Maven project and caches the runnable JAR under `.runtime/games/here-to-slay/`. `npm run game:start` builds if needed and starts the lobby on `http://localhost:5000/`.

Use `HERE_TO_SLAY_PORT` to start the lobby on a different port.

## Notes

The game source is now owned by this repository's normal Git history. Maven build output stays ignored through `games/*/target/`.

The included `LICENSE` file is retained for the MIT-licensed source imported into this folder and must remain with redistributed copies.
