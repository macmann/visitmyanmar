'use client';

import { useEffect, useMemo, useState } from 'react';
import type { PersistentAction } from '@/lib/types';

const clock = (milliseconds: number) => {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

type Props = {
  action: PersistentAction;
  energy: number;
  onVerify: () => Promise<unknown> | void;
  onDevComplete: () => Promise<unknown> | void;
};

/** Full-screen, non-interactive world replacement while the server owns sleep. */
export default function SleepExperience({ action, energy, onVerify, onDevComplete }: Props) {
  const [now, setNow] = useState(Date.now());
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const completesAt = useMemo(() => new Date(action.completesAt).getTime(), [action.completesAt]);
  const startedAt = useMemo(() => new Date(action.startedAt).getTime(), [action.startedAt]);
  const remaining = completesAt - now;
  const progress = Math.max(0, Math.min(100, ((now - startedAt) / Math.max(1, completesAt - startedAt)) * 100));

  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 250); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    if (remaining > 0 || checking) return;
    setChecking(true);
    Promise.resolve(onVerify()).catch(() => setMessage('We could not confirm morning yet. Your rest is safe on the server.')).finally(() => setChecking(false));
  }, [remaining, checking, onVerify]);

  const verify = async () => {
    setChecking(true); setMessage(null);
    try { await onVerify(); }
    catch { setMessage('Connection lost. Your sleep remains saved — retry when ready.'); }
    finally { setChecking(false); }
  };

  return <main className="sleep-experience" aria-live="polite">
    <div className="sleep-room" aria-hidden="true">
      <div className="sleep-window"><i/><i/><span>✦</span></div><div className="curtain left"/><div className="curtain right"/>
      <div className="lamp"><i/><b/></div><div className="bedside"/><div className="luggage"/>
      <div className="bed"><div className="pillow"/><div className="sleeper"><i/><b/></div><div className="blanket"/></div>
    </div>
    <section className="sleep-copy">
      <div className="sleep-kicker">NIGHT IN YANGON</div>
      <h1>Resting<span className="sleep-dots">…</span></h1>
      <div className="sleep-countdown">{clock(remaining)}</div>
      <p>until morning · wake up around 8:00 AM</p>
      <div className="sleep-progress"><i style={{ width: `${progress}%` }}/></div>
      <strong>Energy after rest: {Math.min(100, Math.round(energy + action.energyRecovery))} / 100</strong>
      <small>Sleep continues on the server if you close this window.</small>
      {message && <div className="sleep-error" role="alert">{message}<button onClick={() => void verify()}>Retry</button></div>}
      <button className="verify-rest" disabled={checking} onClick={() => void verify()}>{checking ? 'Checking with server…' : 'Verify rest status'}</button>
      {process.env.NODE_ENV !== 'production' && <button className="dev-rest" onClick={() => void onDevComplete()}>DEV · Complete Sleep</button>}
    </section>
  </main>;
}

