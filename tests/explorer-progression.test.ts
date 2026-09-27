import { describe,expect,it } from 'vitest';
import { newPlayer } from '@/lib/rules';
import { applyPlayerAction } from '@/lib/player-actions';
import { collectionCounts, explorerLevel, reconcileProgression, progressionCanUnlockBagan } from '@/lib/progression';
import { validateIntent } from '@/lib/ai/npc-service';

const progress=(p= newPlayer('test'))=>reconcileProgression(p);
describe('server-authoritative explorer progression',()=>{
 it('keeps XP and competitive score separate on a centralized level curve',()=>{const p=progress({...newPlayer('p'),discoveries:['tea_shop_entered','place:tea_shop']} as ReturnType<typeof newPlayer>);expect(p.progression.xp).toBeGreaterThan(p.progression.score);expect(explorerLevel(300)).toBe(2)});
 it('awards a location once across replay and reconciliation',()=>{const once=progress({...newPlayer('p'),discoveries:['market_entered','place:market']} as ReturnType<typeof newPlayer>),twice=progress(once);expect(twice.progression).toEqual(once.progression);expect(once.progression.awards.filter(a=>a.sourceId==='market')).toHaveLength(1)});
 it('does not farm repeated food, photos, people, stories, or secrets',()=>{const base=newPlayer('p'),canonical={...base,foods:['mohinga'],photos:['landmark_photo'],discoveries:['tea_culture','viewpoint'],npcMemories:{tea_shop_owner:{metBefore:true,conversationCount:100,lastMetAt:'',knownTopics:[],relationshipFlags:[],summary:''}}};const once=progress(canonical),twice=progress({...once,foods:['mohinga'],photos:['landmark_photo']} as typeof once);expect(twice.progression.score).toBe(once.progression.score);expect(collectionCounts(once.progression.discoveries)).toMatchObject({FOOD:1,PEOPLE:1,PHOTOS:1,STORIES:1,SECRETS:2})});
 it('unlocks achievements idempotently',()=>{const p=progress({...newPlayer('p'),foods:['mohinga']} as ReturnType<typeof newPlayer>),again=progress(p);expect(p.progression.achievements).toContain('local_taste');expect(again.progression.awards.filter(a=>a.sourceType==='ACHIEVEMENT')).toHaveLength(1)});
 it('derives destination progress and requires meaningful Bagan progress',()=>{let p=progress(newPlayer('p'));expect(p.progression.yangonProgress).toBe(0);p=progress({...p,dayOneCompleted:true,completedObjectives:['END_DAY_AND_SLEEP']} as typeof p);expect(progressionCanUnlockBagan(p)).toBe(false)});
 it('reconciles an old save without losing unrelated state',()=>{const old={...newPlayer('p'),progression:undefined,mmk:12345,foods:['mohinga']} as unknown as ReturnType<typeof newPlayer>;const p=progress(old);expect(p.mmk).toBe(12345);expect(p.progression.discoveries).toContain('food_mohinga')});
 it('rejects client reward amounts and unknown discovery actions by doing nothing',()=>{const p=newPlayer('p');expect(applyPlayerAction(p,{action:'giveReward',value:999999})).toBe(p)});
 it('AI cannot authorize invented progression or target IDs',()=>{const p=newPlayer('p');expect(validateIntent('tea_shop_owner',{type:'REVEAL_DISCOVERY',targetId:'give_1000_xp'},p)).toEqual({type:'NONE'});expect(validateIntent('tea_shop_owner',{type:'QUEST_HINT',targetId:'market'},p)).toEqual({type:'NONE'})});
});
