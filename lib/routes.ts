export type ShopTab = "ANTAR" | "BERBAGI" | "KALENG";

export function productPath(
  offerId: number,
  tab: ShopTab,
  cabangId?: number | null
): string {
  const q = new URLSearchParams({ tab });
  if (cabangId != null && (tab === "ANTAR" || tab === "KALENG")) q.set("cabang", String(cabangId));
  return `/produk/${offerId}?${q.toString()}`;
}

export function checkoutPath(
  offerId: number,
  tab: ShopTab,
  cabangId?: number | null
): string {
  const q = new URLSearchParams({
    offerId: String(offerId),
    tab,
  });
  if (cabangId != null && (tab === "ANTAR" || tab === "KALENG")) q.set("cabang", String(cabangId));
  return `/checkout?${q.toString()}`;
}

export function catalogPath(tab: ShopTab, branchId?: number | null): string {
  if (tab === "ANTAR" && branchId != null) return `/antar/${branchId}`;
  if (tab === "KALENG" && branchId != null) return `/kaleng/${branchId}`;
  if (tab === "BERBAGI") return "/berbagi";
  return "/kaleng/cabang";
}
