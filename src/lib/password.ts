import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(nodeScrypt);
const KEY_LENGTH = 64;

/** Versioned Node scrypt encoding; passwords are never reversibly stored. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH) as Buffer;
  return `scrypt$v1$${salt.toString('base64url')}$${derived.toString('base64url')}`;
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [algorithm, version, saltText, hashText] = encoded.split('$');
  if (algorithm !== 'scrypt' || version !== 'v1' || !saltText || !hashText) return false;
  try {
    const expected = Buffer.from(hashText, 'base64url');
    const actual = await scrypt(password, Buffer.from(saltText, 'base64url'), expected.length) as Buffer;
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch { return false; }
}
