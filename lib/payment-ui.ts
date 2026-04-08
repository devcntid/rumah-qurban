import type { PaymentCategory, PaymentMethodOption } from "@/lib/types/catalog";

type MethodRow = { code: string; name: string; category: string };

function methodVisualType(m: MethodRow): PaymentMethodOption["type"] {
  const lower = `${m.code} ${m.name}`.toLowerCase();
  if (lower.includes("qris")) return "qris";
  if (m.category === "VIRTUAL_ACCOUNT") return "va";
  if (m.category === "MANUAL_TRANSFER") return "transfer";
  return "ewallet";
}

export function buildPaymentCategories(methods: MethodRow[]): PaymentCategory[] {
  const qris = methods.filter(
    (m) =>
      m.code.toUpperCase().includes("QRIS") || m.name.toLowerCase().includes("qris")
  );
  const va = methods.filter((m) => m.category === "VIRTUAL_ACCOUNT");
  const ew = methods.filter(
    (m) =>
      m.category === "EWALLET" &&
      !m.code.toUpperCase().includes("QRIS") &&
      !m.name.toLowerCase().includes("qris")
  );
  const tf = methods.filter((m) => m.category === "MANUAL_TRANSFER");

  const toOpt = (m: MethodRow): PaymentMethodOption => ({
    id: m.code,
    name: m.name,
    type: methodVisualType(m),
    code: m.code,
    bank: methodVisualType(m) === "va" ? "Bank" : undefined,
    account: methodVisualType(m) === "transfer" ? "— (cek instruksi)" : undefined,
  });

  const out: PaymentCategory[] = [];
  if (qris.length) {
    out.push({
      id: "qris",
      title: "QRIS",
      subtitle: "*Dicek Otomatis",
      examples: "QRIS",
      options: qris.map(toOpt),
    });
  }
  if (va.length) {
    out.push({
      id: "va",
      title: "Bank Transfer Otomatis",
      subtitle: "*Dicek Otomatis",
      examples: "Virtual Account",
      options: va.map(toOpt),
    });
  }
  if (ew.length) {
    out.push({
      id: "ewallet",
      title: "eWallet",
      subtitle: "*Dicek Otomatis",
      examples: "E-Wallet",
      options: ew.map(toOpt),
    });
  }
  if (tf.length) {
    out.push({
      id: "transfer",
      title: "Transfer Bank Manual",
      subtitle: "Verifikasi manual dengan upload bukti",
      examples: "Transfer",
      options: tf.map(toOpt),
    });
  }
  return out;
}
