export const AVATAR_SLOTS = ['BODY', 'HAIR', 'TOP', 'BOTTOM', 'SHOES', 'BAG', 'HAT', 'ACCESSORY'] as const;
export type AvatarSlot = typeof AVATAR_SLOTS[number];
export type AvatarItem = { id:string; name:string; slot:AvatarSlot; color?:string; accent?:string; asset?:string; unlockType:'STARTER'|'MARKET'; price:number; defaultOwned:boolean };
export const APPEARANCE_PRESETS = [
  { id:'body_warm', name:'Warm', skin:'#a96f50' }, { id:'body_golden', name:'Golden', skin:'#c58b62' }, { id:'body_deep', name:'Deep', skin:'#70452f' },
] as const;
export const AVATAR_ITEMS:AvatarItem[] = [
 ...APPEARANCE_PRESETS.map(p=>({id:p.id,name:`${p.name} appearance`,slot:'BODY' as const,color:p.skin,unlockType:'STARTER' as const,price:0,defaultOwned:true})),
 {id:'hair_short_black',name:'Short',slot:'HAIR',color:'#202322',unlockType:'STARTER',price:0,defaultOwned:true},{id:'hair_medium_brown',name:'Medium',slot:'HAIR',color:'#49352c',unlockType:'STARTER',price:0,defaultOwned:true},{id:'hair_tied_black',name:'Tied Back',slot:'HAIR',color:'#191b1b',unlockType:'STARTER',price:0,defaultOwned:true},{id:'hair_cropped_brown',name:'Cropped',slot:'HAIR',color:'#3b2a23',unlockType:'STARTER',price:0,defaultOwned:true},
 {id:'traveler_tshirt_blue',name:'Traveler T-Shirt',slot:'TOP',color:'#39778a',accent:'#f0c86a',unlockType:'STARTER',price:0,defaultOwned:true},{id:'casual_shirt_white',name:'Casual Shirt',slot:'TOP',color:'#e4dfd1',accent:'#496b68',unlockType:'STARTER',price:0,defaultOwned:true},{id:'light_jacket_rust',name:'Light Jacket',slot:'TOP',color:'#a7503f',accent:'#e4b25c',unlockType:'STARTER',price:0,defaultOwned:true},{id:'yangon_explorer_tee',name:'Yangon Explorer T-Shirt',slot:'TOP',color:'#28584e',accent:'#f0c75d',unlockType:'MARKET',price:3000,defaultOwned:false},
 {id:'travel_pants_dark',name:'Travel Pants',slot:'BOTTOM',color:'#293e45',unlockType:'STARTER',price:0,defaultOwned:true},{id:'jeans_indigo',name:'Jeans',slot:'BOTTOM',color:'#365474',unlockType:'STARTER',price:0,defaultOwned:true},{id:'shorts_olive',name:'Travel Shorts',slot:'BOTTOM',color:'#64704d',unlockType:'STARTER',price:0,defaultOwned:true},
 {id:'sneakers_white',name:'Sneakers',slot:'SHOES',color:'#e6e3d9',accent:'#4b6d69',unlockType:'STARTER',price:0,defaultOwned:true},{id:'walking_shoes_brown',name:'Walking Shoes',slot:'SHOES',color:'#654a37',accent:'#c69a57',unlockType:'STARTER',price:0,defaultOwned:true},
 {id:'backpack_small',name:'Small Traveler Backpack',slot:'BAG',color:'#8a5037',accent:'#d3a457',unlockType:'STARTER',price:0,defaultOwned:true},{id:'traveler_cap',name:'Simple Traveler Cap',slot:'HAT',color:'#c9813e',accent:'#f1d28b',unlockType:'MARKET',price:2000,defaultOwned:false},
];
export const DEFAULT_AVATAR_LOADOUT:Record<AvatarSlot,string|null>={BODY:'body_golden',HAIR:'hair_short_black',TOP:'traveler_tshirt_blue',BOTTOM:'travel_pants_dark',SHOES:'sneakers_white',BAG:'backpack_small',HAT:null,ACCESSORY:null};
export const DEFAULT_AVATAR_INVENTORY=AVATAR_ITEMS.filter(x=>x.defaultOwned).map(x=>x.id);
/** Set these paths only to locally licensed, humanoid-rig-compatible GLB assets. */
export const AVATAR_ASSETS={baseModel:null as string|null,animations:{IDLE:'Idle',WALK:'Walk',JOG:'Run',SLEEP:'Sleep'},equipment:Object.fromEntries(AVATAR_SLOTS.map(s=>[s,{}])) as Record<AvatarSlot,Record<string,string>>};
export const avatarItem=(id:string|null|undefined)=>AVATAR_ITEMS.find(x=>x.id===id);
export function validAvatarLoadout(loadout?:Partial<Record<AvatarSlot,string|null>>){return Object.fromEntries(AVATAR_SLOTS.map(slot=>{const candidate=loadout?.[slot];return[slot,candidate&&avatarItem(candidate)?.slot===slot?candidate:DEFAULT_AVATAR_LOADOUT[slot]]})) as Record<AvatarSlot,string|null>}
