import { BALANCE, BUS_ROUTE, SPOTS } from '@/content/game';
import type { PlayerSave } from './types';
import { DEFAULT_SPAWN, isSafeWorldPosition, SAFE_SPAWNS } from '@/content/world';
import { DEFAULT_AVATAR_INVENTORY, DEFAULT_AVATAR_LOADOUT, validAvatarLoadout } from '@/content/avatar';
import { consumeQuestEvent, objectiveById } from '@/content/day-one';
import { emptyProgression, progressionCanUnlockBagan, reconcileProgression } from './progression';
export const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export const advanceGameTime=(day:number,minutes:number,delta:number)=>{const total=minutes+delta;return {day:day+Math.floor(total/1440),minutes:((total%1440)+1440)%1440}};
export const formatGameTime=(minutes:number)=>`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(Math.floor(minutes%60)).padStart(2,'0')}`;
export const attractionStatus=(minutes:number,open=360,close=1260)=>minutes<open||minutes>=close?'CLOSED':minutes>=close-60?'CLOSING SOON':'OPEN';
export const progress=(p:PlayerSave)=>Math.max(reconcileProgression(p).progression.yangonProgress,Math.min(35,Math.round((Math.min(p.discoveries.length,8)/8*30)+(Math.min(p.foods.length,3)/3*5)+(Math.min(p.photos.length,2)/2*5)+(Math.min(p.talkedTo.length,5)/5*5))));
export const shouldUnlockBagan=(p:PlayerSave)=>progressionCanUnlockBagan(reconcileProgression(p))||(p.dayOneCompleted&&p.day>=2&&p.completedObjectives.includes('END_DAY_AND_SLEEP')&&p.foods.length>0&&p.photos.length>=2&&p.discoveries.includes('shwedagon')); // legacy-save compatibility
export type JourneyObjective={id:string;title:string;detail:string;location?:string};
export function journeyObjective(p:PlayerSave):JourneyObjective{
 const configured=objectiveById(p.activeObjectiveId);if(configured)return{id:configured.id,title:configured.title,detail:configured.description,location:configured.navigation?.mode==='SEARCH_AREA'?'viewpoint':configured.completionEvent.targetId};
 const has=(id:string)=>p.discoveries.includes(id);
 if(!has('hotel_checked_in'))return{id:'check_in',title:'Check into the guesthouse',detail:'Enter Golden Tamarind Guesthouse and check in.',location:'hotel'};
 if(!has('tea_shop_entered'))return{id:'go_tea_shop',title:'Go to Tea Shop',detail:'Enter Morning Star Tea Shop.',location:'tea_shop'};
 if(!p.foods.includes('mohinga'))return{id:'breakfast',title:'Eat breakfast',detail:'Order and eat a bowl of mohinga at Morning Star Tea Shop.',location:'tea_shop'};
 if(!has('tea_owner_met'))return{id:'meet_local',title:'Meet a local',detail:'Talk to Daw Nwe, the tea-shop owner.',location:'tea_shop'};
 if(!has('landmark_recommended'))return{id:'learn_yangon',title:'Learn about Yangon',detail:'Ask Daw Nwe what landmark you should visit.',location:'tea_shop'};
 if(!has('market_browsed')&&!has('market_observation'))return{id:'explore_market',title:'Explore the market',detail:'Walk through Lanmadaw Market and browse its stalls.',location:'market'};
 if(!p.inventory.some(x=>['postcard','travel_notebook','simple_souvenir'].includes(x)))return{id:'market_activity',title:'Choose a market keepsake',detail:'Browse, talk, or buy a souvenir at the market.',location:'market'};
 if(!has('shwedagon'))return{id:'visit_landmark',title:'Visit the landmark',detail:'Learn and explore at the Golden Pagoda Gardens.',location:'shwedagon'};
 if(!p.photos.includes('pagoda_portrait'))return{id:'photograph',title:'Photograph it',detail:'Complete the pagoda portrait photo challenge.',location:'shwedagon'};
 if(!has('viewpoint_revealed'))return{id:'hidden_clue',title:'Find the hidden clue',detail:'Show your photograph to the landmark guide.',location:'shwedagon'};
 if(!has('viewpoint'))return{id:'find_viewpoint',title:'Find the viewpoint',detail:'Follow the clue—sunset is the perfect time.',location:'viewpoint'};
 if(!has('journal_reviewed'))return{id:'return_hotel',title:'Return to the hotel',detail:'Review your first-day journal at the guesthouse.',location:'hotel'};
 if(p.day<2)return{id:'sleep',title:'Sleep until Day 2',detail:'Rest at the guesthouse. The real server timer persists.',location:'hotel'};
 if(!p.baganUnlocked)return{id:'day_two',title:'Explore more Yangon',detail:`Reach ${BALANCE.baganUnlockProgress}% Yangon completion to unlock Bagan.`};
 return{id:'travel',title:'Bagan unlocked',detail:'Go to the bus station and buy your ticket.',location:'bus'};
}
export const newPlayer=(id:string):PlayerSave=>({id,progression:emptyProgression(),destination:'YANGON',zone:'Downtown',day:1,gameMinutes:8*60,energy:BALANCE.startingEnergy,mmk:BALANCE.startingMMK,majorState:'EXPLORING',locationContext:'WORLD',position:[...DEFAULT_SPAWN.position],lastSafePosition:[...DEFAULT_SPAWN.position],currentCheckpoint:DEFAULT_SPAWN.id,discoveries:[],foods:[],photos:[],photoMetadata:[],talkedTo:[],completedQuests:[],completedObjectives:[],activeObjectiveId:'CHECK_IN_GUEST_HOUSE',gameplayEvents:[],processedRequests:[],baganUnlocked:false,dayOneCompleted:false,dayOneStartingMMK:BALANCE.startingMMK,luggageState:'CARRYING',activeAction:null,timeline:[{at:new Date().toISOString(),day:1,text:'Arrived in Yangon with the Travel Fund'}],inventory:['canvas_backpack','sun_hat'],equipped:{BAG:'canvas_backpack',HAT:'sun_hat'},avatarInventory:[...DEFAULT_AVATAR_INVENTORY],avatarLoadout:{...DEFAULT_AVATAR_LOADOUT},avatarCreated:false,updatedAt:new Date().toISOString()});
export function resolveAction(p:PlayerSave,now=new Date()):PlayerSave {
 const legacy=!p.avatarInventory||!p.avatarLoadout;
 const normalized=reconcileProgression({...p,progression:p.progression??emptyProgression(),locationContext:p.locationContext??'WORLD',currentLocationId:p.currentLocationId??null,processedRequests:p.processedRequests??[],completedObjectives:p.completedObjectives??[],activeObjectiveId:p.activeObjectiveId??'CHECK_IN_GUEST_HOUSE',gameplayEvents:p.gameplayEvents??[],photoMetadata:p.photoMetadata??[],dayOneCompleted:p.dayOneCompleted??false,dayOneStartingMMK:p.dayOneStartingMMK??BALANCE.startingMMK,luggageState:p.luggageState??'CARRYING',lastSafePosition:p.lastSafePosition??p.position??[...DEFAULT_SPAWN.position],currentCheckpoint:p.currentCheckpoint??DEFAULT_SPAWN.id,avatarInventory:Array.from(new Set([...(p.avatarInventory??[]),...DEFAULT_AVATAR_INVENTORY])),avatarLoadout:validAvatarLoadout(p.avatarLoadout),avatarCreated:legacy?true:(p.avatarCreated??true)});
 if(!isSafeWorldPosition(normalized.position)){normalized.position=[...DEFAULT_SPAWN.position];normalized.lastSafePosition=[...DEFAULT_SPAWN.position];normalized.currentCheckpoint=DEFAULT_SPAWN.id;normalized.locationContext='WORLD';normalized.currentLocationId=null;}
 const a=normalized.activeAction;
 if(!a||new Date(a.completesAt)>now)return normalized;
 const trace=(message:string)=>{if(process.env.NODE_ENV!=='production')console.info(`[Travel] ${message}`)};
 if(a.kind==='TRAVEL'){trace(`travelId=${a.id} status=${a.status??'ACTIVE'} origin=YANGON destination=${a.destination} majorState=${normalized.majorState}`);trace(`server now=${now.toISOString()} completesAt=${a.completesAt}`);trace('completion eligible=true');trace('transaction begin');}
 const t=advanceGameTime(normalized.day,normalized.gameMinutes,a.gameMinutes),hotel=SAFE_SPAWNS.HOTEL.position;
 const completed={...a,status:'COMPLETED' as const,completedAt:now.toISOString()};
 let resolved:PlayerSave={...normalized,day:t.day,gameMinutes:t.minutes,energy:clamp(normalized.energy+a.energyRecovery,0,100),destination:a.destination??normalized.destination,majorState:a.kind==='TRAVEL'?'ARRIVAL':'EXPLORING',activeAction:null,lastCompletedAction:completed,lastSleepCompletedAt:a.kind==='SLEEP'?now.toISOString():normalized.lastSleepCompletedAt,position:a.kind==='SLEEP'?[...hotel] as [number,number,number]:normalized.position,lastSafePosition:a.kind==='SLEEP'?[...hotel] as [number,number,number]:normalized.lastSafePosition,currentCheckpoint:a.kind==='SLEEP'?'HOTEL':normalized.currentCheckpoint,timeline:[...normalized.timeline,{at:now.toISOString(),day:t.day,text:a.kind==='SLEEP'?'Woke refreshed at the guesthouse':`Arrived in ${a.destination}`}],updatedAt:now.toISOString()};
 if(a.kind==='SLEEP'){resolved=consumeQuestEvent(resolved,{id:crypto.randomUUID(),type:'SLEEP_COMPLETED',targetId:'guest_house',at:now.toISOString()});if(shouldUnlockBagan(resolved))resolved={...resolved,baganUnlocked:true,timeline:[...resolved.timeline,{at:now.toISOString(),day:resolved.day,text:'Destination unlocked — Bagan'}]};}
 else {resolved=consumeQuestEvent(resolved,{id:crypto.randomUUID(),type:'TRAVEL_COMPLETED',targetId:BUS_ROUTE.id,at:now.toISOString(),metadata:{origin:'YANGON',destination:a.destination??'BAGAN',transport:'BUS'}});trace('action ACTIVE -> COMPLETED');trace(`destination updated -> ${resolved.destination}`);trace(`majorState TRAVELLING -> ${resolved.majorState}`);trace('transaction commit');}
 return resolved;
}
export const nearbySpot=(position:[number,number,number])=>SPOTS.map(s=>({...s,d:Math.hypot(s.position[0]-position[0],s.position[2]-position[2])})).sort((a,b)=>a.d-b.d)[0];
export const canTravel=(p:PlayerSave)=>p.baganUnlocked&&p.mmk>=BUS_ROUTE.price&&p.majorState==='EXPLORING';
