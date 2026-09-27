import type { LLMProvider } from './types';
import type { LLMConfig } from './config';
import { OpenAIProvider } from './providers/openai';
import { DeepSeekProvider } from './providers/deepseek';

/** The application's only paid-provider selection boundary. */
export function createLLMProvider(config: LLMConfig): LLMProvider | null {
  if (config.mode !== 'api') return null;
  switch (config.provider) {
    case 'openai': return new OpenAIProvider(config);
    case 'deepseek': return new DeepSeekProvider(config);
    default: return null;
  }
}

