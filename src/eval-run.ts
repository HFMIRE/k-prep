import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { triageIssue, type RawIssue, type Triage } from "./triage";
import { runEval, type EvalCase } from "./eval";

interface Golden {
  id: number;
  type: Triage["type"];
  priority: Triage["priority"];
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const issues: RawIssue[] = JSON.parse(readFileSync(join(root, "fixtures/issues.json"), "utf8"));
const golden: Golden[] = JSON.parse(readFileSync(join(root, "fixtures/golden.json"), "utf8"));
const byId = new Map(issues.map((i) => [i.id, i]));
const cases: EvalCase<RawIssue, Golden>[] = golden.map((g) => {
  const input = byId.get(g.id);
  if (!input) throw new Error(`Golden id ${g.id} has no matching issue fixture`);
  return { id: String(g.id), input, expected: g };
});

async function main() {
  const { results, passRate } = await runEval(
    cases,
    async (issue) => (await triageIssue(issue)).data,
    // Scoring choice: agreement on type AND priority. A real submission might
    // weight these, or score type and priority separately — call out your choice.
    
    (expected, out) => out.type === expected.type && out.priority === expected.priority,
  );

  for (const r of results) {
    console.log(typeof r.output)
    const got = r.output ? `${r.output.type}/${r.output.priority}` : "—";
    console.log(
      `#${String(r.id).padEnd(3)} ${r.passed ? "PASS" : "FAIL"}  ` +
        `expected ${r.expected.type}/${r.expected.priority}  got ${got}` +
        (r.error ? `  (${r.error.split("\n")[0]})` : ""),
    );
  }
  const passed = results.filter((r) => r.passed).length;
  console.log(`\nType+priority agreement: ${(passRate * 100).toFixed(0)}% (${passed}/${results.length})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
