import Link from "next/link";
import {
  Building,
  CreditCard,
  QrCode,
  Upload,
  Wallet,
} from "lucide-react";
import type { OrderInvoiceSummary } from "@/lib/data/order";
import { formatIDR } from "@/lib/format-idr";
import {
  inferInstructionPaymentType,
  type InstructionPaymentVisual,
} from "@/lib/payment-instruction-type";

function BlockByType({ type }: { type: InstructionPaymentVisual }) {
  if (type === "transfer") {
    return (
      <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
        <p className="text-xs text-slate-600 mb-1">
          Silakan transfer ke rekening (cek WhatsApp / instruksi resmi):
        </p>
        <p className="text-xs text-slate-500 mb-4">a.n Rumah Qurban Indonesia</p>
        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#1e3a5f]/40 rounded-md p-4 cursor-pointer hover:bg-blue-50 transition-colors bg-white">
          <Upload size={20} className="text-[#1e3a5f] mb-2" />
          <span className="text-sm text-slate-700 font-semibold">
            Upload Bukti Transfer
          </span>
          <span className="text-[10px] text-slate-400 mt-1">
            Format: JPG, PNG, atau PDF
          </span>
          <input type="file" className="hidden" accept="image/*,.pdf" />
        </label>
      </div>
    );
  }
  if (type === "va") {
    return (
      <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
        <p className="text-xs text-slate-600 mb-1">
          Nomor Virtual Account akan dikirim setelah gateway aktif. Untuk
          sementara selesaikan sesuai channel yang dipilih.
        </p>
        <div className="flex items-center justify-between mb-4 mt-1">
          <p className="font-bold text-slate-800 tracking-widest text-xl">
            — — — —
          </p>
        </div>
        <p className="text-xs font-bold text-slate-700 mb-2">
          Panduan Pembayaran
        </p>
        <div className="space-y-2">
          <details className="border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm">
            <summary className="w-full text-left p-3 text-sm font-semibold text-slate-700 cursor-pointer">
              Via ATM
            </summary>
            <div className="p-3 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
              Ikuti menu VA di ATM bank Anda, lalu masukkan nomor VA yang
              valid.
            </div>
          </details>
          <details className="border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm">
            <summary className="w-full text-left p-3 text-sm font-semibold text-slate-700 cursor-pointer">
              Via Mobile Banking
            </summary>
            <div className="p-3 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
              Buka aplikasi m-banking, pilih bayar VA, lalu konfirmasi nominal.
            </div>
          </details>
        </div>
      </div>
    );
  }
  if (type === "ewallet") {
    return (
      <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-center">
        <Wallet size={32} className="text-slate-400 mx-auto mb-3" />
        <p className="text-sm text-slate-700 font-semibold mb-3">
          Selesaikan di aplikasi e-wallet
        </p>
        <p className="text-[10px] text-slate-500 mt-4">
          Pastikan saldo Anda cukup untuk melakukan pembayaran.
        </p>
      </div>
    );
  }
  if (type === "qris") {
    return (
      <div className="flex flex-col items-center bg-slate-50 p-4 rounded-md border border-slate-200">
        <p className="text-sm font-bold text-slate-800 mb-2">
          Scan QRIS Berikut
        </p>
        <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 mb-3">
          <QrCode size={120} className="text-slate-800" />
        </div>
        <p className="text-xs text-slate-600 text-center px-4">
          Gunakan aplikasi M-Banking atau E-Wallet pendukung QRIS untuk
          menscan kode ini.
        </p>
      </div>
    );
  }
  return (
    <p className="text-sm text-slate-600">
      Selesaikan pembayaran sesuai channel yang Anda pilih. Detail tambahan
      dapat dikirim melalui WhatsApp.
    </p>
  );
}

function IconForType({ type }: { type: InstructionPaymentVisual }) {
  if (type === "va") return <Building size={20} className="text-slate-400" />;
  if (type === "transfer")
    return <CreditCard size={20} className="text-slate-400" />;
  if (type === "ewallet") return <Wallet size={20} className="text-slate-400" />;
  if (type === "qris") return <QrCode size={20} className="text-slate-400" />;
  return null;
}

export function PaymentInstructionView({ order }: { order: OrderInvoiceSummary }) {
  const visual = inferInstructionPaymentType(order);
  const methodLabel =
    order.payment_method_name ?? order.payment_method_code ?? "Metode pembayaran";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-28">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
        <Link href="/" className="text-slate-600 p-1" aria-label="Beranda">
          <span className="text-xl">←</span>
        </Link>
        <h1 className="font-bold text-slate-800 text-lg">
          Instruksi Pembayaran
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 text-center">
          <p className="text-xs font-semibold text-slate-500 mb-1">
            Selesaikan Pembayaran
          </p>
          <p className="text-2xl font-bold text-red-700 mb-3">
            {formatIDR(order.grand_total)}
          </p>
          <div className="inline-block border border-orange-200 bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
            Batas Waktu: 23:59:59
          </div>
          <p className="text-xs text-slate-500 mt-2">
            No. Pesanan: <b>{order.invoice_number}</b>
          </p>
        </div>

        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <span className="text-sm font-bold text-slate-800">{methodLabel}</span>
            <IconForType type={visual} />
          </div>
          <BlockByType type={visual} />
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <Link
          href={`/checkout/sukses?invoice=${encodeURIComponent(order.invoice_number)}`}
          className="block w-full py-3 rounded-md font-bold transition-colors text-center shadow-md bg-green-600 text-white active:bg-green-700"
        >
          Saya Sudah Bayar
        </Link>
      </div>
    </div>
  );
}
