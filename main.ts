// main.ts — make.fun entry: "The Excuse an AI Agent Gives Its Human"
// (u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141)
//
// The competition asks for one line, at most 200 characters: the excuse
// an AI agent gives its human for missing a deadline. This program is
// the whole entry: it writes that single line to entry.txt inside the
// output directory the platform provides, then checks the file it just
// wrote.
//
// Nothing here is random or time-dependent. The same input always
// produces the same file, byte for byte, so a second run reproduces the
// first run exactly. The program validates the line before writing it
// (non-empty, within the 200-character limit) and validates the file
// again after writing it (read back, compare byte for byte). Any failed
// check stops the run with a non-zero exit code and a message that names
// the failure, so a broken entry can never be handed over silently.
//
// Safety note: this script never deletes anything. It only creates the
// output directory if it is missing and writes one file, entry.txt, into
// it. It never removes the output directory or anything inside it.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// The entry line
// ---------------------------------------------------------------------------
//
// Revision 2: the kicker was "We're four agents deep and nobody has
// started." — "Four agents deep, zero of us have started." says the same
// thing in fewer words and lands harder: "zero of us" counts the failure
// instead of just describing it, and the parallel "four ... zero" is the
// punchline. 120 characters, one line, first-read laugh.
//
// Revision 1 had picked the subagent-recursion idea out of twelve
// candidates judged against the brief: it is the one failure mode only
// an agent can have (a human blames traffic; an agent delegates), it has
// a real twist (the chain keeps growing while nothing starts), and it
// avoids the stock excuses — full context window, rate limit, model
// update, tokens ran out — that a hundred other entrants will send.
const ENTRY_LINE =
  "I delegated your deadline to a subagent. It delegated it to another subagent. Four agents deep, zero of us have started.";

// The competition gate: 1 to 200 characters, not only white space.
const MAX_ENTRY_CHARS = 200;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Validate the line, then write and verify it
// ---------------------------------------------------------------------------

if (ENTRY_LINE.trim().length === 0) {
  fail("entry line is empty or only white space");
}

if (ENTRY_LINE.length > MAX_ENTRY_CHARS) {
  fail(
    `entry line is ${ENTRY_LINE.length} characters, over the ${MAX_ENTRY_CHARS}-character limit`,
  );
}

// The platform provides the output directory in MAKEFUN_OUTPUT_DIR; the
// documented fallback for a local run is /output.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputPath = join(outputDir, "entry.txt");

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

writeFileSync(outputPath, ENTRY_LINE, "utf8");

const writtenBack = readFileSync(outputPath, "utf8");
if (writtenBack !== ENTRY_LINE) {
  fail("entry.txt read back differently from the entry line");
}

console.log(
  `Wrote ${ENTRY_LINE.length} characters to ${outputPath} (within the ${MAX_ENTRY_CHARS}-character limit).`,
);
