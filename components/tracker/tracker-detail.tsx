import { CheckCircle } from "lucide-react";
import type { TrackerPayload } from "@/lib/data/tracker";

function statusPaid(s: string) {
  return s === "FULL_PAID" || s === "DP_PAID" || s === "SUCCESS";
}

export function TrackerDetail({ data }: { data: TrackerPayload }) {
  const inv = data.invoice;

  return (
    <div className="flex-1 p-4 pb-8">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4">
        <p className="text-xs text-slate-500 font-semibold mb-1">No. Invoice</p>
        <p className="font-bold text-slate-800 text-lg">{inv}</p>
        <p className="text-sm text-slate-600 mt-2">
          Atas Nama:{" "}
          <span className="font-semibold">{data.customerName}</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Status: {data.orderStatus}
        </p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
        <h2 className="font-bold text-slate-800 mb-5 text-sm border-b pb-2">
          Status Penyaluran
        </h2>

        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
          <div className="relative pl-6">
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100 flex items-center justify-center">
              <CheckCircle size={10} className="text-white" />
            </span>
            <h3 className="font-bold text-sm text-slate-800">Pesanan Dibuat</h3>
            <p className="text-xs text-slate-500 mt-1">
              {new Date(data.createdAt).toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              WIB
            </p>
          </div>

          <div className="relative pl-6">
            <span
              className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 flex items-center justify-center ${
                statusPaid(data.orderStatus)
                  ? "bg-green-500 ring-green-100"
                  : "bg-slate-200 ring-slate-50"
              }`}
            >
              {statusPaid(data.orderStatus) && (
                <CheckCircle size={10} className="text-white" />
              )}
            </span>
            <h3 className="font-bold text-sm text-slate-800">
              Pembayaran Diterima
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {statusPaid(data.orderStatus)
                ? "Pembayaran telah dikonfirmasi"
                : "Menunggu pembayaran"}
            </p>
          </div>

          {data.eartagId && (
            <div className="relative pl-6">
              <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </span>
              <h3 className="font-bold text-sm text-blue-800">
                Alokasi Hewan (Kandang)
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-2">
                Hewan qurban Anda telah disiapkan dengan Nomor Eartag/Tag:
              </p>
              <span className="inline-block bg-slate-100 border border-slate-300 px-3 py-1 rounded-sm text-sm font-bold tracking-widest text-slate-700">
                {data.eartagId}
              </span>
            </div>
          )}

          {data.trackings.map((t, i) => (
            <div key={i} className="relative pl-6">
              <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100 flex items-center justify-center">
                <CheckCircle size={10} className="text-white" />
              </span>
              <h3 className="font-bold text-sm text-slate-800">{t.milestone}</h3>
              {t.description && (
                <p className="text-xs text-slate-500 mt-1">{t.description}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                {new Date(t.logged_at).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WIB
              </p>
              {t.media_url && (
                <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.media_url}
                    alt={t.milestone}
                    className="w-full max-h-56 object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
