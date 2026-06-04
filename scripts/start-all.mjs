#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadLocalEnv } from "./env.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hereToSlayScript = path.join(repoRoot, "scripts", "here-to-slay.mjs");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const children = new Set();
let stopping = false;

loadLocalEnv(repoRoot);

function getPort(name, fallback) {
  const port = process.env[name] ?? fallback;
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
    throw new Error(`${name} must be a valid TCP port. Received: ${port}`);
  }
  return Number(port);
}

function isPortListening(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });
    socket.setTimeout(500);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

function runPreflight(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env: process.env,
    stdio: "inherit",
    windowsHide: true,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function requireEnvValue(name) {
  if (!process.env[name]?.trim()) {
    throw new Error(`${name} is required. Set it in .env.local before running start:all.`);
  }
}

function hasCompleteSmtpConfig() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_PORT?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS,
  );
}

function requirePublicUrl(name) {
  requireEnvValue(name);
  const url = new URL(process.env[name]);
  if (["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(url.hostname)) {
    throw new Error(`${name} must be a public URL for start:all. Received: ${process.env[name]}`);
  }
}

function requirePublicOriginList(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    return;
  }

  for (const origin of value.split(",").map((item) => item.trim()).filter(Boolean)) {
    const url = new URL(origin);
    if (["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(url.hostname)) {
      throw new Error(`${name} must not include local origins for start:all. Received: ${origin}`);
    }
  }
}

function requireProductionEnv() {
  for (const name of [
    "BETTER_AUTH_SECRET",
    "GAME_TICKET_SECRET",
    "AUTH_EMAIL_FROM",
  ]) {
    requireEnvValue(name);
  }
  requirePublicUrl("BETTER_AUTH_URL");
  requirePublicUrl("NEXT_PUBLIC_SITE_URL");
  requirePublicUrl("NEXT_PUBLIC_HERE_TO_SLAY_URL");
  requirePublicOriginList("BETTER_AUTH_TRUSTED_ORIGINS");

  if (!process.env.RESEND_API_KEY?.trim() && !hasCompleteSmtpConfig()) {
    throw new Error("Email delivery is not configured. Set RESEND_API_KEY or complete SMTP settings in .env.local.");
  }
}

function start(label, command, args, extraEnv = {}) {
  const child = spawn(command, args, {
    cwd: repoRoot,
    env: { ...process.env, ...extraEnv },
    stdio: "inherit",
    windowsHide: true,
  });

  children.add(child);
  child.once("error", (error) => {
    console.error(`[start:all] Unable to start ${label}: ${error.message}`);
    stopAll();
    process.exitCode = 1;
  });

  child.once("exit", (code, signal) => {
    children.delete(child);
    if (!stopping) {
      console.error(`[start:all] ${label} stopped. Shutting down the remaining service.`);
      stopAll(signal ?? "SIGTERM");
      process.exitCode = code ?? 1;
    }
  });

  return child;
}

function stopAll(signal = "SIGTERM") {
  if (stopping) {
    return;
  }

  stopping = true;
  for (const child of children) {
    if (child.killed) {
      continue;
    }

    if (process.platform === "win32") {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
        windowsHide: true,
      });
    } else {
      child.kill(signal);
    }
  }
}

process.once("SIGINT", () => stopAll("SIGINT"));
process.once("SIGTERM", () => stopAll("SIGTERM"));
process.once("exit", () => stopAll("SIGTERM"));

console.log("[start:all] Starting the production portfolio and private Here to Slay lobby...");
requireProductionEnv();
console.log("[start:all] Applying auth migrations...");
runPreflight(npm, ["run", "auth:migrate"]);

const portfolioPort = getPort("PORT", "3000");
const lobbyPort = getPort("HERE_TO_SLAY_PORT", "5000");

if (await isPortListening(portfolioPort)) {
  console.error(`[start:all] Port ${portfolioPort} is already in use. Stop the existing portfolio server, then rerun npm run start:all.`);
  process.exit(1);
} else {
  start("portfolio", npm, ["run", "start", "--", "-p", String(portfolioPort)], {
    NODE_ENV: "production",
  });
}

if (await isPortListening(lobbyPort)) {
  console.error(`[start:all] Port ${lobbyPort} is already in use. Stop the existing lobby server, then rerun npm run start:all.`);
  stopAll();
  process.exit(1);
} else {
  start("Here to Slay lobby", process.execPath, [hereToSlayScript, "start"]);
}
