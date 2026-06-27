# Practice Take-Home — AI Issue Triage Assistant

**Time-box: 50 minutes. Set a timer. Stop when it rings** — running out of time *is* part of the test, and a clean small thing beats an ambitious half-thing.

This mirrors the shape of the real K test ("AI + improvement systems", reviewed by an engineer, ~45–60 min). Do it cold, like the real one. A reference solution exists (`src/reference/triage.ref.ts`) — don't open it until you've finished or the timer's up.

## The task

A developer platform team is drowning in unlabelled GitHub issues. Build a tool that uses an LLM to **triage** each issue into structured fields so engineers spend less time sorting their backlog.

Raw issues are in `fixtures/issues.json`. Your tool should, for each issue, produce the shape already defined in `src/triage.ts` (`TriageSchema`): a one-line summary, a `type`, a `priority`, a best-guess `component`, a `needsMoreInfo` flag, and a `confidence` score.

### What to actually do
1. Implement `triageIssue()` in `src/triage.ts`. The plumbing is done for you — use `callStructured()` from `src/llm.ts`. (`cp .env.example .env` and add your key first.)
2. `npm run triage` should print a triaged line per issue plus the run-stats table.
3. **Measure it.** `npm run eval` scores your output against `fixtures/golden.json`. Get the agreement rate up, and note in your README what you'd do to push it higher.
4. Fill in `README.template.md` → rename to `README.md`.

### Explicitly out of scope
No web UI, no database, no auth, no batching/queue. If you're tempted, write it in the README's "what I'd do with more time" instead. Scoping *down* is a graded signal.

## How it'll be judged (the hidden rubric)

The reviewer is imagining working next to you. They care about:
- **Judgment over volume** — did you build the smallest thing that fully works, cleanly?
- **Measurement instinct** — is there a real metric, not "feels better"? (This is the team's whole identity.)
- **Team-fit instinct** — did you treat `needsMoreInfo`/`confidence` as guardrails that keep a human in the loop, unprompted?
- **Readable code + commit history** — small, well-messaged commits; typed, idiomatic TS.
- **A README that reads like a mini design doc** — see the template.

## Suggested 50-minute split
- **0–5** Read this twice. Restate the task in one sentence. `npm install`, set `.env`.
- **5–25** Implement `triageIssue`. Get a working vertical slice over all 8 issues first, *then* improve the prompt. Commit as you go.
- **25–40** Run `npm run eval`. Tune the prompt/rubric to lift the agreement rate. Confirm #1 and #8 trip `needsMoreInfo`.
- **40–50** Write the README. One metric, the tradeoffs, one guardrail/risk note. Final commit.

When the timer rings, stop and diff yourself against the reference. Then send it to me and I'll review it the way their engineer would.
