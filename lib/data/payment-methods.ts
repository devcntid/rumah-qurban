import { pool } from "@/lib/db";
import { getRedis, parseRedisJson } from "@/lib/redis";

export type PaymentMethodRow = {
  code: string;
  name: string;
  category: string;
  account_holder_name: string | null;
  bank_name: string | null;
  account_number: string | null;
};

const CACHE_KEY = "payment_methods:all";
const TTL = 300;

export async function getPaymentMethodsCached(): Promise<PaymentMethodRow[]> {
  const redis = getRedis();
  if (redis) {
    const cached = await redis.get(CACHE_KEY);
    const parsed = parseRedisJson<{ methods: PaymentMethodRow[] }>(cached);
    if (parsed?.methods) return parsed.methods;
  }

  const { rows } = await pool.query<PaymentMethodRow>(
    `SELECT code, name, category, account_holder_name, bank_name, account_number
     FROM payment_methods
     WHERE is_active = true AND is_publish = true
     ORDER BY category, name`
  );
  if (redis) {
    await redis.set(CACHE_KEY, JSON.stringify({ methods: rows }), { ex: TTL });
  }
  return rows;
}
