import type { Metadata } from "next";
import { Truck } from "lucide-react";
import { LacakSearchForm } from "@/components/lacak/lacak-search-form";

export const metadata: Metadata = {
  title: "Lacak Pesanan",
  description:
    "Cek status qurban dengan nomor invoice. Pelacakan pesanan Rumah Qurban.",
};

export default function LacakPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
        <h1 className="font-bold text-slate-800 text-lg">Lacak Pesanan</h1>
      </header>
      <div className="flex-1 p-6 flex flex-col items-center justify-start pt-10 pb-24">
        <div className="bg-blue-50 p-4 rounded-full mb-5">
          <Truck size={48} className="text-[#1e3a5f]" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">
          Lacak Pengiriman & Qurban
        </h2>
        <p className="text-center text-sm text-slate-500 mb-8 px-4 max-w-sm">
          Masukkan Nomor HP Anda atau Nomor Invoice pesanan untuk memantau status
          qurban Anda.
        </p>
        <LacakSearchForm />
      </div>
    </div>
  );
}
