---
title: "Here to Slay Online Tabletop"
summary: "A browser-based multiplayer virtual tabletop with a public demo and private-lobby hosting option."
tags: "Java 21, Spring Boot, WebSockets, Docker, JavaScript"
---

## Overview

LiveBoard is a fan-created virtual tabletop for playing Here to Slay online with friends. The public demo opens in the browser and connects to a hosted Spring Boot WebSocket service for real-time multiplayer interactions.

## What visitors can do

- Open the public game directly from the portfolio.
- Start or join the shared multiplayer lobby.
- Load a demo or solo board from the game menu.
- Host a private lobby by downloading the latest LiveBoard release.

## Private lobby setup

Private hosting remains a separate Java service. Install Java 21 or later, launch the LiveBoard JAR file, then visit `http://localhost:5000/`. A tunnel such as Cloudflare Tunnel can expose that private lobby to invited players.

## Source integration

The `HERE-TO-SLAY` folder contains the Spring Boot game source. The portfolio links to the deployed browser client because a visitor cannot reach a server running on another person's `localhost`.
