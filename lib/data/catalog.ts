import { unstable_cache } from "next/cache";
import { pool } from "@/lib/db";
import { getRedis, parseRedisJson } from "@/lib/redis";
import type { BranchRow, CatalogProduct } from "@/lib/types/catalog";
import {
  mapRowToCatalogProduct,
  type CatalogRow,
} from "@/lib/data/map-catalog-row";

export const TAB_TO_PRODUCT: Record<string, string> = {
  ANTAR: "QA",
  BERBAGI: "QB",
  KALENG: "QK",
};

const CATALOG_SELECT = `
    SELECT
      co.id,
      co.branch_id::text AS branch_id,
      co.display_name,
      co.projected_weight,
      co.price,
      co.image_url,
      co.sub_type,
      p.code AS product_code,
      p.requires_shipping,
      av.id AS animal_variant_id,
      av.species,
      av.class_grade,
      av.weight_range,
      av.description AS variant_description,
      v.name AS vendor_name,
      v.location AS vendor_location,
      sh.base_price::text AS shipping_fee,
      sl.base_price::text AS slaughter_fee
    FROM catalog_offers co
    INNER JOIN products p ON p.id = co.product_id
    INNER JOIN animal_variants av ON av.id = co.animal_variant_id
    LEFT JOIN vendors v ON v.id = co.vendor_id
    LEFT JOIN LATERAL (
      SELECT s.base_price
      FROM services s
      WHERE s.service_type = 'SHIPPING'
        AND s.branch_id = co.branch_id
        AND s.animal_variant_id = co.animal_variant_id
      ORDER BY s.id
      LIMIT 1
    ) sh ON true
    LEFT JOIN LATERAL (
      SELECT s.base_price
      FROM services s
      WHERE s.service_type = 'SLAUGHTER'
        AND s.animal_variant_id = co.animal_variant_id
        AND (s.branch_id IS NULL OR s.branch_id = co.branch_id)
      ORDER BY s.id
      LIMIT 1
    ) sl ON true
`;

async function _getBranches(): Promise<BranchRow[]> {
  const CACHE_KEY = "cache:branches:v2";
  const TTL = 600;
  const redis = getRedis();
  if (redis) {
    const cached = await redis.get(CACHE_KEY);
    const parsed = parseRedisJson<{ branches: BranchRow[] }>(cached);
    if (parsed?.branches) return parsed.branches;
  }

  const { rows } = await pool.query<{ id: string; name: string }>(
    `SELECT id, name FROM branches WHERE is_active = true ORDER BY name`
  );
  const branches = rows.map((r) => ({ id: Number(r.id), name: r.name }));
  if (redis) {
    await redis.set(CACHE_KEY, JSON.stringify({ branches }), { ex: TTL });
  }
  return branches;
}

export const getBranchesCached = unstable_cache(_getBranches, ["branches"], {
  revalidate: 300,
});

async function _getCatalogItems(
  tab: string,
  branchIdParam: string | null
): Promise<CatalogProduct[]> {
  const productCode = TAB_TO_PRODUCT[tab];
  if (!productCode) return [];
  const needsBranch = productCode === "QA" || productCode === "QK";
  if (needsBranch && !branchIdParam) return [];

  const redis = getRedis();
  const cacheKey = `cache:catalog:v2:${productCode}:${branchIdParam ?? "na"}`;
  if (redis) {
    const cached = await redis.get(cacheKey);
    const parsed = parseRedisJson<{ items: CatalogProduct[] }>(cached);
    if (parsed?.items) return parsed.items;
  }

  const params: (string | number)[] = [productCode];
  let branchClause = "";
  if (needsBranch) {
    params.push(Number(branchIdParam));
    branchClause = "AND co.branch_id = $2";
  }

  const { rows } = await pool.query<CatalogRow>(
    `
    ${CATALOG_SELECT}
    WHERE co.is_active = true
      AND p.code = $1
      ${branchClause}
    ORDER BY co.display_name
    `,
    params
  );

  const items = rows.map((r) => mapRowToCatalogProduct(r, productCode));
  if (redis) {
    await redis.set(cacheKey, JSON.stringify({ items }), { ex: 300 });
  }
  return items;
}

export async function getCatalogItemsCached(
  tab: string,
  branchIdParam: string | null
): Promise<CatalogProduct[]> {
  const key = `catalog-${tab}-${branchIdParam ?? "na"}`;
  return unstable_cache(() => _getCatalogItems(tab, branchIdParam), [key], {
    revalidate: 300,
  })();
}

async function _getOfferById(
  offerId: number
): Promise<CatalogProduct | null> {
  if (!Number.isFinite(offerId) || offerId <= 0) return null;

  const redis = getRedis();
  const cacheKey = `cache:offer:v2:${offerId}`;
  if (redis) {
    const cached = await redis.get(cacheKey);
    const parsed = parseRedisJson<{ offer: CatalogProduct }>(cached);
    if (parsed?.offer) return parsed.offer;
  }

  const { rows } = await pool.query<CatalogRow>(
    `
    ${CATALOG_SELECT}
    WHERE co.is_active = true AND co.id = $1
    LIMIT 1
    `,
    [offerId]
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  const offer = mapRowToCatalogProduct(r, r.product_code);
  if (redis) {
    await redis.set(cacheKey, JSON.stringify({ offer }), { ex: 300 });
  }
  return offer;
}

export async function getOfferById(
  offerId: number
): Promise<CatalogProduct | null> {
  return unstable_cache(() => _getOfferById(offerId), [`offer-${offerId}`], {
    revalidate: 300,
  })();
}
