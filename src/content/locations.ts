import type { Activity, GameLocation } from '@/lib/types';
export const ACTIVITIES:Activity[]=[
 {id:'food_mohinga',locationId:'tea_shop',name:'Mohinga',description:'Traditional rice-noodle breakfast dish.',mmkCost:3000,energyRestore:20,gameMinutes:15,foodId:'mohinga',discoveryId:'food:mohinga',mmkReward:600,repeatable:true},
 {id:'food_laphet',locationId:'tea_shop',name:'Laphet Thoke',description:'A tea-leaf salad with a mix of textures.',mmkCost:2500,energyRestore:18,gameMinutes:15,foodId:'laphet',discoveryId:'food:laphet',mmkReward:700,repeatable:true},
 {id:'food_tea_snack',locationId:'tea_shop',name:'Tea + Snack',description:'A warm drink and a small snack.',mmkCost:1500,energyRestore:12,gameMinutes:10,foodId:'tea_snack',discoveryId:'food:tea_snack',mmkReward:400,repeatable:true},
 {id:'tea_culture',locationId:'tea_shop',name:'Look Around',description:'Notice the rhythm of a neighbourhood tea shop.',gameMinutes:12,discoveryId:'tea_shop_culture',mmkReward:500,repeatable:false},
 {id:'reveal_viewpoint',locationId:'tea_shop',name:'Tell me where it is',description:'Ask the owner to mark the quiet viewpoint.',gameMinutes:3,discoveryId:'viewpoint_revealed',repeatable:false},
 {id:'market_browse',locationId:'market',name:'Browse Market',description:'Browse the compact collection of stalls.',gameMinutes:12,discoveryId:'market_browsed',repeatable:true},
 {id:'market_postcard',locationId:'market',name:'Postcard',description:'A printed city keepsake.',mmkCost:800,gameMinutes:3,inventoryItem:'postcard',repeatable:false},
 {id:'market_notebook',locationId:'market',name:'Travel Notebook',description:'A pocket notebook for field notes.',mmkCost:2200,gameMinutes:3,inventoryItem:'travel_notebook',repeatable:false},
 {id:'market_souvenir',locationId:'market',name:'Simple Souvenir',description:'A small fictional keepsake from the market.',mmkCost:3500,gameMinutes:3,inventoryItem:'simple_souvenir',repeatable:false},
 {id:'market_observe',locationId:'market',name:'Look Around',description:'Observe the colours and movement of the stalls.',gameMinutes:10,discoveryId:'market_observation',mmkReward:400,repeatable:false},
 {id:'hotel_rest',locationId:'hotel',name:'Rest',description:'Take a short break in the lobby.',gameMinutes:30,energyRestore:12,repeatable:true},
 {id:'landmark_visit',locationId:'shwedagon',name:'Visit',description:'Spend time in the stylized pagoda gardens.',mmkCost:1000,energyCost:8,gameMinutes:30,discoveryId:'shwedagon',mmkReward:1200,repeatable:true},
 {id:'landmark_learn',locationId:'shwedagon',name:'Learn',description:'Read the interpretive display for this fictionalized garden.',gameMinutes:10,discoveryId:'pagoda_gardens_notes',mmkReward:500,repeatable:false},
 {id:'landmark_observe',locationId:'shwedagon',name:'Look Around',description:'Pause and observe the garden design.',gameMinutes:8,discoveryId:'pagoda_gardens_observation',repeatable:false},
];
export const LOCATIONS:GameLocation[]=[
 {id:'tea_shop',name:'Morning Star Tea Shop',type:'TEA_SHOP',description:'A busy neighbourhood tea shop filled with steam and conversation.',exteriorPosition:[-7,0,9],availableActions:['ORDER_FOOD','TALK','ASK_ABOUT_YANGON','LOOK_AROUND','LEAVE'],openingHours:[360,1320],presentation:{theme:'tea'},npcs:['tea_owner'],discoveries:['tea_shop_culture','viewpoint_revealed'],activities:['food_mohinga','food_laphet','food_tea_snack','tea_culture','reveal_viewpoint']},
 {id:'market',name:'Lanmadaw Market',type:'MARKET',description:'A compact neighbourhood market of colourful stalls.',exteriorPosition:[13,0,12],availableActions:['BROWSE','TALK','BUY_SOUVENIR','LOOK_AROUND','LEAVE'],presentation:{theme:'market'},npcs:['market_seller'],discoveries:['market_browsed','market_observation'],activities:['market_browse','market_postcard','market_notebook','market_souvenir','market_observe']},
 {id:'hotel',name:'Golden Tamarind Guesthouse',type:'HOTEL',description:'A calm base for resting and reviewing the journey.',exteriorPosition:[-22,0,14],availableActions:['TALK','REST','SLEEP','VIEW_JOURNAL','LEAVE'],presentation:{theme:'hotel'},npcs:['hotel_staff'],discoveries:[],activities:['hotel_rest']},
 {id:'shwedagon',name:'Golden Pagoda Gardens',type:'LANDMARK',description:'A fictionalized landmark garden inspired by Yangon’s golden skyline.',exteriorPosition:[19,0,-16],availableActions:['VISIT','LEARN','PHOTOGRAPH','LOOK_AROUND','LEAVE'],openingHours:[360,1260],presentation:{theme:'landmark'},npcs:['guide'],discoveries:['shwedagon','pagoda_gardens_notes'],activities:['landmark_visit','landmark_learn','landmark_observe']},
 {id:'bus',name:'Yangon Road Ticket Station',type:'BUS_STATION',description:'The ticket hall for the existing Yangon to Bagan route.',exteriorPosition:[-23,0,-16],availableActions:['TALK','VIEW_DESTINATIONS','BUY_TICKET','LEAVE'],presentation:{theme:'station'},npcs:['ticket_seller'],discoveries:[],activities:[]},
];
export const locationById=(id:string)=>LOCATIONS.find(location=>location.id===id);
export const activityById=(id:string)=>ACTIVITIES.find(activity=>activity.id===id);
