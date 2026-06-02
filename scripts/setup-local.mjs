#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localEnvPath = path.join(repoRoot, ".env.local");
const executable = (command) => (process.platform === "win32" ? `${command}.exe` : command);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function secret() {
  return randomBytes(48).toString("base64url");
}

function run(command, args) {
  return spawnSync(command, args, {
    cwd: repoRoot,
    env: process.env,
    shell: process.platform === "win32" && command.endsWith(".cmd"),
    stdio: "inherit",
    windowsHide: true,
  });
}

if (!existsSync(localEnvPath)) {
  const localEnv = `DATABASE_URL=postgresql://miguisanson:miguisanson_dev@localhost:5432/miguisanson_dev
BETTER_AUTH_SECRET=${secret()}
BETTER_AUTH_URL=http://localhost:3000
GAME_TICKET_SECRET=${secret()}
NEXT_PUBLIC_HERE_TO_SLAY_URL=http://localhost:5000/
LIVEBOARD_AUTH_REQUIRED=true
RESEND_API_KEY=
AUTH_EMAIL_FROM=miguisanson.dev <accounts@example.com>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
`;
  await writeFile(localEnvPath, localEnv, "utf8");
  console.log("[setup] Created .env.local with development secrets.");
} else {
  console.log("[setup] Keeping the existing .env.local file.");
}

const dockerCheck = spawnSync(executable("docker"), ["--version"], {
  encoding: "utf8",
  windowsHide: true,
});

if (dockerCheck.status !== 0) {
  console.log("[setup] Docker was not found. Configure a PostgreSQL DATABASE_URL, then run `npm run auth:migrate`.");
  console.log("[setup] The portfolio and lobby code are ready, but account requests require PostgreSQL.");
  process.exit(0);
}

console.log("[setup] Starting the local PostgreSQL container...");
const compose = run(executable("docker"), ["compose", "up", "-d", "--wait", "postgres"]);
if (compose.status !== 0) {
  process.exit(compose.status ?? 1);
}

console.log("[setup] Applying Better Auth migrations...");
const migrate = run(npm, ["run", "auth:migrate"]);
process.exit(migrate.status ?? 1);
