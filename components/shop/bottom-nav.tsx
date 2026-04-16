"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, HelpCircle, Truck } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const hide =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/produk/") ||
    pathname === "/antar/cabang";

  if (hide) return null;

  const item = (href: string, label: string, icon: ReactNode, active: boolean) => (
    <Link
      href={href}
      className={`flex flex-col items-center ${active ? "text-red-700" : "text-slate-400 hover:text-slate-600"}`}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  );

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-5 pt-3 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      {item("/", "Beranda", <Home size={22} className="mb-1" />, pathname === "/")}
      {item("/faq", "FAQ", <HelpCircle size={22} className="mb-1" />, pathname.startsWith("/faq"))}
      {item("/lacak", "Lacak", <Truck size={22} className="mb-1" />, pathname.startsWith("/lacak"))}
    </nav>
  );
}
