import type { Metadata } from "next";
import { Search } from "lucide-react";
import { ShopHeader } from "@/components/shop/shop-header";
import { LacakSearchForm } from "@/components/lacak/lacak-search-form";

export const metadata: Metadata = {
  title: "Lacak Pesanan",
  description:
    "Cek status qurban dan dokumentasi dengan nomor invoice. Pelacakan pesanan Rumah Qurban.",
};

export default function LacakPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <ShopHeader title="Lacak Pesanan" />
      <div className="flex-1 p-6 flex flex-col items-center justify-start pt-10 pb-24">
        <div className="bg-blue-50 p-4 rounded-full mb-5">
          <Search size={48} className="text-[#1e3a5f]" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">
          Lacak Pesanan & Dokumentasi
        </h2>
        <p className="text-center text-sm text-slate-500 mb-8 px-4 max-w-sm">
          Masukkan Nomor HP atau Invoice untuk melacak pesanan dan melihat
          dokumentasi qurban Anda.
        </p>
        <LacakSearchForm />
      </div>
    </div>
  );
}
