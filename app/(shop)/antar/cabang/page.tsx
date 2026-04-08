import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getBranchesCached } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Pilih Cabang — Qurban Antar",
  description: "Pilih cabang wilayah untuk melihat katalog Qurban Antar.",
};

export default async function AntarCabangPage() {
  const branches = await getBranchesCached();

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <Link href="/" className="text-slate-600 p-1" aria-label="Beranda">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-bold text-slate-800 text-lg">Mau Qurban Dimana?</h1>
      </header>

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
