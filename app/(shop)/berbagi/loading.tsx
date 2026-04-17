import { ShopHeader } from "@/components/shop/shop-header";

export default function BerbagiLoading() {
  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen skeleton-delay">
      <ShopHeader backHref="/" title="Qurban Berbagi" />
      <div className="flex-1 p-4 space-y-4 pb-24">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="w-full h-40 bg-slate-200 animate-pulse" />
            <div className="p-4">
              <div className="h-4 w-40 rounded bg-slate-200 animate-pulse mb-2" />
              <div className="h-3 w-32 rounded bg-slate-100 animate-pulse mb-2" />
              <div className="w-full bg-slate-100 rounded-sm h-2 mb-1">
                <div className="bg-slate-200 h-2 rounded-sm w-1/3 animate-pulse" />
              </div>
              <div className="flex items-center justify-between mt-3">
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
