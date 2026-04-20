"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { CatalogProduct } from "@/lib/types/catalog";
import { formatIDR } from "@/lib/format-idr";
import type { ShopTab } from "@/lib/routes";
import { productPath } from "@/lib/routes";

type SpeciesFilter = "SEMUA" | "SAPI" | "DOMBA_KAMBING";

export function CatalogGrid({
  items,
  tab,
  branchId,
}: {
  items: CatalogProduct[];
  tab: ShopTab;
  branchId?: number | null;
}) {
  const [filter, setFilter] = useState<SpeciesFilter>("SEMUA");

  const speciesSet = useMemo(() => {
    const s = new Set<string>();
    for (const item of items) s.add(item.species);
    return s;
  }, [items]);

  const hasSapi = speciesSet.has("Sapi");
  const hasDombaKambing = speciesSet.has("Domba") || speciesSet.has("Kambing");
  const showFilter = speciesSet.size > 1;

  const filtered = useMemo(() => {
    if (filter === "SEMUA") return items;
    if (filter === "SAPI") return items.filter((i) => i.species === "Sapi");
    return items.filter((i) => i.species === "Domba" || i.species === "Kambing");
  }, [items, filter]);

  return (
    <>
      {showFilter && (
        <div className="bg-white border-b border-slate-200 px-4 sticky top-[53px] z-10">
          <div className="flex gap-2 py-2.5 overflow-x-auto">
            <FilterChip
              label="Semua"
              active={filter === "SEMUA"}
              onClick={() => setFilter("SEMUA")}
            />
            {hasSapi && (
              <FilterChip
                label="Sapi"
                active={filter === "SAPI"}
                onClick={() => setFilter("SAPI")}
              />
            )}
            {hasDombaKambing && (
              <FilterChip
                label="Domba / Kambing"
                active={filter === "DOMBA_KAMBING"}
                onClick={() => setFilter("DOMBA_KAMBING")}
              />
            )}
          </div>
        </div>
      )}

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-500">
            Belum ada penawaran di kategori ini.
          </p>
        )}
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={productPath(item.catalog_offer_id, tab, branchId ?? null)}
            className="block bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden active:bg-slate-50"
          >
            <div className="relative w-full aspect-4/3 bg-slate-100">
              <Image
                src={item.img}
                alt={item.typeName}
                fill
                sizes="(max-width: 448px) 100vw, 448px"
                className="object-contain"
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
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
        active
          ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
          : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
      }`}
    >
      {label}
    </button>
  );
}
