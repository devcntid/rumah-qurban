"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Heart,
  Loader2,
  PlusCircle,
  QrCode,
  Trash2,
  Upload,
  User,
  Building,
  Wallet,
  ChevronRight,
} from "lucide-react";
import type { CatalogProduct, PaymentCategory, PaymentMethodOption } from "@/lib/types/catalog";
import { formatIDR } from "@/lib/format-idr";
import type { ShopTab } from "@/lib/routes";
import { productPath } from "@/lib/routes";
import { ShopHeader } from "@/components/shop/shop-header";
import { AddressMapPicker, type MapSelection } from "@/components/checkout/address-map-picker";

type Props = {
  product: CatalogProduct;
  tab: ShopTab;
  branchId: number | null;
  branchName: string | null;
  paymentCategories: PaymentCategory[];
};

export function CheckoutForm({
  product,
  tab,
  branchId,
  branchName,
  paymentCategories,
}: Props) {
  const router = useRouter();
  const [paymentStep, setPaymentStep] = useState(false);
  const [participants, setParticipants] = useState([
    { name: "", fatherName: "" },
  ]);
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    address: "",
    lat: "",
    lng: "",
  });
  const [isSlaughterRequested, setIsSlaughterRequested] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption | null>(
    null
  );
  const [expandedPaymentCategory, setExpandedPaymentCategory] = useState<
    string | null
  >(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleMapSelect = useCallback(
    (sel: MapSelection) => {
      setCustomerData((prev) => ({
        ...prev,
        address: sel.address,
        lat: sel.lat ? String(sel.lat) : prev.lat,
        lng: sel.lng ? String(sel.lng) : prev.lng,
      }));
    },
    []
  );

  const getMaxParticipants = () => product?.max_participants ?? 1;

  const handleAddParticipant = () => {
    if (participants.length < getMaxParticipants()) {
      setParticipants([...participants, { name: "", fatherName: "" }]);
    }
  };

  const handleRemoveParticipant = (index: number) => {
    const next = [...participants];
    next.splice(index, 1);
    setParticipants(next);
  };

  const handleParticipantChange = (
    index: number,
    field: "name" | "fatherName",
    value: string
  ) => {
    const next = [...participants];
    next[index][field] = value;
    setParticipants(next);
  };

  const calculateTotal = () => {
    const base = product.price;
    let extra = 0;
    if (tab === "ANTAR" && product.shipping_fee != null) {
      extra += product.shipping_fee;
    }
    if (
      tab === "ANTAR" &&
      isSlaughterRequested &&
      product.slaughter_fee != null
    ) {
      extra += product.slaughter_fee;
    }
    return base + extra;
  };

  const submitCheckout = async () => {
    if (!paymentMethod) return;
    const filled = participants.filter((p) => p.name.trim().length > 0);
    if (filled.length === 0) {
      setCheckoutError("Isi minimal satu nama peserta.");
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const latNum = customerData.lat ? Number(customerData.lat) : null;
      const lngNum = customerData.lng ? Number(customerData.lng) : null;
      const body = {
        catalog_offer_id: product.catalog_offer_id,
        customer_name: customerData.name.trim(),
        customer_phone: customerData.phone.trim(),
        delivery_address:
          tab === "ANTAR" ? customerData.address.trim() : null,
        latitude: latNum != null && !Number.isNaN(latNum) ? latNum : null,
        longitude: lngNum != null && !Number.isNaN(lngNum) ? lngNum : null,
        participants: filled.map((p) => ({
          name: p.name.trim(),
          fatherName: p.fatherName.trim(),
        })),
        payment_method_code: paymentMethod.code,
        slaughter_requested:
          tab === "ANTAR" &&
          isSlaughterRequested &&
          product.slaughter_fee != null,
      };
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error ?? "Checkout gagal");
        return;
      }
      const inv = data.invoice_number as string;
      router.push(
        `/checkout/instruksi?invoice=${encodeURIComponent(inv)}`
      );
    } catch {
      setCheckoutError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const backToProduct = productPath(
    product.catalog_offer_id,
    tab,
    branchId
  );

  const categoriesForPayment =
    paymentCategories.length > 0 ? paymentCategories : [];

  if (paymentStep) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-100">
        <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
          <button
            type="button"
            aria-label="Kembali ke checkout"
            onClick={() => setPaymentStep(false)}
            className="text-slate-600 p-1"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-slate-800 text-lg">
            Metode Pembayaran
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
          {categoriesForPayment.length === 0 && (
            <p className="text-sm text-slate-500">Memuat metode pembayaran…</p>
          )}
          {categoriesForPayment.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedPaymentCategory(
                    expandedPaymentCategory === category.id ? null : category.id
                  )
                }
                className="w-full p-4 flex justify-between items-center text-left focus:outline-none"
              >
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    {category.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    {category.subtitle}
                  </p>
                  <p className="text-[10px] text-red-600 mt-1 font-semibold">
                    {category.examples}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className={`text-slate-400 transition-transform ${expandedPaymentCategory === category.id ? "rotate-90" : ""}`}
                />
              </button>

              {expandedPaymentCategory === category.id && (
                <div className="border-t border-slate-100 bg-slate-50">
                  {category.options.map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => {
                        setPaymentMethod(option);
                        setPaymentStep(false);
                      }}
                      className="w-full p-4 border-b border-slate-200 last:border-b-0 flex items-center justify-between text-left active:bg-slate-100 transition-colors"
                    >
                      <span className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                        {option.type === "va" && (
                          <Building size={16} className="text-slate-400" />
                        )}
                        {option.type === "transfer" && (
                          <CreditCard size={16} className="text-slate-400" />
                        )}
                        {option.type === "ewallet" && (
                          <Wallet size={16} className="text-slate-400" />
                        )}
                        {option.type === "qris" && (
                          <QrCode size={16} className="text-slate-400" />
                        )}
                        {option.name}
                      </span>
                      <ChevronRight size={16} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-36">
      <ShopHeader backHref={backToProduct} title="Checkout Pesanan" />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {checkoutError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-md">
            {checkoutError}
          </div>
        )}
        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <h2 className="font-bold text-[#1e3a5f] border-b pb-2 mb-3 flex items-center gap-2">
            <User size={18} /> Data Pemesan
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Nama Lengkap
              </label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:border-[#1e3a5f] outline-none bg-slate-50"
                placeholder="Masukkan nama"
                value={customerData.name}
                onChange={(e) =>
                  setCustomerData({ ...customerData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                No. WhatsApp Aktif
              </label>
              <input
                type="tel"
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:border-[#1e3a5f] outline-none bg-slate-50"
                placeholder="08123xxx"
                value={customerData.phone}
                onChange={(e) =>
                  setCustomerData({ ...customerData, phone: e.target.value })
                }
              />
            </div>
            {tab === "ANTAR" && (
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">
                  Alamat Pengiriman
                </label>
                <AddressMapPicker
                  value={customerData.address}
                  onSelect={handleMapSelect}
                />
              </div>
            )}
          </div>
        </section>

        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="border-b pb-2 mb-3">
            <h2 className="font-bold text-[#1e3a5f] flex items-center gap-2">
              <Heart size={18} /> Data Peserta Qurban
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Atas nama qurban (Maksimal: {getMaxParticipants()})
            </p>
          </div>

          {participants.map((p, index) => (
            <div
              key={index}
              className="mb-4 last:mb-0 relative bg-blue-50/50 p-3 rounded-md border border-blue-100"
            >
              {participants.length > 1 && (
                <button
                  type="button"
                  aria-label="Hapus peserta"
                  onClick={() => handleRemoveParticipant(index)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <h3 className="text-[10px] font-bold text-blue-800 mb-2 uppercase tracking-wider">
                Peserta Ke-{index + 1}
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full border-b border-slate-300 bg-transparent py-1 text-sm outline-none focus:border-[#1e3a5f]"
                  placeholder="Nama yang berqurban"
                  value={p.name}
                  onChange={(e) =>
                    handleParticipantChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="w-full border-b border-slate-300 bg-transparent py-1 text-sm outline-none focus:border-[#1e3a5f]"
                  placeholder="Bin / Binti (Nama Ayah)"
                  value={p.fatherName}
                  onChange={(e) =>
                    handleParticipantChange(index, "fatherName", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          {participants.length < getMaxParticipants() && (
            <button
              type="button"
              onClick={handleAddParticipant}
              className="w-full mt-3 py-2 border border-dashed border-[#1e3a5f] text-[#1e3a5f] font-semibold rounded-md flex items-center justify-center gap-2 active:bg-blue-50 text-sm"
            >
              <PlusCircle size={16} /> Tambah Nama Lainnya
            </button>
          )}
        </section>

        {tab === "ANTAR" && (
          <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <h2 className="font-bold text-[#1e3a5f] border-b pb-2 mb-3">
              Opsi Pengiriman & Jasa
            </h2>
            {product.slaughter_fee != null && (
              <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-red-600 rounded-sm border-gray-300 focus:ring-red-500"
                  checked={isSlaughterRequested}
                  onChange={(e) => setIsSlaughterRequested(e.target.checked)}
                />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    Bantu Sembelih & Potong
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    + {formatIDR(product.slaughter_fee)} / Ekor
                  </p>
                </div>
              </label>
            )}
            <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-100">
              <p className="text-xs text-slate-600">
                <span className="font-semibold">Ongkos Kirim:</span>{" "}
                {product.shipping_fee != null
                  ? `${formatIDR(product.shipping_fee)} (Area ${branchName ?? ""})`
                  : "Tidak berlaku / sudah termasuk"}
              </p>
            </div>
          </section>
        )}

        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <h2 className="font-bold text-[#1e3a5f] border-b pb-2 mb-3 flex items-center gap-2">
            <CreditCard size={18} /> Pilih Metode Pembayaran
          </h2>
          <button
            type="button"
            onClick={() => setPaymentStep(true)}
            className="w-full border border-slate-300 rounded-md p-3.5 flex justify-between items-center bg-slate-50 active:bg-slate-100 transition-colors"
          >
            {paymentMethod ? (
              <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                {paymentMethod.name}
              </span>
            ) : (
              <span className="text-slate-500 text-sm font-semibold">
                Pilih Pembayaran...
              </span>
            )}
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-20">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold text-slate-600">Total Tagihan</p>
          <p className="text-xl font-bold text-red-700">
            {formatIDR(calculateTotal())}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (paymentMethod && !checkoutLoading) void submitCheckout();
          }}
          disabled={!paymentMethod || checkoutLoading}
          className={`w-full py-3 rounded-md font-bold transition-colors text-center shadow-md flex items-center justify-center gap-2 ${
            paymentMethod && !checkoutLoading
              ? "bg-[#1e3a5f] text-white active:bg-blue-900"
              : "bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none"
          }`}
        >
          {checkoutLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Memproses Pesanan…</span>
            </>
          ) : paymentMethod ? (
            "Bayar"
          ) : (
            "Pilih Pembayaran"
          )}
        </button>
      </div>
    </div>
  );
}
