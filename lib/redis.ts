import { Redis } from "@upstash/redis";

let redisSingleton: Redis | null = null;

export function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  if (!redisSingleton) {
    redisSingleton = new Redis({ url, token });
  }
  return redisSingleton;
}

/**
 * Upstash `get` may return a parsed object or a JSON string depending on how
 * the value was stored. Never `JSON.parse` blindly.
 */
export function parseRedisJson<T>(cached: unknown): T | null {
  if (cached == null) return null;
  if (typeof cached === "object") return cached as T;
  if (typeof cached === "string") {
    try {
      return JSON.parse(cached) as T;
    } catch {
      return null;
    }
  }
  return null;
}
