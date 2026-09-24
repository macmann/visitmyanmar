import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { NextRequest, NextResponse } from 'next/server';
import type { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from './password';
import { newPlayer } from './rules';

export const SESSION_COOKIE = 'explore_myanmar_session';
export const SESSION_DAYS = 30;
export type Identity = { playerId: string; type: 'GUEST' | 'REGISTERED'; displayName: string; journeyStartedAt: string; email?: string };
export type PublicIdentity = Omit<Identity, 'playerId'>;
export function publicIdentity({ playerId: _playerId, ...identity }: Identity): PublicIdentity { return identity; }

let prisma: PrismaClient | undefined;
async function db() { if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required'); if (!prisma) { const { PrismaClient } = await import('@prisma/client'); prisma = new PrismaClient(); } return prisma; }
const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');
const expiry = () => new Date(Date.now() + SESSION_DAYS * 86400000);

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: SESSION_DAYS * 86400 });
}
export function clearSessionCookie(response: NextResponse) { response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 }); }

export async function identityForRequest(request: NextRequest): Promise<Identity | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await (await db()).session.findUnique({ where: { tokenHash: tokenHash(token) }, include: { player: { include: { user: true } } } });
  if (!session || session.expiresAt <= new Date()) { if (session) await (await db()).session.delete({ where: { id: session.id } }).catch(() => undefined); return null; }
  return { playerId: session.playerId, type: session.player.user ? 'REGISTERED' : 'GUEST', displayName: session.player.user?.displayName ?? 'Guest Traveler', journeyStartedAt: session.player.createdAt.toISOString(), email: session.player.user?.email };
}

async function issue(playerId: string) { const token = randomBytes(32).toString('base64url'); await (await db()).session.create({ data: { playerId, tokenHash: tokenHash(token), expiresAt: expiry() } }); return token; }

export async function createGuest(): Promise<{ identity: Identity; token: string }> {
  const id = randomUUID(); const database = await db();
  const player = await database.player.create({ data: { id, save: newPlayer(id) as never } });
  return { identity: { playerId: id, type: 'GUEST', displayName: 'Guest Traveler', journeyStartedAt: player.createdAt.toISOString() }, token: await issue(id) };
}

export type Registration = { displayName: string; email: string; password: string };
export async function register(input: Registration, guestPlayerId?: string): Promise<{ identity: Identity; token: string }> {
  const database = await db(); const passwordHash = await hashPassword(input.password); const now = new Date();
  const result = await database.$transaction(async tx => {
    const user = await tx.user.create({ data: { email: input.email, displayName: input.displayName, passwordHash, lastLoginAt: now } });
    let player;
    if (guestPlayerId) {
      player = await tx.player.update({ where: { id: guestPlayerId, userId: null }, data: { userId: user.id } });
    } else {
      const id = randomUUID(); player = await tx.player.create({ data: { id, userId: user.id, save: newPlayer(id) as never } });
    }
    const token = randomBytes(32).toString('base64url');
    await tx.session.create({ data: { playerId: player.id, tokenHash: tokenHash(token), expiresAt: expiry() } });
    return { user, player, token };
  });
  return { identity: { playerId: result.player.id, type: 'REGISTERED', displayName: result.user.displayName, email: result.user.email, journeyStartedAt: result.player.createdAt.toISOString() }, token: result.token };
}

export async function login(email: string, password: string): Promise<{ identity: Identity; token: string } | null> {
  const database = await db(); const user = await database.user.findUnique({ where: { email }, include: { player: true } });
  if (!user || !user.player || !(await verifyPassword(password, user.passwordHash))) return null;
  await database.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return { identity: { playerId: user.player.id, type: 'REGISTERED', displayName: user.displayName, email: user.email, journeyStartedAt: user.player.createdAt.toISOString() }, token: await issue(user.player.id) };
}

export async function logout(request: NextRequest) { const token = request.cookies.get(SESSION_COOKIE)?.value; if (token) await (await db()).session.deleteMany({ where: { tokenHash: tokenHash(token) } }); }
