'use client';
import { useCallback, useEffect, useRef } from 'react';
import World from './World';
import LocationScene from './LocationScene';
import GameErrorBoundary from './GameErrorBoundary';
import Overlay from '@/components/ui/Overlay';
import { api, useGame } from '@/store/game';
export default function Game() {
  const { player, error, locationId, setPlayer, setError } = useGame(), last = useRef(0);
  const load = useCallback(() => api().then(setPlayer).catch(e => setError(e.message)), [setPlayer, setError]);
  useEffect(() => { void load(); const poll = setInterval(load, 15000); return () => clearInterval(poll); }, [load]);
  useEffect(() => { if (!player || player.majorState !== 'EXPLORING') return; const save = setInterval(() => { const now = Date.now(); if (now - last.current > 9000) { last.current = now; void api('checkpoint', { position: player.position }).then(setPlayer).catch(() => {}); } }, 10000); return () => clearInterval(save); }, [player, setPlayer]);
  if (!player) return <main className="splash"><div><div className="lotus">✦</div><h1>Explore Myanmar</h1><div className="spinner"/><p>{error ? 'Yangon could not be prepared.' : 'Preparing Yangon…'}</p>{error && <button onClick={load}>Try again</button>}<small>Your journey is saved automatically.</small></div></main>;
  return <main className="game"><GameErrorBoundary>{locationId?<LocationScene id={locationId}/>:<World/>}<Overlay/></GameErrorBoundary></main>;
}
