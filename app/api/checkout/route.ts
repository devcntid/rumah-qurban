import { NextResponse } from "next/server";
import { Client } from "@neondatabase/serverless";
import { pool } from "@/lib/db";
import { generateInvoiceNumber } from "@/lib/invoice";
import { computeMaxParticipants } from "@/lib/participants";
import { sendWhatsApp, renderTemplate, normalizePhone } from "@/lib/whatsapp";
import { formatIDR } from "@/lib/format-idr";

type ParticipantIn = { name: string; fatherName?: string };

type CheckoutBody = {
  catalog_offer_id: number;
  customer_name: string;
  customer_phone: string;
  delivery_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  participants: ParticipantIn[];
  payment_method_code: string;
  slaughter_requested: boolean;
};

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid" }, { status: 400 });
  }

  const offerId = Number(body.catalog_offer_id);
  if (!Number.isFinite(offerId) || offerId <= 0) {
    return NextResponse.json({ error: "catalog_offer_id tidak valid" }, { status: 400 });
  }
  const name = String(body.customer_name ?? "").trim();
  const phone = String(body.customer_phone ?? "").trim();
  if (!name || !phone) {
    return NextResponse.json(
      { error: "Nama dan nomor WhatsApp wajib diisi" },
      { status: 400 }
    );
  }
  const phoneNormalized = normalizePhone(phone);
  const code = String(body.payment_method_code ?? "").trim();
  if (!code) {
    return NextResponse.json({ error: "Metode pembayaran wajib" }, { status: 400 });
  }
  const participants = Array.isArray(body.participants) ? body.participants : [];
  if (participants.length === 0) {
    return NextResponse.json({ error: "Minimal satu peserta qurban" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      SELECT setval('customers_id_seq', GREATEST(nextval('customers_id_seq'), (SELECT COALESCE(MAX(id),0)+1 FROM customers)));
      SELECT setval('orders_id_seq', GREATEST(nextval('orders_id_seq'), (SELECT COALESCE(MAX(id),0)+1 FROM orders)));
      SELECT setval('order_items_id_seq', GREATEST(nextval('order_items_id_seq'), (SELECT COALESCE(MAX(id),0)+1 FROM order_items)));
      SELECT setval('order_participants_id_seq', GREATEST(nextval('order_participants_id_seq'), (SELECT COALESCE(MAX(id),0)+1 FROM order_participants)));
      SELECT setval('transactions_id_seq', GREATEST(nextval('transactions_id_seq'), (SELECT COALESCE(MAX(id),0)+1 FROM transactions)));
    `);

    const pm = await client.query<{ ok: number }>(
      `SELECT 1 AS ok FROM payment_methods WHERE code = $1 AND is_active = true`,
      [code]
    );
    if (pm.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Metode pembayaran tidak dikenal" },
        { status: 400 }
      );
    }

    const offer = await client.query<{
      id: string;
      display_name: string;
      price: string;
      branch_id: string | null;
      animal_variant_id: string;
      requires_shipping: boolean;
      species: string;
    }>(
      `
      SELECT co.id, co.display_name, co.price, co.branch_id, co.animal_variant_id,
             p.requires_shipping, av.species
      FROM catalog_offers co
      INNER JOIN products p ON p.id = co.product_id
      INNER JOIN animal_variants av ON av.id = co.animal_variant_id
      WHERE co.id = $1 AND co.is_active = true
      FOR UPDATE OF co
      `,
      [offerId]
    );

    if (offer.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Penawaran tidak ditemukan" }, { status: 404 });
    }

    const row = offer.rows[0];
    const unitPrice = Number(row.price);
    const maxP = computeMaxParticipants(row.species, row.display_name);
    const cleaned = participants
      .slice(0, maxP)
      .map((p) => ({
        name: String(p.name ?? "").trim(),
        fatherName: String(p.fatherName ?? "").trim() || null,
      }))
      .filter((p) => p.name.length > 0);
    if (cleaned.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Isi nama peserta minimal satu orang" },
        { status: 400 }
      );
    }

    if (row.requires_shipping) {
      const addr = String(body.delivery_address ?? "").trim();
      if (!addr) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Alamat pengiriman wajib untuk produk ini" },
          { status: 400 }
        );
      }
    }

    let subtotal = unitPrice;
    const lines: {
      type: "ANIMAL" | "SERVICE";
      catalog_offer_id: number | null;
      service_id: number | null;
      item_name: string;
      unit_price: number;
      total_price: number;
    }[] = [
      {
        type: "ANIMAL",
        catalog_offer_id: offerId,
        service_id: null,
        item_name: row.display_name,
        unit_price: unitPrice,
        total_price: unitPrice,
      },
    ];

    const branchId = row.branch_id != null ? Number(row.branch_id) : null;
    const variantId = Number(row.animal_variant_id);

    if (row.requires_shipping && branchId != null) {
      const ship = await client.query<{
        id: string;
        base_price: string;
        name: string;
      }>(
        `
        SELECT id, base_price, name FROM services
        WHERE service_type = 'SHIPPING'
          AND branch_id = $1
          AND animal_variant_id = $2
        ORDER BY id
        LIMIT 1
        `,
        [branchId, variantId]
      );
      if (ship.rows.length > 0) {
        const sp = Number(ship.rows[0].base_price);
        const sid = Number(ship.rows[0].id);
        subtotal += sp;
        lines.push({
          type: "SERVICE",
          catalog_offer_id: null,
          service_id: sid,
          item_name: ship.rows[0].name,
          unit_price: sp,
          total_price: sp,
        });
      }
    }

    if (body.slaughter_requested) {
      const sl = await client.query<{
        id: string;
        base_price: string;
        name: string;
      }>(
        `
        SELECT id, base_price, name FROM services
        WHERE service_type = 'SLAUGHTER'
          AND animal_variant_id = $1
          AND (
            branch_id IS NULL
            OR ($2::bigint IS NOT NULL AND branch_id = $2)
          )
        ORDER BY CASE WHEN branch_id IS NOT NULL THEN 0 ELSE 1 END, id
        LIMIT 1
        `,
        [variantId, branchId]
      );
      if (sl.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Jasa sembelih tidak tersedia untuk varian ini" },
          { status: 422 }
        );
      }
      const sp = Number(sl.rows[0].base_price);
      const sid = Number(sl.rows[0].id);
      subtotal += sp;
      lines.push({
        type: "SERVICE",
        catalog_offer_id: null,
        service_id: sid,
        item_name: sl.rows[0].name,
        unit_price: sp,
        total_price: sp,
      });
    }

    const grandTotal = subtotal;
    let invoice = generateInvoiceNumber();
    for (let i = 0; i < 5; i++) {
      const dup = await client.query(
        `SELECT 1 FROM orders WHERE invoice_number = $1`,
        [invoice]
      );
      if (dup.rows.length === 0) break;
      invoice = generateInvoiceNumber();
    }

    const lat =
      body.latitude != null && Number.isFinite(Number(body.latitude))
        ? Number(body.latitude)
        : null;
    const lng =
      body.longitude != null && Number.isFinite(Number(body.longitude))
        ? Number(body.longitude)
        : null;

    const customerUpsert = await client.query<{ id: string }>(
      `
      INSERT INTO customers (phone_normalized, name, customer_type, total_orders, total_spent, first_order_date, last_order_date)
      VALUES ($1, $2, 'B2C', 1, $3, NOW(), NOW())
      ON CONFLICT (phone_normalized) DO UPDATE SET
        name = EXCLUDED.name,
        total_orders = customers.total_orders + 1,
        total_spent = customers.total_spent + EXCLUDED.total_spent,
        last_order_date = NOW(),
        updated_at = NOW()
      RETURNING id
      `,
      [phoneNormalized, name, grandTotal]
    );

    const customerId = Number(customerUpsert.rows[0].id);

    const orderInsert = await client.query<{ id: string }>(
      `
      INSERT INTO orders (
        invoice_number, branch_id, customer_id, customer_type, customer_name, customer_phone,
        delivery_address, latitude, longitude, subtotal, discount, grand_total,
        dp_paid, remaining_balance, status
      ) VALUES (
        $1, $2, $3, 'B2C', $4, $5, $6, $7, $8, $9, 0, $10, 0, $10, 'PENDING'
      )
      RETURNING id
      `,
      [
        invoice,
        branchId,
        customerId,
        name,
        phoneNormalized,
        body.delivery_address?.trim() || null,
        lat,
        lng,
        grandTotal,
        grandTotal,
      ]
    );

    const orderId = orderInsert.rows[0].id;

    let animalItemId: string | null = null;
    for (const line of lines) {
      const ins = await client.query<{ id: string }>(
        `
        INSERT INTO order_items (
          order_id, item_type, catalog_offer_id, service_id, item_name,
          quantity, unit_price, total_price
        ) VALUES ($1, $2, $3, $4, $5, 1, $6, $7)
        RETURNING id
        `,
        [
          orderId,
          line.type,
          line.catalog_offer_id,
          line.service_id,
          line.item_name,
          line.unit_price,
          line.total_price,
        ]
      );
      if (line.type === "ANIMAL") {
        animalItemId = ins.rows[0].id;
      }
    }

    if (!animalItemId) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Gagal menyimpan item pesanan" }, { status: 500 });
    }

    for (const p of cleaned) {
      await client.query(
        `
        INSERT INTO order_participants (order_item_id, participant_name, father_name)
        VALUES ($1, $2, $3)
        `,
        [animalItemId, p.name, p.fatherName]
      );
    }

    await client.query(
      `
      INSERT INTO transactions (order_id, payment_method_code, transaction_type, amount, status)
      VALUES ($1, $2, 'PELUNASAN', $3, 'PENDING')
      `,
      [orderId, code, grandTotal]
    );

    await client.query("COMMIT");

    const base =
      process.env.APP_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    try {
      const token = process.env.QSTASH_TOKEN;
      if (token) {
        const { Client } = await import("@upstash/qstash");
        const q = new Client({ token });
        await q.publishJSON({
          url: `${base.replace(/\/$/, "")}/api/webhooks/payment-verify`,
          body: { orderId: Number(orderId), invoice_number: invoice },
        });
      }
    } catch {
      /* QStash optional in dev */
    }

    try {
      const tplRow = await pool.query<{
        id: string;
        template_text: string;
      }>(
        `SELECT id, template_text FROM notif_templates WHERE name = 'CHECKOUT' LIMIT 1`,
      );

      if (tplRow.rows.length > 0) {
        const templateId = Number(tplRow.rows[0].id);
        const templateText = tplRow.rows[0].template_text;

        const pmRow = await pool.query<{
          name: string;
          bank_name: string | null;
          account_number: string | null;
          account_holder_name: string | null;
        }>(
          `SELECT name, bank_name, account_number, account_holder_name
           FROM payment_methods WHERE code = $1 LIMIT 1`,
          [code],
        );

        let paymentInfo = "-";
        if (pmRow.rows.length > 0) {
          const pm = pmRow.rows[0];
          const parts: string[] = [];
          if (pm.bank_name) parts.push(pm.bank_name);
          if (pm.account_number) parts.push(`No. Rek: ${pm.account_number}`);
          if (pm.account_holder_name) parts.push(`a.n. ${pm.account_holder_name}`);
          if (parts.length > 0) paymentInfo = parts.join("\n");
          else paymentInfo = pm.name;
        }

        const orderDate = new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const participantNames = cleaned.map((p) => p.name).join(", ");
        const itemName = lines.map((l) => l.item_name).join(", ");
        const trackingUrl = `${base.replace(/\/$/, "")}/lacak/${invoice}`;

        const message = renderTemplate(templateText, {
          customer_name: name,
          order_date: orderDate,
          invoice_number: invoice,
          participant_names: participantNames,
          customer_phone: phone,
          item_name: itemName,
          grand_total: formatIDR(grandTotal),
          payment_info: paymentInfo,
          tracking_url: trackingUrl,
        });

        const waResult = await sendWhatsApp(phoneNormalized, message);

        await pool.query(
          `SELECT setval('notif_logs_id_seq',
            GREATEST(nextval('notif_logs_id_seq'),
              (SELECT COALESCE(MAX(id),0)+1 FROM notif_logs)))`,
        );

        await pool.query(
          `INSERT INTO notif_logs
            (order_id, template_id, target_number, status, payload, provider_response)
           VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)`,
          [
            Number(orderId),
            templateId,
            phoneNormalized,
            waResult.ok ? "SENT" : "FAILED",
            JSON.stringify({ messageType: "text", to: phoneNormalized, body: message }),
            JSON.stringify(waResult.data ?? { error: waResult.error }),
          ],
        );
      }
    } catch (waErr) {
      console.error("[WhatsApp CHECKOUT]", waErr);
    }

    return NextResponse.json({
      invoice_number: invoice,
      order_id: Number(orderId),
      grand_total: grandTotal,
    });
  } catch (e) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* ignore */
    }
    console.error(e);
    return NextResponse.json(
      { error: "Gagal menyimpan pesanan. Coba lagi." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
