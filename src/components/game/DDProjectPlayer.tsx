"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

export function DDProjectPlayer() {
  const playerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameKey, setFrameKey] = useState(0);

  // GameMaker listens for keys on the iframe's own window and drops those
  // handlers whenever it blurs. Clicking the frame must therefore move focus
  // into the iframe, not merely onto the element in this document.
  const focusGame = useCallback(() => {
    frameRef.current?.contentWindow?.focus();
  }, []);

  async function enterFullscreen() {
    await playerRef.current?.requestFullscreen();
    // Fullscreen moves focus to the container in this document, which blurs the
    // iframe and kills keyboard input. Hand it straight back.
    focusGame();
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
      <div className="game-player-frame" ref={playerRef} onPointerDown={focusGame}>
        <iframe
          key={frameKey}
          ref={frameRef}
          onLoad={focusGame}
          src="/api/games/dd-project/runtime"
          title="DD Project"
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
        />
      </div>
      <p className="game-player-note">
        Click <strong>Play</strong> in the frame to start — that one click turns on sound and gives
        the game keyboard control. Clicking away pauses input; click the game again to resume.
      </p>
    </section>
  );
}
