"use client";

import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

type HereToSlayRoomLauncherProps = {
  initialRoom?: string;
  initialError?: string;
};

function openAccountModal(mode: "login" | "verify", next: string, message: string) {
  window.dispatchEvent(
    new CustomEvent("miguisanson:open-account", {
      detail: { mode, next, message },
    }),
  );
}

export function HereToSlayRoomLauncher({ initialRoom = "", initialError = "" }: HereToSlayRoomLauncherProps) {
  const { data: session, isPending } = authClient.useSession();
  const [roomCode, setRoomCode] = useState(initialRoom);
  const [error, setError] = useState(initialError);

  function authenticatedLaunch(path: string) {
    if (!session) {
      openAccountModal("login", path, "Log in or create an account to use private game rooms.");
      return;
    }
    if (!session.user.emailVerified) {
      openAccountModal("verify", path, "Verify your email address before joining a room.");
      return;
    }
    window.location.assign(path);
  }

  function createRoom() {
    setError("");
    authenticatedLaunch("/api/game/launch");
  }

  function joinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = roomCode.toUpperCase().replace(/[^A-Z2-9]/g, "");
    if (normalized.length !== 8) {
      setError("Enter the complete 8-character room code.");
      return;
    }
    setError("");
    authenticatedLaunch(`/api/game/launch?room=${encodeURIComponent(normalized)}`);
  }

  return (
    <section className="game-room-launcher" aria-labelledby="room-launcher-title">
      <div className="game-room-copy">
        <div>
          <span className="post-meta">Private multiplayer</span>
          <h2 id="room-launcher-title">Create or join a room</h2>
        </div>
        <p>Each room has its own players and tabletop state. Share its code only with the people you want to invite.</p>
      </div>
      <div className="game-room-actions">
        <button className="ui-button ui-button--primary ui-button--md" type="button" onClick={createRoom} disabled={isPending}>
          Create private room
        </button>
        <form className="game-room-join" onSubmit={joinRoom}>
          <label htmlFor="here-to-slay-room">Room code</label>
          <div>
            <input
              id="here-to-slay-room"
              name="room"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value.toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 8))}
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="ABCD2345"
              aria-describedby={error ? "room-launch-error" : "room-code-hint"}
              aria-invalid={Boolean(error)}
            />
            <button className="ui-button ui-button--neutral ui-button--md" type="submit" disabled={isPending}>
              Join room
            </button>
          </div>
          {error ? <p className="account-mini-error" id="room-launch-error" role="alert">{error}</p> : <p className="field-hint" id="room-code-hint">Codes expire after eight hours.</p>}
        </form>
      </div>
    </section>
  );
}
