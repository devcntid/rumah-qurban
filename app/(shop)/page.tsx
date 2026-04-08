import type { Metadata } from "next";
import { HomeContent } from "@/components/shop/home-content";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Pilih Qurban Antar, Berbagi, atau Kaleng. Checkout dan lacak pesanan dengan invoice.",
};

export default function HomePage() {
  return <HomeContent />;
}
