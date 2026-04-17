import { pool } from "@/lib/db";
import { phoneVariants } from "@/lib/normalize-phone";

export type DocumentationPayload = {
  invoice: string;
  customerName: string;
  orderStatus: string;
  participantName: string;
  fatherName: string | null;
  eartagId: string | null;
  certificateAvailable: boolean;
  photos: string[];
  videos: { url: string; label: string }[];
};

export async function fetchDocumentationByInvoice(
  invoice: string
): Promise<DocumentationPayload | null> {
  const trimmed = invoice?.trim();
  if (!trimmed) return null;

  const variants = phoneVariants(trimmed);
  const placeholders = variants.map((_, i) => `$${i + 1}`).join(", ");

  let { rows: orderRows } = await pool.query<{
    id: string;
    invoice_number: string;
    customer_name: string;
    status: string;
  }>(
    `SELECT id, invoice_number, customer_name, status FROM orders WHERE invoice_number IN (${placeholders}) OR customer_phone IN (${placeholders})`,
    variants
  );

  if (orderRows.length === 0 && /^\d{4,6}$/.test(trimmed)) {
    const { rows: suffixRows } = await pool.query<{
      id: string;
      invoice_number: string;
      customer_name: string;
      status: string;
    }>(
      `SELECT id, invoice_number, customer_name, status FROM orders WHERE customer_phone LIKE '%' || $1 ORDER BY created_at DESC LIMIT 2`,
      [trimmed]
    );
    if (suffixRows.length === 1) {
      orderRows = suffixRows;
    }
  }

  if (orderRows.length === 0) return null;
  const order = orderRows[0];

  const { rows: partRows } = await pool.query<{
    participant_name: string;
    father_name: string | null;
  }>(
    `
    SELECT op.participant_name, op.father_name
    FROM order_items oi
    INNER JOIN order_participants op ON op.order_item_id = oi.id
    WHERE oi.order_id = $1 AND oi.item_type = 'ANIMAL'
    ORDER BY op.id
    LIMIT 1
    `,
    [order.id]
  );

  const { rows: mediaRows } = await pool.query<{
    eartag_id: string | null;
    photo_url: string | null;
    milestone: string | null;
    media_url: string | null;
    logged_at: string | null;
  }>(
    `
    SELECT fi.eartag_id, fi.photo_url, at.milestone, at.media_url, at.logged_at
    FROM order_items oi
    LEFT JOIN farm_inventories fi ON fi.order_item_id = oi.id
    LEFT JOIN animal_trackings at ON at.farm_inventory_id = fi.id
    WHERE oi.order_id = $1 AND oi.item_type = 'ANIMAL'
    ORDER BY at.logged_at ASC NULLS LAST
    `,
    [order.id]
  );

  const photos: string[] = [];
  const videos: { url: string; label: string }[] = [];
  for (const m of mediaRows) {
    if (m.photo_url?.trim()) photos.push(m.photo_url.trim());
    if (m.media_url?.trim()) {
      videos.push({
        url: m.media_url.trim(),
        label: m.milestone || "Dokumentasi",
      });
    }
  }

  const eartag = mediaRows.find((r) => r.eartag_id)?.eartag_id ?? null;

  return {
    invoice: order.invoice_number,
    customerName: order.customer_name,
    orderStatus: order.status,
    participantName: partRows[0]?.participant_name ?? order.customer_name,
    fatherName: partRows[0]?.father_name ?? null,
    eartagId: eartag,
    certificateAvailable:
      order.status === "FULL_PAID" || order.status === "DP_PAID",
    photos: [...new Set(photos)],
    videos,
  };
}
