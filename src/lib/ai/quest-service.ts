import type { PlayerSave } from '@/lib/types';
import { GameLLMService } from './game-llm-service';

const AUTHORED_HINTS: Record<string, { targetId: string; text: string }[]> = {
  VISIT_TEA_SHOP: [{ targetId: 'tea_shop', text: 'Look for the green tea shop near the crossroads.' }],
  TALK_TO_TEA_SHOP_OWNER: [{ targetId: 'market', text: 'Daw Nwe at the tea shop can point you toward the market.' }],
  VISIT_MARKET: [{ targetId: 'market', text: 'Follow the road east toward the red market awnings.' }],
  VISIT_LANDMARK: [{ targetId: 'shwedagon', text: 'Follow the golden skyline toward the gardens.' }],
};

/** AI may word or select only a server-authored hint; this service never mutates quest state. */
export async function getQuestHint(player: PlayerSave, question: string) {
  const allowed = AUTHORED_HINTS[player.activeObjectiveId] ?? [];
  if (!allowed.length) return null;
  const fallback = allowed[0], service = new GameLLMService();
  const result = await service.generate({ messages: [{ role: 'system', content: `Choose or naturally reword one allowed hint. Allowed hints: ${JSON.stringify(allowed)}. Never complete or change a quest. The intent must be QUEST_HINT and targetId must exactly match an allowed target.` }, { role: 'user', content: question.slice(0, 500) }], maxOutputTokens: 120, metadata: { feature: 'quest' } });
  const valid = allowed.find(hint => hint.targetId === result?.intent.targetId);
  return { targetId: valid?.targetId ?? fallback.targetId, dialogue: valid ? result!.dialogue : fallback.text, fallbackUsed: !valid };
}
