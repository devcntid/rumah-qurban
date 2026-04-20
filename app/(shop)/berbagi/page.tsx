import type { Metadata } from "next";
import { getCatalogItemsCached } from "@/lib/data/catalog";
import { CatalogGrid } from "@/components/shop/catalog-grid";
import { ShopHeader } from "@/components/shop/shop-header";

export const metadata: Metadata = {
  title: "Qurban Berbagi",
  description: "Katalog Qurban Berbagi — penyaluran ke wilayah terpencil.",
};

export default async function BerbagiPage() {
  const items = await getCatalogItemsCached("BERBAGI", null);

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen">
      <ShopHeader backHref="/" title="Qurban Berbagi" />
      <CatalogGrid items={items} tab="BERBAGI" branchId={null} />
    </div>
  );
}
