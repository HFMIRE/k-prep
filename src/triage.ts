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

// ───────────────────────────────────────────────────────────────────────────
//  YOUR EXERCISE  →  see BRIEF.md
//  Implement triageIssue using callStructured from ./llm. Aim for a working
//  vertical slice first, then improve the prompt. A reference solution lives in
//  src/reference/triage.ref.ts — try it yourself before opening it.
// ───────────────────────────────────────────────────────────────────────────
export async function triageIssue(_issue: RawIssue): Promise<StructuredResult<Triage>> {
  const option = {
    schema: TriageSchema,
    system: "You are a software engineering assistant.",
    user: "Please triage the following GitHub issue and provide a structured response in JSON format according to the TriageSchema. Ensure that your response includes a summary, type, priority, component , needsMoreInfo, and confidence level between 0 and 1. When assigning the task with the a  type, consider the action that should be taken to migrate this action in the future from arising and find a fitting type and consider evaluating against  the type we have available from bug, feature, question, docs and chore and urgency associated with  it. When weighing the priority of the task, consider the type of task it like it is a feature, bug, question and chore  and add it to the final weighting of the priority. Here is the issue:\n\n" + JSON.stringify(_issue, null, 2),
    model: "claude-sonnet-4-6",
    maxTokens: 1024
    
  }
  const result = await callStructured(option);  
  return result; 
}
