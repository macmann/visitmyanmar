import { locationById } from '@/content/locations';
import { SPOTS } from '@/content/game';
import type { InteractionKind } from '@/content/game';

export type InteractionAction = 'OPEN_LOCATION' | 'VISIT';

export type InteractionTarget = {
  id: string;
  type: InteractionKind;
  label: string;
  prompt: string;
  distance: number;
  action: InteractionAction;
};

// A little wider than the avatar/building collision margin so standing directly
// in front of a marked entrance always activates it.
export const INTERACTION_DISTANCE = 4.5;

export function interactionTargetAt(position: [number, number, number]): InteractionTarget | null {
  const nearest = SPOTS
    .map(spot => ({ spot, distance: Math.hypot(spot.position[0] - position[0], spot.position[2] - position[2]) }))
    .sort((a, b) => a.distance - b.distance)[0];

  if (!nearest || nearest.distance > INTERACTION_DISTANCE) return null;

  return {
    id: nearest.spot.id,
    type: nearest.spot.kind,
    label: nearest.spot.name,
    prompt: nearest.spot.prompt,
    distance: nearest.distance,
    action: locationById(nearest.spot.id) ? 'OPEN_LOCATION' : 'VISIT',
  };
}
