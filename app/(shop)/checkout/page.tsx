import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBranchesCached,
  getOfferById,
  TAB_TO_PRODUCT,
} from "@/lib/data/catalog";
import { getPaymentMethodsCached } from "@/lib/data/payment-methods";
import { buildPaymentCategories } from "@/lib/payment-ui";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import type { ShopTab } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{
    offerId?: string;
    tab?: string;
    cabang?: string;
  }>;
};

function parseTab(raw: string | undefined): ShopTab | null {
  if (raw === "ANTAR" || raw === "BERBAGI" || raw === "KALENG") return raw;
  return null;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tab = parseTab(sp.tab);
  const offerId = sp.offerId != null ? Number(sp.offerId) : NaN;

  if (!tab || !Number.isFinite(offerId) || offerId <= 0) {
    return (
      <div className="p-6 text-center text-slate-600">
        <p className="mb-4">Parameter checkout tidak lengkap.</p>
        <Link href="/" className="text-[#1e3a5f] font-semibold underline">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  const expectedCode = TAB_TO_PRODUCT[tab];
  const product = await getOfferById(offerId);
  if (!product || product.product_code !== expectedCode) notFound();

  let branchId: number | null = null;
  let branchName: string | null = null;

  if (tab === "ANTAR" || tab === "KALENG") {
    const cab = sp.cabang != null ? Number(sp.cabang) : NaN;
    if (!Number.isFinite(cab) || cab <= 0) notFound();
    if (product.branch_id !== cab) notFound();
    branchId = cab;

    const [branches, methods] = await Promise.all([
      getBranchesCached(),
      getPaymentMethodsCached(),
    ]);
    branchName = branches.find((b) => b.id === cab)?.name ?? null;
    const paymentCategories = buildPaymentCategories(methods);

    return (
      <CheckoutForm
        product={product}
        tab={tab}
        branchId={branchId}
        branchName={branchName}
        paymentCategories={paymentCategories}
      />
    );
  }

  const methods = await getPaymentMethodsCached();
  const paymentCategories = buildPaymentCategories(methods);

  return (
    <CheckoutForm
      product={product}
      tab={tab}
      branchId={branchId}
      branchName={branchName}
      paymentCategories={paymentCategories}
    />
  );
}
