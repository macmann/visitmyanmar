'use client';

export type GraphicsQuality = 'LOW' | 'MEDIUM' | 'HIGH';
export type GameSettings = {
  graphics: GraphicsQuality;
  master: number;
  music: number;
  ambience: number;
  sfx: number;
};

export const DEFAULT_SETTINGS: GameSettings = { graphics: 'MEDIUM', master: 80, music: 45, ambience: 70, sfx: 80 };
const KEY = 'explore-myanmar-settings-v2';

export function loadSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }; }
  catch { return DEFAULT_SETTINGS; }
}

export function saveSettings(settings: GameSettings) {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
