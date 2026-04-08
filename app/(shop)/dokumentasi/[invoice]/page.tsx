import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchDocumentationByInvoice } from "@/lib/data/documentation";
import { DocumentationDetail } from "@/components/dokumentasi/documentation-detail";

type Props = { params: Promise<{ invoice: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { invoice } = await params;
  const inv = decodeURIComponent(invoice).trim();
  return {
    title: `Dokumentasi — ${inv}`,
    description: `Dokumentasi qurban untuk invoice ${inv}.`,
    robots: { index: false, follow: false },
  };
}

export default async function DokumentasiInvoicePage({ params }: Props) {
  const { invoice } = await params;
  const inv = decodeURIComponent(invoice).trim();
  if (!inv) notFound();

  const data = await fetchDocumentationByInvoice(inv);
  if (!data) notFound();

  return <DocumentationDetail data={data} />;
}
