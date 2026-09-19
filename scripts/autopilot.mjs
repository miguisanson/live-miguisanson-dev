// Unattended runner: starts a headless Claude Code session on /continue_live-miguisanson-dev,
// and when it ends starts another — sleeping through usage limits and stopping
// only when the owner drops a stop file or progress stalls. Once the roadmap is
// done (.planning/ROADMAP_DONE) it stops and waits for the owner; with the
// owner's green light (.planning/IMPROVE_GO) sessions improve the site instead.
//
//   node scripts/autopilot.mjs          run in this window
//   scripts\autopilot-start.cmd         run minimised in the background
//   type nul > .planning\AUTOPILOT_STOP stop after the current session
//
// Logs: logs/autopilot/ (runner.log plus one .jsonl transcript per session).

import { spawn, execFileSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { claudeArgs, holdReason, nextStep, sessionPlan } from "./autopilot-lib.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const LOGS = join(ROOT, "logs", "autopilot");
const STOP_FILE = join(ROOT, ".planning", "AUTOPILOT_STOP");
const DONE_FILE = join(ROOT, ".planning", "ROADMAP_DONE");
const LOCK_FILE = join(LOGS, "runner.lock");
const IDLE_FILE = join(ROOT, ".planning", "AUTOPILOT_IDLE");
const GO_FILE = join(ROOT, ".planning", "IMPROVE_GO");
// A runaway session is killed after this long so the loop always comes back.
const SESSION_TIMEOUT_MS = 6 * 60 * 60 * 1000;

mkdirSync(LOGS, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function log(line) {
  const stamped = `[${new Date().toLocaleString()}] ${line}`;
  console.log(stamped);
  appendFileSync(join(LOGS, "runner.log"), `${stamped}\n`);
}

function commitCount() {
  try {
    return Number(execFileSync("git", ["rev-list", "--count", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim());
  } catch {
    return 0;
  }
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function takeLock() {
  // --take-over: ask the running runner to stop after its current session,
  // wait for it to go, then carry on in its place (used to load a new runner).
  const takeOver = process.argv.includes("--take-over");
  if (takeOver) writeFileSync(STOP_FILE, "take-over");
  while (existsSync(LOCK_FILE)) {
    const pid = Number(readFileSync(LOCK_FILE, "utf8"));
    if (!pid || !alive(pid)) break;
    if (!takeOver) {
      log(`Another runner (pid ${pid}) is already going; exiting.`);
      process.exit(0);
    }
    await sleep(60_000);
  }
  if (takeOver) {
    rmSync(STOP_FILE, { force: true });
    log("Took over from the previous runner.");
  }
  writeFileSync(LOCK_FILE, String(process.pid));
  const release = () => rmSync(LOCK_FILE, { force: true });
  process.on("exit", release);
  process.on("SIGINT", () => { release(); process.exit(130); });
}


/** One headless session; resolves with its exit code and the text worth checking for limits. */
function runSession(index) {
  return new Promise((resolve) => {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const transcript = join(LOGS, `session-${stamp}.jsonl`);
    const plan = sessionPlan({ index, roadmapDone: existsSync(DONE_FILE) });
    const prompt = readFileSync(join(ROOT, ".claude", plan.prompt), "utf8");
    log(`Session ${index} starting (${plan.prompt} on ${plan.model}); transcript ${transcript}`);

    // The prompt goes in on stdin: a multi-line argument does not survive the Windows shell.
    const child = spawn(
      "claude",
      claudeArgs(plan.model),
      { cwd: ROOT, shell: true, windowsHide: true },
    );
    child.stdin.end(prompt);

    let finalText = "";
    let stderr = "";
    let buffer = "";
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      appendFileSync(transcript, text);
      buffer += text;
      let newline;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line.startsWith("{")) continue;
        try {
          const event = JSON.parse(line);
          // Only the final result is checked for limit messages: the transcript
          // itself may quote "429" or "rate_limit" in code the agent reads.
          if (event.type === "result") finalText = `${event.result ?? ""} ${event.subtype ?? ""} ${event.is_error ? "error" : ""}`;
        } catch {
          // A partial or non-JSON line is kept in the transcript and ignored here.
        }
      }
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      appendFileSync(transcript, text);
    });

    const timer = setTimeout(() => {
      log(`Session ${index} passed ${SESSION_TIMEOUT_MS / 3_600_000} hours; stopping it.`);
      child.kill();
    }, SESSION_TIMEOUT_MS);

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ exitCode: code ?? 1, output: `${finalText}\n${stderr.slice(-4000)}` });
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ exitCode: 1, output: String(error) });
    });
  });
}

async function main() {
  await takeLock();
  log("Autopilot started.");
  let stuckRuns = 0;
  for (let index = 1; ; index++) {
    if (existsSync(STOP_FILE)) {
      log("Stop file found before starting; exiting.");
      return;
    }
    const hold = holdReason({ roadmapDone: existsSync(DONE_FILE), improveApproved: existsSync(GO_FILE) });
    if (hold) {
      log(`Not starting: ${hold}`);
      return;
    }
    const before = commitCount();
    const { exitCode, output } = await runSession(index);
    const newCommits = commitCount() - before;
    log(`Session ${index} ended (exit ${exitCode}, ${newCommits} new commit(s)). ${output.trim().slice(0, 300)}`);

    const step = nextStep({
      now: new Date(),
      output,
      exitCode,
      newCommits,
      stuckRuns,
      stopRequested: existsSync(STOP_FILE),
      roadmapDone: existsSync(DONE_FILE),
      improveApproved: existsSync(GO_FILE),
      idle: existsSync(IDLE_FILE),
    });
    // The idle signal is for one rest only; the next audit decides afresh.
    rmSync(IDLE_FILE, { force: true });
    if (step.kind === "STOP") {
      log(`Stopping: ${step.reason}`);
      return;
    }
    stuckRuns = step.stuckRuns;
    if (step.kind === "SLEEP") {
      log(step.reason);
      // Sleep in slices so a stop file dropped meanwhile is noticed within a minute.
      while (Date.now() < step.until.getTime() && !existsSync(STOP_FILE)) {
        await sleep(Math.min(60_000, step.until.getTime() - Date.now()));
      }
    } else {
      await sleep(step.afterMs);
    }
  }
}

main().catch((error) => {
  log(`Runner crashed: ${error?.stack ?? error}`);
  process.exit(1);
});
