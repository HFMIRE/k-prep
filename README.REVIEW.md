# <Github issuer ranker>



## Problem
The problem this model is trying to solve is ranking and assigning issue that by adding more detail and trying to rank by assigning priority and type. 

## Approach & key tradeoffs
- I have refined the the prompt by using the system prompts to set out a set of guidelines that takes in the schema. This allows to have a consistent evaluate the issue. In the system prompt, I have added a detail on each catergory that I need the evaulte the issues. 

- **Model choice:** I used claude haiku because it is cheaper and it is brillant for repeative task since this is providing surface insight into the issue, it can handle alot of issue. The token usage is less than sonnet which more expensive then it come to large batch. Also, Haiku provided faster response and the avg latency is <2 sec and cost less compared to the sonnet.
- **Deliberately left out:** The model tends to overestimate the priority by one degree so if it meant to be low, it will assign the task as meduim. I need to see the model is doing this at a large scale and if can be correct by changing the prompt or by adding weight for each criteria so it can evalute it properly.

## How I measured it
- The metric. e.g. "type+priority agreement against a 6-case golden set: 75%."
- What I'd track in production to know it's actually reducing developer toil. I would track if that is similar to developer experiece and if the assumption of the ai model was correct and if there was hidden sub task. 

## Guardrails & risks
- e.g. `needsMoreInfo`/`confidence` keep a human in the loop on low-detail issues rather than confidently mis-triaging. Add a flag for the human to add more detail. Add context in the sprint will help the model understand the importance in the context of the ticket
- One real risk: prompt-injection via issue body, drift as the model updates, schema-validation failures. In a double-regulated context (energy + financial  data) I'd add traceable per-call logging — the ISO 42001 "measurable + auditable" direction. Also, old issuse and redudant tickets and priority and scope changes. 

## What I'd do with more time
- Adding weight the critera so model the can understand the priority?
- Adding more context about the sprint and it objectives 
- Fix the model assumption over raising the priority 



## What's in the box
- `src/llm.ts` — LLM wrapper: validated structured output + cost/latency tracking. **Reusable plumbing — have this ready before the real repo lands.**
- `src/metrics.ts` — roll up cost/latency across a batch.
- `src/eval.ts` — generic golden-set eval harness (the thing most candidates skip).
- `src/triage.ts` — the practice exercise (schema given, `triageIssue` is yours to write).
- `src/index.ts` / `src/eval-run.ts` — run + score.
- `src/reference/triage.ref.ts` — reference solution. Don't open until you've tried.
- `fixtures/` — sample issues + golden labels.

## Run it
```bash
cp .env.example .env   # add ANTHROPIC_API_KEY
npm install
npm run triage         # triage all fixtures + stats
npm run eval           # score against the golden set
```
