import { z } from 'zod';
import { INTENT_TYPES, type GameIntent, type TokenUsage } from '../types';

const payload = z.object({ dialogue: z.string().min(1).max(1200), intent: z.object({ type: z.enum(INTENT_TYPES), targetId: z.string().max(80).nullish() }).default({ type: 'NONE' }) });
export const OUTPUT_INSTRUCTION = 'Return only JSON: {"dialogue":"short in-character reply","intent":{"type":"NONE|SUGGEST_LOCATION|SUGGEST_FOOD|QUEST_HINT|REVEAL_DISCOVERY","targetId":"optional-authoritative-id"}}.';
export function parseStructured(text: string): { dialogue: string; intent: GameIntent } {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const parsed = payload.parse(JSON.parse(cleaned));
  return { dialogue: parsed.dialogue, intent: { type: parsed.intent.type, ...(parsed.intent.targetId ? { targetId: parsed.intent.targetId } : {}) } };
}
export const emptyUsage = (): TokenUsage => ({ inputTokens: null, outputTokens: null, totalTokens: null });
export function asNumber(value: unknown): number | null { return typeof value === 'number' && Number.isFinite(value) ? value : null; }
