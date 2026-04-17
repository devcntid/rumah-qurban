import { ShopHeader } from "@/components/shop/shop-header";

export default function CatalogLoading() {
  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen skeleton-delay">
      <ShopHeader backHref="/" title="Qurban Antar" />
      <div className="flex-1 p-4 space-y-4 pb-24">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="w-full h-40 bg-slate-200 animate-pulse" />
            <div className="p-4">
              <div className="h-4 w-40 rounded bg-slate-200 animate-pulse mb-2" />
              <div className="h-3 w-24 rounded bg-slate-100 animate-pulse mb-3" />
              <div className="flex items-center justify-between mt-1">
                <div className="h-5 w-28 rounded bg-slate-200 animate-pulse" />
                <div className="h-7 w-16 rounded bg-slate-100 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
