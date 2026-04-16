import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ShopHeader({
  backHref,
  title,
  actions,
}: {
  backHref?: string;
  title?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="bg-white px-4 py-3 shadow-sm flex items-center gap-3 sticky top-0 z-20 border-b border-slate-200">
      {backHref && (
        <Link
          href={backHref}
          className="text-slate-500 hover:text-slate-800 p-1 -ml-1 transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </Link>
      )}

      <Link
        href="/"
        className="flex items-center shrink-0"
        aria-label="Rumah Qurban — beranda"
      >
        <Image
          src="/logo-agro.png"
          alt="Rumah Qurban"
          width={426}
          height={96}
          className="h-8 w-auto max-w-[160px] object-contain object-left"
          priority
        />
      </Link>

      {title && (
        <>
          <span className="w-px h-5 bg-slate-200" aria-hidden="true" />
          <span className="text-sm font-bold text-slate-600 truncate">
            {title}
          </span>
        </>
      )}

      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </header>
  );
}
