import { pool } from "@/lib/db";

export type OrderInvoiceSummary = {
  invoice_number: string;
  customer_name: string;
  grand_total: number;
  status: string;
  payment_method_code: string | null;
  payment_method_name: string | null;
  payment_method_category: string | null;
  account_number: string | null;
  bank_name: string | null;
  account_holder_name: string | null;
};

export type PaymentInstruction = {
  channel: string;
  instruction_steps: string;
};

export async function getOrderByInvoice(
  invoice: string,
): Promise<OrderInvoiceSummary | null> {
  const trimmed = invoice?.trim();
  if (!trimmed) return null;

  const { rows } = await pool.query<{
    invoice_number: string;
    customer_name: string;
    grand_total: string;
    status: string;
    payment_method_code: string | null;
    payment_method_name: string | null;
    payment_method_category: string | null;
    account_number: string | null;
    bank_name: string | null;
    account_holder_name: string | null;
  }>(
    `
    SELECT o.invoice_number, o.customer_name, o.grand_total, o.status,
           tr.payment_method_code,
           pm.name AS payment_method_name,
           pm.category AS payment_method_category,
           pm.account_number,
           pm.bank_name,
           pm.account_holder_name
    FROM orders o
    LEFT JOIN transactions tr ON tr.id = (
      SELECT t.id FROM transactions t WHERE t.order_id = o.id ORDER BY t.id DESC LIMIT 1
    )
    LEFT JOIN payment_methods pm ON pm.code = tr.payment_method_code
    WHERE o.invoice_number = $1
    LIMIT 1
    `,
    [trimmed],
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    invoice_number: r.invoice_number,
    customer_name: r.customer_name,
    grand_total: Number(r.grand_total),
    status: r.status,
    payment_method_code: r.payment_method_code,
    payment_method_name: r.payment_method_name,
    payment_method_category: r.payment_method_category,
    account_number: r.account_number,
    bank_name: r.bank_name,
    account_holder_name: r.account_holder_name,
  };
}

export async function getPaymentInstructions(
  paymentMethodCode: string,
): Promise<PaymentInstruction[]> {
  if (!paymentMethodCode) return [];
  const { rows } = await pool.query<{
    channel: string;
    instruction_steps: string;
  }>(
    `
    SELECT channel, instruction_steps
    FROM payment_instructions
    WHERE payment_method_code = $1 AND is_active = true
    ORDER BY id
    `,
    [paymentMethodCode],
  );
  return rows;
}
