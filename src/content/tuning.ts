/** Shared feel settings for the Yangon exploration controller. */
export const MOVEMENT = {
  walkSpeed: 3.7,
  jogSpeed: 6.2,
  acceleration: 10,
  deceleration: 15,
  rotationSpeed: 11,
} as const;

export const CAMERA = {
  minPitch: 0.2,
  maxPitch: 1.02,
  minDistance: 4.6,
  maxDistance: 12,
  shoulderHeight: 1.42,
  collisionPadding: 0.55,
  collisionRecovery: 4.5,
} as const;
