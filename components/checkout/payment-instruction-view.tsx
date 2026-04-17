"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Building,
  Copy,
  CreditCard,
  Loader2,
  QrCode,
  Wallet,
} from "lucide-react";
import { ShopHeader } from "@/components/shop/shop-header";
import type { OrderInvoiceSummary, PaymentInstruction } from "@/lib/data/order";
import { formatIDR } from "@/lib/format-idr";
import {
  inferInstructionPaymentType,
  type InstructionPaymentVisual,
} from "@/lib/payment-instruction-type";
import { ProofUploader } from "./proof-uploader";

function channelLabel(channel: string): string {
  const map: Record<string, string> = {
    ATM: "Via ATM",
    MBANKING: "Via Mobile Banking",
    ALL: "Semua Channel",
  };
  return map[channel.toUpperCase()] ?? channel;
}

function InstructionSteps({ steps }: { steps: string }) {
  return (
    <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
      {steps}
    </div>
  );
}

function TransferBlock({
  order,
  instructions,
  onFileChange,
}: {
  order: OrderInvoiceSummary;
  instructions: PaymentInstruction[];
  onFileChange: (file: File | null) => void;
}) {
  const hasAccount = !!order.account_number;

  return (
    <div className="space-y-4">
      {hasAccount && (
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Rekening Tujuan
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-800">
                {order.bank_name ?? "Bank"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-[#1e3a5f] tracking-wider font-mono">
                {order.account_number}
              </p>
              <button
                type="button"
                className="text-slate-400 hover:text-[#1e3a5f] transition-colors p-1"
                aria-label="Salin nomor rekening"
                data-copy={order.account_number ?? ""}
              >
                <Copy size={14} />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              a.n <b className="text-slate-800">{order.account_holder_name ?? "Rumah Qurban"}</b>
            </p>
          </div>
        </div>
      )}

      {!hasAccount && (
        <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
          <p className="text-xs text-slate-600">
            Silakan transfer sesuai instruksi yang dikirim via WhatsApp.
          </p>
        </div>
      )}

      {instructions.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-700 mb-2">
            Panduan Pembayaran
          </p>
          <div className="space-y-2">
            {instructions.map((ins) => (
              <details
                key={ins.channel}
                className="border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm"
              >
                <summary className="w-full text-left p-3 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50">
                  {channelLabel(ins.channel)}
                </summary>
                <div className="p-3 border-t border-slate-100 bg-slate-50">
                  <InstructionSteps steps={ins.instruction_steps} />
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      <ProofUploader onFileChange={onFileChange} />
    </div>
  );
}

function VaBlock({
  instructions,
}: {
  instructions: PaymentInstruction[];
}) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
        <p className="text-xs text-slate-600 mb-2">
          Nomor Virtual Account akan dikirim setelah payment gateway aktif.
          Untuk sementara, selesaikan sesuai panduan berikut.
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="font-bold text-slate-800 tracking-widest text-xl">
            — — — —
          </p>
        </div>
      </div>

      {instructions.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-700 mb-2">
            Panduan Pembayaran
          </p>
          <div className="space-y-2">
            {instructions.map((ins) => (
              <details
                key={ins.channel}
                className="border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm"
              >
                <summary className="w-full text-left p-3 text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50">
                  {channelLabel(ins.channel)}
                </summary>
                <div className="p-3 border-t border-slate-100 bg-slate-50">
                  <InstructionSteps steps={ins.instruction_steps} />
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QrisBlock({
  instructions,
}: {
  instructions: PaymentInstruction[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center bg-slate-50 p-4 rounded-md border border-slate-200">
        <p className="text-sm font-bold text-slate-800 mb-2">
          Scan QRIS Berikut
        </p>
        <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 mb-3">
          <QrCode size={120} className="text-slate-800" />
        </div>
        {instructions.length > 0 ? (
          <div className="w-full text-left mt-2">
            {instructions.map((ins) => (
              <div key={ins.channel} className="text-xs text-slate-600 whitespace-pre-line">
                {ins.instruction_steps}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600 text-center px-4">
            Gunakan aplikasi M-Banking atau E-Wallet pendukung QRIS untuk
            menscan kode ini.
          </p>
        )}
      </div>
    </div>
  );
}

function EwalletBlock({
  instructions,
}: {
  instructions: PaymentInstruction[];
}) {
  return (
    <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-center">
      <Wallet size={32} className="text-slate-400 mx-auto mb-3" />
      <p className="text-sm text-slate-700 font-semibold mb-3">
        Selesaikan di aplikasi e-wallet
      </p>
      {instructions.length > 0 ? (
        <div className="text-left mt-3 space-y-2">
          {instructions.map((ins) => (
            <div key={ins.channel} className="text-xs text-slate-600 whitespace-pre-line">
              {ins.instruction_steps}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-slate-500 mt-4">
          Pastikan saldo Anda cukup untuk melakukan pembayaran.
        </p>
      )}
    </div>
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

function PaymentBlock({
  type,
  order,
  instructions,
  onFileChange,
}: {
  type: InstructionPaymentVisual;
  order: OrderInvoiceSummary;
  instructions: PaymentInstruction[];
  onFileChange: (file: File | null) => void;
}) {
  if (type === "transfer")
    return <TransferBlock order={order} instructions={instructions} onFileChange={onFileChange} />;
  if (type === "va") return <VaBlock instructions={instructions} />;
  if (type === "qris") return <QrisBlock instructions={instructions} />;
  if (type === "ewallet") return <EwalletBlock instructions={instructions} />;
  return (
    <p className="text-sm text-slate-600">
      Selesaikan pembayaran sesuai channel yang Anda pilih. Detail tambahan
      dapat dikirim melalui WhatsApp.
    </p>
  );
}

export function PaymentInstructionView({
  order,
  instructions,
}: {
  order: OrderInvoiceSummary;
  instructions: PaymentInstruction[];
}) {
  const router = useRouter();
  const visual = inferInstructionPaymentType(order);
  const isTransfer = visual === "transfer";
  const methodLabel =
    order.payment_method_name ?? order.payment_method_code ?? "Metode pembayaran";

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = useCallback((file: File | null) => {
    setProofFile(file);
    setUploadError("");
  }, []);

  const handleConfirmPayment = async () => {
    const successUrl = `/checkout/sukses?invoice=${encodeURIComponent(order.invoice_number)}`;

    if (!isTransfer || !proofFile) {
      router.push(successUrl);
      return;
    }

    setUploading(true);
    setUploadError("");

    const form = new FormData();
    form.append("file", proofFile);
    form.append("invoice", order.invoice_number);

    try {
      const res = await fetch("/api/upload-proof", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Upload gagal. Coba lagi.");
        return;
      }
      router.push(successUrl);
    } catch {
      setUploadError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-28">
      <ShopHeader backHref="/" title="Instruksi Pembayaran" />

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
          <PaymentBlock
            type={visual}
            order={order}
            instructions={instructions}
            onFileChange={handleFileChange}
          />
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-20">
        {uploadError && (
          <p className="text-xs text-red-600 font-semibold text-center mb-2">
            {uploadError}
          </p>
        )}
        <button
          type="button"
          onClick={() => void handleConfirmPayment()}
          disabled={uploading}
          className="w-full py-3 rounded-md font-bold transition-colors text-center shadow-md bg-green-600 text-white active:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Mengupload Bukti…</span>
            </>
          ) : (
            "Saya Sudah Bayar"
          )}
        </button>
      </div>
    </div>
  );
}
