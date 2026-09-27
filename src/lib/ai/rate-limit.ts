const windows = new Map<string, number[]>();
export function takeAIRequest(key: string, now = Date.now(), limit = 8, windowMs = 60_000) {
  const active = (windows.get(key) ?? []).filter(at => now - at < windowMs);
  if (active.length >= limit) return false;
  active.push(now); windows.set(key, active); return true;
}
export function clearAIRateLimits() { windows.clear(); }

