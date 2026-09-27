'use client';
import { useCallback, useEffect, useRef } from 'react';
import World from './World';
import LocationScene from './LocationScene';
import GameErrorBoundary from './GameErrorBoundary';
import Overlay from '@/components/ui/Overlay';
import InputController from './InputController';
import { api, useGame } from '@/store/game';
import QuestValidation from './QuestValidation';
import TravelerCreator from '@/components/avatar/TravelerCreator';
export default function Game() {
  const { player, error, locationId, setPlayer, mergePersistentPlayer, setError } = useGame(), last = useRef(0);
  const load = useCallback(() => api().then(p => useGame.getState().player ? mergePersistentPlayer(p) : setPlayer(p)).catch(e => setError(e.message)), [mergePersistentPlayer, setPlayer, setError]);
  useEffect(() => { void load(); const poll = setInterval(load, 15000); return () => clearInterval(poll); }, [load]);
  useEffect(() => { if (!player || player.majorState !== 'EXPLORING') return; const save = setInterval(() => { const current=useGame.getState().player,now=Date.now(); if (current&&now-last.current>9000) { last.current=now; const position:[number,number,number]=[...current.position]; void api('checkpoint',{position}).then(p=>useGame.getState().mergePersistentPlayer(p)).catch(()=>{}); } },10000); return()=>clearInterval(save); }, [player?.majorState]);
  if (!player) return <main className="splash"><div><div className="lotus">✦</div><h1>Explore Myanmar</h1><div className="spinner"/><p>{error ? 'Yangon could not be prepared.' : 'Preparing Yangon…'}</p>{error && <button onClick={load}>Try again</button>}<small>Your journey is saved automatically.</small></div></main>;
  if(!player.avatarCreated)return <TravelerCreator initial={player.avatarLoadout} onStart={async loadout=>setPlayer(await api('avatarStart',{loadout}))}/>;
  return <main className="game"><QuestValidation/><GameErrorBoundary><InputController/>{locationId?<LocationScene id={locationId}/>:<World/>}<Overlay/></GameErrorBoundary></main>;
}
