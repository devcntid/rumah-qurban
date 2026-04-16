import { NextResponse } from "next/server";
import { getPaymentMethodsCached } from "@/lib/data/payment-methods";

export type { PaymentMethodRow } from "@/lib/data/payment-methods";

export async function GET() {
  const methods = await getPaymentMethodsCached();
  return NextResponse.json({ methods });
}
