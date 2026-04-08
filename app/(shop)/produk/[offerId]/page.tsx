import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOfferById, TAB_TO_PRODUCT } from "@/lib/data/catalog";
import { ProductDetailView } from "@/components/shop/product-detail";
import type { ShopTab } from "@/lib/routes";

type Props = {
  params: Promise<{ offerId: string }>;
  searchParams: Promise<{ tab?: string; cabang?: string }>;
};

function parseTab(raw: string | undefined): ShopTab | null {
  if (raw === "ANTAR" || raw === "BERBAGI" || raw === "KALENG") return raw;
  return null;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { offerId } = await params;
  const sp = await searchParams;
  const id = Number(offerId);
  if (!Number.isFinite(id) || id <= 0) {
    return { title: "Produk tidak ditemukan" };
  }
  const offer = await getOfferById(id);
  if (!offer) {
    return { title: "Produk tidak ditemukan" };
  }
  const tab = parseTab(sp.tab);
  const title =
    tab === "ANTAR"
      ? `${offer.typeName} — Qurban Antar`
      : tab === "BERBAGI"
        ? `${offer.typeName} — Qurban Berbagi`
        : tab === "KALENG"
          ? `${offer.typeName} — Qurban Kaleng`
          : offer.typeName;
  return {
    title,
    description: offer.desc.slice(0, 160),
    openGraph: {
      images: offer.img ? [{ url: offer.img }] : undefined,
    },
  };
}

export default async function ProdukPage({ params, searchParams }: Props) {
  const { offerId } = await params;
  const sp = await searchParams;
  const id = Number(offerId);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const tab = parseTab(sp.tab);
  if (!tab) {
    return (
      <div className="p-6 text-center text-slate-600">
        <p className="mb-4">Parameter tab tidak valid.</p>
        <Link href="/" className="text-[#1e3a5f] font-semibold underline">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  const expectedCode = TAB_TO_PRODUCT[tab];
  const offer = await getOfferById(id);
  if (!offer || offer.product_code !== expectedCode) notFound();

  let branchId: number | null = null;

  if (tab === "ANTAR") {
    const cab = sp.cabang != null ? Number(sp.cabang) : NaN;
    if (!Number.isFinite(cab) || cab <= 0) notFound();
    if (offer.branch_id !== cab) notFound();
    branchId = cab;
  }

  return (
    <ProductDetailView product={offer} tab={tab} branchId={branchId} />
  );
}
