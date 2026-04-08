import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchTrackerByInvoice } from "@/lib/data/tracker";
import { TrackerDetail } from "@/components/tracker/tracker-detail";

type Props = { params: Promise<{ invoice: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { invoice } = await params;
  const inv = decodeURIComponent(invoice).trim();
  return {
    title: `Lacak — ${inv}`,
    description: `Status pesanan untuk invoice ${inv}.`,
    robots: { index: false, follow: false },
  };
}

export default async function LacakInvoicePage({ params }: Props) {
  const { invoice } = await params;
  const inv = decodeURIComponent(invoice).trim();
  if (!inv) notFound();

  const data = await fetchTrackerByInvoice(inv);
  if (!data) notFound();

  return <TrackerDetail data={data} />;
}
