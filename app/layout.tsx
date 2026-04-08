import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const SITE_NAME = "Rumah Qurban";

/** Ringkasan untuk SEO, Open Graph, dan pratinjau sosial (Bahasa Indonesia). */
export const SITE_OG_DESCRIPTION =
  "Platform Qurban Terpercaya — katalog resmi, checkout aman, lacak pesanan dengan nomor invoice, dan dokumentasi penyembelihan untuk pelanggan B2C.";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: `${SITE_NAME} — Qurban Antar, Berbagi & Kaleng`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_OG_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — Qurban Antar, Berbagi & Kaleng`,
    description: SITE_OG_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "id_ID",
    type: "website",
    url: "/",
    images: [
      {
        url: "/logo-agro.png",
        width: 426,
        height: 96,
        alt: SITE_NAME,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Qurban Antar, Berbagi & Kaleng`,
    description: SITE_OG_DESCRIPTION,
    images: ["/logo-agro.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${sourceSans.variable} h-full antialiased`}>
      <body className={`min-h-full flex flex-col font-sans ${sourceSans.className}`}>
        {children}
      </body>
    </html>
  );
}
