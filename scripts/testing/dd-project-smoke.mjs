/**
 * Drives the DD Project runtime in a real Chrome via the DevTools Protocol.
 *
 * The in-app browser pane reports visibilityState "hidden", which throttles
 * requestAnimationFrame to zero — GameMaker's whole loop runs on rAF, so the
 * game can never be observed running there. Chrome launched here is a genuine
 * visible page, so the loop actually ticks.
 */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const CHROME =
  "/Users/miguelsanson/.cache/puppeteer/chrome/mac_arm-150.0.7871.24/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const PORT = 9333;
const OUT = "/private/tmp/claude-501/-Users-miguelsanson-Projects/d49628d6-5b7f-4cc6-a0e0-4bec06eafba4/scratchpad";

const USER = process.env.GAME_USER ?? "migui";
const PASS = process.env.GAME_PASS ?? "MiguiDev2026!Local";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`,
  "--no-first-run",
  "--no-default-browser-check",
  `--user-data-dir=${OUT}/chrome-profile`,
  "--headless=new",
  "--window-size=1280,900",
  "--hide-scrollbars",
  // Let the game start audio without a gesture so a scripted run can reach the
  // same state a human would after clicking.
  "--autoplay-policy=no-user-gesture-required",
  "about:blank",
], { stdio: "ignore" });

process.on("exit", () => chrome.kill());

async function cdpTargets() {
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  return res.json();
}

// Wait for Chrome's debugging endpoint to come up.
let targets;
for (let i = 0; i < 60; i++) {
  try {
    targets = await cdpTargets();
    if (targets.length) break;
  } catch {}
  await sleep(250);
}
if (!targets?.length) {
  console.error("Chrome did not expose a debugging target");
  process.exit(1);
}

const wsUrl = targets.find((t) => t.type === "page").webSocketDebuggerUrl;

// Minimal CDP client over the raw WebSocket — avoids installing puppeteer.
const ws = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let msgId = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
});

function send(method, params = {}) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const { result, exceptionDetails } = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (exceptionDetails) {
    throw new Error(exceptionDetails.exception?.description ?? "evaluate failed");
  }
  return result.value;
}

async function goto(url) {
  await send("Page.navigate", { url });
  await sleep(1500);
}

async function shot(name) {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, "base64"));
  return `${OUT}/${name}.png`;
}

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");

const consoleLines = [];
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === "Log.entryAdded") {
    consoleLines.push(`[${msg.params.entry.level}] ${msg.params.entry.text}`);
  }
});

// --- sign in so the authenticated game route is reachable -------------------
await goto("http://localhost:3000/login");
const login = await evaluate(`
  fetch("/api/auth/sign-in/username", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: ${JSON.stringify(USER)}, password: ${JSON.stringify(PASS)} }),
  }).then(r => r.status)
`);
console.log("login status:", login);

// --- load the game ----------------------------------------------------------
await send("Network.enable");
const netFailures = [];
ws.addEventListener("message", (event) => {
  const m = JSON.parse(event.data);
  if (m.method === "Network.responseReceived" && m.params.response.status >= 400) {
    netFailures.push(m.params.response.status + " " + m.params.response.url);
  }
});

await goto("http://localhost:3000/api/games/dd-project/runtime");
await sleep(3000);

console.log("visibility:", await evaluate(`document.visibilityState`));

// Click the start gate the way a person would.
await evaluate(`
  (() => {
    const gate = document.getElementById("start-gate");
    if (gate && !gate.hidden) { gate.click(); return "clicked"; }
    return gate ? "already hidden" : "no gate";
  })()
`);

// Instrument the loop so we can prove whether frames are being scheduled.
await evaluate(`
  (() => {
    window.__frames = 0;
    const raf = window.requestAnimationFrame.bind(window);
    const tick = () => { window.__frames++; raf(tick); };
    raf(tick);
    window.__t0 = performance.now();
    return true;
  })()
`);

await sleep(5000);

const report = await evaluate(`
  (() => {
    const cv = document.getElementById("canvas");
    const secs = (performance.now() - window.__t0) / 1000;
    return JSON.stringify({
      visibility: document.visibilityState,
      fps: +(window.__frames / secs).toFixed(1),
      framesObserved: window.__frames,
      gateHidden: document.getElementById("start-gate")?.hidden,
      audio: window.g_WebAudioContext && window.g_WebAudioContext.state,
      canvasCss: cv ? [Math.round(cv.getBoundingClientRect().width), Math.round(cv.getBoundingClientRect().height)] : null,
      activeEl: document.activeElement === cv ? "canvas" : document.activeElement?.tagName,
      keydownBound: typeof window.onkeydown,
    }, null, 1);
  })()
`);
console.log("\\n=== RUNTIME REPORT ===");
console.log(report);

await shot("game-01-after-start");

// --- does the picture actually change over time? ----------------------------
async function fingerprint() {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  let hash = 0;
  for (let i = 0; i < data.length; i += 97) hash = (hash * 31 + data.charCodeAt(i)) >>> 0;
  return hash;
}

const a = await fingerprint();
await sleep(2500);
const b = await fingerprint();
console.log("\\nframe changed over 2.5s:", a !== b, `(${a} -> ${b})`);

// --- send real key presses through the CDP input domain ---------------------
async function pressKey(key, code, keyCode) {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode });
  await sleep(120);
  await send("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode });
}

await evaluate(`(() => { window.__keys = []; const o = window.onkeydown; if (typeof o === "function") { window.onkeydown = function(e){ window.__keys.push(e.keyCode); return o.apply(this, arguments); }; } return true; })()`);

for (const [key, code, kc] of [["Enter", "Enter", 13], [" ", "Space", 32], ["Enter", "Enter", 13]]) {
  await pressKey(key, code, kc);
  await sleep(500);
}
await shot("game-02-menu");

// Commit to a difficulty and walk into the world.
await pressKey("Enter", "Enter", 13);
await sleep(2500);
await shot("game-03-entered");

const moveHashes = [];
for (const [key, code, kc] of [["d", "KeyD", 68], ["d", "KeyD", 68], ["s", "KeyS", 83], ["a", "KeyA", 65], ["w", "KeyW", 87]]) {
  await pressKey(key, code, kc);
  await sleep(400);
  moveHashes.push(await fingerprint());
}
await shot("game-04-after-movement");
console.log("distinct frames while moving:", new Set(moveHashes).size, "of", moveHashes.length);

console.log("key codes the game received:", await evaluate(`JSON.stringify(window.__keys)`));
await shot("game-02-after-keys");

const after = await fingerprint();
console.log("frame changed after key presses:", b !== after);

console.log("\\n=== NETWORK >=400 ===");
console.log(netFailures.length ? [...new Set(netFailures)].join("\\n") : "(none)");

console.log("\\n=== SHIM INTERCEPTED URLS ===");
console.log(await evaluate(`JSON.stringify(window.__shimLog || "shim did not log")`));

console.log("\\n=== CONSOLE (errors/warnings) ===");
console.log(consoleLines.filter((l) => !l.startsWith("[verbose]")).slice(-25).join("\\n") || "(none)");

ws.close();
chrome.kill();
process.exit(0);
