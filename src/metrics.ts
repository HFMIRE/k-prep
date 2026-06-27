import type { StructuredResult } from "./llm";

/**
 * Roll up cost + latency across a batch of calls. The whole point of the
 * K DevEx team is "a true metric, not 'this feels better'", so make
 * measurement a habit: every batch you run should report numbers.
 */

export interface RunStats {
  runs: number;
  totalCostUsd: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
}

export function summarize(results: StructuredResult<unknown>[]): RunStats {
  const n = results.length;
  const latencies = results.map((r) => r.latencyMs).sort((a, b) => a - b);
  const p95Index = Math.min(latencies.length - 1, Math.floor(latencies.length * 0.95));
  return {
    runs: n,
    totalCostUsd: Number(results.reduce((s, r) => s + r.costUsd, 0).toFixed(6)),
    avgLatencyMs: n ? Math.round(results.reduce((s, r) => s + r.latencyMs, 0) / n) : 0,
    p95LatencyMs: latencies[p95Index] ?? 0,
    totalInputTokens: results.reduce((s, r) => s + r.usage.inputTokens, 0),
    totalOutputTokens: results.reduce((s, r) => s + r.usage.outputTokens, 0),
  };
}
