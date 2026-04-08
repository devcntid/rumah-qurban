export type ShopTab = "ANTAR" | "BERBAGI" | "KALENG";

export function productPath(
  offerId: number,
  tab: ShopTab,
  cabangId?: number | null
): string {
  const q = new URLSearchParams({ tab });
  if (cabangId != null && tab === "ANTAR") q.set("cabang", String(cabangId));
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
  if (cabangId != null && tab === "ANTAR") q.set("cabang", String(cabangId));
  return `/checkout?${q.toString()}`;
}

export function catalogPath(tab: ShopTab, branchId?: number | null): string {
  if (tab === "ANTAR" && branchId != null) return `/antar/${branchId}`;
  if (tab === "BERBAGI") return "/berbagi";
  return "/kaleng";
}
