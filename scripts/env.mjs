import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function parseLine(line) {
  const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!match) {
    return undefined;
  }

  let value = match[2];
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [match[1], value];
}

export function loadLocalEnv(repoRoot) {
  for (const filename of [".env.local", ".env"]) {
    const envPath = path.join(repoRoot, filename);
    if (!existsSync(envPath)) {
      continue;
    }

    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      if (!line.trim() || line.trimStart().startsWith("#")) {
        continue;
      }

      const parsed = parseLine(line);
      if (parsed && process.env[parsed[0]] === undefined) {
        process.env[parsed[0]] = parsed[1];
      }
    }
  }
}
