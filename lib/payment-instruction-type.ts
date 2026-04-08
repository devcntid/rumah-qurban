import type { OrderInvoiceSummary } from "@/lib/data/order";

export type InstructionPaymentVisual =
  | "qris"
  | "va"
  | "ewallet"
  | "transfer"
  | "unknown";

export function inferInstructionPaymentType(
  o: Pick<
    OrderInvoiceSummary,
    "payment_method_code" | "payment_method_name" | "payment_method_category"
  >
): InstructionPaymentVisual {
  const code = o.payment_method_code ?? "";
  const name = o.payment_method_name ?? "";
  const lower = `${code} ${name}`.toLowerCase();
  if (lower.includes("qris")) return "qris";
  if (o.payment_method_category === "VIRTUAL_ACCOUNT") return "va";
  if (o.payment_method_category === "MANUAL_TRANSFER") return "transfer";
  if (o.payment_method_category === "EWALLET") return "ewallet";
  return "unknown";
}
