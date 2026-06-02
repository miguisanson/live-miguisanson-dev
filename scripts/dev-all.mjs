#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextScript = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next");
const liveboardScript = path.join(repoRoot, "scripts", "liveboard.mjs");
const children = new Set();
let stopping = false;

function start(command, args) {
  const child = spawn(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
    windowsHide: true,
  });

  children.add(child);
  child.once("error", (error) => {
    console.error(`[dev:all] Unable to start ${command}: ${error.message}`);
    stopAll();
    process.exitCode = 1;
  });

  child.once("exit", (code, signal) => {
    children.delete(child);
    if (!stopping) {
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

console.log("[dev:all] Starting the portfolio and private LiveBoard lobby...");
start(process.execPath, [nextScript, "dev"]);
start(process.execPath, [liveboardScript, "start"]);
