import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageHeader({
  backHref,
  title,
}: {
  backHref: string;
  title: string;
}) {
  return (
    <header className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 sticky top-0 z-10 border-b border-slate-200">
      <Link
        href={backHref}
        aria-label="Kembali"
        className="text-slate-600 p-1"
      >
        <ArrowLeft size={24} />
      </Link>
      <h1 className="font-bold text-slate-800 text-lg">{title}</h1>
    </header>
  );
}
