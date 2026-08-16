# Games

This directory contains game projects that are part of the miguisanson.dev repository.

Each game should live in its own folder:

```text
games/
  dd-project/            # Packaging notes for the GameMaker HTML5 build
  here-to-slay/
```

The deployable DD Project HTML5 assets live in `public/game-assets/dd-project/`; its authenticated
player is implemented by the Next.js `/play/dd-project` route. Here to Slay remains a separate
Spring Boot/WebSocket service. Generated output such as Maven `target/` directories should remain
ignored.
