import { ACHIEVEMENTS, BAGAN_MIN_PROGRESS, DESTINATION_WEIGHTS, DISCOVERY_DEFINITIONS, LEVEL_CURVE } from '@/content/progression';
import type { DiscoveryCategory, ExplorerProgression, PlayerSave, ProgressionAward } from './types';
const categories:DiscoveryCategory[]=['PLACES','FOOD','PEOPLE','STORIES','PHOTOS','SECRETS'];
export const explorerLevel=(xp:number)=>LEVEL_CURVE.reduce((level,threshold,index)=>xp>=threshold?index+1:level,1);
export const levelWindow=(xp:number)=>{const level=explorerLevel(xp),start=LEVEL_CURVE[level-1]??LEVEL_CURVE.at(-1)!,end=LEVEL_CURVE[level]??start+1000;return {level,start,end,current:xp-start,required:end-start}};
function canonical(p:PlayerSave,sourceType:string,id:string){
 if(sourceType==='LOCATION_DISCOVERED')return p.discoveries.includes(`place:${id}`)||p.discoveries.includes(id==='hotel'?'hotel_entered':id==='tea_shop'?'tea_shop_entered':`${id}_entered`);
 if(sourceType==='FOOD_DISCOVERED')return p.foods.includes(id);
 if(sourceType==='NPC_MEANINGFULLY_MET')return (p.npcMemories?.[id]?.conversationCount??0)>=1||p.discoveries.includes(id==='tea_shop_owner'?'tea_owner_met':id==='market_seller'?'market_seller_met':'never');
 if(sourceType==='STORY_DISCOVERED'||sourceType==='HIDDEN_DISCOVERY')return p.discoveries.includes(id);
 if(sourceType==='PHOTO_CHALLENGE')return p.photos.includes(id);
 return false;
}
export function destinationProgress(p:PlayerSave,discovered:string[]){const counts=collectionCounts(discovered),totals=collectionTotals();const journey=Math.min(1,p.completedObjectives.filter(x=>!['GO_TO_BUS_STATION','BUY_BAGAN_TICKET'].includes(x)).length/14);let value=journey*DESTINATION_WEIGHTS.journey;for(const category of categories)value+=(totals[category]?counts[category]/totals[category]:0)*DESTINATION_WEIGHTS[category];return Math.min(100,Math.round(value));}
export function collectionTotals(){return DISCOVERY_DEFINITIONS.reduce((a,d)=>(a[d.category]++,a),{PLACES:0,FOOD:0,PEOPLE:0,STORIES:0,PHOTOS:0,SECRETS:0} as Record<DiscoveryCategory,number>)}
export function collectionCounts(ids:string[]){return DISCOVERY_DEFINITIONS.filter(d=>ids.includes(d.id)).reduce((a,d)=>(a[d.category]++,a),{PLACES:0,FOOD:0,PEOPLE:0,STORIES:0,PHOTOS:0,SECRETS:0} as Record<DiscoveryCategory,number>)}
export function emptyProgression():ExplorerProgression{return {xp:0,score:0,level:1,awards:[],discoveries:[],achievements:[],yangonProgress:0}}
/** Rebuilds missing canonical awards. Safe to call after every server event and for old saves. */
export function reconcileProgression(player:PlayerSave):PlayerSave{
 const previous=player.progression??emptyProgression(),awards:ProgressionAward[]=[...previous.awards],known=new Set(awards.map(a=>`${a.sourceType}:${a.sourceId}`)),discovered=new Set(previous.discoveries),now=new Date().toISOString();
 for(const definition of DISCOVERY_DEFINITIONS)if(canonical(player,definition.sourceType,definition.sourceId)){discovered.add(definition.id);const key=`${definition.sourceType}:${definition.sourceId}`;if(!known.has(key)){known.add(key);awards.push({sourceType:definition.sourceType,sourceId:definition.sourceId,xp:definition.xp,score:definition.score,createdAt:now})}}
 const unlocked=new Set(previous.achievements),counts=collectionCounts([...discovered]);
 for(const achievement of ACHIEVEMENTS)if(achievement.test(counts)){unlocked.add(achievement.id);const key=`ACHIEVEMENT:${achievement.id}`;if(!known.has(key)){known.add(key);awards.push({sourceType:'ACHIEVEMENT',sourceId:achievement.id,xp:achievement.xp,score:achievement.score,createdAt:now})}}
 if(player.dayOneCompleted){const key='CHAPTER_COMPLETE:yangon_day_1';if(!known.has(key)){known.add(key);awards.push({sourceType:'CHAPTER_COMPLETE',sourceId:'yangon_day_1',xp:175,score:100,createdAt:now})}}
 const xp=awards.reduce((n,a)=>n+a.xp,0),score=awards.reduce((n,a)=>n+a.score,0),yangonProgress=destinationProgress(player,[...discovered]);
 return {...player,progression:{xp,score,level:explorerLevel(xp),awards,discoveries:[...discovered],achievements:[...unlocked],yangonProgress}};
}
export const progressionCanUnlockBagan=(p:PlayerSave)=>p.dayOneCompleted&&p.completedObjectives.includes('END_DAY_AND_SLEEP')&&p.progression.yangonProgress>=BAGAN_MIN_PROGRESS;
