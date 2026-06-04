import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { captcha, username } from "better-auth/plugins";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Pool } from "pg";
import {
  accountPolicy,
  normalizeEmailInput,
  normalizeUsernameInput,
  validateAccountPassword,
  validateEmailAddress,
  validateUsername,
} from "./account-policy";
import { recordAuditEvent } from "./admin-data";
import { hasTransactionalEmailProvider, sendTransactionalEmail } from "./email";

const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
const productionTrustedOrigins = [
  "https://miguisanson.dev",
  "https://www.miguisanson.dev",
  "https://game.miguisanson.dev",
];
const localTrustedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function emailHtml(message: string, url: string) {
  return `<p>${message}</p><p><a href="${url}">${url}</a></p>`;
}

function getTrustedOrigins() {
  return Array.from(
    new Set(
      [
        ...productionTrustedOrigins,
        ...(process.env.NODE_ENV === "production" ? [] : localTrustedOrigins),
        process.env.BETTER_AUTH_URL,
        ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
          .split(",")
          .map((origin) => origin.trim())
          .filter(Boolean),
      ].filter((origin): origin is string => {
        if (!origin) {
          return false;
        }
        if (process.env.NODE_ENV !== "production") {
          return true;
        }
        try {
          const url = new URL(origin);
          return !["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(url.hostname);
        } catch {
          return false;
        }
      }),
    ),
  );
}

function getDatabase() {
  if (process.env.DATABASE_URL) {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  const sqliteFilename = path.basename(process.env.AUTH_SQLITE_PATH ?? "auth.sqlite");
  const sqlitePath = path.join(process.cwd(), ".runtime", sqliteFilename);
  mkdirSync(path.dirname(sqlitePath), { recursive: true });
  return new DatabaseSync(sqlitePath);
}

function rejectSignup(message: string): never {
  throw new APIError("BAD_REQUEST", { message });
}

function stringBodyValue(body: unknown, key: string) {
  if (!body || typeof body !== "object" || !(key in body)) {
    return undefined;
  }
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

function updatedBody(ctx: { body?: unknown }, updates: Record<string, string>) {
  return {
    context: {
      body: {
        ...(ctx.body && typeof ctx.body === "object" ? ctx.body : {}),
        ...updates,
      },
    },
  };
}

type AuditUser = {
  id?: string;
  email?: string | null;
  username?: string | null;
  displayUsername?: string | null;
  name?: string | null;
};

function returnedUser(value: unknown) {
  if (!value || typeof value !== "object" || !("user" in value)) {
    return undefined;
  }
  const user = (value as { user?: unknown }).user;
  return user && typeof user === "object" ? (user as AuditUser) : undefined;
}

function returnedError(value: unknown) {
  if (value instanceof APIError) {
    return value.body?.message ?? value.message;
  }
  if (!value || typeof value !== "object") {
    return "";
  }
  const body = "body" in value ? (value as { body?: unknown }).body : undefined;
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    return typeof message === "string" ? message : "";
  }
  return "";
}

function requestFromContext(ctx: unknown) {
  return ctx && typeof ctx === "object" && "request" in ctx ? ((ctx as { request?: Request }).request) : undefined;
}

async function auditAuthRequest(ctx: { path: string; body?: unknown; context: { returned?: unknown } }) {
  const email = stringBodyValue(ctx.body, "email");
  const usernameValue = stringBodyValue(ctx.body, "username") ?? stringBodyValue(ctx.body, "name");
  const returned = ctx.context.returned;
  const error = returnedError(returned);
  const success = !error;
  const user = returnedUser(returned);
  const request = requestFromContext(ctx);

  if (ctx.path === "/sign-up/email") {
    await recordAuditEvent({
      eventType: "auth.sign_up",
      actor: user ?? { email, username: usernameValue },
      targetUserId: user?.id ?? null,
      targetEmail: user?.email ?? email ?? null,
      metadata: { success, path: ctx.path, error: error || undefined },
      request,
    });
  }

  if (ctx.path === "/sign-in/email" || ctx.path === "/sign-in/username") {
    await recordAuditEvent({
      eventType: "auth.sign_in",
      actor: user ?? { email, username: usernameValue },
      targetUserId: user?.id ?? null,
      targetEmail: user?.email ?? email ?? null,
      metadata: { success, path: ctx.path, error: error || undefined },
      request,
    });
  }

  if (ctx.path === "/send-verification-email") {
    await recordAuditEvent({
      eventType: "auth.verification_requested",
      actor: user ?? { email },
      targetEmail: user?.email ?? email ?? null,
      metadata: { success, path: ctx.path, error: error || undefined },
      request,
    });
  }

  if (ctx.path === "/request-password-reset") {
    await recordAuditEvent({
      eventType: "auth.password_reset_requested",
      actor: user ?? { email },
      targetEmail: user?.email ?? email ?? null,
      metadata: { success, path: ctx.path, error: error || undefined },
      request,
    });
  }
}

export const auth = betterAuth({
  appName: "miguisanson.dev",
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: getTrustedOrigins(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: getDatabase(),
  disabledPaths: ["/is-username-available"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: accountPolicy.passwordMinLength,
    maxPasswordLength: accountPolicy.passwordMaxLength,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendTransactionalEmail({
        to: user.email,
        subject: "Reset your miguisanson.dev password",
        text: `Open this link to reset your password: ${url}`,
        html: emailHtml("Open this link to reset your password:", url),
        developmentUrl: url,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendTransactionalEmail({
        to: user.email,
        subject: "Verify your miguisanson.dev account",
        text: `Open this link to verify your email address: ${url}`,
        html: emailHtml("Open this link to verify your email address:", url),
        developmentUrl: url,
      });
    },
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: {
      "/sign-up/email": { window: 60, max: 5 },
      "/sign-in/email": { window: 10, max: 3 },
      "/sign-in/username": { window: 10, max: 3 },
      "/send-verification-email": { window: 60, max: 3 },
      "/request-password-reset": { window: 60, max: 3 },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        process.env.NODE_ENV === "production" &&
        ["/sign-up/email", "/send-verification-email", "/request-password-reset"].includes(ctx.path) &&
        !hasTransactionalEmailProvider()
      ) {
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message:
            "Email delivery is not configured. Set AUTH_EMAIL_FROM and RESEND_API_KEY or SMTP settings before enabling public accounts.",
        });
      }

      const updates: Record<string, string> = {};
      const email = stringBodyValue(ctx.body, "email");
      if (
        email &&
        ["/sign-up/email", "/sign-in/email", "/send-verification-email", "/request-password-reset"].includes(ctx.path)
      ) {
        const normalizedEmail = normalizeEmailInput(email);
        updates.email = normalizedEmail;
        if (ctx.path === "/sign-up/email") {
          const emailError = validateEmailAddress(normalizedEmail);
          if (emailError) {
            rejectSignup(emailError);
          }
        }
      }

      if (ctx.path === "/sign-up/email") {
        const usernameValue = stringBodyValue(ctx.body, "username") ?? stringBodyValue(ctx.body, "name") ?? "";
        const normalizedUsername = normalizeUsernameInput(usernameValue);
        updates.username = normalizedUsername;
        updates.name = normalizedUsername;

        const usernameError = validateUsername(normalizedUsername);
        if (usernameError) {
          rejectSignup(usernameError);
        }

        const password = stringBodyValue(ctx.body, "password") ?? "";
        const passwordError = validateAccountPassword(password, {
          email: updates.email ?? email,
          username: normalizedUsername,
        });
        if (passwordError) {
          rejectSignup(passwordError);
        }
      }

      if (["/reset-password", "/change-password", "/set-password"].includes(ctx.path)) {
        const password = stringBodyValue(ctx.body, "newPassword") ?? "";
        const passwordError = validateAccountPassword(password);
        if (passwordError) {
          rejectSignup(passwordError);
        }
      }

      if (Object.keys(updates).length > 0) {
        return updatedBody(ctx, updates);
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (
        [
          "/sign-up/email",
          "/sign-in/email",
          "/sign-in/username",
          "/send-verification-email",
          "/request-password-reset",
        ].includes(ctx.path)
      ) {
        await auditAuthRequest(ctx);
      }
    }),
  },
  plugins: [
    username({
      minUsernameLength: accountPolicy.usernameMinLength,
      maxUsernameLength: accountPolicy.usernameMaxLength,
      usernameValidator: (value) => !validateUsername(value),
    }),
    ...(turnstileSecret
      ? [
          captcha({
            provider: "cloudflare-turnstile" as const,
            secretKey: turnstileSecret,
          }),
        ]
      : []),
    nextCookies(),
  ],
});
