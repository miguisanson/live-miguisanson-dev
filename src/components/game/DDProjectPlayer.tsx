"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export function DDProjectPlayer() {
  const playerRef = useRef<HTMLDivElement>(null);
  const [frameKey, setFrameKey] = useState(0);

  async function enterFullscreen() {
    await playerRef.current?.requestFullscreen();
  }

  return (
    <section className="game-player" aria-labelledby="dd-project-player-title">
      <div className="game-player-toolbar">
        <div>
          <h2 id="dd-project-player-title">Your private game instance</h2>
          <p>Progress is isolated to this account on this browser.</p>
        </div>
        <div className="game-player-actions">
          <button className="ui-button ui-button--neutral ui-button--sm" type="button" onClick={() => setFrameKey((key) => key + 1)}>
            Restart player
          </button>
          <button className="ui-button ui-button--primary ui-button--sm" type="button" onClick={enterFullscreen}>
            Fullscreen
          </button>
          <Link className="ui-button ui-button--ghost ui-button--sm" href="/games">
            Exit
          </Link>
        </div>
      </div>
      <div className="game-player-frame" ref={playerRef}>
        <iframe
          key={frameKey}
          src="/api/games/dd-project/runtime"
          title="DD Project"
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
        />
      </div>
      <p className="game-player-note">Use a keyboard for the best experience. Click the game once if it does not immediately receive input.</p>
    </section>
  );
}
