import { ShopHeader } from "@/components/shop/shop-header";

export default function AntarCabangLoading() {
  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen skeleton-delay">
      <ShopHeader backHref="/" title="Mau Qurban Dimana?" />
      <div className="p-4 space-y-3 pb-24">
        <div className="h-4 w-56 rounded bg-slate-200 animate-pulse mb-2 mx-1" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-full bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between"
          >
            <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
            <div className="h-5 w-5 rounded bg-slate-100 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
