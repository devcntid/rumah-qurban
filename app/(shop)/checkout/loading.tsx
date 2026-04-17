import { ShopHeader } from "@/components/shop/shop-header";

export default function CheckoutLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-36 skeleton-delay">
      <ShopHeader backHref="/" title="Checkout Pesanan" />
      <div className="flex-1 p-4 space-y-4">
        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="h-5 w-32 rounded bg-slate-200 animate-pulse mb-4" />
          <div className="space-y-3">
            <div className="h-10 w-full rounded bg-slate-100 animate-pulse" />
            <div className="h-10 w-full rounded bg-slate-100 animate-pulse" />
          </div>
        </section>
        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="h-5 w-40 rounded bg-slate-200 animate-pulse mb-4" />
          <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100">
            <div className="h-3 w-20 rounded bg-slate-200 animate-pulse mb-2" />
            <div className="h-8 w-full rounded bg-slate-100 animate-pulse mb-2" />
            <div className="h-8 w-full rounded bg-slate-100 animate-pulse" />
          </div>
        </section>
        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="h-5 w-44 rounded bg-slate-200 animate-pulse mb-4" />
          <div className="h-12 w-full rounded bg-slate-100 animate-pulse" />
        </section>
      </div>
    </div>
  );
}
