import { describe, expect, it } from 'vitest';
import { SPOTS } from '@/content/game';
import { interactionTargetAt } from '@/lib/interactions';

describe('central interaction targeting', () => {
  it.each(SPOTS.map(spot => [spot.id, spot.position] as const))('resolves %s at its world position', (id, position) => {
    const target = interactionTargetAt(position);
    expect(target?.id).toBe(id);
    expect(target?.label).toBe(SPOTS.find(spot => spot.id === id)?.name);
    expect(target?.distance).toBe(0);
  });

  it.each(['hotel', 'tea_shop', 'market', 'shwedagon', 'bus'])('opens the %s location', id => {
    const spot = SPOTS.find(candidate => candidate.id === id)!;
    expect(interactionTargetAt(spot.position)?.action).toBe('OPEN_LOCATION');
  });

  it('dispatches non-location discoveries as visits', () => {
    const viewpoint = SPOTS.find(spot => spot.id === 'viewpoint')!;
    expect(interactionTargetAt(viewpoint.position)?.action).toBe('VISIT');
  });

  it('returns no target outside interaction range', () => {
    expect(interactionTargetAt([0, 0, 0])).toBeNull();
  });
});
