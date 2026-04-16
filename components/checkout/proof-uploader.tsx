"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, CheckCircle, Loader2, AlertCircle, X } from "lucide-react";

export function ProofUploader({ invoiceNumber }: { invoiceNumber: string }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setStatus("uploading");
      setErrorMsg("");
      setFileName(file.name);

      const form = new FormData();
      form.append("file", file);
      form.append("invoice", invoiceNumber);

      try {
        const res = await fetch("/api/upload-proof", {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setErrorMsg(data.error ?? "Upload gagal");
          return;
        }
        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMsg("Terjadi kesalahan. Coba lagi.");
      }
    },
    [invoiceNumber],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const reset = () => {
    setStatus("idle");
    setFileName("");
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-md p-4">
        <CheckCircle size={20} className="text-green-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-green-800">Bukti berhasil diupload</p>
          <p className="text-xs text-green-600 truncate">{fileName}</p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-green-500 hover:text-green-700 p-1"
          aria-label="Upload ulang"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-md p-4">
          <AlertCircle size={20} className="text-red-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-800">Upload gagal</p>
            <p className="text-xs text-red-600">{errorMsg}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="w-full text-sm text-[#1e3a5f] font-semibold py-2 hover:underline"
        >
          Coba Upload Lagi
        </button>
      </div>
    );
  }

  return (
    <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#1e3a5f]/40 rounded-md p-4 cursor-pointer hover:bg-blue-50 transition-colors bg-white">
      {status === "uploading" ? (
        <>
          <Loader2 size={20} className="text-[#1e3a5f] mb-2 animate-spin" />
          <span className="text-sm text-slate-700 font-semibold">Mengupload…</span>
          <span className="text-[10px] text-slate-400 mt-1 truncate max-w-[200px]">
            {fileName}
          </span>
        </>
      ) : (
        <>
          <Upload size={20} className="text-[#1e3a5f] mb-2" />
          <span className="text-sm text-slate-700 font-semibold">
            Upload Bukti Transfer
          </span>
          <span className="text-[10px] text-slate-400 mt-1">
            Format: JPG, PNG, atau PDF (Maks. 5MB)
          </span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={handleChange}
        disabled={status === "uploading"}
      />
    </label>
  );
}
