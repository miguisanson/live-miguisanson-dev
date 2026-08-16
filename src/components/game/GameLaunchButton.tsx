"use client";

import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

type GameLaunchButtonProps = {
  className?: string;
  children?: ReactNode;
  launchPath?: string;
  loginMessage?: string;
  verificationMessage?: string;
};

function openAccountModal(mode: "login" | "verify", message: string, next: string) {
  window.dispatchEvent(
    new CustomEvent("miguisanson:open-account", {
      detail: {
        mode,
        next,
        message,
      },
    }),
  );
}

export function GameLaunchButton({
  className = "button",
  children = "Play Game",
  launchPath = "/api/game/launch",
  loginMessage = "Log in or create an account to play.",
  verificationMessage = "Verify your email address before playing.",
}: GameLaunchButtonProps) {
  const { data: session, isPending } = authClient.useSession();

  function launch() {
    if (!session) {
      openAccountModal("login", loginMessage, launchPath);
      return;
    }

    if (!session.user.emailVerified) {
      openAccountModal("verify", verificationMessage, launchPath);
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
