'use client';
import { useState } from 'react';
import AvatarPreview from './AvatarPreview';
import { AVATAR_ITEMS, AVATAR_SLOTS, avatarItem, type AvatarSlot } from '@/content/avatar';
import type { PlayerSave } from '@/lib/types';
export default function Wardrobe({player,onEquip}:{player:PlayerSave;onEquip:(id:string)=>Promise<void>}){
 const [slot,setSlot]=useState<AvatarSlot>('TOP'),[busy,setBusy]=useState('');const owned=AVATAR_ITEMS.filter(x=>x.slot===slot&&player.avatarInventory.includes(x.id));
 return <div className="wardrobe"><div className="eyebrow">TRAVELER · WARDROBE</div><h2>Your travel look</h2><div className="wardrobe-layout"><AvatarPreview loadout={player.avatarLoadout}/><div><div className="wardrobe-tabs">{AVATAR_SLOTS.filter(x=>x!=='BODY').map(x=><button key={x} className={slot===x?'active':''} onClick={()=>setSlot(x)}>{x}</button>)}</div><div className="wardrobe-items">{owned.length?owned.map(item=><button key={item.id} className={player.avatarLoadout[slot]===item.id?'equipped':''} disabled={busy===item.id||player.avatarLoadout[slot]===item.id} onClick={async()=>{setBusy(item.id);await onEquip(item.id);setBusy('')}}><i style={{background:item.color}}/><span><b>{item.name}</b><small>{player.avatarLoadout[slot]===item.id?'EQUIPPED':'OWNED · EQUIP'}</small></span></button>):<p>No owned items in this category yet. Visit the Yangon market.</p>}</div>{player.avatarLoadout[slot]&&<p className="equipped-note">Currently equipped: <b>{avatarItem(player.avatarLoadout[slot])?.name}</b></p>}</div></div></div>
}
