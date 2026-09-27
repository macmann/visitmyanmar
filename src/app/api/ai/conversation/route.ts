import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { identityForRequest } from '@/lib/auth';
import { getPlayer, mutatePlayer } from '@/lib/server-store';
import { AI_NPCS } from '@/content/ai-npcs';
import { converseWithNPC } from '@/lib/ai/npc-service';
import { takeAIRequest } from '@/lib/ai/rate-limit';
import { getLLMConfig } from '@/lib/ai/config';
import { reconcileProgression } from '@/lib/progression';

export const dynamic = 'force-dynamic';
const schema = z.object({ npcId: z.string().max(80), question: z.string().trim().min(1).max(500), history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(500) })).max(6).default([]) }).strict();
const config = getLLMConfig();
if (config.error) console.error(config.error);
if (process.env.NODE_ENV !== 'production') console.info(`[AI] Provider: ${config.provider ?? 'none'} Model: ${config.model ?? 'none'} Mode: ${config.mode.toUpperCase()}`);

export async function POST(request: NextRequest) {
  const identity = await identityForRequest(request);
  if (!identity) return NextResponse.json({ error: 'Journey session required' }, { status: 401 });
  if (!takeAIRequest(identity.playerId)) return NextResponse.json({ error: 'Please give your local a moment before asking again.' }, { status: 429, headers: { 'retry-after': '30' } });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid conversation request' }, { status: 400 });
  const npc = AI_NPCS[parsed.data.npcId];
  if (!npc) return NextResponse.json({ error: 'Unknown local' }, { status: 404 });
  const player = await getPlayer(identity.playerId);
  if (player.locationContext === 'WORLD' || npc.location !== player.locationContext.toLowerCase()) return NextResponse.json({ error: 'Move closer to speak with this local.' }, { status: 403 });
  const reply = await converseWithNPC({ ...parsed.data, player, memory: player.npcMemories?.[npc.id] });
  await mutatePlayer(identity.playerId, current => reconcileProgression({ ...current, npcMemories: { ...(current.npcMemories ?? {}), [npc.id]: reply.memory }, talkedTo: current.talkedTo.includes(npc.id) ? current.talkedTo : [...current.talkedTo, npc.id] }));
  const { memory: _memory, ...safeReply } = reply;
  return NextResponse.json(safeReply);
}

