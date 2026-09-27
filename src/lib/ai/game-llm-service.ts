import { getLLMConfig, type LLMConfig } from './config';
import { createLLMProvider } from './provider-factory';
import type { GameLLMRequest, GameLLMResponse } from './types';

export class GameLLMService {
  readonly config: LLMConfig;
  private readonly provider;
  constructor(config = getLLMConfig()) { this.config = config; this.provider = createLLMProvider(config); }
  async generate(request: GameLLMRequest): Promise<GameLLMResponse | null> {
    if (!this.provider) return null;
    try { return await this.provider.generate({ ...request, maxOutputTokens: Math.min(request.maxOutputTokens, this.config.maxOutputTokens) }); }
    catch (error) { console.error(`[AI] ${this.config.provider} request failed; using authored fallback.`, error instanceof Error ? error.message : 'Unknown error'); return null; }
  }
}

