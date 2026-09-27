import { NextRequest, NextResponse } from 'next/server';
import { identityForRequest } from '@/lib/auth';
import { getLLMConfig } from '@/lib/ai/config';
import { GameLLMService } from '@/lib/ai/game-llm-service';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') return new NextResponse(null, { status: 404 });
  if (!await identityForRequest(request)) return NextResponse.json({ error: 'Journey session required' }, { status: 401 });
  const c = getLLMConfig(); return NextResponse.json({ provider: c.provider, model: c.model, status: c.mode === 'api' ? 'Configured' : 'Fallback', error: c.error });
}
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') return new NextResponse(null, { status: 404 });
  if (!await identityForRequest(request)) return NextResponse.json({ error: 'Journey session required' }, { status: 401 });
  const service = new GameLLMService(), started = Date.now();
  const response = await service.generate({ messages: [{ role: 'user', content: 'Reply with a short friendly greeting and intent NONE.' }], maxOutputTokens: 80, metadata: { feature: 'diagnostic' } });
  return NextResponse.json({ success: !!response, fallback: !response, latencyMs: response?.latencyMs ?? Date.now() - started, provider: service.config.provider, model: service.config.model });
}
