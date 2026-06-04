"use client";

import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

type GameLaunchButtonProps = {
  className?: string;
  children?: ReactNode;
};

const launchPath = "/api/game/launch";

function openAccountModal(mode: "login" | "verify", message: string) {
  window.dispatchEvent(
    new CustomEvent("miguisanson:open-account", {
      detail: {
        mode,
        next: launchPath,
        message,
      },
    }),
  );
}

export function GameLaunchButton({ className = "button", children = "Play Game" }: GameLaunchButtonProps) {
  const { data: session, isPending } = authClient.useSession();

  function launch() {
    if (!session) {
      openAccountModal("login", "Log in or create an account to join the tabletop.");
      return;
    }

    if (!session.user.emailVerified) {
      openAccountModal("verify", "Verify your email address before joining the tabletop.");
      return;
    }

    window.location.assign(launchPath);
  }

  return (
    <button className={className} type="button" onClick={launch} disabled={isPending}>
      <span className="button-inner">{children}</span>
    </button>
  );
}
