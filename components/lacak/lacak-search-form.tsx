"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function LacakSearchForm() {
  const router = useRouter();
  const [invoice, setInvoice] = useState("");
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = invoice.trim();
    if (!inv) return;
    setLoading(true);
    router.push(`/lacak/${encodeURIComponent(inv)}`);
    requestAnimationFrame(() => {
      if (mountedRef.current) setLoading(false);
    });
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm mx-auto">
      <label className="text-xs font-semibold text-slate-500 mb-1 block">
        No. HP atau Nomor Invoice
      </label>
      <input
        type="text"
        placeholder="Contoh: 0812... atau INV-WEB-…"
        className="w-full border border-slate-300 rounded-md p-3.5 mb-2 outline-none focus:border-[#1e3a5f] bg-white font-semibold text-slate-800"
        value={invoice}
        onChange={(e) => setInvoice(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading || !invoice.trim()}
        className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-md font-bold active:bg-blue-900 transition-colors shadow-sm disabled:opacity-50"
      >
        {loading ? "Membuka…" : "Cari Pesanan"}
      </button>
    </form>
  );
}
