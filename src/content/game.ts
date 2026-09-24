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
 {id:'hotel',name:'Golden Tamarind Guesthouse',position:[-16,0,-12],kind:'sleep',prompt:'Check in / rest',color:'#d99058',description:'Your friendly base in downtown Yangon.'},
 {id:'tea_shop',name:'Morning Star Tea Shop',position:[-5,0,10],kind:'food',prompt:'Order food',color:'#57a773',description:'Steam, conversation, and local favourites.'},
 {id:'shwedagon',name:'Golden Pagoda Gardens',position:[14,0,-9],kind:'attraction',prompt:'Visit landmark',color:'#e8b938',description:'A stylized landmark garden inspired by Yangon’s golden skyline.'},
 {id:'market',name:'Lanmadaw Market',position:[12,0,11],kind:'npc',prompt:'Talk to May',color:'#d75b61',description:'A compact neighbourhood market.'},
 {id:'viewpoint',name:'Secret Rooftop View',position:[2,0,-17],kind:'discover',prompt:'Take in the view',color:'#6e9bd1',description:'A quiet view above the warm city streets.'},
 {id:'bus',name:'Aung Mingalar Ticket Office',position:[-17,0,13],kind:'travel',prompt:'Buy Bagan ticket',color:'#5c75a8',description:'Express coaches depart for the next chapter.'}
];
export const NPCS={hotel:{name:'Ko Min',role:'Hotel host',lines:['Mingalaba! The city is best learned one street at a time.','Try breakfast at the green tea shop, then follow the gold skyline.']},market:{name:'May',role:'Market seller',lines:['These lanes wake early. Every stall has a story.','There is a quiet viewpoint north of here—look for the blue lantern.']},tea_shop:{name:'Daw Nwe',role:'Tea shop owner',lines:['Sit, breathe, and taste Yangon. Mohinga is a fine beginning.']},shwedagon:{name:'Thiri',role:'Local guide',lines:['Welcome to our stylized pagoda garden. Take only memories—and a photograph.']},bus:{name:'U Htun',role:'Ticket seller',lines:['Document enough of Yangon and the road to Bagan opens.']}} as const;
export const QUESTS=[{id:'first_taste',name:'A Yangon Breakfast',text:'Try any local food.'},{id:'golden_frame',name:'Frame the Gold',text:'Photograph the pagoda gardens.'},{id:'city_threads',name:'City Threads',text:'Discover the market and hidden viewpoint.'}] as const;
export const SLEEP_OPTIONS=[{hours:2,recovery:25},{hours:4,recovery:50},{hours:6,recovery:75},{hours:8,recovery:100}];
export const BUS_ROUTE={id:'yangon_bagan_bus',name:'Express Bus',origin:'YANGON',destination:'BAGAN',price:9000,gameHours:11,realMinutes:66};
