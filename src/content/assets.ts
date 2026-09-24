import type { Vec3 } from './game';

export type AssetDefinition = {
  path: string;
  scale: number;
  rotation?: Vec3;
  collider: 'hull' | 'cuboid' | 'none';
};

/**
 * Single replacement point for future production art. The files deliberately do
 * not ship in the procedural alpha: scene modules render their fallback until an
 * asset is explicitly enabled after import and optimisation.
 */
export const ASSETS = {
  player: { path: '/assets/characters/player_character.glb', scale: 1, collider: 'none' },
  teaShop: { path: '/assets/buildings/yangon_tea_shop.glb', scale: 1, collider: 'cuboid' },
  marketStall: { path: '/assets/props/yangon_market_stall.glb', scale: 1, collider: 'cuboid' },
  heroPagoda: { path: '/assets/landmarks/shwedagon_hero.glb', scale: 1, collider: 'hull' },
  bus: { path: '/assets/vehicles/yangon_bus.glb', scale: 1, collider: 'cuboid' },
} satisfies Record<string, AssetDefinition>;

export const AUDIO = {
  city: '/assets/audio/ambient-city.ogg',
  market: '/assets/audio/market.ogg',
  teaShop: '/assets/audio/tea-shop.ogg',
  landmark: '/assets/audio/landmark.ogg',
  evening: '/assets/audio/evening.ogg',
  footsteps: '/assets/audio/footsteps.ogg',
  ui: '/assets/audio/ui.ogg',
  discovery: '/assets/audio/discovery.ogg',
  purchase: '/assets/audio/purchase.ogg',
  shutter: '/assets/audio/shutter.ogg',
} as const;

export const PALETTE = {
  road: '#3e4548', roadLine: '#e7d59b', sidewalk: '#b8ae98', plaster: '#d89a73',
  cream: '#f1d8ab', teal: '#477b74', green: '#477555', darkGreen: '#254c3c',
  gold: '#e8b83f', deepGold: '#aa7520', roof: '#8f4539', wood: '#684631',
  night: '#15213b', lamp: '#ffd986', white: '#fff6dc', marketRed: '#b94e43',
} as const;
