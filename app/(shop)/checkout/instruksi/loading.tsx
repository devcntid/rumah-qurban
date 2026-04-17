import { ShopHeader } from "@/components/shop/shop-header";

export default function InstruksiLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-28 skeleton-delay">
      <ShopHeader backHref="/" title="Instruksi Pembayaran" />
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 text-center">
          <div className="h-3 w-36 rounded bg-slate-200 animate-pulse mx-auto mb-2" />
          <div className="h-7 w-44 rounded bg-slate-200 animate-pulse mx-auto mb-3" />
          <div className="h-6 w-40 rounded bg-orange-100 animate-pulse mx-auto mb-2" />
          <div className="h-3 w-52 rounded bg-slate-100 animate-pulse mx-auto" />
        </div>
        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="h-5 w-36 rounded bg-slate-200 animate-pulse mb-4" />
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <div className="h-3 w-20 rounded bg-blue-100 animate-pulse mb-3" />
            <div className="h-5 w-44 rounded bg-blue-100 animate-pulse mb-2" />
            <div className="h-3 w-32 rounded bg-blue-100 animate-pulse" />
          </div>
        </section>
      </div>
    </div>
  );
}
