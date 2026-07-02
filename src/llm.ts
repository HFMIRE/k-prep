import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

/**
 * Thin LLM wrapper that returns *validated, structured* output and tracks
 * cost + latency on every call. This is the kind of plumbing you want done
 * BEFORE a timed take-home starts, so you spend your minutes on the actual task.
 */

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

// Approximate USD per million tokens. UPDATE with current pricing before quoting cost numbers.
const PRICING: Record<string, { input: number; output: number }> = {
  "claude-haiku-4-5": { input: 1.0, output: 5.0 },
  "claude-sonnet-4-6": { input: 3.0, output: 15.0 },
};

export interface StructuredResult<T> {
  data: T;
  latencyMs: number;
  usage: { inputTokens: number; outputTokens: number };
  costUsd: number;
}

export interface CallOpts<T> {
  schema: z.ZodType<T>;
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced?.[1] ?? text;
  const start = body.search(/[[{]/);
  return start >= 0 ? body.slice(start).trim() : body.trim();
}

export async function callStructured<T>(opts: CallOpts<T>): Promise<StructuredResult<T>> {
  const model = opts.model ?? "claude-haiku-4-5";
  const maxTokens = opts.maxTokens ?? 1024;
  const started = performance.now();

  const message = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: `${opts.system}\n\nRespond with ONLY valid JSON matching the requested shape. No prose, no markdown fences.`,
    messages: [{ role: "user", content: opts.user }],
  });

  const latencyMs = Math.round(performance.now() - started);
  const textBlock = message.content.find((b) => b.type === "text");
  const raw = textBlock && textBlock.type === "text" ? textBlock.text : "";

  let data: T;
  try {
    data = opts.schema.parse(JSON.parse(extractJson(raw)));
  } catch (err) {
    // A validation failure is a SIGNAL, not just an error — log it for your eval.
    throw new Error(`Output failed schema validation: ${(err as Error).message}\nRaw response: ${raw}`);
  }

  const price = PRICING[model] ?? { input: 0, output: 0 };
  const inputTokens = message.usage.input_tokens;
  const outputTokens = message.usage.output_tokens;
  const costUsd =
    (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output;

  return { data, latencyMs, usage: { inputTokens, outputTokens }, costUsd };
}
