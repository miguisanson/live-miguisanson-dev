import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { captcha, username } from "better-auth/plugins";
import { Pool } from "pg";
import { sendTransactionalEmail } from "./email";

const localDatabaseUrl = "postgresql://miguisanson:miguisanson_dev@localhost:5432/miguisanson_dev";
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

function emailHtml(message: string, url: string) {
  return `<p>${message}</p><p><a href="${url}">${url}</a></p>`;
}

export const auth = betterAuth({
  appName: "miguisanson.dev",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: new Pool({
    connectionString: process.env.DATABASE_URL ?? localDatabaseUrl,
  }),
  disabledPaths: ["/is-username-available"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      void sendTransactionalEmail({
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
      void sendTransactionalEmail({
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
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,
      usernameValidator: (value) => /^[a-zA-Z0-9_.]+$/.test(value),
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
