"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapPin,
  ChevronRight,
  Search,
  Heart,
  Package,
  Truck,
  ArrowLeft,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Phone,
  Home,
  FileText,
  ShieldCheck,
  PlayCircle,
  Info,
  Download,
  CheckCircle,
  Camera,
  User,
  Map,
  CreditCard,
  Upload,
  QrCode,
  Wallet,
  ChevronDown,
  ChevronUp,
  Building,
  HelpCircle,
} from "lucide-react";
import type {
  BranchRow,
  CatalogProduct,
  PaymentCategory,
  PaymentMethodOption,
} from "@/lib/types/catalog";
import { buildPaymentCategories } from "@/lib/payment-ui";
import { FAQ_DATA } from "@/components/faq-data";

type View =
  | "home"
  | "branch_selection"
  | "catalog"
  | "product_detail"
  | "checkout"
  | "payment_selection"
  | "payment_instruction"
  | "success"
  | "tracker"
  | "dokumentasi"
  | "faq";

type ActiveTab = "ANTAR" | "BERBAGI" | "KALENG";

type TrackerApi = {
  invoice: string;
  customerName: string;
  orderStatus: string;
  createdAt: string;
  eartagId: string | null;
  trackings: {
    milestone: string;
    description: string | null;
    logged_at: string;
    media_url: string | null;
  }[];
};

type DocApi = {
  invoice: string;
  customerName: string;
  orderStatus: string;
  participantName: string;
  fatherName: string | null;
  eartagId: string | null;
  certificateAvailable: boolean;
  photos: string[];
  videos: { url: string; label: string }[];
};

export default function RumahQurbanApp() {
  const [view, setView] = useState<View>("home");
  const [selectedBranch, setSelectedBranch] = useState<BranchRow | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("ANTAR");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(
    null
  );
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

  const [showMap, setShowMap] = useState(false);
  const [mapSearchInput, setMapSearchInput] = useState("");
  const [isMapSearched, setIsMapSearched] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodOption | null>(null);
  const [expandedPaymentCategory, setExpandedPaymentCategory] = useState<
    string | null
  >(null);
  const [vaAccordion, setVaAccordion] = useState("atm");

  const [trackerInput, setTrackerInput] = useState("");
  const [isTrackerSearched, setIsTrackerSearched] = useState(false);
  const [dokumenInput, setDokumenInput] = useState("");
  const [isDokumenSearched, setIsDokumenSearched] = useState(false);
  const [faqActiveTab, setFaqActiveTab] = useState("Qurban Berbagi");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [catalogItems, setCatalogItems] = useState<CatalogProduct[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [paymentCategories, setPaymentCategories] = useState<
    PaymentCategory[]
  >([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [trackerData, setTrackerData] = useState<TrackerApi | null>(null);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [trackerErr, setTrackerErr] = useState<string | null>(null);
  const [docData, setDocData] = useState<DocApi | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [docErr, setDocErr] = useState<string | null>(null);

  const osmMapIframe = useMemo(
    () => (
      <iframe
        title="OSM Map"
        width="100%"
        height="180"
        frameBorder={0}
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src="https://www.openstreetmap.org/export/embed.html?bbox=106.0,-8.0,109.0,-6.0&layer=mapnik"
      />
    ),
    []
  );

  const formatIDR = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const getMaxParticipants = (p: CatalogProduct | null) =>
    p?.max_participants ?? 1;

  const handleAddParticipant = () => {
    if (participants.length < getMaxParticipants(selectedProduct)) {
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
    const base = selectedProduct?.price ?? 0;
    let extra = 0;
    if (activeTab === "ANTAR" && selectedProduct?.shipping_fee != null) {
      extra += selectedProduct.shipping_fee;
    }
    if (
      activeTab === "ANTAR" &&
      isSlaughterRequested &&
      selectedProduct?.slaughter_fee != null
    ) {
      extra += selectedProduct.slaughter_fee;
    }
    return base + extra;
  };

  const loadBranches = useCallback(async () => {
    setBranchesLoading(true);
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      setBranches(
        (data.branches as { id: string; name: string }[]).map((b) => ({
          id: Number(b.id),
          name: b.name,
        }))
      );
    } catch {
      setBranches([]);
    } finally {
      setBranchesLoading(false);
    }
  }, []);

  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      let url = `/api/catalog?tab=${encodeURIComponent(activeTab)}`;
      if (activeTab === "ANTAR" && selectedBranch) {
        url += `&branchId=${selectedBranch.id}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setCatalogError(data.error ?? "Gagal memuat katalog");
        setCatalogItems([]);
        return;
      }
      setCatalogItems(data.items as CatalogProduct[]);
    } catch {
      setCatalogError("Koneksi gagal. Coba lagi.");
      setCatalogItems([]);
    } finally {
      setCatalogLoading(false);
    }
  }, [activeTab, selectedBranch]);

  const loadPaymentMethods = useCallback(async () => {
    try {
      const res = await fetch("/api/payment-methods");
      const data = await res.json();
      const methods = data.methods as {
        code: string;
        name: string;
        category: string;
      }[];
      setPaymentCategories(buildPaymentCategories(methods));
    } catch {
      setPaymentCategories([]);
    }
  }, []);

  useEffect(() => {
    if (view !== "branch_selection") return;
    void loadBranches();
  }, [view, loadBranches]);

  useEffect(() => {
    if (view !== "catalog") return;
    if (activeTab === "ANTAR" && !selectedBranch) return;
    void loadCatalog();
  }, [view, activeTab, selectedBranch, loadCatalog]);

  useEffect(() => {
    if (view !== "payment_selection" && view !== "checkout") return;
    if (paymentCategories.length) return;
    void loadPaymentMethods();
  }, [view, paymentCategories.length, loadPaymentMethods]);

  const submitCheckout = async () => {
    if (!selectedProduct || !paymentMethod) return;
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
        catalog_offer_id: selectedProduct.catalog_offer_id,
        customer_name: customerData.name.trim(),
        customer_phone: customerData.phone.trim(),
        delivery_address:
          activeTab === "ANTAR" ? customerData.address.trim() : null,
        latitude: latNum != null && !Number.isNaN(latNum) ? latNum : null,
        longitude: lngNum != null && !Number.isNaN(lngNum) ? lngNum : null,
        participants: filled.map((p) => ({
          name: p.name.trim(),
          fatherName: p.fatherName.trim(),
        })),
        payment_method_code: paymentMethod.code,
        slaughter_requested:
          activeTab === "ANTAR" &&
          isSlaughterRequested &&
          selectedProduct.slaughter_fee != null,
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
      setInvoiceNumber(data.invoice_number as string);
      setView("payment_instruction");
    } catch {
      setCheckoutError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const searchTracker = async () => {
    const inv = trackerInput.trim();
    if (!inv) return;
    setTrackerLoading(true);
    setTrackerErr(null);
    try {
      const res = await fetch(
        `/api/tracker?invoice=${encodeURIComponent(inv)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setTrackerErr(data.error ?? "Tidak ditemukan");
        setTrackerData(null);
        return;
      }
      setTrackerData(data as TrackerApi);
      setIsTrackerSearched(true);
    } catch {
      setTrackerErr("Koneksi gagal");
      setTrackerData(null);
    } finally {
      setTrackerLoading(false);
    }
  };

  const searchDoc = async () => {
    const inv = dokumenInput.trim();
    if (!inv) return;
    setDocLoading(true);
    setDocErr(null);
    try {
      const res = await fetch(
        `/api/documentation?invoice=${encodeURIComponent(inv)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setDocErr(data.error ?? "Tidak ditemukan");
        setDocData(null);
        return;
      }
      setDocData(data as DocApi);
      setIsDokumenSearched(true);
    } catch {
      setDocErr("Koneksi gagal");
      setDocData(null);
    } finally {
      setDocLoading(false);
    }
  };

  const HomeView = () => (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-20">
      <header className="bg-white px-5 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <Heart className="text-red-700 fill-red-700" size={24} />
          <span className="font-bold text-xl text-slate-800 tracking-tight">
            rumah<span className="text-red-700">qurban</span>
          </span>
        </div>
        <button
          type="button"
          aria-label="Hubungi layanan pelanggan"
          className="bg-green-50 text-green-700 py-1.5 rounded-md flex items-center gap-1 text-xs font-bold px-3 border border-green-200"
        >
          <Phone size={14} /> CS
        </button>
      </header>

      <div className="relative bg-slate-900 text-white p-6 pb-12 pt-10">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img
            src="https://images.pexels.com/photos/840111/pexels-photo-840111.jpeg?auto=compress&cs=tinysrgb&w=800"
            className="w-full h-full object-cover"
            alt="Qurban Farm"
          />
        </div>
        <div className="relative z-10">
          <span className="bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
            Qurban 2026
          </span>
          <h1 className="text-3xl font-bold mt-4 leading-tight">
            Kembalikan Manfaat,
            <br />
            Qurban ke Desa
          </h1>
          <p className="mt-2 text-slate-300 text-sm line-clamp-2">
            Lembaga penyedia layanan qurban terpercaya dengan berbagai pilihan
            hewan dan jangkauan luas.
          </p>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-5 border border-slate-200">
          <div className="text-center mb-4">
            <h2 className="font-extrabold text-slate-800 text-lg">
              Mulai Pesan Qurban Anda
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium bg-slate-50 py-1 px-2 rounded inline-block">
              Pilih kategori di bawah untuk melihat katalog
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab("ANTAR");
                setView("branch_selection");
              }}
              className="flex flex-col items-center p-2 rounded-xl active:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 group"
            >
              <div className="bg-blue-50 text-blue-900 p-3.5 rounded-full mb-2 group-active:scale-95 transition-transform">
                <Truck size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                Qurban
                <br />
                Antar
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("BERBAGI");
                setSelectedBranch(null);
                setView("catalog");
              }}
              className="flex flex-col items-center p-2 rounded-xl active:bg-red-50 transition-colors border border-transparent hover:border-red-100 group"
            >
              <div className="bg-red-50 text-red-700 p-3.5 rounded-full mb-2 group-active:scale-95 transition-transform">
                <Heart size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                Qurban
                <br />
                Berbagi
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("KALENG");
                setSelectedBranch(null);
                setView("catalog");
              }}
              className="flex flex-col items-center p-2 rounded-xl active:bg-amber-50 transition-colors border border-transparent hover:border-amber-100 group"
            >
              <div className="bg-amber-50 text-amber-700 p-3.5 rounded-full mb-2 group-active:scale-95 transition-transform">
                <Package size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                Qurban
                <br />
                Kaleng
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 px-5">
        <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">
          Telah Dipercaya Oleh
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#1e3a5f]">35.898+</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Pequrban</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center shadow-sm">
            <p className="text-2xl font-bold text-[#1e3a5f]">275.810+</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Penerima Manfaat
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white py-6 px-5 border-y border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-5 text-center">
          Kebermanfaatan Rumah Qurban
        </h2>
        <div className="grid grid-cols-2 gap-y-6">
          <div className="flex flex-col items-center text-center">
            <ShieldCheck size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">
              Sesuai Syariat
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <FileText size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">
              Sertifikat Resmi
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <PlayCircle size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">
              Video Dokumentasi
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <MapPin size={28} className="text-[#1e3a5f] mb-2" />
            <span className="text-xs font-semibold text-slate-600">
              Tepat Sasaran
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const BranchSelectionView = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button
          type="button"
          aria-label="Kembali ke beranda"
          onClick={() => setView("home")}
          className="text-slate-600 p-1"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-slate-800 text-lg">Mau Qurban Dimana?</h1>
      </header>

      <div className="p-4 space-y-3 overflow-y-auto pb-20">
        <p className="text-sm text-slate-500 mb-2 px-1">
          Pilih cabang terdekat untuk melihat stok dan harga Qurban Antar di
          wilayah Anda.
        </p>
        {branchesLoading && (
          <p className="text-sm text-slate-500 px-1">Memuat cabang…</p>
        )}
        {!branchesLoading &&
          branches.map((branch) => (
            <button
              type="button"
              key={branch.id}
              onClick={() => {
                setSelectedBranch(branch);
                setView("catalog");
              }}
              className="w-full bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between active:scale-95 transition-transform"
            >
              <span className="font-semibold text-slate-800">{branch.name}</span>
              <ChevronRight className="text-slate-400" />
            </button>
          ))}
      </div>
    </div>
  );

  const CatalogView = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-[#1e3a5f] text-white px-4 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Kembali ke beranda"
            onClick={() => setView("home")}
            className="p-1"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-tight">
              {activeTab === "ANTAR"
                ? "Qurban Antar"
                : activeTab === "BERBAGI"
                  ? "Qurban Berbagi"
                  : "Qurban Kaleng"}
            </h1>
            {activeTab === "ANTAR" && selectedBranch && (
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin size={10} /> {selectedBranch.name}
              </p>
            )}
          </div>
        </div>
        <Search size={20} className="text-slate-200" />
      </header>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        {catalogLoading && (
          <p className="text-center text-sm text-slate-500">Memuat katalog…</p>
        )}
        {catalogError && (
          <p className="text-center text-sm text-red-600">{catalogError}</p>
        )}
        {!catalogLoading &&
          !catalogError &&
          catalogItems.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSelectedProduct(item);
                  setView("product_detail");
                }
              }}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden active:bg-slate-50"
              onClick={() => {
                setSelectedProduct(item);
                setView("product_detail");
              }}
            >
              <img
                src={item.img}
                alt={item.typeName}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-slate-800 mb-1">{item.typeName}</h3>

                {activeTab === "BERBAGI" ? (
                  <div className="mb-3">
                    <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                      <MapPin size={14} /> {item.location}
                    </p>
                    <p className="text-xs text-slate-500">
                      Progress kolektif akan diinformasikan lewat admin.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mb-3">{item.weight}</p>
                )}

                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-red-700 text-lg">
                    {formatIDR(item.price)}
                  </span>
                  <span className="text-xs text-[#1e3a5f] font-bold border border-[#1e3a5f] px-3 py-1.5 rounded-sm">
                    Detail
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const ProductDetailView = () => (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <header className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between">
        <button
          type="button"
          aria-label="Kembali ke katalog"
          onClick={() => setView("catalog")}
          className="bg-black/40 backdrop-blur-md text-white p-2 rounded-md"
        >
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-28">
        <img
          src={selectedProduct?.img}
          alt="Product"
          className="w-full h-72 object-cover"
        />

        <div className="bg-white p-5 rounded-t-xl -mt-4 relative z-10 shadow-sm border-t border-slate-200">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-slate-800">
              {selectedProduct?.typeName}
            </h1>
          </div>
          <p className="text-2xl font-bold text-red-700 mb-4">
            {formatIDR(selectedProduct?.price ?? 0)}
          </p>

          {activeTab === "BERBAGI" && selectedProduct?.location && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-md mb-4">
              <p className="text-sm text-slate-600 flex items-center gap-1 mb-3 font-semibold">
                <MapPin size={16} /> Lokasi: {selectedProduct.location}
              </p>
            </div>
          )}

          <div className="border-t border-slate-100 pt-4 mb-4">
            <h3 className="font-bold text-slate-800 mb-2">Deskripsi</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {selectedProduct?.desc}
            </p>
            {activeTab !== "BERBAGI" && (
              <p className="text-slate-600 text-sm mt-2">
                <span className="font-semibold text-slate-800">
                  Spesifikasi/Berat:
                </span>{" "}
                {selectedProduct?.weight}
              </p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3 border border-blue-100">
            <Info className="text-blue-700 shrink-0 mt-0.5" size={20} />
            <p className="text-xs text-blue-800">
              Harga sudah termasuk biaya perawatan. Sertifikat dan video
              penyembelihan akan dikirim otomatis ke WhatsApp Anda.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 px-5 shadow-sm flex gap-3">
        <button
          type="button"
          onClick={() => {
            setParticipants([{ name: "", fatherName: "" }]);
            setIsSlaughterRequested(false);
            setPaymentMethod(null);
            setView("checkout");
          }}
          className="w-full bg-red-700 text-white py-3 rounded-md font-bold active:bg-red-800 transition-colors text-lg"
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );

  const categoriesForPayment =
    paymentCategories.length > 0
      ? paymentCategories
      : ([] as PaymentCategory[]);

  const PaymentSelectionView = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
        <button
          type="button"
          aria-label="Kembali ke checkout"
          onClick={() => setView("checkout")}
          className="text-slate-600 p-1"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-slate-800 text-lg">Metode Pembayaran</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 bg-slate-100">
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
                      setView("checkout");
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

  const CheckoutView = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button
          type="button"
          aria-label="Kembali ke detail produk"
          onClick={() => setView("product_detail")}
          className="text-slate-600 p-1"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-slate-800 text-lg">Checkout Pesanan</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
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
            {activeTab === "ANTAR" && (
              <div className="relative">
                <label className="text-xs font-semibold text-slate-500 mb-1 block">
                  Alamat Pengiriman
                </label>
                <textarea
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:border-[#1e3a5f] outline-none h-20 bg-slate-50"
                  placeholder="Alamat lengkap tujuan kirim"
                  value={customerData.address}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, address: e.target.value })
                  }
                />

                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="text-[#1e3a5f] font-semibold text-xs flex items-center mt-2 cursor-pointer hover:underline"
                >
                  <Map size={14} className="mr-1" />{" "}
                  {showMap ? "Tutup Peta" : "Pilih Titik di Peta untuk Presisi (Opsional)"}
                </button>
                {showMap && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                        />
                        <input
                          id="mapSearchInput"
                          type="text"
                          placeholder="Cari jalan atau area..."
                          className="w-full border border-slate-300 rounded-md py-2 pl-8 pr-2 text-xs focus:border-[#1e3a5f] outline-none bg-white"
                          value={mapSearchInput}
                          onChange={(e) => setMapSearchInput(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMapSearched(true);
                        }}
                        className="bg-[#1e3a5f] text-white px-3 py-2 rounded-md text-xs font-bold active:bg-blue-900 transition-colors"
                      >
                        Cari
                      </button>
                    </div>

                    <div className="rounded-md overflow-hidden border border-slate-300 shadow-inner relative bg-slate-200">
                      {osmMapIframe}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-4">
                        <MapPin
                          size={32}
                          className={`text-red-600 drop-shadow-md transition-transform ${isMapSearched ? "animate-bounce" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-200">
                      <span>
                        Lat:{" "}
                        <b className="text-slate-700">
                          {isMapSearched ? "-6.89123" : customerData.lat || "-"}
                        </b>
                      </span>
                      <span>
                        Long:{" "}
                        <b className="text-slate-700">
                          {isMapSearched ? "107.60351" : customerData.lng || "-"}
                        </b>
                      </span>
                    </div>

                    <button
                      type="button"
                      className="w-full mt-3 bg-green-600 text-white py-2.5 text-xs font-bold rounded-md active:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      onClick={() => {
                        if (isMapSearched) {
                          setCustomerData({
                            ...customerData,
                            lat: "-6.89123",
                            lng: "107.60351",
                          });
                        }
                        setShowMap(false);
                      }}
                    >
                      <CheckCircle2 size={16} /> Simpan Titik Lokasi
                    </button>
                  </div>
                )}
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
              Atas nama qurban (Maksimal:{" "}
              {getMaxParticipants(selectedProduct)})
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

          {participants.length < getMaxParticipants(selectedProduct) && (
            <button
              type="button"
              onClick={handleAddParticipant}
              className="w-full mt-3 py-2 border border-dashed border-[#1e3a5f] text-[#1e3a5f] font-semibold rounded-md flex items-center justify-center gap-2 active:bg-blue-50 text-sm"
            >
              <PlusCircle size={16} /> Tambah Nama Lainnya
            </button>
          )}
        </section>

        {activeTab === "ANTAR" && (
          <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <h2 className="font-bold text-[#1e3a5f] border-b pb-2 mb-3">
              Opsi Pengiriman & Jasa
            </h2>
            {selectedProduct?.slaughter_fee != null && (
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
                    + {formatIDR(selectedProduct.slaughter_fee)} / Ekor
                  </p>
                </div>
              </label>
            )}
            <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-100">
              <p className="text-xs text-slate-600">
                <span className="font-semibold">Ongkos Kirim:</span>{" "}
                {selectedProduct?.shipping_fee != null
                  ? `${formatIDR(selectedProduct.shipping_fee)} (Area ${selectedBranch?.name ?? ""})`
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
            onClick={() => setView("payment_selection")}
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

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold text-slate-600">Total Tagihan</p>
          <p className="text-xl font-bold text-red-700">
            {formatIDR(calculateTotal())}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (paymentMethod) void submitCheckout();
          }}
          disabled={!paymentMethod || checkoutLoading}
          className={`w-full py-3 rounded-md font-bold transition-colors text-center shadow-md ${
            paymentMethod && !checkoutLoading
              ? "bg-[#1e3a5f] text-white active:bg-blue-900"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {checkoutLoading ? "Memproses…" : paymentMethod ? "Bayar" : "Pilih Pembayaran"}
        </button>
      </div>
    </div>
  );

  const PaymentInstructionView = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
        <button
          type="button"
          aria-label="Kembali ke checkout"
          onClick={() => setView("checkout")}
          className="text-slate-600 p-1"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-slate-800 text-lg">Instruksi Pembayaran</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 text-center">
          <p className="text-xs font-semibold text-slate-500 mb-1">
            Selesaikan Pembayaran
          </p>
          <p className="text-2xl font-bold text-red-700 mb-3">
            {formatIDR(calculateTotal())}
          </p>
          <div className="inline-block border border-orange-200 bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
            Batas Waktu: 23:59:59
          </div>
          <p className="text-xs text-slate-500 mt-2">
            No. Pesanan:{" "}
            <b>{invoiceNumber ?? "—"}</b>
          </p>
        </div>

        <section className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <span className="text-sm font-bold text-slate-800">
              {paymentMethod?.name}
            </span>
            {paymentMethod?.type === "va" && (
              <Building size={20} className="text-slate-400" />
            )}
            {paymentMethod?.type === "transfer" && (
              <CreditCard size={20} className="text-slate-400" />
            )}
            {paymentMethod?.type === "ewallet" && (
              <Wallet size={20} className="text-slate-400" />
            )}
            {paymentMethod?.type === "qris" && (
              <QrCode size={20} className="text-slate-400" />
            )}
          </div>

          {paymentMethod?.type === "transfer" && (
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">
                Silakan transfer ke rekening (cek WhatsApp / instruksi resmi):
              </p>
              <p className="text-xs text-slate-500 mb-4">
                a.n Rumah Qurban Indonesia
              </p>
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#1e3a5f]/40 rounded-md p-4 cursor-pointer hover:bg-blue-50 transition-colors bg-white">
                <Upload size={20} className="text-[#1e3a5f] mb-2" />
                <span className="text-sm text-slate-700 font-semibold">
                  Upload Bukti Transfer
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Format: JPG, PNG, atau PDF
                </span>
                <input type="file" className="hidden" accept="image/*,.pdf" />
              </label>
            </div>
          )}

          {paymentMethod?.type === "va" && (
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">
                Nomor Virtual Account akan dikirim setelah gateway aktif. Untuk
                sementara selesaikan sesuai channel yang dipilih.
              </p>
              <div className="flex items-center justify-between mb-4 mt-1">
                <p className="font-bold text-slate-800 tracking-widest text-xl">
                  — — — —
                </p>
              </div>
              <p className="text-xs font-bold text-slate-700 mb-2">
                Panduan Pembayaran
              </p>
              <div className="space-y-2">
                <div className="border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setVaAccordion(vaAccordion === "atm" ? "" : "atm")
                    }
                    className="w-full text-left p-3 text-sm font-semibold flex justify-between items-center text-slate-700"
                  >
                    Via ATM{" "}
                    {vaAccordion === "atm" ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  {vaAccordion === "atm" && (
                    <div className="p-3 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
                      Ikuti menu VA di ATM bank Anda, lalu masukkan nomor VA
                      yang valid.
                    </div>
                  )}
                </div>
                <div className="border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setVaAccordion(vaAccordion === "mbanking" ? "" : "mbanking")
                    }
                    className="w-full text-left p-3 text-sm font-semibold flex justify-between items-center text-slate-700"
                  >
                    Via Mobile Banking{" "}
                    {vaAccordion === "mbanking" ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  {vaAccordion === "mbanking" && (
                    <div className="p-3 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
                      Buka aplikasi m-banking, pilih bayar VA, lalu konfirmasi
                      nominal.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {paymentMethod?.type === "ewallet" && (
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-center">
              <Wallet size={32} className="text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-700 font-semibold mb-3">
                Selesaikan di aplikasi e-wallet
              </p>
              <p className="text-[10px] text-slate-500 mt-4">
                Pastikan saldo Anda cukup untuk melakukan pembayaran.
              </p>
            </div>
          )}

          {paymentMethod?.type === "qris" && (
            <div className="flex flex-col items-center bg-slate-50 p-4 rounded-md border border-slate-200">
              <p className="text-sm font-bold text-slate-800 mb-2">
                Scan QRIS Berikut
              </p>
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 mb-3">
                <QrCode size={120} className="text-slate-800" />
              </div>
              <p className="text-xs text-slate-600 text-center px-4">
                Gunakan aplikasi M-Banking atau E-Wallet pendukung QRIS untuk
                menscan kode ini.
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <button
          type="button"
          onClick={() => setView("success")}
          className="w-full py-3 rounded-md font-bold transition-colors text-center shadow-md bg-green-600 text-white active:bg-green-700"
        >
          Saya Sudah Bayar
        </button>
      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6 text-center">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 w-full">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
        </div>
        <h1 className="text-lg font-bold text-slate-800 mb-2">
          Pesanan Berhasil Diproses!
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Terima kasih {customerData.name || "Kak"}. Kami akan memverifikasi
          pembayaran Anda segera.
        </p>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-md mb-6 text-left">
          <p className="text-xs font-semibold text-slate-500 mb-1">
            Total Transaksi
          </p>
          <p className="font-bold text-red-700 text-xl mb-3">
            {formatIDR(calculateTotal())}
          </p>
          <div className="h-px bg-slate-200 w-full mb-3" />
          <p className="text-xs font-semibold text-slate-500 mb-1">
            No. Invoice Pesanan
          </p>
          <p className="font-bold text-slate-800 text-lg tracking-wider">
            {invoiceNumber ?? "—"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (invoiceNumber) setTrackerInput(invoiceNumber);
            setIsTrackerSearched(false);
            setTrackerData(null);
            setView("tracker");
          }}
          className="w-full bg-[#1e3a5f] text-white py-3 rounded-md font-bold shadow-sm mb-3"
        >
          Lacak Pesanan Saya
        </button>
        <button
          type="button"
          onClick={() => {
            setView("home");
            setSelectedProduct(null);
            setCustomerData({ name: "", phone: "", address: "", lat: "", lng: "" });
            setPaymentMethod(null);
            setInvoiceNumber(null);
          }}
          className="w-full text-slate-500 py-3 rounded-md font-bold text-sm"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );

  const statusPaid = (s: string) =>
    s === "FULL_PAID" || s === "DP_PAID" || s === "SUCCESS";

  const TrackerView = () => {
    if (!isTrackerSearched) {
      return (
        <div className="flex flex-col h-full bg-slate-50">
          <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
            <h1 className="font-bold text-slate-800 text-lg">Lacak Pesanan</h1>
          </header>
          <div className="flex-1 p-6 flex flex-col items-center justify-center pb-24">
            <div className="bg-blue-50 p-4 rounded-full mb-5">
              <Truck size={48} className="text-[#1e3a5f]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">
              Lacak Pengiriman & Qurban
            </h2>
            <p className="text-center text-sm text-slate-500 mb-6 px-4">
              Masukkan nomor invoice yang Anda terima melalui WhatsApp untuk
              memantau status pesanan.
            </p>

            <div className="w-full">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Nomor Invoice
              </label>
              <input
                type="text"
                placeholder="Contoh: INV-WEB-…"
                className="w-full border border-slate-300 rounded-md p-3.5 mb-2 outline-none focus:border-[#1e3a5f] bg-white font-semibold text-slate-800"
                value={trackerInput}
                onChange={(e) => setTrackerInput(e.target.value)}
              />
              {trackerErr && (
                <p className="text-xs text-red-600 mb-2">{trackerErr}</p>
              )}
              <button
                type="button"
                onClick={() => void searchTracker()}
                disabled={trackerLoading || !trackerInput.trim()}
                className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-md font-bold active:bg-blue-900 transition-colors shadow-sm disabled:opacity-50"
              >
                {trackerLoading ? "Mencari…" : "Cari Pesanan"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const td = trackerData;
    const inv = td?.invoice ?? trackerInput;

    return (
      <div className="flex flex-col h-full bg-slate-50">
        <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
          <button
            type="button"
            aria-label="Kembali ke pencarian"
            onClick={() => {
              setIsTrackerSearched(false);
              setTrackerData(null);
            }}
            className="text-slate-600 p-1"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-slate-800 text-lg">Detail Lacak</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4">
            <p className="text-xs text-slate-500 font-semibold mb-1">
              No. Invoice
            </p>
            <p className="font-bold text-slate-800 text-lg">{inv}</p>
            <p className="text-sm text-slate-600 mt-2">
              Atas Nama:{" "}
              <span className="font-semibold">
                {td?.customerName ?? "—"}
              </span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Status: {td?.orderStatus ?? "—"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-800 mb-5 text-sm border-b pb-2">
              Status Penyaluran
            </h2>

            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
              {td && (
                <>
                  <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100 flex items-center justify-center">
                      <CheckCircle size={10} className="text-white" />
                    </span>
                    <h3 className="font-bold text-sm text-slate-800">
                      Pesanan Dibuat
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(td.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="relative pl-6">
                    <span
                      className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 flex items-center justify-center ${
                        statusPaid(td.orderStatus)
                          ? "bg-green-500 ring-green-100"
                          : "bg-slate-200 ring-slate-50"
                      }`}
                    >
                      {statusPaid(td.orderStatus) && (
                        <CheckCircle size={10} className="text-white" />
                      )}
                    </span>
                    <h3 className="font-bold text-sm text-slate-800">
                      Pembayaran
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {statusPaid(td.orderStatus)
                        ? "Diterima / terdaftar"
                        : "Menunggu pembayaran"}
                    </p>
                  </div>
                  {td.eartagId && (
                    <div className="relative pl-6">
                      <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </span>
                      <h3 className="font-bold text-sm text-blue-800">
                        Alokasi Hewan (Kandang)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 mb-2">
                        Nomor Eartag/Tag:
                      </p>
                      <span className="inline-block bg-slate-100 border border-slate-300 px-3 py-1 rounded-sm text-sm font-bold tracking-widest text-slate-700">
                        {td.eartagId}
                      </span>
                    </div>
                  )}
                  {td.trackings.map((t, i) => (
                    <div key={i} className="relative pl-6">
                      <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100 flex items-center justify-center">
                        <CheckCircle size={10} className="text-white" />
                      </span>
                      <h3 className="font-bold text-sm text-slate-800">
                        {t.milestone}
                      </h3>
                      {t.description && (
                        <p className="text-xs text-slate-500 mt-1">{t.description}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(t.logged_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DokumentasiView = () => {
    if (!isDokumenSearched) {
      return (
        <div className="flex flex-col h-full bg-slate-50">
          <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
            <h1 className="font-bold text-slate-800 text-lg">
              Dokumen & Sertifikat
            </h1>
          </header>
          <div className="flex-1 p-6 flex flex-col items-center justify-center pb-24">
            <div className="bg-amber-50 p-4 rounded-full mb-5">
              <FileText size={48} className="text-amber-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">
              Sertifikat & Dokumentasi
            </h2>
            <p className="text-center text-sm text-slate-500 mb-6 px-4">
              Masukkan nomor invoice untuk mengunduh e-sertifikat qurban dan
              melihat galeri dokumentasi.
            </p>

            <div className="w-full">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">
                Nomor Invoice
              </label>
              <input
                type="text"
                placeholder="Contoh: INV-WEB-…"
                className="w-full border border-slate-300 rounded-md p-3.5 mb-2 outline-none focus:border-[#1e3a5f] bg-white font-semibold text-slate-800"
                value={dokumenInput}
                onChange={(e) => setDokumenInput(e.target.value)}
              />
              {docErr && (
                <p className="text-xs text-red-600 mb-2">{docErr}</p>
              )}
              <button
                type="button"
                onClick={() => void searchDoc()}
                disabled={docLoading || !dokumenInput.trim()}
                className="w-full bg-[#1e3a5f] text-white py-3.5 rounded-md font-bold active:bg-blue-900 transition-colors shadow-sm disabled:opacity-50"
              >
                {docLoading ? "Mencari…" : "Cari Dokumen"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const d = docData;

    return (
      <div className="flex flex-col h-full bg-slate-50">
        <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
          <button
            type="button"
            aria-label="Kembali ke pencarian dokumen"
            onClick={() => {
              setIsDokumenSearched(false);
              setDocData(null);
            }}
            className="text-slate-600 p-1"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-slate-800 text-lg">Dokumentasi Anda</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
              <div className="bg-amber-100 text-amber-700 p-2 rounded-md">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-sm">
                  Sertifikat Qurban
                </h2>
                <p className="text-xs text-slate-500">
                  {d?.certificateAvailable
                    ? "Tersedia setelah verifikasi"
                    : "Menunggu verifikasi"}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-center">
              <h3 className="text-sm font-bold text-slate-700">Atas Nama</h3>
              <p className="text-lg font-bold text-[#1e3a5f] mt-1">
                {d?.participantName ?? "—"}
              </p>
              {d?.fatherName && (
                <p className="text-xs text-slate-500 mb-4">Bin {d.fatherName}</p>
              )}
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full bg-white border border-slate-300 text-slate-700 py-2 rounded-md text-sm font-semibold hover:bg-slate-50 active:bg-slate-100"
              >
                <Download size={16} /> Unduh Sertifikat (PDF)
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
                <Camera size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-sm">
                  Dokumentasi Lapangan
                </h2>
                <p className="text-xs text-slate-500">
                  Eartag: {d?.eartagId ?? "—"}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-2 font-semibold">Galeri Foto</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(d?.photos?.length ? d.photos : []).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Dokumentasi ${i + 1}`}
                  className="w-full h-24 object-cover rounded-md border border-slate-200 shadow-sm"
                />
              ))}
              {(!d?.photos || d.photos.length === 0) && (
                <p className="text-xs text-slate-400 col-span-2">
                  Belum ada foto dari sistem.
                </p>
              )}
            </div>

            <p className="text-xs text-slate-600 mb-2 font-semibold mt-2">
              Daftar Video Penyembelihan
            </p>
            <div className="space-y-3">
              {(d?.videos?.length ? d.videos : []).map((v, i) => (
                <a
                  key={i}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full h-32 bg-slate-900 rounded-md flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm"
                >
                  <PlayCircle size={40} className="text-white relative z-10 opacity-90" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded">
                    {v.label}
                  </span>
                </a>
              ))}
              {(!d?.videos || d.videos.length === 0) && (
                <p className="text-xs text-slate-400">Belum ada video.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FAQView = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-4 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b border-slate-200">
        <h1 className="font-bold text-slate-800 text-lg">Tanya Jawab (FAQ)</h1>
      </header>

      <div className="flex px-4 py-3 gap-2 bg-white overflow-x-auto no-scrollbar border-b border-slate-200 sticky top-[60px] z-10">
        {FAQ_DATA.map((category) => (
          <button
            type="button"
            key={category.category}
            onClick={() => {
              setFaqActiveTab(category.category);
              setExpandedFaq(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors ${
              faqActiveTab === category.category
                ? "bg-[#1e3a5f] text-white shadow-sm"
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {category.icon}
            {category.category}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-24">
        {FAQ_DATA.find((c) => c.category === faqActiveTab)?.questions.map(
          (faq, idx) => (
            <div
              key={idx}
              className="mb-3 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedFaq(expandedFaq === idx ? null : idx)
                }
                className="w-full text-left p-4 text-sm font-bold text-slate-700 flex justify-between items-center bg-white active:bg-slate-50"
              >
                <span className="pr-4 leading-snug">{faq.q}</span>
                {expandedFaq === idx ? (
                  <ChevronUp size={18} className="text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-slate-400 shrink-0" />
                )}
              </button>
              {expandedFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="font-sans bg-slate-100 min-h-screen w-full flex flex-col">
      <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 relative flex flex-col shadow-xl sm:border-x sm:border-slate-200">
        <div className="flex-1 relative overflow-hidden bg-slate-50 min-h-0">
          {view === "home" && HomeView()}
          {view === "branch_selection" && BranchSelectionView()}
          {view === "catalog" && CatalogView()}
          {view === "product_detail" && ProductDetailView()}
          {view === "checkout" && CheckoutView()}
          {view === "payment_selection" && PaymentSelectionView()}
          {view === "payment_instruction" && PaymentInstructionView()}
          {view === "success" && SuccessView()}
          {view === "tracker" && TrackerView()}
          {view === "dokumentasi" && DokumentasiView()}
          {view === "faq" && FAQView()}
        </div>

        {["home", "catalog", "tracker", "dokumentasi", "faq"].includes(view) && (
          <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-5 pt-3 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <button
              type="button"
              onClick={() => setView("home")}
              className={`flex flex-col items-center ${view === "home" ? "text-red-700" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Home size={22} className="mb-1" />
              <span className="text-[10px] font-bold">Beranda</span>
            </button>
            <button
              type="button"
              onClick={() => setView("faq")}
              className={`flex flex-col items-center ${view === "faq" ? "text-red-700" : "text-slate-400 hover:text-slate-600"}`}
            >
              <HelpCircle size={22} className="mb-1" />
              <span className="text-[10px] font-bold">FAQ</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsTrackerSearched(false);
                setTrackerData(null);
                setView("tracker");
              }}
              className={`flex flex-col items-center ${view === "tracker" ? "text-red-700" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Truck size={22} className="mb-1" />
              <span className="text-[10px] font-bold">Lacak</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsDokumenSearched(false);
                setDocData(null);
                setView("dokumentasi");
              }}
              className={`flex flex-col items-center ${view === "dokumentasi" ? "text-red-700" : "text-slate-400 hover:text-slate-600"}`}
            >
              <FileText size={22} className="mb-1" />
              <span className="text-[10px] font-bold">Dokumen</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
