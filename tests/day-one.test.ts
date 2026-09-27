import {describe,expect,it} from 'vitest';
import {DAY_ONE_OBJECTIVES,consumeQuestEvent} from '../src/content/day-one';
import {newPlayer} from '../src/lib/rules';
import type {GameplayEventType,PlayerSave} from '../src/lib/types';

const event=(type:GameplayEventType,targetId:string)=>({id:crypto.randomUUID(),type,targetId,at:new Date().toISOString()});
describe('data-driven Yangon Day 1',()=>{
 it('defines a connected, uniquely identified objective chain',()=>{expect(DAY_ONE_OBJECTIVES).toHaveLength(11);expect(new Set(DAY_ONE_OBJECTIVES.map(x=>x.id)).size).toBe(11);for(const objective of DAY_ONE_OBJECTIVES){expect(objective.chapterId).toBe('YANGON_DAY_1');expect(objective.title).toBeTruthy();expect(objective.description).toBeTruthy();expect(objective.requirements).toBeDefined();expect(objective.reward).toBeDefined();if(objective.nextObjectiveId)expect(DAY_ONE_OBJECTIVES.some(x=>x.id===objective.nextObjectiveId)).toBe(true)}});
 it('only advances from matching standardized gameplay events',()=>{let player=newPlayer('quest');player=consumeQuestEvent(player,event('FOOD_EATEN','mohinga'));expect(player.activeObjectiveId).toBe('CHECK_IN_GUEST_HOUSE');player=consumeQuestEvent(player,event('ACTIVITY_COMPLETED','hotel_checkin'));expect(player.activeObjectiveId).toBe('VISIT_TEA_SHOP');expect(player.completedObjectives).toContain('CHECK_IN_GUEST_HOUSE')});
 it('can resume persisted progression without transient UI state',()=>{const player=consumeQuestEvent(newPlayer('resume'),event('ACTIVITY_COMPLETED','hotel_checkin'));const restored=JSON.parse(JSON.stringify(player)) as PlayerSave;expect(restored.activeObjectiveId).toBe('VISIT_TEA_SHOP');expect(restored.gameplayEvents.at(-1)?.type).toBe('ACTIVITY_COMPLETED')});
});
