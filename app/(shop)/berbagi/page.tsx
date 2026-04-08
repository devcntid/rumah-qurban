import type { Metadata } from "next";
import { getCatalogItemsCached } from "@/lib/data/catalog";
import { CatalogGrid } from "@/components/shop/catalog-grid";

export const metadata: Metadata = {
  title: "Qurban Berbagi",
  description: "Katalog Qurban Berbagi — penyaluran ke wilayah terpencil.",
};

export default async function BerbagiPage() {
  const items = await getCatalogItemsCached("BERBAGI", null);

  return (
    <CatalogGrid items={items} tab="BERBAGI" branchId={null} branchName={null} />
  );
}
