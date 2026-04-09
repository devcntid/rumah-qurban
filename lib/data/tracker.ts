import { pool } from "@/lib/db";

export type TrackerPayload = {
  invoice: string;
  customerName: string;
  orderStatus: string;
  createdAt: string;
  eartagId: string | null;
  trackings: {
    milestone: string;
    description: string | null;
    logged_at: string;
    media_url: string | null;
  }[];
};

export async function fetchTrackerByInvoice(
  identifier: string
): Promise<TrackerPayload | null> {
  const trimmed = identifier?.trim();
  if (!trimmed) return null;

  const { rows: orderRows } = await pool.query<{
    id: string;
    invoice_number: string;
    customer_name: string;
    status: string;
    created_at: string;
  }>(
    `SELECT id, invoice_number, customer_name, status, created_at FROM orders WHERE invoice_number = $1 OR customer_phone = $1 ORDER BY created_at DESC LIMIT 1`,
    [trimmed]
  );

  if (orderRows.length === 0) return null;
  const order = orderRows[0];

  const { rows: invRows } = await pool.query<{ eartag_id: string }>(
    `
    SELECT fi.eartag_id
    FROM order_items oi
    INNER JOIN farm_inventories fi ON fi.order_item_id = oi.id
    WHERE oi.order_id = $1 AND oi.item_type = 'ANIMAL'
    LIMIT 1
    `,
    [order.id]
  );

  const { rows: trackRows } = await pool.query<{
    milestone: string;
    description: string | null;
    logged_at: string;
    media_url: string | null;
  }>(
    `
    SELECT at.milestone, at.description, at.logged_at, at.media_url
    FROM order_items oi
    INNER JOIN farm_inventories fi ON fi.order_item_id = oi.id
    INNER JOIN animal_trackings at ON at.farm_inventory_id = fi.id
    WHERE oi.order_id = $1 AND oi.item_type = 'ANIMAL'
    ORDER BY at.logged_at ASC NULLS LAST
    `,
    [order.id]
  );

  return {
    invoice: order.invoice_number,
    customerName: order.customer_name,
    orderStatus: order.status,
    createdAt: order.created_at,
    eartagId: invRows[0]?.eartag_id ?? null,
    trackings: trackRows,
  };
}
