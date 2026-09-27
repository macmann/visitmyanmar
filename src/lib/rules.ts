import { BALANCE, BUS_ROUTE, SPOTS } from '@/content/game';
import type { PlayerSave } from './types';
import { DEFAULT_SPAWN, SAFE_SPAWNS } from '@/content/world';
export const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export const advanceGameTime=(day:number,minutes:number,delta:number)=>{const total=minutes+delta;return {day:day+Math.floor(total/1440),minutes:((total%1440)+1440)%1440}};
export const formatGameTime=(minutes:number)=>`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(Math.floor(minutes%60)).padStart(2,'0')}`;
export const attractionStatus=(minutes:number,open=360,close=1260)=>minutes<open||minutes>=close?'CLOSED':minutes>=close-60?'CLOSING SOON':'OPEN';
export const progress=(p:Pick<PlayerSave,'discoveries'|'foods'|'photos'|'talkedTo'>)=>Math.min(100,Math.round((p.discoveries.length/6*40)+(p.foods.length/3*20)+(p.photos.length/3*25)+(p.talkedTo.length/5*15)));
export const shouldUnlockBagan=(p:PlayerSave)=>p.day>=2&&progress(p)>=BALANCE.baganUnlockProgress&&p.foods.length>0&&p.photos.length>0&&p.discoveries.includes('shwedagon');
export type JourneyObjective={id:string;title:string;detail:string;location?:string};
export function journeyObjective(p:PlayerSave):JourneyObjective{
 const has=(id:string)=>p.discoveries.includes(id);
 if(!has('hotel_checked_in'))return{id:'check_in',title:'Check into the guesthouse',detail:'Enter Golden Tamarind Guesthouse and check in.',location:'hotel'};
 if(!p.foods.includes('mohinga'))return{id:'breakfast',title:'Eat breakfast',detail:'Order a bowl of mohinga at Morning Star Tea Shop.',location:'tea_shop'};
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
export const newPlayer=(id:string):PlayerSave=>({id,destination:'YANGON',zone:'Downtown',day:1,gameMinutes:8*60,energy:BALANCE.startingEnergy,mmk:BALANCE.startingMMK,majorState:'EXPLORING',position:[...DEFAULT_SPAWN.position],lastSafePosition:[...DEFAULT_SPAWN.position],currentCheckpoint:DEFAULT_SPAWN.id,discoveries:[],foods:[],photos:[],talkedTo:[],completedQuests:[],baganUnlocked:false,activeAction:null,timeline:[{at:new Date().toISOString(),day:1,text:'Arrived in Yangon with the Travel Fund'}],inventory:['canvas_backpack','sun_hat'],equipped:{BAG:'canvas_backpack',HAT:'sun_hat'},updatedAt:new Date().toISOString()});
export function resolveAction(p:PlayerSave,now=new Date()):PlayerSave {const normalized={...p,lastSafePosition:p.lastSafePosition??p.position??[...DEFAULT_SPAWN.position],currentCheckpoint:p.currentCheckpoint??DEFAULT_SPAWN.id};const a=normalized.activeAction;if(!a||new Date(a.completesAt)>now)return normalized;const t=advanceGameTime(normalized.day,normalized.gameMinutes,a.gameMinutes);const hotel=SAFE_SPAWNS.HOTEL.position;return {...normalized,day:t.day,gameMinutes:t.minutes,energy:clamp(normalized.energy+a.energyRecovery,0,100),destination:a.destination??normalized.destination,majorState:'EXPLORING',activeAction:null,position:a.kind==='SLEEP'?[...hotel]:normalized.position,lastSafePosition:a.kind==='SLEEP'?[...hotel]:normalized.lastSafePosition,currentCheckpoint:a.kind==='SLEEP'?'HOTEL':normalized.currentCheckpoint,timeline:[...normalized.timeline,{at:now.toISOString(),day:t.day,text:a.kind==='SLEEP'?'Woke refreshed at the guesthouse':`Arrived in ${a.destination}`}],updatedAt:now.toISOString()};}
export const nearbySpot=(position:[number,number,number])=>SPOTS.map(s=>({...s,d:Math.hypot(s.position[0]-position[0],s.position[2]-position[2])})).sort((a,b)=>a.d-b.d)[0];
export const canTravel=(p:PlayerSave)=>p.baganUnlocked&&p.mmk>=BUS_ROUTE.price&&p.majorState==='EXPLORING';
