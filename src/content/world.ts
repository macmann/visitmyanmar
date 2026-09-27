import type { Vec3 } from '@/lib/types';

export type SafeSpawnId = 'YANGON_DEFAULT' | 'HOTEL' | 'TEA_HOUSE' | 'MARKET' | 'LANDMARK' | 'BUS_STATION';
export type SafeSpawn = { id: SafeSpawnId; destination: 'YANGON'; position: Vec3; facing: number; camera?: { yaw: number; pitch: number; distance: number } };

// The rendered Yangon ground is 70 x 70. Keep the collision perimeter just
// inside its edge so neither the player nor their camera can reach unloaded space.
export const WORLD_BOUNDS = { minX: -34, maxX: 34, minZ: -34, maxZ: 34, killY: -8, wallHeight: 6, wallThickness: .6 } as const;

export const SAFE_SPAWNS: Record<SafeSpawnId, SafeSpawn> = {
  YANGON_DEFAULT: { id: 'YANGON_DEFAULT', destination: 'YANGON', position: [-13, 1.1, -9], facing: 0, camera: { yaw: -.6, pitch: .38, distance: 9 } },
  HOTEL: { id: 'HOTEL', destination: 'YANGON', position: [-18, 1.1, 11], facing: Math.PI, camera: { yaw: -.4, pitch: .38, distance: 8 } },
  TEA_HOUSE: { id: 'TEA_HOUSE', destination: 'YANGON', position: [-7, 1.1, 3.5], facing: Math.PI, camera: { yaw: 0, pitch: .4, distance: 8 } },
  MARKET: { id: 'MARKET', destination: 'YANGON', position: [13, 1.1, 9], facing: 0 },
  LANDMARK: { id: 'LANDMARK', destination: 'YANGON', position: [19, 1.1, -7.5], facing: Math.PI },
  BUS_STATION: { id: 'BUS_STATION', destination: 'YANGON', position: [-20, 1.1, -8], facing: Math.PI },
};

export const DEFAULT_SPAWN = SAFE_SPAWNS.YANGON_DEFAULT;
export const isSafeWorldPosition = ([x, y, z]: Vec3) => Number.isFinite(x + y + z) && y >= -.5 && y < 8 && x > WORLD_BOUNDS.minX + 1 && x < WORLD_BOUNDS.maxX - 1 && z > WORLD_BOUNDS.minZ + 1 && z < WORLD_BOUNDS.maxZ - 1;
export const safeSpawn = (id?: string | null) => id && id in SAFE_SPAWNS ? SAFE_SPAWNS[id as SafeSpawnId] : DEFAULT_SPAWN;

export function checkpointNear([x, , z]: Vec3): SafeSpawnId | null {
  let nearest: SafeSpawnId | null = null, distance = 5;
  for (const spawn of Object.values(SAFE_SPAWNS)) { const d = Math.hypot(x - spawn.position[0], z - spawn.position[2]); if (d < distance) { distance = d; nearest = spawn.id; } }
  return nearest;
}
