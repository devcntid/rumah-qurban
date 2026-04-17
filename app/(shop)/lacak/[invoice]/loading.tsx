import { ShopHeader } from "@/components/shop/shop-header";

export default function TrackerLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 skeleton-delay">
      <ShopHeader backHref="/lacak" title="Detail Pesanan" />
      <div className="p-4 space-y-4 pb-24">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
            <div>
              <div className="h-4 w-32 rounded bg-slate-200 animate-pulse mb-1" />
              <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
            </div>
          </div>
          <div className="h-px bg-slate-200 w-full my-3" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>

        <div className="flex gap-2 mb-2">
          <div className="h-8 w-20 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-8 w-28 rounded-full bg-slate-100 animate-pulse" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-slate-200 animate-pulse shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="h-3 w-28 rounded bg-slate-200 animate-pulse mb-1" />
                <div className="h-2 w-20 rounded bg-slate-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
