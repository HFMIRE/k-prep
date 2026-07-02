# GitHub Issue Triage Assistant

## Problem
This tool triages incoming GitHub issues, it adds a one-line summary and classifies each by type and priority, so a team spends less time sorting its backlog by hand.

## Approach & key tradeoffs
- I moved the classification guidelines into the system prompt, with a definition for each category the model evaluates against. This keeps the evaluation consistent across issues.
- **Model choice:** I used Claude Haiku. Triage is a high-volume, repetitive task that needs surface-level insight, and Haiku handles that at lower token cost than Sonnet, which gets expensive on large batches,  while also being faster (average latency under 2 seconds).
- **Deliberately left out:** no web UI, persistence, or batching, the tool runs over a fixture set via CLI. In the time box, correctness of the classification mattered more than surface area.

## How I measured it
- **Type + priority agreement: 75% (6/8)** against the golden set.
- **Type accuracy: 100% (8/8)** , every issue was classified into the correct type.
- Both misses were *priority over-estimation* (chore/medium → high, docs/low → high), consistent with the systematic +1 priority bias I observed by eye. The failure mode is narrow and one-directional, which makes it fixable via prompt weighting or a calibration step.
- **In production I'd track the human correction rate**, the share of AI-triaged issues a human re-labels, and **time-from-open-to-triaged**. Those two directly measure whether the tool is actually removing triage toil, rather than just moving it.

## Guardrails & risks
- `needsMoreInfo` / `confidence` keep a human in the loop on low-detail issues rather than confidently mis-triaging. I'd add a flag for a human to supply missing detail, and pulling in sprint context would help the model weigh importance relative to the ticket.
- Real risks: prompt injection via the issue body, drift as the model updates, and schema-validation failures. In a double-regulated context (energy + financial data) I'd add traceable per-call logging, the ISO 42001 "measurable and auditable" direction. Other risks: stale issues, duplicate tickets, and priority or scope changes over time.

## What I'd do with more time
- Add weighting to the criteria so the model calibrates priority better (fixing the inflation bias).
- Feed in sprint context and objectives so priority reflects what the team is actually working on.
- Split the eval: score type/priority on fully-specified issues, and separately assert `needsMoreInfo` on under-specified ones, so the metric isn't diluted by cases the tool correctly can't judge.

## Run it
```bash
cp .env.example .env   # add ANTHROPIC_API_KEY
npm install
npm run triage         # triage all fixtures + stats
npm run eval           # score against the golden set
```