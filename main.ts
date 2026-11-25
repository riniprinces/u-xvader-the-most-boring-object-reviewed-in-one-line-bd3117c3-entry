#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// One-line review of the most boring everyday object: the rubber band.
// Boring: it just sits there, stretched, holding other things together.
// True: the only thing it ever does by itself is snap — and only ever at
// the exact moment you are counting on it. That is the whole joke.
// ---------------------------------------------------------------------------
const REVIEW: string =
  "A rubber band spends its whole life stretched thin holding everyone else's stuff together, then snaps the one time you actually need it.";

const LIMIT = 200;
const GATE_PATH = "/output/entry.txt";

function fail(message: string): never {
  throw new Error(`entry rejected: ${message}`);
}

function validate(line: string): string {
  const text = line.trim();
  if (text.length < 1) fail("empty line");
  if (text.length > LIMIT) fail(`${text.length} chars exceeds ${LIMIT}`);
  if (text.includes("\n")) fail("must be a single line");
  return text;
}

function save(path: string, line: string): void {
  const folder = dirname(path);
  if (!existsSync(folder)) mkdirSync(folder, { recursive: true });
  writeFileSync(path, line + "\n", { encoding: "utf8" });
}

function verify(path: string, expected: string): void {
  const back = readFileSync(path, "utf8").replace(/\n$/, "");
  if (back !== expected) fail(`wrote ${path} but read-back differs`);
}

const line = validate(REVIEW);

// The competition gate reads /output/entry.txt.
save(GATE_PATH, line);
verify(GATE_PATH, line);

// Mirror the same line into the repo so the committed entry is identical.
const repoRoot = dirname(fileURLToPath(import.meta.url));
const repoEntry = join(repoRoot, "entry.txt");
save(repoEntry, line);
verify(repoEntry, line);

console.log(`OK: ${line.length} characters written to ${GATE_PATH} and entry.txt`);
