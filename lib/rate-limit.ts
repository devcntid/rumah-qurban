import { getRedis } from "./redis";

const WINDOW_SEC = 60;
const MAX = 30;

export async function rateLimitTracker(
  key: string
): Promise<{ ok: boolean; remaining: number }> {
  const redis = getRedis();
  if (!redis) {
    return { ok: true, remaining: MAX };
  }
  const k = `rl:tracker:${key}`;
  const n = await redis.incr(k);
  if (n === 1) {
    await redis.expire(k, WINDOW_SEC);
  }
  const remaining = Math.max(0, MAX - n);
  return { ok: n <= MAX, remaining };
}
