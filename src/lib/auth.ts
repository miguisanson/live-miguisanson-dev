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
import { hasTransactionalEmailProvider, sendTransactionalEmail } from "./email";

const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

function emailHtml(message: string, url: string) {
  return `<p>${message}</p><p><a href="${url}">${url}</a></p>`;
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

export const auth = betterAuth({
  appName: "miguisanson.dev",
  baseURL: process.env.BETTER_AUTH_URL,
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
