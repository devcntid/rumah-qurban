import { NextRequest, NextResponse } from "next/server";
import { fetchTrackerByInvoice } from "@/lib/data/tracker";
import { rateLimitTracker } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const invoice = req.nextUrl.searchParams.get("invoice")?.trim();
  if (!invoice) {
    return NextResponse.json({ error: "Parameter invoice wajib" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "local";
  const rl = await rateLimitTracker(`${ip}:${invoice.slice(0, 40)}`);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi sebentar." },
      { status: 429 }
    );
  }

  const data = await fetchTrackerByInvoice(invoice);
  if (!data) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({
    invoice: data.invoice,
    customerName: data.customerName,
    orderStatus: data.orderStatus,
    createdAt: data.createdAt,
    eartagId: data.eartagId,
    trackings: data.trackings,
  });
}
