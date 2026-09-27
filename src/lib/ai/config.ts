export type LLMProviderName = 'openai' | 'deepseek';
export type LLMConfig = { provider: LLMProviderName | null; model: string | null; apiKey: string | null; timeoutMs: number; maxOutputTokens: number; mode: 'api' | 'fallback'; error?: string };

const positiveInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

/** Reads secrets only on the server. Missing settings intentionally select free authored dialogue. */
export function getLLMConfig(env: Record<string, string | undefined> = process.env): LLMConfig {
  const raw = env.LLM_PROVIDER?.trim().toLowerCase();
  const timeoutMs = positiveInteger(env.LLM_TIMEOUT_MS, 15000);
  const maxOutputTokens = positiveInteger(env.LLM_MAX_OUTPUT_TOKENS, 500);
  if (!raw) return { provider: null, model: env.LLM_MODEL?.trim() || null, apiKey: null, timeoutMs, maxOutputTokens, mode: 'fallback' };
  if (raw !== 'openai' && raw !== 'deepseek') {
    return { provider: null, model: env.LLM_MODEL?.trim() || null, apiKey: null, timeoutMs, maxOutputTokens, mode: 'fallback', error: `[AI] Invalid LLM_PROVIDER "${raw}". Supported values: openai, deepseek.` };
  }
  const provider = raw as LLMProviderName;
  const model = env.LLM_MODEL?.trim() || null;
  const apiKey = (provider === 'openai' ? env.OPENAI_API_KEY : env.DEEPSEEK_API_KEY)?.trim() || null;
  const missing = !model ? 'LLM_MODEL' : !apiKey ? `${provider === 'openai' ? 'OPENAI' : 'DEEPSEEK'}_API_KEY` : null;
  return { provider, model, apiKey, timeoutMs, maxOutputTokens, mode: missing ? 'fallback' : 'api', error: missing ? `[AI] ${provider} configured without ${missing}. Using authored fallback mode.` : undefined };
}

