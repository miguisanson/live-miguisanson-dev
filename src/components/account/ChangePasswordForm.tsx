"use client";

import { FormEvent, useState } from "react";
import { validateAccountPassword } from "@/lib/account-policy";
import { authClient } from "@/lib/auth-client";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");

    const passwordError = validateAccountPassword(newPassword);
    if (passwordError || newPassword !== confirmPassword) {
      setPending(false);
      setError(passwordError || "The passwords do not match.");
      return;
    }

    const result = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to change password.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Password updated.");
  }

  return (
    <form className="account-form" onSubmit={submit}>
      {message ? <p className="account-notice">{message}</p> : null}
      {error ? <p className="account-error">{error}</p> : null}

      <label>
        Current password
        <input
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      <label>
        New password
        <input
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          autoComplete="new-password"
          required
        />
      </label>
      <label>
        Confirm new password
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          required
        />
      </label>
      <button className="account-primary-button account-form-submit" type="submit" disabled={pending}>
        {pending ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
