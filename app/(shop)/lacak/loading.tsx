import { ShopHeader } from "@/components/shop/shop-header";

export default function LacakLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 skeleton-delay">
      <ShopHeader title="Lacak Pesanan" />
      <div className="flex-1 p-6 flex flex-col items-center justify-start pt-10 pb-24">
        <div className="h-20 w-20 rounded-full bg-blue-50 animate-pulse mb-5" />
        <div className="h-6 w-52 rounded bg-slate-200 animate-pulse mb-2" />
        <div className="h-3 w-64 rounded bg-slate-100 animate-pulse mb-1" />
        <div className="h-3 w-48 rounded bg-slate-100 animate-pulse mb-8" />
        <div className="w-full max-w-sm space-y-2">
          <div className="h-3 w-32 rounded bg-slate-200 animate-pulse" />
          <div className="h-12 w-full rounded-md bg-white border border-slate-200 animate-pulse" />
          <div className="h-12 w-full rounded-md bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
