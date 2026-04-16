import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByInvoice, getPaymentInstructions } from "@/lib/data/order";
import { PaymentInstructionView } from "@/components/checkout/payment-instruction-view";

type Props = {
  searchParams: Promise<{ invoice?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const sp = await searchParams;
  const inv = sp.invoice?.trim();
  if (!inv) return { title: "Instruksi Pembayaran" };
  return {
    title: `Bayar — ${inv}`,
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutInstruksiPage({ searchParams }: Props) {
  const sp = await searchParams;
  const inv = sp.invoice?.trim();
  if (!inv) {
    return (
      <div className="p-6 text-center text-slate-600">
        <p className="mb-4">Nomor invoice tidak ada.</p>
        <Link href="/" className="text-[#1e3a5f] font-semibold underline">
          Beranda
        </Link>
      </div>
    );
  }

  const order = await getOrderByInvoice(inv);
  if (!order) notFound();

  const instructions = order.payment_method_code
    ? await getPaymentInstructions(order.payment_method_code)
    : [];

  return <PaymentInstructionView order={order} instructions={instructions} />;
}
