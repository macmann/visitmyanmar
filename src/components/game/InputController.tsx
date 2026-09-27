'use client';

import { useEffect } from 'react';
import type { InteractionTarget } from '@/lib/interactions';
import { api, useGame } from '@/store/game';

const debug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') console.log(...args);
};

function transitionToLocation(locationId: string) {
  const state = useGame.getState();
  debug('[Interaction] opening location', locationId);
  state.setTransitioning(true);
  window.setTimeout(() => {
    const current = useGame.getState();
    current.setPanel(null);
    current.setLocation(locationId);
    window.setTimeout(() => useGame.getState().setTransitioning(false), 180);
  }, 260);
}

/** The one dispatcher used by both the physical key and the clickable prompt. */
export function executeInteraction(target: InteractionTarget) {
  debug('[Interaction] target', target);
  debug('[Interaction] dispatch', target.action);
  if (target.action === 'OPEN_LOCATION') {
    transitionToLocation(target.id);
    return;
  }
  void api('interact', { target: target.id }).then(player => {
    useGame.getState().setPlayer(player);
    useGame.getState().setNotice(`NEW DISCOVERY · ${target.label} · Journal updated`);
  }).catch(error => useGame.getState().setError(error instanceof Error ? error.message : 'Network error'));
}

export default function InputController() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const state = useGame.getState();
      if (event.code === 'KeyE') {
        debug('[Interaction] KeyE pressed');
        debug('[Interaction] target', state.activeInteractionTarget);
        if (!state.activeInteractionTarget || state.locationId || state.panel || state.cameraMode || state.transitioning || state.player?.majorState !== 'EXPLORING') return;
        event.preventDefault();
        executeInteraction(state.activeInteractionTarget);
        return;
      }
      if (event.code === 'KeyM' && !state.locationId) state.setPanel(state.panel === 'map' ? null : 'map');
      if (event.code === 'KeyJ') state.setPanel(state.panel === 'journal' ? null : 'journal');
      if (event.code === 'Escape') { state.setPanel(state.panel ? null : 'menu'); state.setCameraMode(false); }
      if (event.code === 'KeyC' && !state.panel && !state.locationId) state.setCameraMode(!state.cameraMode);
    };
    // Capture makes interaction independent of canvas focus and downstream handlers.
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, []);
  return null;
}
