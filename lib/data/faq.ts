import { pool } from "@/lib/db";
import { getRedis, parseRedisJson } from "@/lib/redis";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  display_order: number;
}

export interface FaqCategory {
  category: string;
  product_code: string;
  items: FaqItem[];
}

const CACHE_KEY = "cache:faqs:v3";
const TTL = 3600;

function sanitizeAnswer(raw: string): string {
  const hasHtml = /<[a-z][\s\S]*>/i.test(raw);
  if (hasHtml) return raw;
  return raw
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

export async function getFaqsCached(): Promise<FaqCategory[]> {
  const redis = getRedis();

  if (redis) {
    const cached = await redis.get(CACHE_KEY);
    const parsed = parseRedisJson<{ categories: FaqCategory[] }>(cached);
    if (parsed?.categories) return parsed.categories;
  }

  const { rows } = await pool.query<{
    id: string;
    category: string;
    question: string;
    answer: string;
    display_order: number;
    product_code: string;
  }>(
    `SELECT DISTINCT ON (p.code, f.category, f.display_order, f.question)
       f.id, f.category, f.question, f.answer, f.display_order, p.code AS product_code
     FROM faqs f
     INNER JOIN products p ON p.id = f.product_id
     WHERE f.is_active = true
     ORDER BY p.code, f.category, f.display_order, f.question, f.id`
  );

  const categoryMap = new Map<string, FaqCategory>();
  for (const r of rows) {
    const key = `${r.product_code}::${r.category}`;
    let cat = categoryMap.get(key);
    if (!cat) {
      cat = { category: r.category, product_code: r.product_code, items: [] };
      categoryMap.set(key, cat);
    }
    cat.items.push({
      id: Number(r.id),
      question: r.question,
      answer: sanitizeAnswer(r.answer),
      display_order: r.display_order,
    });
  }

  const categories = Array.from(categoryMap.values());

  if (redis) {
    await redis.set(CACHE_KEY, JSON.stringify({ categories }), { ex: TTL });
  }

  return categories;
}
