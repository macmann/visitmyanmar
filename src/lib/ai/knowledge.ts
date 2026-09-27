export type KnowledgeEntry = { id: string; scopes: string[]; keywords: string[]; text: string };
export const KNOWLEDGE: KnowledgeEntry[] = [
  { id: 'mohinga', scopes: ['food', 'tea-shops'], keywords: ['mohinga', 'eat', 'food', 'breakfast', 'it'], text: 'Mohinga is a Myanmar rice-noodle soup commonly eaten for breakfast. Recipes vary; it is often built around a savoury fish broth and served with garnishes.' },
  { id: 'tea_shop', scopes: ['tea-shops', 'yangon'], keywords: ['tea', 'shop', 'place'], text: 'Tea shops are social gathering places. Morning Star is fictional game content inspired by Yangon tea-shop culture and serves the foods listed in the game menu.' },
  { id: 'yangon', scopes: ['yangon', 'myanmar'], keywords: ['yangon', 'here', 'around', 'city'], text: 'Yangon is Myanmar’s largest city and is known for tree-lined streets, markets, tea-shop culture, and a golden pagoda skyline.' },
  { id: 'market', scopes: ['markets', 'yangon'], keywords: ['market', 'visit', 'go', 'lost', 'around'], text: 'Lanmadaw Market is a fictional playable neighbourhood market east of Morning Star Tea Shop.' },
  { id: 'pagoda_gardens', scopes: ['landmarks', 'yangon'], keywords: ['landmark', 'pagoda', 'gold', 'visit', 'see'], text: 'Golden Pagoda Gardens is a respectful fictional game location inspired by Yangon’s golden skyline; it is not a factual reconstruction.' },
  { id: 'bagan', scopes: ['myanmar'], keywords: ['bagan'], text: 'Bagan is known for its historic temple landscape. In this game, knowing about Bagan never unlocks travel; progression remains server-owned.' },
];

export function retrieveKnowledge(question: string, scopes: string[], recent: string[] = [], limit = 3): KnowledgeEntry[] {
  const query = `${recent.slice(-2).join(' ')} ${question}`.toLowerCase();
  return KNOWLEDGE.map(entry => ({ entry, score: entry.keywords.filter(word => query.includes(word)).length + (entry.scopes.some(scope => scopes.includes(scope)) ? 1 : -20) })).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map(x => x.entry);
}

