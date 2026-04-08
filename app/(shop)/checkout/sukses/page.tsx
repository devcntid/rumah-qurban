import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getOrderByInvoice } from "@/lib/data/order";
import { formatIDR } from "@/lib/format-idr";

type Props = {
  searchParams: Promise<{ invoice?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const sp = await searchParams;
  const inv = sp.invoice?.trim();
  if (!inv) return { title: "Pesanan Berhasil" };
  return {
    title: `Pesanan Berhasil — ${inv}`,
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutSuksesPage({ searchParams }: Props) {
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

  const trackHref = `/lacak/${encodeURIComponent(order.invoice_number)}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
        </div>
        <h1 className="text-lg font-bold text-slate-800 mb-2">
          Pesanan Berhasil Diproses!
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Terima kasih {order.customer_name || "Kak"}. Kami akan memverifikasi
          pembayaran Anda segera.
        </p>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-md mb-6 text-left">
          <p className="text-xs font-semibold text-slate-500 mb-1">
            Total Transaksi
          </p>
          <p className="font-bold text-red-700 text-xl mb-3">
            {formatIDR(order.grand_total)}
          </p>
          <div className="h-px bg-slate-200 w-full mb-3" />
          <p className="text-xs font-semibold text-slate-500 mb-1">
            No. Invoice Pesanan
          </p>
          <p className="font-bold text-slate-800 text-lg tracking-wider">
            {order.invoice_number}
          </p>
        </div>

        <Link
          href={trackHref}
          className="block w-full bg-[#1e3a5f] text-white py-3 rounded-md font-bold shadow-sm mb-3 text-center"
        >
          Lacak Pesanan Saya
        </Link>
        <Link
          href="/"
          className="block w-full text-slate-500 py-3 rounded-md font-bold text-sm text-center"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
