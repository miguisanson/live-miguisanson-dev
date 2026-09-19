// Decisions for the unattended runner (scripts/autopilot.mjs). Pure, so the
// rules for sleeping, retrying and stopping are tested without spawning Claude.

const MINUTE = 60_000;
const RESET_MARGIN_MS = 3 * MINUTE;
const STUCK_BACKOFF_AT = 3;
const STUCK_STOP_AT = 6;

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export function isLimitHit(text) {
  return /hit your (session|weekly|usage|daily) limit|usage limit reached|rate_limit|\b429\b/i.test(text);
}

function to24h(hour, minute, meridiem) {
  let h = Number(hour) % 12;
  if (meridiem.toLowerCase() === "pm") h += 12;
  return { h, m: minute === undefined ? 0 : Number(minute) };
}

/** When the limit named in `text` lifts, in local time; null when no time is given. */
export function parseLimitReset(text, now) {
  const stamp = /limit reached\|(\d{9,})/i.exec(text);
  if (stamp) return new Date(Number(stamp[1]) * 1000);

  const dated = /resets\s+([a-z]{3})[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(text);
  if (dated) {
    const month = MONTHS.indexOf(dated[1].toLowerCase());
    if (month >= 0) {
      const { h, m } = to24h(dated[3], dated[4], dated[5]);
      const date = new Date(now.getFullYear(), month, Number(dated[2]), h, m, 0, 0);
      // A date earlier than now belongs to next year (a December message read in January).
      if (date.getTime() < now.getTime() - 24 * 60 * MINUTE) date.setFullYear(date.getFullYear() + 1);
      return date;
    }
  }

  const clock = /resets\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i.exec(text);
  if (clock) {
    const { h, m } = to24h(clock[1], clock[2], clock[3]);
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
    if (date.getTime() <= now.getTime()) date.setDate(date.getDate() + 1);
    return date;
  }
  return null;
}

/**
 * Why no session may start, or null. The owner wants to see the finished site
 * before anything else changes it (2026-09-20), so a done roadmap holds until
 * .planning/IMPROVE_GO exists — the owner's green light for improvement work.
 */
export function holdReason({ roadmapDone, improveApproved }) {
  if (roadmapDone && !improveApproved) return "Roadmap done; waiting for the owner's green light (.planning/IMPROVE_GO) before improving.";
  return null;
}

/**
 * What to do after one headless session ends.
 * input: { now, output, exitCode, newCommits, stuckRuns, stopRequested, idle }
 */
export function nextStep(input) {
  const { now, output, exitCode, newCommits, stuckRuns, stopRequested, roadmapDone, improveApproved, idle } = input;
  if (stopRequested) return { kind: "STOP", reason: "Stop file found." };
  const hold = holdReason({ roadmapDone, improveApproved });
  if (hold) return { kind: "STOP", reason: hold };

  if (isLimitHit(output)) {
    const reset = parseLimitReset(output, now);
    // A limit is not the agent's fault, so it never counts toward being stuck.
    const until = reset === null ? new Date(now.getTime() + 30 * MINUTE) : new Date(reset.getTime() + RESET_MARGIN_MS);
    return { kind: "SLEEP", until, stuckRuns, reason: `Usage limit hit; waiting until ${until.toLocaleString()}.` };
  }

  // An improvement session that found nothing worth changing rests before
  // auditing again, rather than inventing churn to look busy.
  if (idle) {
    return { kind: "SLEEP", until: new Date(now.getTime() + 6 * 60 * MINUTE), stuckRuns: 0, reason: "Nothing worth improving right now; resting six hours." };
  }

  if (newCommits > 0) return { kind: "RUN", afterMs: MINUTE, stuckRuns: 0 };

  const stuck = stuckRuns + 1;
  if (stuck >= STUCK_STOP_AT) {
    return { kind: "STOP", reason: `No progress in ${stuck} sessions in a row; needs the owner.` };
  }
  if (stuck >= STUCK_BACKOFF_AT) {
    return { kind: "SLEEP", until: new Date(now.getTime() + 60 * MINUTE), stuckRuns: stuck, reason: "No commits for a while; backing off an hour." };
  }
  return { kind: "RUN", afterMs: exitCode === 0 ? MINUTE : 5 * MINUTE, stuckRuns: stuck };
}

/** The instructions file (in .claude/) for the next session. */
export function promptFor({ roadmapDone }) {
  return roadmapDone ? "autopilot-improve-prompt.md" : "autopilot-prompt.md";
}

const REVIEW_EVERY = 5;

/**
 * Which instructions and which model the next session gets. Building runs on
 * Sonnet; every fifth session is a review on the strongest model, which also
 * fixes what it finds — a cheap model reviewing its own work misses the subtle
 * rule errors the tests cannot see, and a finding nobody acts on is worthless.
 */
export function sessionPlan({ index, roadmapDone }) {
  if (index % REVIEW_EVERY === 0) return { prompt: "autopilot-review-prompt.md", model: "opus" };
  return { prompt: promptFor({ roadmapDone }), model: "sonnet" };
}

/**
 * Arguments for one headless session. The main session is pinned to Sonnet:
 * unattended runs must not follow a default that might be Opus, which spends
 * the allowance several times faster. Subagents still pick their own model.
 */
export function claudeArgs(model = "sonnet") {
  return ["-p", "--model", model, "--dangerously-skip-permissions", "--output-format", "stream-json", "--verbose"];
}
