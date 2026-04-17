import { ShopHeader } from "@/components/shop/shop-header";

export default function ProdukLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-28 skeleton-delay">
      <ShopHeader backHref="/" title="Detail Produk" />
      <div className="w-full h-56 bg-slate-200 animate-pulse" />
      <div className="p-4 space-y-4">
        <div className="h-6 w-48 rounded bg-slate-200 animate-pulse" />
        <div className="h-4 w-32 rounded bg-slate-100 animate-pulse" />
        <div className="h-7 w-36 rounded bg-slate-200 animate-pulse" />
        <div className="space-y-2 mt-4">
          <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-slate-100 animate-pulse" />
          <div className="h-3 w-4/6 rounded bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
