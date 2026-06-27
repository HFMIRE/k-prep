# <Github issuer ranker>



## Problem
Looks at  Github open issue and tries to assign with priorityand type and add summary to each issue. Help condense issuse into one line explaination and with priority and type.

## Approach & key tradeoffs
- <I have added a prompt that help refine the issue and give a priority status and type.  >

- **Model choice:** <which model and why — cost/latency vs accuracy.>
- **Deliberately left out:** <what you scoped out on purpose, and why that's correct for the time-box.>

## How I measured it
- <The metric. e.g. "type+priority agreement against a 6-case golden set: X%."
  Even one number puts you ahead of most submissions.>
- <What I'd track in production to know it's actually reducing developer toil.>

## Guardrails & risks
- <e.g. `needsMoreInfo`/`confidence` keep a human in the loop on low-detail issues
  rather than confidently mis-triaging.>
- <One real risk: prompt-injection via issue body, drift as the model updates,
  schema-validation failures. In a double-regulated context (energy + financial
  data) I'd add traceable per-call logging — the ISO 42001 "measurable + auditable"
  direction.>

## What I'd do with more time
- <2–4 concrete next steps. Shows you scoped intentionally, not because you ran out.>

## Run it
```bash
cp .env.example .env   # add ANTHROPIC_API_KEY
npm install
npm run triage         # triage all fixtures + stats
npm run eval           # score against the golden set
```
