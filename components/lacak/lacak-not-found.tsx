"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchX, Home, Info } from "lucide-react";

export function LacakNotFound({ query }: { query: string }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = invoice.trim();
    if (!inv) return;
    setLoading(true);
    router.push(`/lacak/${encodeURIComponent(inv)}`);
  };

  return (
    <div className="flex-1 p-6 flex flex-col items-center justify-start pt-8 pb-24">
      <div className="bg-red-50 p-4 rounded-full mb-5">
        <SearchX size={48} className="text-red-400" />
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">
        Pesanan Tidak Ditemukan
      </h2>

      <p className="text-center text-sm text-slate-500 mb-2 px-4 max-w-sm">
        Kami tidak menemukan pesanan dengan pencarian{" "}
        <span className="font-bold text-slate-700">&ldquo;{query}&rdquo;</span>.
      </p>

      <p className="text-center text-sm text-slate-500 mb-6 px-4 max-w-sm">
        Pastikan nomor invoice atau nomor HP yang dimasukkan sudah benar.
      </p>

      <div className="w-full max-w-sm bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2.5">
          <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-blue-800 mb-1.5">
              Format yang diterima:
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>
                <span className="font-semibold">Invoice:</span>{" "}
                <span className="font-mono bg-blue-100 px-1 rounded">
                  INV-WEB-...
                </span>
              </li>
              <li>
                <span className="font-semibold">No. HP lengkap:</span>{" "}
                <span className="font-mono bg-blue-100 px-1 rounded">
                  08xx xxxx xxxx
                </span>
              </li>
              <li>
                <span className="font-semibold">4 digit terakhir HP:</span>{" "}
                <span className="font-mono bg-blue-100 px-1 rounded">
                  6437
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <label className="text-xs font-semibold text-slate-500 mb-1 block">
          Coba cari lagi
        </label>
        <input
          type="text"
          placeholder="Masukkan invoice atau nomor HP…"
          className="w-full border border-slate-300 rounded-md p-3.5 mb-2 outline-none focus:border-[#1e3a5f] bg-white font-semibold text-slate-800"
          value={invoice}
          onChange={(e) => setInvoice(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !invoice.trim()}
          className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-md font-bold active:bg-blue-900 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "Mencari…" : "Cari Pesanan"}
        </button>
      </form>

      <Link
        href="/"
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
      >
        <Home size={16} />
        Kembali ke Beranda
      </Link>
    </div>
  );
}
