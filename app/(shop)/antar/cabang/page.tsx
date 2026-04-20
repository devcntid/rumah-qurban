import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getBranchesCached } from "@/lib/data/catalog";
import { ShopHeader } from "@/components/shop/shop-header";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Pilih Cabang — Qurban Antar",
  description: "Pilih cabang wilayah untuk melihat katalog Qurban Antar.",
};

export default async function AntarCabangPage() {
  const branches = await getBranchesCached();

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen">
      <ShopHeader backHref="/" title="Mau Qurban Dimana?" />

      <div className="p-4 space-y-3 overflow-y-auto pb-24">
        <p className="text-sm text-slate-500 mb-2 px-1">
          Pilih cabang terdekat untuk melihat stok dan harga Qurban Antar di
          wilayah Anda.
        </p>
        {branches.map((b) => (
          <Link
            key={b.id}
            href={`/antar/${b.id}`}
            className="w-full bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between active:scale-[0.99] transition-transform"
          >
            <span className="font-semibold text-slate-800">{b.name}</span>
            <ChevronRight className="text-slate-400" size={20} />
          </Link>
        ))}
      </div>
    </div>
  );
}
