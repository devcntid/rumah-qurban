import { ShopHeader } from "@/components/shop/shop-header";

export default function FaqLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24 skeleton-delay">
      <ShopHeader title="Pertanyaan Umum" />
      <div className="p-4 space-y-6">
        {[1, 2, 3].map((section) => (
          <section key={section}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 w-4 rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-28 rounded bg-slate-200 animate-pulse" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white border border-slate-200 rounded-lg p-4"
                >
                  <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
