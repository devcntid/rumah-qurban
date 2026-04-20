import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBranchesCached, getCatalogItemsCached } from "@/lib/data/catalog";
import { CatalogGrid } from "@/components/shop/catalog-grid";
import { ShopHeader } from "@/components/shop/shop-header";

type Props = { params: Promise<{ branchId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branchId } = await params;
  const id = Number(branchId);
  if (!Number.isFinite(id)) return { title: "Qurban Kaleng" };
  const branches = await getBranchesCached();
  const b = branches.find((x) => x.id === id);
  return {
    title: b ? `Qurban Kaleng — ${b.name}` : "Qurban Kaleng",
    description: b
      ? `Katalog Qurban Kaleng untuk wilayah ${b.name}.`
      : "Katalog Qurban Kaleng.",
  };
}

export default async function KalengBranchCatalogPage({ params }: Props) {
  const { branchId } = await params;
  const id = Number(branchId);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const branches = await getBranchesCached();
  const branch = branches.find((b) => b.id === id);
  if (!branch) notFound();

  const items = await getCatalogItemsCached("KALENG", String(id));

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen">
      <ShopHeader backHref="/" title={`Qurban Kaleng · ${branch.name}`} />
      <CatalogGrid items={items} tab="KALENG" branchId={id} />
    </div>
  );
}
