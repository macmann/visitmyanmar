import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../src/lib/password';

describe('password hashing', () => {
  it('uses a unique salt and verifies only the correct password', async () => {
    const first = await hashPassword('a sufficiently long password');
    const second = await hashPassword('a sufficiently long password');
    expect(first).not.toBe(second);
    expect(first).not.toContain('a sufficiently long password');
    await expect(verifyPassword('a sufficiently long password', first)).resolves.toBe(true);
    await expect(verifyPassword('incorrect password', first)).resolves.toBe(false);
  });
  it('rejects malformed stored hashes', async () => {
    await expect(verifyPassword('anything', 'not-a-hash')).resolves.toBe(false);
  });
});
