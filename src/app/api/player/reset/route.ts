import { NextRequest, NextResponse } from 'next/server';
import { identityForRequest, publicIdentity } from '@/lib/auth';
import { resetJourney } from '@/lib/server-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const identity = await identityForRequest(request);
  if (!identity) return NextResponse.json({ error: 'Journey session required' }, { status: 401 });
  try {
    const player = await resetJourney(identity.playerId);
    return NextResponse.json({ player, identity: publicIdentity(identity), serverNow: new Date().toISOString() });
  } catch (error) {
    console.error('Journey reset failed', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({ error: 'Journey reset failed' }, { status: 500 });
  }
}
