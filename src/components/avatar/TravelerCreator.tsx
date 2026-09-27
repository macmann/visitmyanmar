'use client';
import { useState } from 'react';
import AvatarPreview from './AvatarPreview';
import { AVATAR_ITEMS, avatarItem } from '@/content/avatar';
import type { AvatarLoadout } from '@/lib/types';

const FIELDS=['BODY','HAIR','TOP','BOTTOM','SHOES','BAG'] as const;
export default function TravelerCreator({initial,onStart}:{initial:AvatarLoadout;onStart:(loadout:AvatarLoadout)=>Promise<void>}){
 const [loadout,setLoadout]=useState(initial),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const cycle=(slot:typeof FIELDS[number],direction:number)=>{const choices=AVATAR_ITEMS.filter(x=>x.slot===slot&&x.defaultOwned);const index=choices.findIndex(x=>x.id===loadout[slot]);const item=choices[(index+direction+choices.length)%choices.length];setLoadout({...loadout,[slot]:item.id})};
 return <main className="creator"><section><div className="eyebrow">YOUR JOURNEY BEGINS</div><h1>Create your traveler</h1><p>Choose a friendly travel look. You can change it later in the Wardrobe.</p><AvatarPreview loadout={loadout}/></section><section className="creator-options">{FIELDS.map(slot=><div className="avatar-picker" key={slot}><small>{slot==='BODY'?'APPEARANCE':slot}</small><button aria-label={`Previous ${slot}`} onClick={()=>cycle(slot,-1)}>‹</button><b>{avatarItem(loadout[slot])?.name}</b><button aria-label={`Next ${slot}`} onClick={()=>cycle(slot,1)}>›</button></div>)}{error&&<p className="form-error">{error}</p>}<button className="primary" disabled={busy} onClick={async()=>{setBusy(true);try{await onStart(loadout)}catch(e){setError(e instanceof Error?e.message:'Could not begin journey');setBusy(false)}}}>{busy?'PREPARING…':'START JOURNEY'}</button></section></main>
}
