import { ShopHeader } from "@/components/shop/shop-header";

export default function HomeLoading() {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-20 skeleton-delay">
      <ShopHeader />

      <div className="relative bg-slate-900 p-6 pb-12 pt-10">
        <div className="h-6 w-24 rounded bg-slate-700 animate-pulse" />
        <div className="h-8 w-48 rounded bg-slate-700 animate-pulse mt-4" />
        <div className="h-4 w-64 rounded bg-slate-700 animate-pulse mt-2" />
      </div>

      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-5 border border-slate-200">
          <div className="h-5 w-48 rounded bg-slate-200 animate-pulse mx-auto mb-4" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center p-2">
                <div className="h-12 w-12 rounded-full bg-slate-200 animate-pulse mb-2" />
                <div className="h-3 w-14 rounded bg-slate-200 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 px-5">
        <div className="h-5 w-40 rounded bg-slate-200 animate-pulse mx-auto mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 text-center shadow-sm">
              <div className="h-7 w-20 rounded bg-slate-200 animate-pulse mx-auto" />
              <div className="h-3 w-16 rounded bg-slate-100 animate-pulse mx-auto mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
