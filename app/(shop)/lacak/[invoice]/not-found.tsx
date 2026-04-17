import { ShopHeader } from "@/components/shop/shop-header";
import { LacakNotFound } from "@/components/lacak/lacak-not-found";

export default function LacakInvoiceNotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <ShopHeader backHref="/lacak" title="Lacak Pesanan" />
      <LacakNotFound query="" />
    </div>
  );
}
