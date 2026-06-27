import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { triageIssue, type RawIssue } from "./triage";
import { summarize } from "./metrics";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const issues: RawIssue[] = JSON.parse(readFileSync(join(root, "fixtures/issues.json"), "utf8"));

async function main() {
  const results = [];
  for (const issue of issues) {
    const res = await triageIssue(issue);
    const flag = res.data.needsMoreInfo ? "⚠ needs-info" : "";
    console.log(
      `#${String(issue.id).padEnd(3)} ${res.data.type.padEnd(8)} ${res.data.priority.padEnd(9)} ` +
        `conf=${res.data.confidence.toFixed(2)} ${flag.padEnd(12)} ${res.data.summary}`,
    );
    results.push(res);
  }
  console.log("\n--- run stats ---");
  console.table(summarize(results));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
