import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Info, MapPin } from "lucide-react";
import type { CatalogProduct } from "@/lib/types/catalog";
import { formatIDR } from "@/lib/format-idr";
import type { ShopTab } from "@/lib/routes";
import { catalogPath, checkoutPath } from "@/lib/routes";

export function ProductDetailView({
  product,
  tab,
  branchId,
}: {
  product: CatalogProduct;
  tab: ShopTab;
  branchId: number | null;
}) {
  const progressPct =
    tab === "BERBAGI" &&
    product.target != null &&
    product.target > 0 &&
    product.current != null
      ? Math.min(100, (product.current / product.target) * 100)
      : 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen relative">
      <header className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between">
        <Link
          href={catalogPath(tab, branchId)}
          className="bg-black/40 backdrop-blur-md text-white p-2 rounded-md"
          aria-label="Kembali ke katalog"
        >
          <ArrowLeft size={20} />
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto pb-28">
        <div className="relative w-full aspect-4/3 bg-slate-100">
          <Image
            src={product.img}
            alt={product.typeName}
            fill
            sizes="(max-width: 448px) 100vw, 448px"
            className="object-contain"
            priority
          />
        </div>

        <div className="bg-white p-5 rounded-t-xl -mt-4 relative z-10 shadow-sm border-t border-slate-200">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-slate-800">
              {product.typeName}
            </h1>
          </div>
          <p className="text-2xl font-bold text-red-700 mb-4">
            {formatIDR(product.price)}
          </p>

          {tab === "BERBAGI" && product.location && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-md mb-4">
              <p className="text-sm text-slate-600 flex items-center gap-1 mb-3 font-semibold">
                <MapPin size={16} /> Lokasi: {product.location}
              </p>
              {product.target != null &&
                product.target > 0 &&
                product.current != null && (
                  <>
                    <div className="w-full bg-slate-200 rounded-sm h-2.5 mb-2">
                      <div
                        className="bg-red-600 h-2.5 rounded-sm"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-slate-500 font-semibold">
                      <span>
                        Terkumpul: {product.current} / {product.target}
                      </span>
                    </div>
                  </>
                )}
            </div>
          )}

          <div className="border-t border-slate-100 pt-4 mb-4">
            <h3 className="font-bold text-slate-800 mb-2">Deskripsi</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {product.desc}
            </p>
            {tab !== "BERBAGI" && (
              <p className="text-slate-600 text-sm mt-2">
                <span className="font-semibold text-slate-800">
                  Spesifikasi/Berat:
                </span>{" "}
                {product.weight}
              </p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3 border border-blue-100">
            <Info className="text-blue-700 shrink-0 mt-0.5" size={20} />
            <p className="text-xs text-blue-800">
              Harga sudah termasuk biaya perawatan. Sertifikat dan video
              penyembelihan akan dikirim otomatis ke WhatsApp Anda.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full bg-white border-t border-slate-200 p-4 px-5 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] flex gap-3 z-20">
        <Link
          href={checkoutPath(product.catalog_offer_id, tab, branchId)}
          className="w-full bg-red-700 text-white py-3 rounded-md font-bold active:bg-red-800 transition-colors text-lg text-center"
        >
          Pesan Sekarang
        </Link>
      </div>
    </div>
  );
}
