import type { Metadata } from "next";
import { getCatalogItemsCached } from "@/lib/data/catalog";
import { CatalogGrid } from "@/components/shop/catalog-grid";

export const metadata: Metadata = {
  title: "Qurban Kaleng",
  description: "Katalog olahan daging kaleng — Qurban Kaleng.",
};

export default async function KalengPage() {
  const items = await getCatalogItemsCached("KALENG", null);

  return (
    <CatalogGrid items={items} tab="KALENG" branchId={null} branchName={null} />
  );
}
