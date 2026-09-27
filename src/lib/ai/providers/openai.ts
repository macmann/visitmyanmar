import type { GameLLMRequest, GameLLMResponse, LLMProvider } from '../types';
import type { LLMConfig } from '../config';
import { asNumber, emptyUsage, OUTPUT_INSTRUCTION, parseStructured } from './shared';

export class OpenAIProvider implements LLMProvider {
  constructor(private readonly config: LLMConfig) {}
  async generate(request: GameLLMRequest): Promise<GameLLMResponse> {
    const started = Date.now(), controller = new AbortController(), timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await fetch('https://api.openai.com/v1/responses', { method: 'POST', signal: controller.signal, headers: { authorization: `Bearer ${this.config.apiKey}`, 'content-type': 'application/json' }, body: JSON.stringify({ model: this.config.model, input: [...request.messages, { role: 'system', content: OUTPUT_INSTRUCTION }], max_output_tokens: request.maxOutputTokens, text: { format: { type: 'json_schema', name: 'game_npc_reply', strict: true, schema: { type: 'object', additionalProperties: false, properties: { dialogue: { type: 'string' }, intent: { type: 'object', additionalProperties: false, properties: { type: { type: 'string', enum: ['NONE', 'SUGGEST_LOCATION', 'SUGGEST_FOOD', 'QUEST_HINT', 'REVEAL_DISCOVERY'] }, targetId: { type: ['string', 'null'] } }, required: ['type', 'targetId'] } }, required: ['dialogue', 'intent'] } } } }) });
      if (!response.ok) throw new Error(`OpenAI request failed (${response.status})`);
      const data = await response.json() as Record<string, any>;
      const text = typeof data.output_text === 'string' ? data.output_text : data.output?.flatMap((item: any) => item.content ?? []).find((item: any) => typeof item.text === 'string')?.text;
      if (typeof text !== 'string') throw new Error('OpenAI response contained no text');
      const parsed = parseStructured(text), input = asNumber(data.usage?.input_tokens), output = asNumber(data.usage?.output_tokens);
      return { ...parsed, provider: 'openai', model: this.config.model!, usage: { ...emptyUsage(), inputTokens: input, outputTokens: output, totalTokens: asNumber(data.usage?.total_tokens) ?? (input !== null && output !== null ? input + output : null) }, latencyMs: Date.now() - started };
    } finally { clearTimeout(timer); }
  }
}
