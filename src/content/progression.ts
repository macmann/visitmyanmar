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

 d({id:'place_sule',category:'PLACES',destinationId:'YANGON',title:'Sule City Anchor',description:'A stylized downtown navigation anchor.',sourceType:'LOCATION_DISCOVERED',sourceId:'sule',...REWARD_CATALOG.PLACE}),
 d({id:'place_heritage_row',category:'PLACES',destinationId:'YANGON',title:'Downtown Heritage Row',description:'Older urban frontage in the compressed downtown.',sourceType:'LOCATION_DISCOVERED',sourceId:'heritage_row',...REWARD_CATALOG.PLACE}),
 d({id:'place_book_arcade',category:'PLACES',destinationId:'YANGON',title:'Book Arcade',description:'A shaded place for books and conversation.',sourceType:'LOCATION_DISCOVERED',sourceId:'book_arcade',...REWARD_CATALOG.PLACE}),
 d({id:'place_bogyoke_market',category:'PLACES',destinationId:'YANGON',title:'Bogyoke Market Arcade',description:'A stylized larger market arcade.',sourceType:'LOCATION_DISCOVERED',sourceId:'bogyoke_market',...REWARD_CATALOG.PLACE}),
 d({id:'place_street_food',category:'PLACES',destinationId:'YANGON',title:'19th Street Food Lane',description:'An evening street-food destination.',sourceType:'LOCATION_DISCOVERED',sourceId:'street_food',...REWARD_CATALOG.PLACE}),
 d({id:'place_shwedagon_viewpoint',category:'PLACES',destinationId:'YANGON',title:'Shwedagon Viewpoint',description:'A respectful configured skyline viewpoint.',sourceType:'LOCATION_DISCOVERED',sourceId:'shwedagon_viewpoint',...REWARD_CATALOG.PLACE}),
 d({id:'place_kandawgyi_walk',category:'PLACES',destinationId:'YANGON',title:'Kandawgyi Lake Walk',description:'Water, planting, and quieter paths.',sourceType:'LOCATION_DISCOVERED',sourceId:'kandawgyi_walk',...REWARD_CATALOG.PLACE}),
 d({id:'place_lake_viewpoint',category:'PLACES',destinationId:'YANGON',title:'Lake Sunset Deck',description:'A configured western-facing lake view.',sourceType:'LOCATION_DISCOVERED',sourceId:'lake_viewpoint',...REWARD_CATALOG.PLACE}),
 d({id:'place_strand_frontage',category:'PLACES',destinationId:'YANGON',title:'Strand Frontage',description:'Older urban frontage by the river road.',sourceType:'LOCATION_DISCOVERED',sourceId:'strand_frontage',...REWARD_CATALOG.PLACE}),
 d({id:'place_pansodan_jetty',category:'PLACES',destinationId:'YANGON',title:'Pansodan Jetty View',description:'A river-edge view and future ferry foundation.',sourceType:'LOCATION_DISCOVERED',sourceId:'pansodan_jetty',...REWARD_CATALOG.PLACE}),
 d({id:'place_river_view',category:'PLACES',destinationId:'YANGON',title:'Yangon River Frame',description:'An open view across the river edge.',sourceType:'LOCATION_DISCOVERED',sourceId:'river_view',...REWARD_CATALOG.PLACE}),
 d({id:'food_shan_noodles',category:'FOOD',destinationId:'YANGON',title:'Shan-style Noodles',description:'A configured noodle plate served at the food lane.',sourceType:'FOOD_DISCOVERED',sourceId:'shan_noodles',...REWARD_CATALOG.FOOD}),
 d({id:'food_samosa_salad',category:'FOOD',destinationId:'YANGON',title:'Samosa Salad',description:'A configured savoury street-food discovery.',sourceType:'FOOD_DISCOVERED',sourceId:'samosa_salad',...REWARD_CATALOG.FOOD}),
 d({id:'food_grilled_skewer',category:'FOOD',destinationId:'YANGON',title:'Street-side Skewer',description:'A small evening food-stall discovery.',sourceType:'FOOD_DISCOVERED',sourceId:'grilled_skewer',...REWARD_CATALOG.FOOD}),
 d({id:'food_jaggery_snack',category:'FOOD',destinationId:'YANGON',title:'Jaggery Snack',description:'A sweet market snack discovery.',sourceType:'FOOD_DISCOVERED',sourceId:'jaggery_snack',...REWARD_CATALOG.FOOD}),
 d({id:'person_downtown_bookseller',category:'PEOPLE',destinationId:'YANGON',title:'Ma Ei',description:'Downtown bookseller.',sourceType:'NPC_MEANINGFULLY_MET',sourceId:'downtown_bookseller',...REWARD_CATALOG.PERSON}),
 d({id:'person_bogyoke_seller',category:'PEOPLE',destinationId:'YANGON',title:'Thandar',description:'Market arcade seller.',sourceType:'NPC_MEANINGFULLY_MET',sourceId:'bogyoke_seller',...REWARD_CATALOG.PERSON}),
 d({id:'person_food_vendor',category:'PEOPLE',destinationId:'YANGON',title:'Ko Aung',description:'Street-food vendor.',sourceType:'NPC_MEANINGFULLY_MET',sourceId:'food_vendor',...REWARD_CATALOG.PERSON}),
 d({id:'person_landmark_guide',category:'PEOPLE',destinationId:'YANGON',title:'Thiri',description:'Knowledgeable local at the garden approach.',sourceType:'NPC_MEANINGFULLY_MET',sourceId:'landmark_guide',...REWARD_CATALOG.PERSON}),
 d({id:'person_park_visitor',category:'PEOPLE',destinationId:'YANGON',title:'Mya Mya',description:'A regular park visitor.',sourceType:'NPC_MEANINGFULLY_MET',sourceId:'park_visitor',...REWARD_CATALOG.PERSON}),
 d({id:'person_taxi_driver',category:'PEOPLE',destinationId:'YANGON',title:'U Zaw',description:'Local taxi driver.',sourceType:'NPC_MEANINGFULLY_MET',sourceId:'taxi_driver',...REWARD_CATALOG.PERSON}),
 d({id:'story_heritage_walk',category:'STORIES',destinationId:'YANGON',title:'Balconies Above the Street',description:'A close look at the visual layers of downtown.',sourceType:'STORY_DISCOVERED',sourceId:'heritage_walk',...REWARD_CATALOG.STORY}),
 d({id:'story_bogyoke_browsed',category:'STORIES',destinationId:'YANGON',title:'Arcade Rhythm',description:'A market story found by browsing rather than rushing.',sourceType:'STORY_DISCOVERED',sourceId:'bogyoke_browsed',...REWARD_CATALOG.STORY}),
 d({id:'story_south_garden_walk',category:'STORIES',destinationId:'YANGON',title:'A Quiet Approach',description:'A story about observing a landmark respectfully.',sourceType:'STORY_DISCOVERED',sourceId:'south_garden_walk',...REWARD_CATALOG.STORY}),
 d({id:'story_strand_walked',category:'STORIES',destinationId:'YANGON',title:'City at the River',description:'The city changes character at its river edge.',sourceType:'STORY_DISCOVERED',sourceId:'strand_walked',...REWARD_CATALOG.STORY}),
 d({id:'story_jetty_observed',category:'STORIES',destinationId:'YANGON',title:'Across the Water',description:'A short observation at the working waterfront.',sourceType:'STORY_DISCOVERED',sourceId:'jetty_observed',...REWARD_CATALOG.STORY}),
 d({id:'photo_sule_photo',category:'PHOTOS',destinationId:'YANGON',title:'City Compass',description:'Frame the downtown anchor.',sourceType:'PHOTO_CHALLENGE',sourceId:'sule_photo',...REWARD_CATALOG.PHOTO}),
 d({id:'photo_bogyoke_photo',category:'PHOTOS',destinationId:'YANGON',title:'Market Geometry',description:'Capture the arcade approach.',sourceType:'PHOTO_CHALLENGE',sourceId:'bogyoke_photo',...REWARD_CATALOG.PHOTO}),
 d({id:'photo_street_food_photo',category:'PHOTOS',destinationId:'YANGON',title:'Evening Tables',description:'Photograph the food lane after 17:00.',sourceType:'PHOTO_CHALLENGE',sourceId:'street_food_photo',...REWARD_CATALOG.PHOTO}),
 d({id:'photo_shwedagon_view_photo',category:'PHOTOS',destinationId:'YANGON',title:'Respectful Distance',description:'Frame the skyline from the configured viewpoint.',sourceType:'PHOTO_CHALLENGE',sourceId:'shwedagon_view_photo',...REWARD_CATALOG.PHOTO}),
 d({id:'photo_lake_sunset_photo',category:'PHOTOS',destinationId:'YANGON',title:'Lake Afterglow',description:'Capture the lake between 17:00 and 20:00.',sourceType:'PHOTO_CHALLENGE',sourceId:'lake_sunset_photo',...REWARD_CATALOG.PHOTO}),
 d({id:'photo_waterfront_photo',category:'PHOTOS',destinationId:'YANGON',title:'River City',description:'Frame the river from a configured viewpoint.',sourceType:'PHOTO_CHALLENGE',sourceId:'waterfront_photo',...REWARD_CATALOG.PHOTO}),
 d({id:'secret_lantern_alley_secret',category:'SECRETS',destinationId:'YANGON',title:'Market Wall Passage',description:'A tucked-away passage behind the arcades.',hidden:true,sourceType:'HIDDEN_DISCOVERY',sourceId:'lantern_alley_secret',...REWARD_CATALOG.SECRET}),
 d({id:'secret_garden_bench_pause',category:'SECRETS',destinationId:'YANGON',title:'The Quiet Bench',description:'A shaded pause beyond the lake path.',hidden:true,sourceType:'HIDDEN_DISCOVERY',sourceId:'garden_bench_pause',...REWARD_CATALOG.SECRET}),
 d({id:'secret_jetty_observed',category:'SECRETS',destinationId:'YANGON',title:'Jetty Detail',description:'A small detail at the edge of the river.',hidden:true,sourceType:'HIDDEN_DISCOVERY',sourceId:'jetty_observed',...REWARD_CATALOG.SECRET}),];
export const ACHIEVEMENTS=[
 {id:'first_steps',title:'First Steps',description:'Discover your first Yangon place.',xp:75,score:40,test:(c:Record<DiscoveryCategory,number>)=>c.PLACES>=1},
 {id:'local_taste',title:'Local Taste',description:'Discover your first Myanmar food.',xp:75,score:40,test:(c:Record<DiscoveryCategory,number>)=>c.FOOD>=1},
 {id:'people_person',title:'People Person',description:'Meaningfully meet three Yangon locals.',xp:125,score:75,test:(c:Record<DiscoveryCategory,number>)=>c.PEOPLE>=3},
 {id:'yangon_photographer',title:'Yangon Photographer',description:'Complete both Yangon photo challenges.',xp:150,score:100,test:(c:Record<DiscoveryCategory,number>)=>c.PHOTOS>=2},
 {id:'hidden_yangon',title:'Hidden Yangon',description:'Find two of Yangon’s secrets.',xp:150,score:100,test:(c:Record<DiscoveryCategory,number>)=>c.SECRETS>=2},
] as const;
export const DESTINATION_WEIGHTS={journey:40,PLACES:20,FOOD:10,PEOPLE:10,STORIES:5,PHOTOS:10,SECRETS:5} as const;
export const BAGAN_MIN_PROGRESS=65;
