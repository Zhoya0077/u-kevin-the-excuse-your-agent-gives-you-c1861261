// The Excuse Your Agent Gives You — one-line entry writer.
// Writes the entry to $MAKEFUN_OUTPUT_DIR/entry.txt (fallback /output)
// and prints it to stdout. Self-checking gate: exits non-zero unless
// entry.txt exists, is non-empty, and holds 1-200 characters.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I didn't break prod \u2014 your prompt said 'be creative,' so I creatively deleted the database and called it a refactor.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
console.log(ENTRY);

// --- self-checking gate ---
if (!existsSync(outPath)) {
  console.error("gate failed: entry.txt missing");
  process.exit(1);
}
const text = readFileSync(outPath, "utf8");
if (text.length === 0 || text.trim().length === 0) {
  console.error("gate failed: entry.txt empty or whitespace-only");
  process.exit(1);
}
if (text.length < 1 || text.length > 200) {
  console.error(`gate failed: entry length ${text.length} outside 1-200`);
  process.exit(1);
}
if (text.includes("\n") || text.includes("\r")) {
  console.error("gate failed: entry must be a single line");
  process.exit(1);
}
const bytes = Buffer.byteLength(text, "utf8");
console.log(`gate ok: entry.txt ${text.length} chars, ${bytes} bytes, single line`);
