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
 {id:'hotel',name:'Golden Tamarind Guesthouse',position:[-74,0,21],kind:'sleep',prompt:'Enter Guest House',color:'#d99058',description:'Your quiet base in the Tamarind Quarter.'},
 {id:'tea_shop',name:'Morning Star Tea Shop',position:[-58,0,7.6],kind:'food',prompt:'Enter Tea Shop',color:'#57a773',description:'Steam, conversation, and local favourites.'},
 {id:'market',name:'Lanmadaw Market',position:[-46,0,10.2],kind:'npc',prompt:'Enter Market',color:'#d75b61',description:'The original compact neighbourhood market.'},
 {id:'viewpoint',name:'Secret Garden View',position:[-44,0,22],kind:'discover',prompt:'Examine',color:'#6e9bd1',description:'A quiet raised view framed by tamarind trees.'},
 {id:'bus',name:'Yangon Road Ticket Station',position:[-76,0,-11.8],kind:'travel',prompt:'Enter Bus Station',color:'#5c75a8',description:'Express coaches depart for the next chapter.'},
 {id:'sule',name:'Sule City Anchor',position:[-8,0,-5],kind:'attraction',prompt:'Visit Sule Area',color:'#e8b938',description:'A stylized navigation landmark, not an exact reproduction.'},
 {id:'heritage_row',name:'Downtown Heritage Row',position:[-27,0,-18],kind:'discover',prompt:'Explore Architecture',color:'#d18762',description:'Older urban frontage and shaded pavements.'},
 {id:'book_arcade',name:'Book Arcade',position:[-29,0,17],kind:'npc',prompt:'Browse Books',color:'#61846f',description:'A small arcade of books and conversation.'},
 {id:'bogyoke_market',name:'Bogyoke Market Arcade',position:[34,0,-7],kind:'npc',prompt:'Enter Market Arcade',color:'#bd4d45',description:'A stylized larger covered market destination.'},
 {id:'street_food',name:'19th Street Food Lane',position:[52,0,10],kind:'food',prompt:'Explore Food Lane',color:'#e27a42',description:'An evening-oriented street-food lane inspired by central Yangon.'},
 {id:'lantern_alley',name:'Lantern Alley',position:[57,0,-20],kind:'discover',prompt:'Look Closer',color:'#9d5fc4',description:'A tucked-away lane behind the market blocks.'},
 {id:'shwedagon',name:'Shwedagon Garden Approach',position:[-10,0,-62],kind:'attraction',prompt:'Visit Garden Approach',color:'#e8b938',description:'A respectful, stylized viewpoint inspired by Yangon’s landmark skyline.'},
 {id:'shwedagon_viewpoint',name:'Shwedagon Viewpoint',position:[4,0,-75],kind:'discover',prompt:'Observe Skyline',color:'#e6c25a',description:'A configured photography point away from the sacred structure.'},
 {id:'south_gate_gardens',name:'South Garden Walk',position:[-27,0,-76],kind:'discover',prompt:'Walk in Garden',color:'#62905a',description:'A calm planted approach.'},
 {id:'kandawgyi_walk',name:'Kandawgyi Lake Walk',position:[38,0,-58],kind:'discover',prompt:'Walk by Lake',color:'#4d9ca5',description:'A compressed park-and-lake setting.'},
 {id:'lake_viewpoint',name:'Lake Sunset Deck',position:[58,0,-72],kind:'discover',prompt:'Visit Viewpoint',color:'#e99a5b',description:'An open western-facing photography deck.'},
 {id:'garden_bench',name:'Quiet Garden Bench',position:[28,0,-78],kind:'npc',prompt:'Meet Park Visitor',color:'#6d9b62',description:'A shaded place to pause.'},
 {id:'strand_frontage',name:'Strand Frontage',position:[-5,0,48],kind:'discover',prompt:'Explore Strand',color:'#c38a65',description:'Older urban frontage along the river road.'},
 {id:'pansodan_jetty',name:'Pansodan Jetty View',position:[23,0,65],kind:'travel',prompt:'Visit Jetty',color:'#548b9b',description:'A future ferry connection; boats are not playable yet.'},
 {id:'river_view',name:'Yangon River Frame',position:[48,0,58],kind:'discover',prompt:'View River',color:'#4c91a5',description:'A broad configured river viewpoint.'}
];
export const NPCS={hotel:{name:'Ko Min',role:'Hotel host',lines:['Mingalaba! The city is best learned one street at a time.','Try breakfast at the green tea shop, then follow the gold skyline.']},market:{name:'May',role:'Market seller',lines:['These lanes wake early. Every stall has a story.','There is a quiet viewpoint north of here—look for the blue lantern.']},tea_shop:{name:'Daw Nwe',role:'Tea shop owner',lines:['Sit, breathe, and taste Yangon. Mohinga is a fine beginning.']},shwedagon:{name:'Thiri',role:'Local guide',lines:['Welcome to our stylized pagoda garden. Take only memories—and a photograph.']},bus:{name:'U Htun',role:'Ticket seller',lines:['Document enough of Yangon and the road to Bagan opens.']}} as const;
export const QUESTS=[{id:'first_taste',name:'A Yangon Breakfast',text:'Try any local food.'},{id:'golden_frame',name:'Frame the Gold',text:'Photograph the pagoda gardens.'},{id:'city_threads',name:'City Threads',text:'Discover the market and hidden viewpoint.'}] as const;
export const SLEEP_OPTIONS=[{hours:2,recovery:25},{hours:4,recovery:50},{hours:6,recovery:75},{hours:8,recovery:100}];
export const BUS_ROUTE={id:'yangon_bagan_bus',name:'Express Bus',origin:'YANGON',destination:'BAGAN',price:9000,gameHours:11,realMinutes:60};
