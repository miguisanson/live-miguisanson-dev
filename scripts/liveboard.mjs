#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { createWriteStream, existsSync } from "node:fs";
import { copyFile, mkdir, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { extract } from "tar";
import { loadLocalEnv } from "./env.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadLocalEnv(repoRoot);
const runtimeDir = path.resolve(repoRoot, process.env.LIVEBOARD_RUNTIME_DIR ?? ".runtime/liveboard");
const overlayDir = path.resolve(repoRoot, process.env.LIVEBOARD_OVERLAY_DIR ?? "liveboard-overlay");
const sourceDir = path.resolve(repoRoot, ".runtime/liveboard-source");
const sourcePatch = path.resolve(repoRoot, "patches/liveboard-account.patch");
const sourceRepository = process.env.LIVEBOARD_SOURCE_URL ?? "https://github.com/LanCorC/LiveBoard.git";
const sourceRevision = process.env.LIVEBOARD_SOURCE_REVISION ?? "cb1fd577401a0520eaef3b2a2486c4b150c470e7";
const localJar = path.join(runtimeDir, "LiveBoard-account-lobby.jar");
const mavenVersion = "3.9.11";
const mavenRuntimeDir = path.resolve(repoRoot, ".runtime/maven");
const mavenHome = path.join(mavenRuntimeDir, `apache-maven-${mavenVersion}`);
const downloadedMaven = path.join(mavenHome, "bin", process.platform === "win32" ? "mvn.cmd" : "mvn");
const releaseApiUrl =
  process.env.LIVEBOARD_RELEASE_API_URL ?? "https://api.github.com/repos/LanCorC/LiveBoard/releases/latest";
const minimumJavaVersion = 21;

function fail(message) {
  console.error(`[liveboard] ${message}`);
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

async function findCachedJar() {
  await mkdir(runtimeDir, { recursive: true });
  const files = await readdir(runtimeDir);
  const jars = files.filter((file) => file.toLowerCase().endsWith(".jar")).sort().reverse();
  return jars.length > 0 ? path.join(runtimeDir, jars[0]) : undefined;
}

async function getReleaseAsset() {
  if (process.env.LIVEBOARD_JAR_URL) {
    const url = new URL(process.env.LIVEBOARD_JAR_URL);
    return {
      name: path.basename(url.pathname) || "LiveBoard.jar",
      url: url.toString(),
      release: "custom",
    };
  }

  console.log("[liveboard] Looking up the latest LiveBoard release...");
  const response = await fetch(releaseApiUrl, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "miguisanson-dev-liveboard-launcher",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub release lookup failed with HTTP ${response.status}.`);
  }

  const release = await response.json();
  const asset = release.assets?.find((candidate) => candidate.name.toLowerCase().endsWith(".jar"));
  if (!asset) {
    throw new Error("The latest LiveBoard release does not contain a JAR file.");
  }

  return {
    name: asset.name,
    url: asset.browser_download_url,
    release: release.tag_name,
  };
}

async function downloadJar(asset) {
  await mkdir(runtimeDir, { recursive: true });
  const destination = path.join(runtimeDir, asset.name);
  const temporaryDestination = `${destination}.download`;

  console.log(`[liveboard] Downloading ${asset.name} from release ${asset.release}...`);
  const response = await fetch(asset.url, {
    headers: {
      "User-Agent": "miguisanson-dev-liveboard-launcher",
    },
    redirect: "follow",
  });

  if (!response.ok || !response.body) {
    throw new Error(`LiveBoard download failed with HTTP ${response.status}.`);
  }

  await rm(temporaryDestination, { force: true });
  try {
    await pipeline(Readable.fromWeb(response.body), createWriteStream(temporaryDestination));
    await rm(destination, { force: true });
    await rename(temporaryDestination, destination);

    const cachedFiles = await readdir(runtimeDir);
    await Promise.all(
      cachedFiles
        .filter((file) => file.toLowerCase().endsWith(".jar") && file !== asset.name)
        .map((file) => rm(path.join(runtimeDir, file), { force: true })),
    );
  } catch (error) {
    await rm(temporaryDestination, { force: true });
    throw error;
  }

  await writeFile(
    path.join(runtimeDir, "release.json"),
    `${JSON.stringify({ ...asset, downloadedAt: new Date().toISOString() }, null, 2)}\n`,
    "utf8",
  );

  console.log(`[liveboard] Saved ${destination}`);
  return destination;
}

async function setup({ refresh = false } = {}) {
  await mkdir(runtimeDir, { recursive: true });
  if (existsSync(localJar) && !refresh) {
    console.log(`[liveboard] Using customized lobby JAR: ${localJar}`);
    return localJar;
  }

  const maven = await getMaven();
  await prepareSource();
  const pom = path.join(sourceDir, "pom.xml");

  console.log("[liveboard] Building the customized account-aware lobby...");
  const build = spawnSync(maven, ["-q", "-f", pom, "clean", "package", "-DskipTests"], {
    cwd: sourceDir,
    encoding: "utf8",
    shell: process.platform === "win32" && maven.endsWith(".cmd"),
    windowsHide: true,
  });

  if (build.status !== 0) {
    throw new Error(`Customized lobby build failed.\n${(build.stderr || build.stdout).trim()}`);
  }

  const targetJar = path.join(sourceDir, "target", "LiveBoard-1.0-SNAPSHOT.jar");
  if (!existsSync(targetJar)) {
    throw new Error(`Maven completed but did not create ${targetJar}.`);
  }

  await copyFile(targetJar, localJar);
  console.log(`[liveboard] Saved customized lobby JAR: ${localJar}`);
  return localJar;
}

async function prepareSource() {
  const runtimeRoot = path.resolve(repoRoot, ".runtime");
  if (!sourceDir.startsWith(`${runtimeRoot}${path.sep}`)) {
    throw new Error(`Refusing to replace lobby source outside ${runtimeRoot}.`);
  }
  if (!existsSync(sourcePatch)) {
    throw new Error(`The lobby customization patch was not found at ${sourcePatch}.`);
  }

  await rm(sourceDir, { recursive: true, force: true });
  await mkdir(path.dirname(sourceDir), { recursive: true });

  console.log(`[liveboard] Cloning pinned LiveBoard source ${sourceRevision}...`);
  const clone = spawnSync("git", ["clone", "--filter=blob:none", "--no-checkout", sourceRepository, sourceDir], {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
  if (clone.status !== 0) {
    throw new Error(`Unable to clone LiveBoard source.\n${(clone.stderr || clone.stdout).trim()}`);
  }

  const checkout = spawnSync("git", ["-C", sourceDir, "checkout", "--detach", sourceRevision], {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
  if (checkout.status !== 0) {
    throw new Error(`Unable to check out LiveBoard source revision ${sourceRevision}.\n${(checkout.stderr || checkout.stdout).trim()}`);
  }

  const apply = spawnSync("git", ["-C", sourceDir, "apply", "--whitespace=nowarn", sourcePatch], {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
  if (apply.status !== 0) {
    throw new Error(`Unable to apply lobby customization patch.\n${(apply.stderr || apply.stdout).trim()}`);
  }
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
  console.log(`[liveboard] Maven was not found. Downloading Maven ${mavenVersion} into .runtime...`);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "miguisanson-dev-liveboard-launcher",
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

  const port = process.env.LIVEBOARD_PORT ?? "5000";
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
    throw new Error(`LIVEBOARD_PORT must be a valid TCP port. Received: ${port}`);
  }

  const jar = await setup();
  console.log(`[liveboard] Starting private lobby at http://localhost:${port}/`);

  const javaArgs = ["-jar", jar, `--server.port=${port}`];
  if (existsSync(overlayDir)) {
    const overlayUrl = pathToFileURL(`${overlayDir}${path.sep}`).href;
    javaArgs.push(
      `--spring.web.resources.static-locations=${overlayUrl},classpath:/META-INF/resources/,classpath:/resources/,classpath:/static/,classpath:/public/`,
    );
    console.log(`[liveboard] Applying lobby UI overlay from ${overlayDir}`);
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
      console.log(`[liveboard] Java lobby stopped by ${signal}.`);
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
    fail("Usage: node scripts/liveboard.mjs <setup [--refresh] | start>");
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
