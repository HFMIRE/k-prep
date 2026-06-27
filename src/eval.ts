/**
 * Tiny, generic eval harness. Give it a golden set, a function to run, and a
 * scorer, and it tells you the pass rate. This is the single highest-signal
 * thing most take-home candidates leave out. Don't be most candidates.
 */

export interface EvalCase<I, E> {
  id: string;
  input: I;
  expected: E;
}

export interface EvalResult<I, E, O> {
  id: string;
  input: I;
  expected: E;
  output: O | null;
  passed: boolean;
  error?: string;
}

export type Scorer<E, O> = (expected: E, output: O) => boolean;

export async function runEval<I, E, O>(
  cases: EvalCase<I, E>[],
  run: (input: I) => Promise<O>,
  score: Scorer<E, O>,
): Promise<{ results: EvalResult<I, E, O>[]; passRate: number }> {
  const results: EvalResult<I, E, O>[] = [];
  for (const c of cases) {
    try {
      const output = await run(c.input);
      results.push({ ...c, output, passed: score(c.expected, output) });
    } catch (err) {
      results.push({ ...c, output: null, passed: false, error: (err as Error).message });
    }
  }
  const passed = results.filter((r) => r.passed).length;
  return { results, passRate: cases.length ? passed / cases.length : 0 };
}
