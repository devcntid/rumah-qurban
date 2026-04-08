import { NextResponse } from "next/server";
import { getPaymentMethodsCached } from "@/lib/data/payment-methods";

export type PaymentMethodRow = {
  code: string;
  name: string;
  category: string;
};

export async function GET() {
  const methods = await getPaymentMethodsCached();
  return NextResponse.json({ methods });
}
