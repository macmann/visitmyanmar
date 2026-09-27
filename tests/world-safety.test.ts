import { describe, expect, it } from 'vitest';
import { checkpointNear, DEFAULT_SPAWN, isSafeWorldPosition, SAFE_SPAWNS, WORLD_BOUNDS } from '../src/content/world';
import { newPlayer } from '../src/lib/rules';

describe('player recovery and Yangon boundaries', () => {
  it('defines every Yangon recovery checkpoint centrally above valid ground', () => {
    expect(Object.keys(SAFE_SPAWNS)).toEqual(['YANGON_DEFAULT', 'HOTEL', 'TEA_HOUSE', 'MARKET', 'LANDMARK', 'BUS_STATION']);
    for (const spawn of Object.values(SAFE_SPAWNS)) expect(isSafeWorldPosition(spawn.position)).toBe(true);
  });

  it('rejects falling and perimeter positions as safe saves', () => {
    expect(isSafeWorldPosition([0, WORLD_BOUNDS.killY - 1, 0])).toBe(false);
    expect(isSafeWorldPosition([WORLD_BOUNDS.maxX, 1, 0])).toBe(false);
    expect(isSafeWorldPosition([0, 1, WORLD_BOUNDS.minZ])).toBe(false);
  });

  it('starts a canonical journey at Yangon default with a recoverable checkpoint', () => {
    const player = newPlayer('recovery-test');
    expect(player.position).toEqual(DEFAULT_SPAWN.position);
    expect(player.lastSafePosition).toEqual(DEFAULT_SPAWN.position);
    expect(player.currentCheckpoint).toBe('YANGON_DEFAULT');
  });

  it('recognizes meaningful checkpoint proximity without accepting arbitrary positions', () => {
    expect(checkpointNear(SAFE_SPAWNS.HOTEL.position)).toBe('HOTEL');
    expect(checkpointNear([0, 1, 0])).toBeNull();
  });
});
