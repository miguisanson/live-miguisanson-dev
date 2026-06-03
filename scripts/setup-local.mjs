#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localEnvPath = path.join(repoRoot, ".env.local");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const skipAutoInstall = process.env.MIGUISANSON_SKIP_AUTO_INSTALL === "1";
const useDockerPostgres = process.env.MIGUISANSON_USE_DOCKER_POSTGRES === "1";
const bundledPostgresUrl = "postgresql://miguisanson:miguisanson_dev@localhost:5432/miguisanson_dev";
const localSqlitePath = ".runtime/auth.sqlite";

function secret() {
  return randomBytes(48).toString("base64url");
}

function executable(command) {
  return process.platform === "win32" ? `${command}.exe` : command;
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    env: process.env,
    shell: process.platform === "win32" && command.endsWith(".cmd"),
    stdio: options.stdio ?? "inherit",
    encoding: options.encoding,
    windowsHide: true,
  });
}

function commandOk(command, args = ["--version"]) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env: process.env,
    shell: process.platform === "win32" && command.endsWith(".cmd"),
    stdio: "ignore",
    windowsHide: true,
  });
  return result.status === 0;
}

function runElevated(command, args) {
  if (process.platform !== "linux") {
    return run(command, args);
  }
  if (typeof process.getuid === "function" && process.getuid() === 0) {
    return run(command, args);
  }
  if (!commandOk("sudo", ["--version"])) {
    return { status: 1 };
  }
  return run("sudo", [command, ...args]);
}

function appendPathIfExists(directory) {
  if (!existsSync(directory)) {
    return;
  }

  const pathKey = process.platform === "win32" ? "Path" : "PATH";
  const currentPath = process.env[pathKey] ?? "";
  if (!currentPath.split(path.delimiter).some((entry) => entry.toLowerCase() === directory.toLowerCase())) {
    process.env[pathKey] = `${currentPath}${path.delimiter}${directory}`;
  }
}

function installWindowsPackage(id, name) {
  if (skipAutoInstall) {
    return false;
  }
  const winget = executable("winget");
  if (!commandOk(winget, ["--version"])) {
    console.log(`[setup] ${name} is missing and winget is not available. Install it manually, then rerun setup.`);
    return false;
  }

  console.log(`[setup] Installing ${name} with winget...`);
  const result = run(winget, [
    "install",
    "--id",
    id,
    "--exact",
    "--source",
    "winget",
    "--accept-package-agreements",
    "--accept-source-agreements",
  ]);
  return result.status === 0;
}

function readJavaMajor() {
  const result = spawnSync("java", ["-version"], {
    cwd: repoRoot,
    env: process.env,
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0) {
    return 0;
  }

  const output = `${result.stderr}\n${result.stdout}`;
  const match = output.match(/version "(?:1\.)?(\d+)/);
  return match ? Number(match[1]) : 0;
}

async function ensureJava() {
  if (readJavaMajor() >= 21) {
    return;
  }
  if (skipAutoInstall) {
    console.log("[setup] Java 21 was not found. Install Java 21 or later before running the game lobby.");
    return;
  }

  if (process.platform === "win32") {
    installWindowsPackage("EclipseAdoptium.Temurin.21.JDK", "Java 21");
    appendPathIfExists("C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.0.0-hotspot\\bin");
    return;
  }

  if (process.platform === "linux") {
    console.log("[setup] Installing Java 21 with apt...");
    runElevated("apt-get", ["update"]);
    const result = runElevated("apt-get", ["install", "-y", "openjdk-21-jdk"]);
    if (result.status !== 0) {
      console.log("[setup] Java 21 could not be installed automatically. Install openjdk-21-jdk manually if you want to run the game lobby.");
    }
  }
}

function dockerCommand() {
  return executable("docker");
}

function dockerInstalled() {
  return commandOk(dockerCommand(), ["--version"]);
}

function dockerComposeInstalled() {
  return commandOk(dockerCommand(), ["compose", "version"]);
}

function dockerUsable() {
  return commandOk(dockerCommand(), ["info"]);
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDocker(timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (dockerUsable()) {
      return true;
    }
    await sleep(2_000);
  }
  return dockerUsable();
}

async function startDockerDesktop() {
  if (process.platform !== "win32") {
    return;
  }

  const desktopPath = "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe";
  if (!existsSync(desktopPath)) {
    return;
  }

  console.log("[setup] Starting Docker Desktop...");
  spawnSync("powershell.exe", ["-NoProfile", "-Command", `Start-Process -FilePath "${desktopPath}"`], {
    stdio: "ignore",
    windowsHide: true,
  });
  await waitForDocker();
}

async function ensureDocker() {
  if (!dockerInstalled() && !skipAutoInstall) {
    if (process.platform === "win32") {
      installWindowsPackage("Docker.DockerDesktop", "Docker Desktop");
      appendPathIfExists("C:\\Program Files\\Docker\\Docker\\resources\\bin");
    } else if (process.platform === "linux") {
      console.log("[setup] Installing Docker with apt...");
      runElevated("apt-get", ["update"]);
      const install = runElevated("apt-get", ["install", "-y", "docker.io"]);
      if (install.status !== 0) {
        console.log("[setup] Docker could not be installed automatically. Install Docker manually, then rerun setup.");
      }
      if (!dockerComposeInstalled()) {
        const composePlugin = runElevated("apt-get", ["install", "-y", "docker-compose-plugin"]);
        if (composePlugin.status !== 0 && !dockerComposeInstalled()) {
          runElevated("apt-get", ["install", "-y", "docker-compose-v2"]);
        }
      }
      runElevated("systemctl", ["enable", "--now", "docker"]);
    }
  }

  if (!dockerInstalled()) {
    console.log("[setup] Docker was not found. Configure a PostgreSQL DATABASE_URL, then run `npm run auth:migrate`.");
    return false;
  }

  if (!dockerComposeInstalled()) {
    console.log("[setup] Docker is installed, but `docker compose` is unavailable. Install the Docker Compose plugin, then rerun setup.");
    return false;
  }

  if (!dockerUsable()) {
    if (process.platform === "win32") {
      await startDockerDesktop();
    } else if (process.platform === "linux") {
      runElevated("systemctl", ["start", "docker"]);
      await waitForDocker(10_000);
    }
  }

  if (!dockerUsable()) {
    if (process.platform === "linux") {
      console.log("[setup] Docker is installed but this user cannot access the Docker daemon yet.");
      console.log("[setup] Run `sudo usermod -aG docker $USER`, log out and back in, then rerun `npm run setup:local`.");
    } else {
      console.log("[setup] Docker is installed but not running yet. Start Docker Desktop, wait for it to finish, then rerun setup.");
    }
    return false;
  }

  return true;
}

async function ensureNodePackages() {
  if (existsSync(path.join(repoRoot, "node_modules"))) {
    return;
  }

  console.log("[setup] Installing Node packages...");
  const install = run(npm, ["install"]);
  if (install.status !== 0) {
    process.exit(install.status ?? 1);
  }
}

async function ensureEnvFile() {
  if (existsSync(localEnvPath)) {
    console.log("[setup] Keeping the existing .env.local file.");
    await normalizeLocalDatabaseEnv();
    return;
  }

  const databaseLine = useDockerPostgres ? `DATABASE_URL=${bundledPostgresUrl}` : `AUTH_SQLITE_PATH=${localSqlitePath}`;
  const localEnv = `${databaseLine}
BETTER_AUTH_SECRET=${secret()}
BETTER_AUTH_URL=http://localhost:3000
GAME_TICKET_SECRET=${secret()}
NEXT_PUBLIC_HERE_TO_SLAY_URL=http://localhost:5000/
HERE_TO_SLAY_AUTH_REQUIRED=true
RESEND_API_KEY=
AUTH_EMAIL_FROM=miguisanson.dev <accounts@example.com>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
`;
  await writeFile(localEnvPath, localEnv, "utf8");
  console.log("[setup] Created .env.local with development secrets.");
}

async function normalizeLocalDatabaseEnv() {
  if (!existsSync(localEnvPath)) {
    return;
  }

  let envFile = await readFile(localEnvPath, "utf8");
  let changed = false;
  let migratedLiveBoardAuth = false;

  if (/^LIVEBOARD_AUTH_REQUIRED=/m.test(envFile)) {
    if (/^HERE_TO_SLAY_AUTH_REQUIRED=/m.test(envFile)) {
      envFile = envFile.replace(/^LIVEBOARD_AUTH_REQUIRED=.*(?:\r?\n)?/m, "");
    } else {
      envFile = envFile.replace(/^LIVEBOARD_AUTH_REQUIRED=/m, "HERE_TO_SLAY_AUTH_REQUIRED=");
    }
    changed = true;
    migratedLiveBoardAuth = true;
  }

  if (useDockerPostgres) {
    if (changed) {
      await writeFile(localEnvPath, envFile, "utf8");
      if (migratedLiveBoardAuth) {
        console.log("[setup] Updated the old LiveBoard auth setting to Here to Slay.");
      }
    }
    return;
  }

  if (new RegExp(`^DATABASE_URL=${bundledPostgresUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m").test(envFile)) {
    envFile = envFile.replace(
      new RegExp(`^DATABASE_URL=${bundledPostgresUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"),
      `AUTH_SQLITE_PATH=${localSqlitePath}`,
    );
    await writeFile(localEnvPath, envFile, "utf8");
    console.log("[setup] Switched the default local auth database from Docker Postgres to SQLite.");
    if (migratedLiveBoardAuth) {
      console.log("[setup] Updated the old LiveBoard auth setting to Here to Slay.");
    }
    return;
  }

  if (!/^DATABASE_URL=/m.test(envFile) && !/^AUTH_SQLITE_PATH=/m.test(envFile)) {
    envFile = `${envFile.trimEnd()}\nAUTH_SQLITE_PATH=${localSqlitePath}\n`;
    changed = true;
    console.log("[setup] Added local SQLite auth database path to .env.local.");
  }

  if (changed) {
    await writeFile(localEnvPath, envFile, "utf8");
    if (migratedLiveBoardAuth) {
      console.log("[setup] Updated the old LiveBoard auth setting to Here to Slay.");
    }
  }
}

async function getDatabaseMode() {
  if (useDockerPostgres) {
    return "docker-postgres";
  }
  if (!existsSync(localEnvPath)) {
    return "sqlite";
  }

  const envFile = await readFile(localEnvPath, "utf8");
  const databaseUrl = envFile.match(/^DATABASE_URL\s*=\s*(.+)\s*$/m)?.[1]?.trim();
  if (!databaseUrl) {
    return "sqlite";
  }
  return databaseUrl === bundledPostgresUrl ? "docker-postgres" : "external-postgres";
}

await ensureEnvFile();
await ensureNodePackages();
await ensureJava();

const databaseMode = await getDatabaseMode();
if (databaseMode === "sqlite") {
  console.log(`[setup] Using local SQLite auth database at ${localSqlitePath}.`);
  const migrate = run(npm, ["run", "auth:migrate"]);
  process.exit(migrate.status ?? 1);
}

if (databaseMode === "external-postgres") {
  console.log("[setup] Using configured PostgreSQL DATABASE_URL.");
  console.log("[setup] Skipping Docker startup and applying migrations against the configured database.");
  const migrate = run(npm, ["run", "auth:migrate"]);
  process.exit(migrate.status ?? 1);
}

const dockerReady = await ensureDocker();
if (!dockerReady) {
  console.log("[setup] The portfolio and lobby code are ready, but account requests require PostgreSQL.");
  process.exit(0);
}

console.log("[setup] Starting the local PostgreSQL container...");
const compose = run(dockerCommand(), ["compose", "up", "-d", "--wait", "postgres"]);
if (compose.status !== 0) {
  process.exit(compose.status ?? 1);
}

console.log("[setup] Applying Better Auth migrations...");
const migrate = run(npm, ["run", "auth:migrate"]);
process.exit(migrate.status ?? 1);
