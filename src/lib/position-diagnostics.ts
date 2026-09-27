export type PositionTuple = [number, number, number];
export type PositionWriteSource = 'INITIAL_SPAWN'|'PHYSICS_MOVEMENT'|'AUTOSAVE_REQUEST'|'RESET_POSITION'|'FALL_RECOVERY'|'DEV_TELEPORT'|'LOCATION_EXIT';

let lastMovementLog = 0;
export function debugPositionWrite(source: PositionWriteSource, from: PositionTuple, to: PositionTuple) {
  if (process.env.NODE_ENV === 'production') return;
  const now = typeof performance === 'undefined' ? Date.now() : performance.now();
  if (source === 'PHYSICS_MOVEMENT' && now - lastMovementLog < 2000) return;
  if (source === 'PHYSICS_MOVEMENT') lastMovementLog = now;
  console.debug('[PlayerPosition]', { source, from: [...from], to: [...to] });
}
