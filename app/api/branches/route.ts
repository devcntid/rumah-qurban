import { NextResponse } from "next/server";
import { getBranchesCached } from "@/lib/data/catalog";

export async function GET() {
  const branches = await getBranchesCached();
  return NextResponse.json({ branches });
}
