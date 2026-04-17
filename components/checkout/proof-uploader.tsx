"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, ImageIcon, X } from "lucide-react";

export function ProofUploader({
  onFileChange,
}: {
  onFileChange: (file: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsPdf(file.type === "application/pdf");

    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }

    onFileChange(file);
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName("");
    setIsPdf(false);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (fileName) {
    return (
      <div className="space-y-2">
        {preview && (
          <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview bukti transfer"
              className="w-full max-h-56 object-contain bg-slate-100"
            />
          </div>
        )}

        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-md p-3">
          <ImageIcon size={18} className="text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-green-800 truncate">
              {isPdf ? "Dokumen PDF dipilih" : "Foto dipilih"}
            </p>
            <p className="text-[10px] text-green-600 truncate">{fileName}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-slate-400 hover:text-red-500 p-1 transition-colors"
            aria-label="Hapus file"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#1e3a5f]/40 rounded-md p-4 cursor-pointer hover:bg-blue-50 transition-colors bg-white">
      <Upload size={20} className="text-[#1e3a5f] mb-2" />
      <span className="text-sm text-slate-700 font-semibold">
        Upload Bukti Transfer
      </span>
      <span className="text-[10px] text-slate-400 mt-1">
        Format: JPG, PNG, atau PDF (Maks. 5MB)
      </span>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleChange}
      />
    </label>
  );
}
