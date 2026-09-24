import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { clearSessionCookie, createGuest, identityForRequest, login, logout, publicIdentity, register, setSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';
const email = z.string().trim().toLowerCase().email().max(254);
const displayName = z.string().trim().min(2).max(32).regex(/^[\p{L}\p{N}][\p{L}\p{N} .'-]*$/u);
const registerSchema = z.object({ intent: z.literal('register'), displayName, email, password: z.string().min(10).max(128), confirmPassword: z.string() }).refine(x => x.password === x.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match.' });
const loginSchema = z.object({ intent: z.literal('login'), email, password: z.string().min(1).max(128) });
const actionSchema = z.union([z.object({ intent: z.literal('guest') }), registerSchema, loginSchema, z.object({ intent: z.literal('logout') })]);

export async function GET(request: NextRequest) { const identity = await identityForRequest(request); return NextResponse.json({ identity: identity ? publicIdentity(identity) : null }); }

export async function POST(request: NextRequest) {
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const mismatch = parsed.error.issues.find(i => i.path.includes('confirmPassword'));
    const password = parsed.error.issues.find(i => i.path.includes('password'));
    return NextResponse.json({ error: mismatch?.message ?? (password ? 'Password must be at least 10 characters.' : 'Please check the information you entered.') }, { status: 400 });
  }
  try {
    if (parsed.data.intent === 'logout') { await logout(request); const response = NextResponse.json({ ok: true }); clearSessionCookie(response); return response; }
    if (parsed.data.intent === 'guest') {
      const current = await identityForRequest(request); if (current) return NextResponse.json({ identity: publicIdentity(current) });
      const result = await createGuest(); const response = NextResponse.json({ identity: publicIdentity(result.identity) }, { status: 201 }); setSessionCookie(response, result.token); return response;
    }
    if (parsed.data.intent === 'login') {
      const result = await login(parsed.data.email, parsed.data.password);
      if (!result) return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
      const response = NextResponse.json({ identity: publicIdentity(result.identity) }); setSessionCookie(response, result.token); return response;
    }
    const current = await identityForRequest(request);
    const result = await register({ displayName: parsed.data.displayName, email: parsed.data.email, password: parsed.data.password }, current?.type === 'GUEST' ? current.playerId : undefined);
    const response = NextResponse.json({ identity: publicIdentity(result.identity) }, { status: 201 }); setSessionCookie(response, result.token); return response;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    console.error('Authentication operation failed', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({ error: 'We could not complete that request. Please try again.' }, { status: 500 });
  }
}
