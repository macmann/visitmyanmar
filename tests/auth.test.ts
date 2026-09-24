import { describe, expect, it } from 'vitest';
import { publicIdentity } from '../src/lib/auth';

describe('session identity projection', () => {
  it('never exposes the server-side player id', () => {
    const identity = publicIdentity({ playerId: 'internal-id', type: 'GUEST', displayName: 'Guest Traveler', journeyStartedAt: '2026-01-01T00:00:00.000Z' });
    expect(identity).toEqual({ type: 'GUEST', displayName: 'Guest Traveler', journeyStartedAt: '2026-01-01T00:00:00.000Z' });
    expect(identity).not.toHaveProperty('playerId');
  });
});
