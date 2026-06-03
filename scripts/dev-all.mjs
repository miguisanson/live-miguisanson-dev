#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextScript = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next");
const hereToSlayScript = path.join(repoRoot, "scripts", "here-to-slay.mjs");
const children = new Set();
let stopping = false;

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

console.log("[dev:all] Starting the portfolio and private Here to Slay lobby...");
const portfolioPort = getPort("PORT", "3000");
const lobbyPort = getPort("HERE_TO_SLAY_PORT", "5000");

if (await isPortListening(portfolioPort)) {
  console.log(`[dev:all] Port ${portfolioPort} is already in use. Leaving the existing portfolio server running.`);
} else {
  start(process.execPath, [nextScript, "dev", "-p", String(portfolioPort)]);
}

if (await isPortListening(lobbyPort)) {
  console.log(`[dev:all] Port ${lobbyPort} is already in use. Leaving the existing lobby server running.`);
} else {
  start(process.execPath, [hereToSlayScript, "start"]);
}

if (children.size === 0) {
  console.log("[dev:all] Both services were already running.");
}
