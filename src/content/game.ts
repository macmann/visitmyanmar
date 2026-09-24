export const BALANCE = { maxEnergy:100, startingEnergy:82, startingMMK:22000, explorationDrainPerMinute:1.2, baganUnlockProgress:30, activeGameMinutesPerRealMinute:10 } as const;
export type Vec3=[number,number,number];
export type InteractionKind='npc'|'food'|'attraction'|'sleep'|'travel'|'discover';
export type WorldSpot={id:string;name:string;position:Vec3;kind:InteractionKind;prompt:string;color:string;description:string};
export const FOODS=[
 {id:'mohinga',name:'Mohinga',description:'A comforting rice-noodle breakfast bowl.',price:1800,energy:24,reward:600},
 {id:'laphet',name:'Laphet thoke',description:'Bright tea-leaf salad with crunchy textures.',price:2200,energy:18,reward:700},
 {id:'tea_snack',name:'Sweet tea & samosa',description:'A tea-shop pause with a crisp snack.',price:1200,energy:12,reward:400}
] as const;
export const SPOTS:WorldSpot[]=[
 {id:'hotel',name:'Golden Tamarind Guesthouse',position:[-22,0,14],kind:'sleep',prompt:'Enter Hotel',color:'#d99058',description:'Your quiet base in the Tamarind Quarter.'},
 {id:'tea_shop',name:'Morning Star Tea Shop',position:[-7,0,9],kind:'food',prompt:'Enter Tea Shop',color:'#57a773',description:'Steam, conversation, and local favourites.'},
 {id:'shwedagon',name:'Golden Pagoda Gardens',position:[19,0,-16],kind:'attraction',prompt:'Enter Landmark',color:'#e8b938',description:'A fictionalized landmark garden inspired by Yangon’s golden skyline.'},
 {id:'market',name:'Lanmadaw Market',position:[13,0,12],kind:'npc',prompt:'Enter Market',color:'#d75b61',description:'A compact neighbourhood market.'},
 {id:'viewpoint',name:'Secret Garden View',position:[27,0,19],kind:'discover',prompt:'Examine',color:'#6e9bd1',description:'A quiet raised view framed by tamarind trees.'},
 {id:'bus',name:'Yangon Road Ticket Station',position:[-23,0,-16],kind:'travel',prompt:'Enter Bus Station',color:'#5c75a8',description:'Express coaches depart for the next chapter.'}
];
export const NPCS={hotel:{name:'Ko Min',role:'Hotel host',lines:['Mingalaba! The city is best learned one street at a time.','Try breakfast at the green tea shop, then follow the gold skyline.']},market:{name:'May',role:'Market seller',lines:['These lanes wake early. Every stall has a story.','There is a quiet viewpoint north of here—look for the blue lantern.']},tea_shop:{name:'Daw Nwe',role:'Tea shop owner',lines:['Sit, breathe, and taste Yangon. Mohinga is a fine beginning.']},shwedagon:{name:'Thiri',role:'Local guide',lines:['Welcome to our stylized pagoda garden. Take only memories—and a photograph.']},bus:{name:'U Htun',role:'Ticket seller',lines:['Document enough of Yangon and the road to Bagan opens.']}} as const;
export const QUESTS=[{id:'first_taste',name:'A Yangon Breakfast',text:'Try any local food.'},{id:'golden_frame',name:'Frame the Gold',text:'Photograph the pagoda gardens.'},{id:'city_threads',name:'City Threads',text:'Discover the market and hidden viewpoint.'}] as const;
export const SLEEP_OPTIONS=[{hours:2,recovery:25},{hours:4,recovery:50},{hours:6,recovery:75},{hours:8,recovery:100}];
export const BUS_ROUTE={id:'yangon_bagan_bus',name:'Express Bus',origin:'YANGON',destination:'BAGAN',price:9000,gameHours:11,realMinutes:60};
