"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

type AccountMode = "profile" | "login" | "signup" | "verify" | "forgot" | "reset";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          theme: "auto";
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turnstileSiteKey || !container.current) {
      return;
    }

    let widgetId: string | undefined;
    const render = () => {
      if (!container.current || !window.turnstile || widgetId) {
        return;
      }
      widgetId = window.turnstile.render(container.current, {
        sitekey: turnstileSiteKey,
        callback: onToken,
        "expired-callback": () => onToken(""),
        theme: "auto",
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-turnstile="true"]');
    if (existingScript) {
      if (window.turnstile) {
        render();
      } else {
        existingScript.addEventListener("load", render, { once: true });
      }
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = "true";
      script.addEventListener("load", render, { once: true });
      document.head.append(script);
    }

    return () => {
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [onToken]);

  return turnstileSiteKey ? <div className="account-captcha" ref={container} /> : null;
}

function getInitialRequest() {
  const params = new URLSearchParams(window.location.search);
  const requestedMode = params.get("account");
  return {
    mode: (
      requestedMode === "signup" ||
      requestedMode === "verify" ||
      requestedMode === "forgot" ||
      requestedMode === "reset"
        ? requestedMode
        : "login"
    ) as AccountMode,
    next: params.get("next") ?? "",
    message: params.get("message") ?? "",
    token: params.get("token") ?? "",
    shouldOpen: params.has("account") || params.has("token"),
  };
}

function safeNextPath(next: string) {
  return next.startsWith("/") && !next.startsWith("//") ? next : "";
}

export function AccountMenu() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AccountMode>("login");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [nextPath, setNextPath] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const request = getInitialRequest();
    if (!request.shouldOpen) {
      return;
    }

    setMode(request.token ? "reset" : request.mode);
    setResetToken(request.token);
    setNextPath(safeNextPath(request.next));
    setMessage(request.message);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.classList.add("account-modal-open-body");
    } else {
      document.body.classList.remove("account-modal-open-body");
    }

    return () => document.body.classList.remove("account-modal-open-body");
  }, [open]);

  useEffect(() => {
    if (session?.user.emailVerified && nextPath) {
      window.location.assign(nextPath);
    }
  }, [nextPath, session?.user.emailVerified]);

  function openModal(nextMode?: AccountMode) {
    setMode(nextMode ?? (session ? "profile" : "login"));
    setError("");
    setMessage("");
    setCaptchaToken("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setError("");
    setMessage("");
    const url = new URL(window.location.href);
    for (const key of ["account", "message", "next", "token", "error"]) {
      url.searchParams.delete(key);
    }
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function fetchOptions() {
    return captchaToken
      ? {
          headers: {
            "x-captcha-response": captchaToken,
          },
        }
      : undefined;
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");

    const value = identifier.trim();
    const result = value.includes("@")
      ? await authClient.signIn.email({ email: value, password, fetchOptions: fetchOptions() })
      : await authClient.signIn.username({ username: value, password, fetchOptions: fetchOptions() });

    setPending(false);
    if (result.error) {
      setError(
        result.error.status === 403
          ? "Verify your email address before logging in. Use the verification link from signup or resend it with your email address."
          : result.error.message ?? "Login failed.",
      );
      return;
    }

    if (nextPath) {
      window.location.assign(nextPath);
      return;
    }
    closeModal();
  }

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");

    if (password.length < 8) {
      setPending(false);
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmPassword) {
      setPending(false);
      setError("The passwords do not match.");
      return;
    }

    const result = await authClient.signUp.email({
      email: email.trim(),
      name: username.trim(),
      username: username.trim(),
      password,
      callbackURL: `${window.location.origin}/?account=login&message=${encodeURIComponent("Email verified. You can now log in.")}`,
      fetchOptions: fetchOptions(),
    });

    setPending(false);
    if (result.error) {
      setError(result.error.message ?? "Account creation failed.");
      return;
    }

    setMode("verify");
    setMessage("Check your inbox for a verification link. The same response is shown when an email is already registered.");
    setPassword("");
    setConfirmPassword("");
  }

  async function resendVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await authClient.sendVerificationEmail({
      email: email.trim(),
      callbackURL: `${window.location.origin}/?account=login&message=${encodeURIComponent("Email verified. You can now log in.")}`,
    });
    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to send a verification email.");
      return;
    }
    setMessage("If the account exists, a fresh verification link has been sent.");
  }

  async function requestPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await authClient.requestPasswordReset({
      email: email.trim(),
      redirectTo: `${window.location.origin}/?account=reset`,
      fetchOptions: fetchOptions(),
    });
    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to request a password reset.");
      return;
    }
    setMessage("If the account exists, a password reset link has been sent.");
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    if (!resetToken) {
      setPending(false);
      setError("This password reset link is missing its token. Request a new link.");
      return;
    }
    if (password.length < 8 || password !== confirmPassword) {
      setPending(false);
      setError(password.length < 8 ? "Use at least 8 characters for your password." : "The passwords do not match.");
      return;
    }

    const result = await authClient.resetPassword({ newPassword: password, token: resetToken });
    setPending(false);
    if (result.error) {
      setError(result.error.message ?? "Unable to reset your password.");
      return;
    }

    setMode("login");
    setPassword("");
    setConfirmPassword("");
    setMessage("Password updated. Log in with your new password.");
  }

  async function signOut() {
    setPending(true);
    await authClient.signOut();
    setPending(false);
    closeModal();
  }

  const displayUsername =
    session && "displayUsername" in session.user && typeof session.user.displayUsername === "string"
      ? session.user.displayUsername
      : session?.user.name;

  return (
    <>
      <button className="account-trigger" type="button" onClick={() => openModal()} disabled={sessionPending}>
        {session ? displayUsername : "Account"}
      </button>

      {open ? (
        <div className="account-modal" role="presentation">
          <button className="account-modal-backdrop" type="button" onClick={closeModal} aria-label="Close account dialog" />
          <section className="account-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="account-modal-title">
            <button className="account-modal-close" type="button" onClick={closeModal} aria-label="Close account dialog">
              &times;
            </button>

            <h2 id="account-modal-title">
              {mode === "signup"
                ? "Create account"
                : mode === "verify"
                  ? "Verify your email"
                  : mode === "forgot"
                    ? "Reset password"
                    : mode === "reset"
                      ? "Choose a new password"
                      : mode === "profile"
                        ? "Your account"
                        : "Log in"}
            </h2>

            {message ? <p className="account-notice">{message}</p> : null}
            {error ? <p className="account-error">{error}</p> : null}

            {mode === "profile" && session ? (
              <div className="account-profile">
                <strong>{displayUsername}</strong>
                <span>{session.user.email}</span>
                <span>{session.user.emailVerified ? "Email verified" : "Email verification required"}</span>
                <button className="account-primary-button" type="button" onClick={signOut} disabled={pending}>
                  Log out
                </button>
              </div>
            ) : null}

            {mode === "login" ? (
              <form className="account-form" onSubmit={submitLogin}>
                <label>
                  Username or email
                  <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" required />
                </label>
                <label>
                  Password
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
                </label>
                <TurnstileWidget onToken={setCaptchaToken} />
                <button className="account-primary-button" type="submit" disabled={pending}>
                  {pending ? "Logging in..." : "Log in"}
                </button>
                <button className="account-text-button" type="button" onClick={() => openModal("forgot")}>
                  Forgot password?
                </button>
                <button className="account-text-button" type="button" onClick={() => openModal("signup")}>
                  Create an account
                </button>
              </form>
            ) : null}

            {mode === "signup" ? (
              <form className="account-form" onSubmit={submitSignup}>
                <label>
                  Username
                  <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" minLength={3} maxLength={30} pattern="[A-Za-z0-9_.]+" required />
                </label>
                <label>
                  Email
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
                </label>
                <label>
                  Password
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
                </label>
                <label>
                  Confirm password
                  <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
                </label>
                <TurnstileWidget onToken={setCaptchaToken} />
                <button className="account-primary-button" type="submit" disabled={pending}>
                  {pending ? "Creating account..." : "Create account"}
                </button>
                <button className="account-text-button" type="button" onClick={() => openModal("login")}>
                  Already have an account? Log in
                </button>
              </form>
            ) : null}

            {mode === "verify" ? (
              <form className="account-form" onSubmit={resendVerification}>
                <label>
                  Email
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
                </label>
                <button className="account-primary-button" type="submit" disabled={pending}>
                  {pending ? "Sending..." : "Resend verification email"}
                </button>
                <button className="account-text-button" type="button" onClick={() => openModal("login")}>
                  Back to login
                </button>
              </form>
            ) : null}

            {mode === "forgot" ? (
              <form className="account-form" onSubmit={requestPasswordReset}>
                <label>
                  Email
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
                </label>
                <TurnstileWidget onToken={setCaptchaToken} />
                <button className="account-primary-button" type="submit" disabled={pending}>
                  {pending ? "Sending..." : "Send reset link"}
                </button>
                <button className="account-text-button" type="button" onClick={() => openModal("login")}>
                  Back to login
                </button>
              </form>
            ) : null}

            {mode === "reset" ? (
              <form className="account-form" onSubmit={resetPassword}>
                <label>
                  New password
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
                </label>
                <label>
                  Confirm password
                  <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
                </label>
                <button className="account-primary-button" type="submit" disabled={pending}>
                  {pending ? "Updating..." : "Update password"}
                </button>
              </form>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}
