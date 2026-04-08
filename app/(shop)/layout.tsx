import { BottomNav } from "@/components/shop/bottom-nav";

export default function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen w-full bg-slate-100">
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-slate-50 shadow-xl sm:border-x sm:border-slate-200">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
