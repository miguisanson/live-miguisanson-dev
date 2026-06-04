"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type ResendVerificationButtonProps = {
  email: string;
};

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

export function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function resend() {
    setPending(true);
    setMessage("");
    setError("");
    const result = await authClient.sendVerificationEmail({
      email,
      callbackURL: `${getPublicOrigin()}/?account=login&message=${encodeURIComponent("Email verified. You can now log in.")}`,
    });
    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to send a verification email.");
      return;
    }
    setMessage("Verification email sent.");
  }

  return (
    <div className="account-action-stack">
      <button className="account-small-button" type="button" onClick={resend} disabled={pending}>
        {pending ? "Sending..." : "Resend verification"}
      </button>
      {message ? <p className="account-mini-message">{message}</p> : null}
      {error ? <p className="account-mini-error">{error}</p> : null}
    </div>
  );
}
