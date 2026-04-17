import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { CatalogProduct } from "@/lib/types/catalog";
import { formatIDR } from "@/lib/format-idr";
import type { ShopTab } from "@/lib/routes";
import { productPath } from "@/lib/routes";
import { ShopHeader } from "@/components/shop/shop-header";

export function CatalogGrid({
  items,
  tab,
  branchId,
  branchName,
}: {
  items: CatalogProduct[];
  tab: ShopTab;
  branchId?: number | null;
  branchName?: string | null;
}) {
  const title =
    tab === "ANTAR"
      ? "Qurban Antar"
      : tab === "BERBAGI"
        ? "Qurban Berbagi"
        : "Qurban Kaleng";

  const catalogTitle =
    (tab === "ANTAR" || tab === "KALENG") && branchName ? `${title} · ${branchName}` : title;

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen">
      <ShopHeader backHref="/" title={catalogTitle} />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        {items.length === 0 && (
          <p className="text-center text-sm text-slate-500">
            Belum ada penawaran di kategori ini.
          </p>
        )}
        {items.map((item) => (
          <Link
            key={item.id}
            href={productPath(item.catalog_offer_id, tab, branchId ?? null)}
            className="block bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden active:bg-slate-50"
          >
            <div className="relative w-full h-40">
              <Image
                src={item.img}
                alt={item.typeName}
                fill
                sizes="(max-width: 448px) 100vw, 448px"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-800 mb-1">{item.typeName}</h3>

              {tab === "BERBAGI" ? (
                <div className="mb-3">
                  {item.location && (
                    <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                      <MapPin size={14} /> {item.location}
                    </p>
                  )}
                  {item.target != null &&
                  item.target > 0 &&
                  item.current != null ? (
                    <>
                      <div className="w-full bg-slate-100 rounded-sm h-2 mb-1">
                        <div
                          className="bg-red-600 h-2 rounded-sm"
                          style={{
                            width: `${Math.min(100, (item.current / item.target) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Terkumpul: {item.current}</span>
                        <span>Sisa: {item.target - item.current}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Progress kolektif diinformasikan oleh admin.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500 mb-3">{item.weight}</p>
              )}

              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-red-700 text-lg">
                  {formatIDR(item.price)}
                </span>
                <span className="text-xs text-[#1e3a5f] font-bold border border-[#1e3a5f] px-3 py-1.5 rounded-sm">
                  Detail
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
