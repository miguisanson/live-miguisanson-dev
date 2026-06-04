"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const productionSiteUrl = "https://miguisanson.dev";

function getPublicOrigin() {
  if (siteUrl) {
    return siteUrl.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    return productionSiteUrl;
  }
  return window.location.origin;
}

export function DeleteAccountButton() {
  const [confirmed, setConfirmed] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function requestDeletion() {
    setPending(true);
    setMessage("");
    setError("");
    const result = await authClient.deleteUser({
      callbackURL: `${getPublicOrigin()}/?message=${encodeURIComponent("Account deleted.")}`,
    });
    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to request account deletion.");
      return;
    }
    setMessage("Check your email to confirm deletion.");
  }

  return (
    <div className="account-action-stack">
      <label className="account-check-row">
        <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
        <span>I understand this permanently deletes my account.</span>
      </label>
      <button
        className="account-small-button account-danger-button"
        type="button"
        onClick={requestDeletion}
        disabled={!confirmed || pending}
      >
        {pending ? "Sending..." : "Email deletion link"}
      </button>
      {message ? <p className="account-mini-message">{message}</p> : null}
      {error ? <p className="account-mini-error">{error}</p> : null}
    </div>
  );
}
