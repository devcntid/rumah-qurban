import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchTrackerByInvoice } from "@/lib/data/tracker";
import { fetchDocumentationByInvoice } from "@/lib/data/documentation";
import { ShopHeader } from "@/components/shop/shop-header";
import { TrackerTabs } from "@/components/tracker/tracker-tabs";

type Props = { params: Promise<{ invoice: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { invoice } = await params;
  const inv = decodeURIComponent(invoice).trim();
  return {
    title: `Lacak — ${inv}`,
    description: `Status pesanan dan dokumentasi untuk invoice ${inv}.`,
    robots: { index: false, follow: false },
  };
}

export default async function LacakInvoicePage({ params }: Props) {
  const { invoice } = await params;
  const inv = decodeURIComponent(invoice).trim();
  if (!inv) notFound();

  const [tracker, documentation] = await Promise.all([
    fetchTrackerByInvoice(inv),
    fetchDocumentationByInvoice(inv),
  ]);

  if (!tracker) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <ShopHeader backHref="/lacak" title="Detail Pesanan" />
      <TrackerTabs tracker={tracker} documentation={documentation} />
    </div>
  );
}
