import fs from 'node:fs';
import path from 'node:path';
import type { Prisma, PrismaClient } from '@prisma/client';
import type { PlayerSave } from './types';
import { newPlayer, resolveAction } from './rules';

type Mutator = (player: PlayerSave) => PlayerSave;
type JsonDatabase = Record<string, PlayerSave>;
const dataDirectory = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDirectory, 'players.json');
let jsonQueue = Promise.resolve();
let prisma: PrismaClient | undefined;

function useJsonAdapter() {
  return process.env.NODE_ENV !== 'production' && (process.env.STORE_ADAPTER === 'json' || !process.env.DATABASE_URL);
}

async function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required in production');
  if (!prisma) { const { PrismaClient } = await import('@prisma/client'); prisma = new PrismaClient(); }
  return prisma;
}

function readJson(): JsonDatabase { try { return JSON.parse(fs.readFileSync(dataFile, 'utf8')) as JsonDatabase; } catch { return {}; } }
function writeJson(contents: JsonDatabase) { fs.mkdirSync(dataDirectory, { recursive: true }); const temporary = `${dataFile}.${process.pid}.tmp`; fs.writeFileSync(temporary, JSON.stringify(contents, null, 2)); fs.renameSync(temporary, dataFile); }
function serializedJson<T>(operation: () => T): Promise<T> { const result = jsonQueue.then(operation, operation); jsonQueue = result.then(() => undefined, () => undefined); return result; }
function parseSave(value: Prisma.JsonValue): PlayerSave { return value as unknown as PlayerSave; }
async function retrySerializable<T>(operation: () => Promise<T>): Promise<T> { for (let attempt = 0; ; attempt += 1) { try { return await operation(); } catch (error) { if (attempt >= 2 || !(error instanceof Error) || !('code' in error) || error.code !== 'P2034') throw error; } } }

export async function getPlayer(id: string): Promise<PlayerSave> {
  if (useJsonAdapter()) return serializedJson(() => { const records = readJson(); const player = resolveAction(records[id] ?? newPlayer(id)); records[id] = player; writeJson(records); return player; });
  return retrySerializable(async () => (await database()).$transaction(async tx => {
    await tx.player.upsert({ where: { id }, create: { id, save: newPlayer(id) as unknown as Prisma.InputJsonValue }, update: {} });
    await tx.$queryRaw`SELECT id FROM "Player" WHERE id = ${id} FOR UPDATE`;
    const record = await tx.player.findUniqueOrThrow({ where: { id } });
    const stored = parseSave(record.save); const player = resolveAction(stored);
    if (player.updatedAt !== stored.updatedAt) { await tx.player.update({ where: { id }, data: { save: player as unknown as Prisma.InputJsonValue } }); await tx.persistentAction.updateMany({ where: { playerId: id, resolvedAt: null, completesAt: { lte: new Date() } }, data: { resolvedAt: new Date() } }); }
    return player;
  }, { isolationLevel: 'Serializable' }));
}

export async function mutatePlayer(id: string, mutate: Mutator): Promise<PlayerSave> {
  if (useJsonAdapter()) return serializedJson(() => { const records = readJson(); const next = { ...mutate(resolveAction(records[id] ?? newPlayer(id))), updatedAt: new Date().toISOString() }; records[id] = next; writeJson(records); return next; });
  return retrySerializable(async () => (await database()).$transaction(async tx => {
    await tx.player.upsert({ where: { id }, create: { id, save: newPlayer(id) as unknown as Prisma.InputJsonValue }, update: {} });
    await tx.$queryRaw`SELECT id FROM "Player" WHERE id = ${id} FOR UPDATE`;
    const record = await tx.player.findUniqueOrThrow({ where: { id } });
    const before = resolveAction(parseSave(record.save)); const next = { ...mutate(before), updatedAt: new Date().toISOString() };
    await tx.player.update({ where: { id }, data: { save: next as unknown as Prisma.InputJsonValue } });
    if (next.activeAction && next.activeAction.id !== before.activeAction?.id) await tx.persistentAction.create({ data: { id: next.activeAction.id, playerId: id, kind: next.activeAction.kind, startedAt: new Date(next.activeAction.startedAt), completesAt: new Date(next.activeAction.completesAt), payload: next.activeAction as unknown as Prisma.InputJsonValue } });
    if (before.activeAction && !next.activeAction) await tx.persistentAction.updateMany({ where: { id: before.activeAction.id, resolvedAt: null }, data: { resolvedAt: new Date() } });
    return next;
  }, { isolationLevel: 'Serializable' }));
}
