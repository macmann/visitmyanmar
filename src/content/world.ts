import type { Vec3 } from '@/lib/types';

export type SafeSpawnId = 'YANGON_DEFAULT' | 'HOTEL' | 'TEA_HOUSE' | 'MARKET' | 'DOWNTOWN' | 'SULE' | 'BOGYOKE' | 'LANDMARK' | 'KANDAWGYI' | 'WATERFRONT' | 'BUS_STATION';
export type SafeSpawn = { id: SafeSpawnId; destination: 'YANGON'; position: Vec3; facing: number; camera?: { yaw: number; pitch: number; distance: number } };

// The rendered Yangon ground is 70 x 70. Keep the collision perimeter just
// inside its edge so neither the player nor their camera can reach unloaded space.
export const WORLD_BOUNDS = { minX: -90, maxX: 74, minZ: -94, maxZ: 84, killY: -8, wallHeight: 6, wallThickness: .6 } as const;

export const SAFE_SPAWNS: Record<SafeSpawnId, SafeSpawn> = {
  YANGON_DEFAULT: { id: 'YANGON_DEFAULT', destination: 'YANGON', position: [-68, 1.1, 5], facing: 0, camera: { yaw: -.6, pitch: .38, distance: 9 } },
  HOTEL: { id: 'HOTEL', destination: 'YANGON', position: [-73, 1.1, 20], facing: Math.PI },
  TEA_HOUSE: { id: 'TEA_HOUSE', destination: 'YANGON', position: [-58, 1.1, 7], facing: Math.PI },
  MARKET: { id: 'MARKET', destination: 'YANGON', position: [-46, 1.1, 10], facing: 0 },
  DOWNTOWN: { id: 'DOWNTOWN', destination: 'YANGON', position: [-18, 1.1, 1], facing: 0 },
  SULE: { id: 'SULE', destination: 'YANGON', position: [-8, 1.1, -5], facing: 0 },
  BOGYOKE: { id: 'BOGYOKE', destination: 'YANGON', position: [34, 1.1, -5], facing: 0 },
  LANDMARK: { id: 'LANDMARK', destination: 'YANGON', position: [-10, 1.1, -62], facing: Math.PI },
  KANDAWGYI: { id: 'KANDAWGYI', destination: 'YANGON', position: [44, 1.1, -64], facing: 0 },
  WATERFRONT: { id: 'WATERFRONT', destination: 'YANGON', position: [11, 1.1, 56], facing: Math.PI },
  BUS_STATION: { id: 'BUS_STATION', destination: 'YANGON', position: [-76, 1.1, -13], facing: Math.PI },
};

export const DEFAULT_SPAWN = SAFE_SPAWNS.YANGON_DEFAULT;
export const isSafeWorldPosition = ([x, y, z]: Vec3) => Number.isFinite(x + y + z) && y >= -.5 && y < 12 && x > WORLD_BOUNDS.minX + 1 && x < WORLD_BOUNDS.maxX - 1 && z > WORLD_BOUNDS.minZ + 1 && z < WORLD_BOUNDS.maxZ - 1;
export const safeSpawn = (id?: string | null) => id && id in SAFE_SPAWNS ? SAFE_SPAWNS[id as SafeSpawnId] : DEFAULT_SPAWN;

export function checkpointNear([x, , z]: Vec3): SafeSpawnId | null {
  let nearest: SafeSpawnId | null = null, distance = 5;
  for (const spawn of Object.values(SAFE_SPAWNS)) { const d = Math.hypot(x - spawn.position[0], z - spawn.position[2]); if (d < distance) { distance = d; nearest = spawn.id; } }
  return nearest;
}
