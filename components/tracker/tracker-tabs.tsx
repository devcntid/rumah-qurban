"use client";

import { useState } from "react";
import { Truck, FileText } from "lucide-react";
import { TrackerDetail } from "@/components/tracker/tracker-detail";
import { DocumentationDetail } from "@/components/dokumentasi/documentation-detail";
import type { TrackerPayload } from "@/lib/data/tracker";
import type { DocumentationPayload } from "@/lib/data/documentation";

type Tab = "lacak" | "dokumentasi";

export function TrackerTabs({
  tracker,
  documentation,
}: {
  tracker: TrackerPayload;
  documentation: DocumentationPayload | null;
}) {
  const [active, setActive] = useState<Tab>("lacak");

  return (
    <div className="flex flex-col flex-1">
      <div className="bg-white border-b border-slate-200 px-4 sticky top-[53px] z-10">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActive("lacak")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold border-b-2 transition-colors ${
              active === "lacak"
                ? "border-[#1e3a5f] text-[#1e3a5f]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Truck size={16} />
            Lacak
          </button>
          <button
            type="button"
            onClick={() => setActive("dokumentasi")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold border-b-2 transition-colors ${
              active === "dokumentasi"
                ? "border-[#1e3a5f] text-[#1e3a5f]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <FileText size={16} />
            Dokumentasi
          </button>
        </div>
      </div>

      {active === "lacak" ? (
        <TrackerDetail data={tracker} />
      ) : documentation ? (
        <DocumentationDetail data={documentation} />
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-sm text-slate-500 text-center">
            Belum ada dokumentasi untuk pesanan ini.
          </p>
        </div>
      )}
    </div>
  );
}
