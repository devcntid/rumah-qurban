import { NextResponse } from "next/server";
import { getFaqsCached } from "@/lib/data/faq";

export async function GET() {
  try {
    const categories = await getFaqsCached();
    return NextResponse.json(
      { categories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (err) {
    console.error("[FAQ API]", err);
    return NextResponse.json(
      { error: "Gagal memuat FAQ" },
      { status: 500 }
    );
  }
}
