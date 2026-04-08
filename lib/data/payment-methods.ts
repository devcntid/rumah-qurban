import { pool } from "@/lib/db";
import { getRedis, parseRedisJson } from "@/lib/redis";

export type PaymentMethodRow = {
  code: string;
  name: string;
  category: string;
};

const CACHE_KEY = "cache:payment_methods:v2";
const TTL = 300;

export async function getPaymentMethodsCached(): Promise<PaymentMethodRow[]> {
  const redis = getRedis();
  if (redis) {
    const cached = await redis.get(CACHE_KEY);
    const parsed = parseRedisJson<{ methods: PaymentMethodRow[] }>(cached);
    if (parsed?.methods) return parsed.methods;
  }

  const { rows } = await pool.query<PaymentMethodRow>(
    `SELECT code, name, category FROM payment_methods WHERE is_active = true ORDER BY category, name`
  );
  if (redis) {
    await redis.set(CACHE_KEY, JSON.stringify({ methods: rows }), { ex: TTL });
  }
  return rows;
}
