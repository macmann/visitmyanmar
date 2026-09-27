import { describe, expect, it } from 'vitest';
import { LOCAL_TRANSPORT, loadedZonesAt, YANGON_ZONES, zoneAt } from '@/content/yangon';
import { LOCATIONS } from '@/content/locations';
import { AI_NPCS } from '@/content/ai-npcs';
import { DISCOVERY_DEFINITIONS } from '@/content/progression';
import { applyPlayerAction } from '@/lib/player-actions';
import { newPlayer, resolveAction } from '@/lib/rules';
import { isSafeWorldPosition } from '@/content/world';

describe('Yangon expansion', () => {
  it('defines six complete, non-overlapping identities and meaningful locations', () => {
    expect(YANGON_ZONES).toHaveLength(6);
    expect(new Set(YANGON_ZONES.map(z => z.id)).size).toBe(6);
    expect(YANGON_ZONES.every(z => z.locationIds.length >= 3 && z.npcIds.length >= 1 && z.activities.length >= 2)).toBe(true);
    expect(LOCATIONS.length).toBeGreaterThanOrEqual(19);
    expect(YANGON_ZONES.flatMap(z => z.locationIds).every(id => LOCATIONS.some(location => location.id === id))).toBe(true);
  });

  it('streams the current zone and validates every safe transport arrival', () => {
    for (const route of LOCAL_TRANSPORT) {
      expect(isSafeWorldPosition(route.arrival)).toBe(true);
      expect(zoneAt(route.arrival).id).toBe(route.zoneId);
      expect(loadedZonesAt(route.arrival).some(z => z.id === route.zoneId)).toBe(true);
      expect(route.fare).toBeGreaterThan(0);
      expect(route.gameMinutes).toBeGreaterThan(0);
    }
  });

  it('server-authoritatively rejects undiscovered transport and charges once', () => {
    const p = newPlayer('taxi-test');
    expect(() => applyPlayerAction(p,{action:'localTravel',destinationId:'kandawgyi',requestId:'taxi-1'})).toThrow(/Discover/);
    const discovered = {...p, discoveries:[...p.discoveries,'transport:kandawgyi']};
    const moved = applyPlayerAction(discovered,{action:'localTravel',destinationId:'kandawgyi',requestId:'taxi-1'});
    expect(moved.mmk).toBe(p.mmk - 900);
    expect(moved.gameMinutes).toBe(p.gameMinutes + 20);
    expect(moved.position).toEqual(LOCAL_TRANSPORT.find(r => r.zoneId === 'kandawgyi')!.arrival);
    expect(moved.majorState).toBe('EXPLORING');
    expect(applyPlayerAction(moved,{action:'localTravel',destinationId:'kandawgyi',requestId:'taxi-1'})).toEqual(moved);
  });

  it('keeps location knowledge scoped and discovery IDs unique', () => {
    expect(Object.keys(AI_NPCS).length).toBeGreaterThanOrEqual(9);
    expect(AI_NPCS.food_vendor.knowledgeScopes).not.toContain('waterfront');
    expect(AI_NPCS.park_visitor.knowledgeScopes).toContain('kandawgyi');
    expect(new Set(DISCOVERY_DEFINITIONS.map(d => d.id)).size).toBe(DISCOVERY_DEFINITIONS.length);
  });

  it('normalizes an existing save without replacing progression or position', () => {
    const old = newPlayer('old-save');
    old.progression.xp = 321; old.progression.score = 123; old.position = [-18,1.1,1];
    delete old.currentLocationId;
    const migrated = resolveAction(old);
    expect(migrated.position).toEqual([-18,1.1,1]);
    expect(migrated.currentLocationId).toBeNull();
    expect(migrated.progression.awards).toEqual(old.progression.awards);
  });
});
