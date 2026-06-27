# K-prep

Practice kit for the K AI Engineer (Developer Experience) take-home + interviews.

## Start here
1. **`CHECKLIST.md`** — master prep plan for all three stages.
2. **`BRIEF.md`** — a realistic, 50-minute practice take-home. Do it timed.
3. **`README.template.md`** — the design-doc README to fill during the real test.

## What's in the box
- `src/llm.ts` — LLM wrapper: validated structured output + cost/latency tracking. **Reusable plumbing — have this ready before the real repo lands.**
- `src/metrics.ts` — roll up cost/latency across a batch.
- `src/eval.ts` — generic golden-set eval harness (the thing most candidates skip).
- `src/triage.ts` — the practice exercise (schema given, `triageIssue` is yours to write).
- `src/index.ts` / `src/eval-run.ts` — run + score.
- `src/reference/triage.ref.ts` — reference solution. Don't open until you've tried.
- `fixtures/` — sample issues + golden labels.

## Run
```bash
cp .env.example .env   # add ANTHROPIC_API_KEY
npm install
npm run typecheck
npm run triage         # after you implement triageIssue
npm run eval
```

Requires Node 18+. Uses the Anthropic SDK; swap the client in `src/llm.ts` for any provider.
