import { callStructured, type StructuredResult } from "../llm";
import { TriageSchema, type RawIssue, type Triage } from "../triage";

/**
 * REFERENCE SOLUTION — try the exercise yourself in src/triage.ts first.
 * To run this: paste the body below into triageIssue() in src/triage.ts.
 *
 * Notes on the choices here (the kind of thing you'd put in your README):
 *  - Few-shot-free but with an explicit rubric in the system prompt; cheap and
 *    good enough for triage. If accuracy were low I'd add 2-3 worked examples.
 *  - Haiku by default: triage is high-volume and latency-sensitive, so the
 *    cheaper/faster model is the right default; escalate to Sonnet only if the
 *    eval pass rate is unacceptable.
 *  - needsMoreInfo is the guardrail: low-detail issues get flagged for a human
 *    rather than confidently mis-triaged.
 */
const SYSTEM = `You are an issue-triage assistant for a developer platform team.
Classify each issue using this rubric:
- type: bug (something is broken), feature (new capability), question (usage/how-to),
  docs (documentation gap), chore (build/CI/dependency/maintenance).
- priority: critical (outage / data loss / security), high (broken core flow, many users),
  medium (degraded but has a workaround), low (cosmetic / nice-to-have).
- component: best guess at the affected area, or null if unclear.
- needsMoreInfo: true when the issue lacks the detail needed to action it
  (e.g. a bug report with no reproduction steps or error message).
- confidence: your 0-1 certainty in the classification.`;

export async function triageIssueRef(issue: RawIssue): Promise<StructuredResult<Triage>> {
  return callStructured({
    schema: TriageSchema,
    system: SYSTEM,
    user: `Triage this issue.\n\nTitle: ${issue.title}\n\nBody:\n${issue.body}`,
  });
}
