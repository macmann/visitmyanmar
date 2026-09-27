import type { GameLLMRequest, GameLLMResponse, LLMProvider } from '../types';
import type { LLMConfig } from '../config';
import { asNumber, emptyUsage, OUTPUT_INSTRUCTION, parseStructured } from './shared';

export class DeepSeekProvider implements LLMProvider {
  constructor(private readonly config: LLMConfig) {}
  async generate(request: GameLLMRequest): Promise<GameLLMResponse> {
    const started = Date.now(), controller = new AbortController(), timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', { method: 'POST', signal: controller.signal, headers: { authorization: `Bearer ${this.config.apiKey}`, 'content-type': 'application/json' }, body: JSON.stringify({ model: this.config.model, messages: [...request.messages, { role: 'system', content: OUTPUT_INSTRUCTION }], max_tokens: request.maxOutputTokens, response_format: { type: 'json_object' }, stream: false }) });
      if (!response.ok) throw new Error(`DeepSeek request failed (${response.status})`);
      const data = await response.json() as Record<string, any>, text = data.choices?.[0]?.message?.content;
      if (typeof text !== 'string') throw new Error('DeepSeek response contained no text');
      const parsed = parseStructured(text), input = asNumber(data.usage?.prompt_tokens), output = asNumber(data.usage?.completion_tokens);
      return { ...parsed, provider: 'deepseek', model: this.config.model!, usage: { ...emptyUsage(), inputTokens: input, outputTokens: output, totalTokens: asNumber(data.usage?.total_tokens) ?? (input !== null && output !== null ? input + output : null) }, latencyMs: Date.now() - started };
    } finally { clearTimeout(timer); }
  }
}

