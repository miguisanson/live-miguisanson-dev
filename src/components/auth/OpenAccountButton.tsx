"use client";

import type { ReactNode } from "react";

type AccountMode = "login" | "signup" | "verify" | "forgot" | "reset";

type OpenAccountButtonProps = {
  mode?: AccountMode;
  next?: string;
  message?: string;
  className?: string;
  children?: ReactNode;
};

export function OpenAccountButton({
  mode = "login",
  next = "",
  message = "",
  className = "button",
  children = "Open account dialog",
}: OpenAccountButtonProps) {
  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("miguisanson:open-account", {
            detail: { mode, next, message },
          }),
        );
      }}
    >
      <span className="button-inner">{children}</span>
    </button>
  );
}
