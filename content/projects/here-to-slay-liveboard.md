---
title: "Here to Slay Online Tabletop"
summary: "A browser-based multiplayer virtual tabletop with a public demo and private-lobby hosting option."
tags: "Java 21, Spring Boot, WebSockets, Docker, JavaScript"
---

## Overview

LiveBoard is a fan-created virtual tabletop for playing Here to Slay online with friends. The portfolio link opens a private Spring Boot lobby URL configured by the site owner for real-time multiplayer interactions.

## What visitors can do

- Open the private game lobby directly from the portfolio.
- Start or join the site owner's multiplayer lobby.
- Load a demo or solo board from the game menu.
- Host a private lobby by downloading the latest LiveBoard release.

## Private lobby setup

Private hosting remains a separate Java service. Install Java 21 or later, launch the LiveBoard JAR file, then visit `http://localhost:5000/`. A tunnel such as Cloudflare Tunnel can expose that private lobby to invited players. Set `NEXT_PUBLIC_HERE_TO_SLAY_URL` when building the portfolio so its project card opens the public tunnel URL.

## Source integration

The `HERE-TO-SLAY` folder contains the Spring Boot game source and browser client. The portfolio defaults to `http://localhost:5000/` during local development. A deployed portfolio must use a public tunnel URL because a visitor cannot reach a server running on another person's `localhost`.
