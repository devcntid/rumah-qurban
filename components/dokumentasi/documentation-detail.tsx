import { Camera, Download, FileText, PlayCircle } from "lucide-react";
import type { DocumentationPayload } from "@/lib/data/documentation";

export function DocumentationDetail({ data }: { data: DocumentationPayload }) {
  return (
    <div className="flex-1 p-4 space-y-4 pb-8">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <p className="text-xs text-slate-500">Invoice</p>
        <p className="font-bold text-slate-800">{data.invoice}</p>
        <p className="text-sm text-slate-600 mt-2">
          Peserta: <span className="font-semibold">{data.participantName}</span>
        </p>
        {data.fatherName && (
          <p className="text-xs text-slate-500">Bin/Binti: {data.fatherName}</p>
        )}
        {data.eartagId && (
          <p className="text-xs text-slate-600 mt-2">
            Eartag: <b>{data.eartagId}</b>
          </p>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <FileText size={18} /> Sertifikat
        </h2>
        {data.certificateAvailable ? (
          <a
            href={`/api/certificate?invoice=${encodeURIComponent(data.invoice)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 border border-[#1e3a5f] text-[#1e3a5f] rounded-md font-semibold text-sm"
          >
            <Download size={18} /> Unduh Sertifikat
          </a>
        ) : (
          <p className="text-xs text-slate-500">
            Sertifikat akan tersedia setelah pembayaran terverifikasi.
          </p>
        )}
      </div>

      {data.photos.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
            <Camera size={18} /> Foto
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {data.photos.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`Dokumentasi ${i + 1}`}
                className="rounded-md object-cover w-full h-32"
              />
            ))}
          </div>
        </div>
      )}

      {data.videos.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
            <PlayCircle size={18} /> Video
          </h2>
          <ul className="space-y-2">
            {data.videos.map((v, i) => (
              <li key={i}>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1e3a5f] font-semibold underline"
                >
                  {v.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.photos.length === 0 && data.videos.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-6">
          Belum ada foto/video dokumentasi untuk pesanan ini.
        </p>
      )}
    </div>
  );
}
