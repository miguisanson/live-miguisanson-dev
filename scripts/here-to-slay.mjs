#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { createWriteStream, existsSync } from "node:fs";
import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { extract } from "tar";
import { loadLocalEnv } from "./env.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadLocalEnv(repoRoot);

const gameDir = path.resolve(repoRoot, process.env.HERE_TO_SLAY_SOURCE_DIR ?? "games/here-to-slay");
const runtimeDir = path.resolve(repoRoot, process.env.HERE_TO_SLAY_RUNTIME_DIR ?? ".runtime/games/here-to-slay");
const overlayDir = path.resolve(repoRoot, process.env.HERE_TO_SLAY_OVERLAY_DIR ?? "games/here-to-slay/overlay");
const localJar = path.join(runtimeDir, "here-to-slay-lobby.jar");
const builtJar = path.join(gameDir, "target", "here-to-slay-lobby-1.0-SNAPSHOT.jar");
const mavenVersion = "3.9.11";
const mavenRuntimeDir = path.resolve(repoRoot, ".runtime/maven");
const mavenHome = path.join(mavenRuntimeDir, `apache-maven-${mavenVersion}`);
const downloadedMaven = path.join(mavenHome, "bin", process.platform === "win32" ? "mvn.cmd" : "mvn");
const minimumJavaVersion = 21;

function fail(message) {
  console.error(`[here-to-slay] ${message}`);
  process.exitCode = 1;
}

function findJavaVersion() {
  const result = spawnSync("java", ["-version"], {
    encoding: "utf8",
    windowsHide: true,
  });

  if (result.error?.code === "ENOENT") {
    throw new Error("Java was not found. Install Java 21 or later and ensure `java` is on PATH.");
  }

  if (result.status !== 0) {
    throw new Error(`Unable to run Java: ${(result.stderr || result.stdout).trim()}`);
  }

  const output = `${result.stderr}\n${result.stdout}`;
  const match = output.match(/version "(?:1\.)?(\d+)/);
  if (!match) {
    throw new Error("Unable to detect your Java version from `java -version`.");
  }

  return Number(match[1]);
}

async function setup({ refresh = false } = {}) {
  if (!existsSync(path.join(gameDir, "pom.xml"))) {
    throw new Error(`The Here to Slay game source was not found at ${gameDir}.`);
  }

  await mkdir(runtimeDir, { recursive: true });
  if (existsSync(localJar) && !refresh) {
    console.log(`[here-to-slay] Using cached lobby JAR: ${localJar}`);
    return localJar;
  }

  const maven = await getMaven();
  console.log("[here-to-slay] Building the local lobby source...");
  const build = spawnSync(maven, ["-q", "clean", "package", "-DskipTests"], {
    cwd: gameDir,
    encoding: "utf8",
    shell: process.platform === "win32" && maven.endsWith(".cmd"),
    windowsHide: true,
  });

  if (build.status !== 0) {
    throw new Error(`Lobby build failed.\n${(build.stderr || build.stdout).trim()}`);
  }

  if (!existsSync(builtJar)) {
    throw new Error(`Maven completed but did not create ${builtJar}.`);
  }

  await copyFile(builtJar, localJar);
  console.log(`[here-to-slay] Saved lobby JAR: ${localJar}`);
  return localJar;
}

async function getMaven() {
  const installed = spawnSync("mvn", ["-version"], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (installed.status === 0) {
    return "mvn";
  }
  if (existsSync(downloadedMaven)) {
    return downloadedMaven;
  }

  await mkdir(mavenRuntimeDir, { recursive: true });
  const archive = path.join(mavenRuntimeDir, `apache-maven-${mavenVersion}-bin.tar.gz`);
  const url = `https://archive.apache.org/dist/maven/maven-3/${mavenVersion}/binaries/apache-maven-${mavenVersion}-bin.tar.gz`;
  console.log(`[here-to-slay] Maven was not found. Downloading Maven ${mavenVersion} into .runtime...`);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "miguisanson-dev-here-to-slay-launcher",
    },
  });
  if (!response.ok || !response.body) {
    throw new Error(`Maven download failed with HTTP ${response.status}.`);
  }

  await rm(archive, { force: true });
  await pipeline(Readable.fromWeb(response.body), createWriteStream(archive));
  await extract({ file: archive, cwd: mavenRuntimeDir });
  await rm(archive, { force: true });

  if (!existsSync(downloadedMaven)) {
    throw new Error("The Maven archive was downloaded but could not be extracted.");
  }
  return downloadedMaven;
}

async function start() {
  const javaVersion = findJavaVersion();
  if (javaVersion < minimumJavaVersion) {
    throw new Error(`Java ${minimumJavaVersion}+ is required. Detected Java ${javaVersion}.`);
  }

  const port = process.env.HERE_TO_SLAY_PORT ?? "5000";
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
    throw new Error(`HERE_TO_SLAY_PORT must be a valid TCP port. Received: ${port}`);
  }

  const jar = await setup();
  console.log(`[here-to-slay] Starting private lobby at http://localhost:${port}/`);

  const javaArgs = ["-jar", jar, `--server.port=${port}`];
  if (existsSync(overlayDir)) {
    const overlayUrl = pathToFileURL(`${overlayDir}${path.sep}`).href;
    javaArgs.push(
      `--spring.web.resources.static-locations=${overlayUrl},classpath:/META-INF/resources/,classpath:/resources/,classpath:/static/,classpath:/public/`,
    );
    console.log(`[here-to-slay] Applying lobby UI overlay from ${overlayDir}`);
  }

  const child = spawn("java", javaArgs, {
    cwd: repoRoot,
    stdio: "inherit",
    windowsHide: true,
  });

  const stop = (signal) => {
    if (child.killed) {
      return;
    }

    if (process.platform === "win32") {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
        windowsHide: true,
      });
    } else {
      child.kill(signal);
    }
  };

  process.once("SIGINT", () => stop("SIGINT"));
  process.once("SIGTERM", () => stop("SIGTERM"));

  child.once("error", (error) => {
    fail(`Unable to start Java: ${error.message}`);
  });

  child.once("exit", (code, signal) => {
    if (signal) {
      console.log(`[here-to-slay] Java lobby stopped by ${signal}.`);
    }
    process.exitCode = code ?? (signal ? 0 : 1);
  });
}

const [command, ...args] = process.argv.slice(2);

try {
  if (command === "setup") {
    await setup({ refresh: args.includes("--refresh") });
  } else if (command === "start") {
    await start();
  } else {
    fail("Usage: node scripts/here-to-slay.mjs <setup [--refresh] | start>");
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
