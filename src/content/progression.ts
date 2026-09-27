import type { DiscoveryCategory } from '@/lib/types';

export type DiscoveryDefinition={id:string;category:DiscoveryCategory;destinationId:'YANGON';title:string;description:string;hidden?:boolean;sourceType:string;sourceId:string;xp:number;score:number};
export const LEVEL_CURVE=[0,300,750,1350,2100,3000] as const;
export const REWARD_CATALOG={PLACE:{xp:60,score:30},FOOD:{xp:75,score:40},PERSON:{xp:60,score:25},STORY:{xp:80,score:45},PHOTO:{xp:100,score:60},SECRET:{xp:125,score:80},CHAPTER:{xp:175,score:100},ACHIEVEMENT:{xp:100,score:50}} as const;
const d=(v:DiscoveryDefinition)=>v;
export const DISCOVERY_DEFINITIONS:DiscoveryDefinition[]=[
 d({id:'place_guest_house',category:'PLACES',destinationId:'YANGON',title:'Golden Tamarind Guesthouse',description:'A welcoming base in Yangon.',sourceType:'LOCATION_DISCOVERED',sourceId:'hotel',...REWARD_CATALOG.PLACE}),
 d({id:'place_tea_shop',category:'PLACES',destinationId:'YANGON',title:'Morning Star Tea Shop',description:'A neighbourhood table and a warm bowl.',sourceType:'LOCATION_DISCOVERED',sourceId:'tea_shop',...REWARD_CATALOG.PLACE}),
 d({id:'place_market',category:'PLACES',destinationId:'YANGON',title:'Lanmadaw Market',description:'Busy stalls and local stories.',sourceType:'LOCATION_DISCOVERED',sourceId:'market',...REWARD_CATALOG.PLACE}),
 d({id:'place_shwedagon',category:'PLACES',destinationId:'YANGON',title:'Golden Pagoda Gardens',description:'A golden landmark above the city.',sourceType:'LOCATION_DISCOVERED',sourceId:'shwedagon',...REWARD_CATALOG.PLACE}),
 d({id:'food_mohinga',category:'FOOD',destinationId:'YANGON',title:'Mohinga',description:'Myanmar rice noodles in a fragrant fish broth.',sourceType:'FOOD_DISCOVERED',sourceId:'mohinga',...REWARD_CATALOG.FOOD}),
 d({id:'food_laphet',category:'FOOD',destinationId:'YANGON',title:'Laphet Thoke',description:'Tea-leaf salad with bright, crisp textures.',sourceType:'FOOD_DISCOVERED',sourceId:'laphet',...REWARD_CATALOG.FOOD}),
 d({id:'person_daw_nwe',category:'PEOPLE',destinationId:'YANGON',title:'Daw Nwe',description:'Tea shop owner · met at Morning Star.',sourceType:'NPC_MEANINGFULLY_MET',sourceId:'tea_shop_owner',...REWARD_CATALOG.PERSON}),
 d({id:'person_may',category:'PEOPLE',destinationId:'YANGON',title:'May',description:'Market seller · met at Lanmadaw Market.',sourceType:'NPC_MEANINGFULLY_MET',sourceId:'market_seller',...REWARD_CATALOG.PERSON}),
 d({id:'person_ko_min',category:'PEOPLE',destinationId:'YANGON',title:'Ko Min',description:'Neighbourhood local · met near the guesthouse.',sourceType:'NPC_MEANINGFULLY_MET',sourceId:'street_local',...REWARD_CATALOG.PERSON}),
 d({id:'story_tea_culture',category:'STORIES',destinationId:'YANGON',title:'A Seat at the Tea Table',description:'Tea shops are places to pause, talk and learn.',sourceType:'STORY_DISCOVERED',sourceId:'tea_culture',...REWARD_CATALOG.STORY}),
 d({id:'story_market_rhythm',category:'STORIES',destinationId:'YANGON',title:'The Market’s Rhythm',description:'A market is best understood by taking time to observe.',sourceType:'STORY_DISCOVERED',sourceId:'market_observation',...REWARD_CATALOG.STORY}),
 d({id:'photo_landmark',category:'PHOTOS',destinationId:'YANGON',title:'Golden Frame',description:'Photograph the Golden Pagoda Gardens.',sourceType:'PHOTO_CHALLENGE',sourceId:'landmark_photo',...REWARD_CATALOG.PHOTO}),
 d({id:'photo_viewpoint',category:'PHOTOS',destinationId:'YANGON',title:'Above the Streets',description:'Capture Yangon from the quiet viewpoint.',sourceType:'PHOTO_CHALLENGE',sourceId:'viewpoint_photo',...REWARD_CATALOG.PHOTO}),
 d({id:'secret_blue_lanterns',category:'SECRETS',destinationId:'YANGON',title:'Blue Lantern Passage',description:'A quiet viewpoint beyond the market.',hidden:true,sourceType:'HIDDEN_DISCOVERY',sourceId:'viewpoint',...REWARD_CATALOG.SECRET}),
 d({id:'secret_sunset',category:'SECRETS',destinationId:'YANGON',title:'Yangon Afterglow',description:'The golden hour seen from a hidden perch.',hidden:true,sourceType:'HIDDEN_DISCOVERY',sourceId:'sunset_shot',...REWARD_CATALOG.SECRET}),
 d({id:'secret_teashop_detail',category:'SECRETS',destinationId:'YANGON',title:'The Old Tea Kettle',description:'A well-used kettle with a story in every mark.',hidden:true,sourceType:'HIDDEN_DISCOVERY',sourceId:'tea_culture',...REWARD_CATALOG.SECRET}),
];
export const ACHIEVEMENTS=[
 {id:'first_steps',title:'First Steps',description:'Discover your first Yangon place.',xp:75,score:40,test:(c:Record<DiscoveryCategory,number>)=>c.PLACES>=1},
 {id:'local_taste',title:'Local Taste',description:'Discover your first Myanmar food.',xp:75,score:40,test:(c:Record<DiscoveryCategory,number>)=>c.FOOD>=1},
 {id:'people_person',title:'People Person',description:'Meaningfully meet three Yangon locals.',xp:125,score:75,test:(c:Record<DiscoveryCategory,number>)=>c.PEOPLE>=3},
 {id:'yangon_photographer',title:'Yangon Photographer',description:'Complete both Yangon photo challenges.',xp:150,score:100,test:(c:Record<DiscoveryCategory,number>)=>c.PHOTOS>=2},
 {id:'hidden_yangon',title:'Hidden Yangon',description:'Find two of Yangon’s secrets.',xp:150,score:100,test:(c:Record<DiscoveryCategory,number>)=>c.SECRETS>=2},
] as const;
export const DESTINATION_WEIGHTS={journey:40,PLACES:20,FOOD:10,PEOPLE:10,STORIES:5,PHOTOS:10,SECRETS:5} as const;
export const BAGAN_MIN_PROGRESS=65;
