#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadLocalEnv } from "./env.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadLocalEnv(repoRoot);

if (!process.env.DATABASE_URL) {
  console.error("[auth] DATABASE_URL is missing. Run `npm run setup:local` or configure `.env.local`.");
  process.exit(1);
}

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(
  npx,
  ["--yes", "auth@1.6.13", "migrate", "--yes", "--config", "src/lib/auth.ts"],
  {
    cwd: repoRoot,
    env: process.env,
    shell: process.platform === "win32",
    stdio: "inherit",
    windowsHide: true,
  },
);

if (result.error) {
  console.error(`[auth] Unable to run Better Auth migrations: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
