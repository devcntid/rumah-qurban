import { NextRequest, NextResponse } from "next/server";
import { TAB_TO_PRODUCT, getCatalogItemsCached } from "@/lib/data/catalog";

export async function GET(req: NextRequest) {
  const tab = req.nextUrl.searchParams.get("tab") ?? "ANTAR";
  const branchIdParam = req.nextUrl.searchParams.get("branchId");
  const productCode = TAB_TO_PRODUCT[tab];
  if (!productCode) {
    return NextResponse.json({ error: "Parameter tab tidak valid" }, { status: 400 });
  }
  if (productCode === "QA" && !branchIdParam) {
    return NextResponse.json(
      { error: "branchId wajib untuk Qurban Antar" },
      { status: 400 }
    );
  }

  const items = await getCatalogItemsCached(tab, branchIdParam);
  return NextResponse.json({ items });
}
