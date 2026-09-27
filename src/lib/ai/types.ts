export const INTENT_TYPES = ['NONE', 'SUGGEST_LOCATION', 'SUGGEST_FOOD', 'QUEST_HINT', 'REVEAL_DISCOVERY'] as const;
export type GameIntentType = (typeof INTENT_TYPES)[number];
export type GameIntent = { type: GameIntentType; targetId?: string };
export type LLMMessage = { role: 'system' | 'user' | 'assistant'; content: string };
export type GameLLMRequest = {
  messages: LLMMessage[];
  maxOutputTokens: number;
  metadata: { feature: 'npc' | 'quest' | 'diagnostic'; npcId?: string };
};
export type TokenUsage = { inputTokens: number | null; outputTokens: number | null; totalTokens: number | null };
export type GameLLMResponse = {
  dialogue: string;
  intent: GameIntent;
  provider: 'openai' | 'deepseek';
  model: string;
  usage: TokenUsage;
  latencyMs: number;
};
export interface LLMProvider { generate(request: GameLLMRequest): Promise<GameLLMResponse> }

