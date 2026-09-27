import { describe, expect, it } from 'vitest';
import { newPlayer } from '@/lib/rules';
import { locationIdForPlayer, mergePersistentSnapshot } from '@/store/game';

describe('live player position authority',()=>{
 it('never replaces the live physics position with an autosave response',()=>{
  const live=newPlayer('live'),stale={...live,position:[-13,1.1,-9] as [number,number,number],mmk:9000};
  live.position=[22,1.1,18];
  const merged=mergePersistentSnapshot(live,stale);
  expect(merged.position).toEqual([22,1.1,18]);
  expect(merged.mmk).toBe(9000);
 });
 it('is insensitive to out-of-order position acknowledgements',()=>{
  const live=newPlayer('live');live.position=[30,1.1,30];
  const newer={...live,position:[20,1.1,20] as [number,number,number]};
  const older={...live,position:[5,1.1,5] as [number,number,number]};
  expect(mergePersistentSnapshot(mergePersistentSnapshot(live,newer),older).position).toEqual([30,1.1,30]);
 });
 it('derives the rendered location from authoritative player context',()=>{
  const player=newPlayer('location');
  expect(locationIdForPlayer(player)).toBeNull();
  player.locationContext='HOTEL';
  player.currentLocationId='hotel';
  expect(locationIdForPlayer(player)).toBe('hotel');
  player.locationContext='WORLD';
  expect(locationIdForPlayer(player)).toBeNull();
 });
});
