"use client";

import { authClient } from "@/lib/auth-client";
import { UserMenu } from "./UserMenu";

type AccountUser = {
  username?: string | null;
  displayUsername?: string | null;
  name?: string | null;
  email?: string | null;
};

function openAccount(mode: "login" | "signup") {
  window.dispatchEvent(new CustomEvent("miguisanson:open-account", { detail: { mode } }));
}

export function AccountControls() {
  const { data: session, isPending } = authClient.useSession();

  if (session) {
    const user = session.user as AccountUser;
    const username = user.username ?? "";
    const displayName = user.displayUsername ?? user.username ?? user.name ?? user.email ?? "Account";
    return <UserMenu username={username} displayName={displayName} />;
  }

  return (
    <div className="account-trigger-group">
      <button className="account-trigger" type="button" onClick={() => openAccount("login")} disabled={isPending}>
        Log in
      </button>
      <button className="account-trigger account-trigger-accent" type="button" onClick={() => openAccount("signup")} disabled={isPending}>
        Create account
      </button>
    </div>
  );
}
