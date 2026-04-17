import Link from "next/link";
import {
  Heart,
  Phone,
  Package,
  Truck,
  MapPin,
  ShieldCheck,
  FileText,
  PlayCircle,
} from "lucide-react";
import { ShopHeader } from "@/components/shop/shop-header";

export function HomeContent() {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-20">
      <ShopHeader
        actions={
          <button
            type="button"
            aria-label="Hubungi layanan pelanggan"
            className="bg-green-50 text-green-700 py-1.5 rounded-md flex items-center gap-1 text-xs font-bold px-3 border border-green-200"
          >
            <Phone size={14} /> CS
          </button>
        }
      />

      <div className="relative bg-slate-900 text-white p-6 pb-12 pt-10">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img
            src="https://images.pexels.com/photos/840111/pexels-photo-840111.jpeg?auto=compress&cs=tinysrgb&w=800"
            className="w-full h-full object-cover"
            alt="Qurban Farm"
          />
        </div>
        <div className="relative z-10">
          <span className="bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
            Qurban {year}
          </span>
          <h1 className="text-3xl font-bold mt-4 leading-tight">
            Kembalikan Manfaat,
            <br />
            Qurban ke Desa
          </h1>
          <p className="mt-2 text-slate-300 text-sm line-clamp-2">
            Lembaga penyedia layanan qurban terpercaya dengan berbagai pilihan
            hewan dan jangkauan luas.
          </p>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-5 border border-slate-200">
          <div className="text-center mb-4">
            <h2 className="font-extrabold text-slate-800 text-lg">
              Mulai Pesan Qurban Anda
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium bg-slate-50 py-1 px-2 rounded inline-block">
              Pilih kategori di bawah untuk melihat katalog
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Link
              href="/antar/cabang"
              className="flex flex-col items-center p-2 rounded-xl active:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 group"
            >
              <div className="bg-blue-50 text-blue-900 p-3.5 rounded-full mb-2 group-active:scale-95 transition-transform">
                <Truck size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                Qurban
                <br />
                Antar
              </span>
            </Link>
            <Link
              href="/berbagi"
              className="flex flex-col items-center p-2 rounded-xl active:bg-red-50 transition-colors border border-transparent hover:border-red-100 group"
            >
              <div className="bg-red-50 text-red-700 p-3.5 rounded-full mb-2 group-active:scale-95 transition-transform">
                <Heart size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                Qurban
                <br />
                Berbagi
              </span>
            </Link>
            <Link
              href="/kaleng/cabang"
              className="flex flex-col items-center p-2 rounded-xl active:bg-amber-50 transition-colors border border-transparent hover:border-amber-100 group"
            >
              <div className="bg-amber-50 text-amber-700 p-3.5 rounded-full mb-2 group-active:scale-95 transition-transform">
                <Package size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                Qurban
                <br />
                Kaleng
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 px-5">
        <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">
          Telah Dipercaya Oleh
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#1e3a5f]">35.898+</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Pequrban</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#1e3a5f]">275.810+</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Penerima Manfaat
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white py-6 px-5 border-y border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-5 text-center">
          Kebermanfaatan Rumah Qurban
        </h2>
        <div className="grid grid-cols-2 gap-y-6">
          <div className="flex flex-col items-center text-center">
            <ShieldCheck size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">
              Sesuai Syariat
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <FileText size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">
              Sertifikat Resmi
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <PlayCircle size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">
              Video Dokumentasi
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <MapPin size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">
              Tepat Sasaran
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
