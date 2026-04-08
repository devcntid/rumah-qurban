import type { Metadata } from "next";
import { FAQ_DATA } from "@/components/faq-data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Pertanyaan umum tentang Qurban Antar, Berbagi, dan Kaleng di Rumah Qurban.",
};

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <h1 className="font-bold text-slate-800 text-lg">Pertanyaan Umum</h1>
      </header>
      <div className="p-4 space-y-6">
        {FAQ_DATA.map((cat) => (
          <section key={cat.category}>
            <div className="flex items-center gap-2 mb-3 text-[#1e3a5f] font-bold text-sm">
              {cat.icon}
              {cat.category}
            </div>
            <div className="space-y-2">
              {cat.questions.map((item, idx) => (
                <details
                  key={idx}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                >
                  <summary className="p-4 cursor-pointer text-sm font-semibold text-slate-800 list-none flex justify-between gap-2">
                    <span>{item.q}</span>
                    <span className="text-slate-400 shrink-0">+</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
