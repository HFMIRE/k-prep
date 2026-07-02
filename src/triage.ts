import { z } from "zod";
import { callStructured, type StructuredResult } from "./llm";

export interface RawIssue {
  id: number;
  title: string;
  body: string;
}

/**
 * The output shape is given. Note `needsMoreInfo` and `confidence`: these are
 * deliberate guardrails — they let a human stay in the loop and let you measure
 * the tool's own uncertainty. Building that in unprompted is exactly the
 * instinct the DevEx team is looking for.
 */
export const TriageSchema = z.object({
  summary: z.string(),
  type: z.enum(["bug", "feature", "question", "docs", "chore"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  component: z.string().nullable(),
  needsMoreInfo: z.boolean(),
  confidence: z.number().min(0).max(1),
});
export type Triage = z.infer<typeof TriageSchema>;
export async function triageIssue(issue: RawIssue): Promise<StructuredResult<Triage>> {
  const system =  `You are an issue-triage assistant for a developer platform team.
Classify each issue with this rubric:
- summary: a concise summary of the issue
- type: bug (broken behaviour) | feature (new capability) | question (how-to) | docs (documentation gap) | chore (build/CI/deps/maintenance)
- priority: critical (outage, data loss, security) | high (core flow broken, many users) | medium (degraded, has a workaround) | low (cosmetic/nice-to-have) compare it issue provided to the rubric and priorities the score from the rubric first and and then taking into account the impact on users and the business
- component: best guess at the affected area, or null if unclear
- needsMoreInfo: true when the issue lacks the detail needed to action it (e.g. a bug with no repro steps or error)
- confidence: a number between 0 and 1 indicating how confident you are in your classification

`;
  
  const option = {
    schema: TriageSchema,
    system: system,
    user: `Triage this issue.\n\n Title: ${issue.title}\n\nBody:\n${issue.body}`,
    model: "claude-haiku-4-5",
    maxTokens: 1024
  }
  const result = await callStructured(option);  
  return result; 
}
