import type { Metadata } from "next";
import { Truck, Heart, Package, HelpCircle } from "lucide-react";
import { getFaqsCached, type FaqCategory } from "@/lib/data/faq";
import { ShopHeader } from "@/components/shop/shop-header";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Pertanyaan umum tentang Qurban Antar, Berbagi, dan Kaleng di Rumah Qurban.",
};

export const revalidate = 3600;

const PRODUCT_ICON: Record<string, React.ReactNode> = {
  QA: <Truck size={16} />,
  QB: <Heart size={16} />,
  QK: <Package size={16} />,
};

function FaqSection({ cat }: { cat: FaqCategory }) {
  const icon = PRODUCT_ICON[cat.product_code] ?? <HelpCircle size={16} />;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3 text-[#1e3a5f] font-bold text-sm">
        {icon}
        {cat.category}
      </div>
      <div className="space-y-2">
        {cat.items.map((item) => (
          <details
            key={item.id}
            className="bg-white border border-slate-200 rounded-lg overflow-hidden"
          >
            <summary className="p-4 cursor-pointer text-sm font-semibold text-slate-800 list-none flex justify-between gap-2">
              <span>{item.question}</span>
              <span className="text-slate-400 shrink-0">+</span>
            </summary>
            <div
              className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 faq-answer"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </details>
        ))}
      </div>
    </section>
  );
}

export default async function FaqPage() {
  const categories = await getFaqsCached();

  if (categories.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
        <ShopHeader title="Pertanyaan Umum" />
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-slate-500 text-sm text-center">
            Belum ada FAQ yang tersedia saat ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      <ShopHeader title="Pertanyaan Umum" />
      <div className="p-4 space-y-6">
        {categories.map((cat) => (
          <FaqSection key={`${cat.product_code}::${cat.category}`} cat={cat} />
        ))}
      </div>
    </div>
  );
}
