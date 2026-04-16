import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { pool } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const invoice = form.get("invoice") as string | null;

    if (!file || !invoice) {
      return NextResponse.json(
        { error: "File dan nomor invoice wajib diisi" },
        { status: 400 },
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 },
      );
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file harus JPG, PNG, WebP, atau PDF" },
        { status: 400 },
      );
    }

    const txRow = await pool.query<{ transaction_id: string }>(
      `SELECT t.id AS transaction_id
       FROM transactions t
       JOIN orders o ON o.id = t.order_id
       WHERE o.invoice_number = $1
       ORDER BY t.id DESC LIMIT 1`,
      [invoice.trim()],
    );

    if (txRow.rows.length === 0) {
      return NextResponse.json(
        { error: "Order atau transaksi tidak ditemukan" },
        { status: 404 },
      );
    }

    const transactionId = Number(txRow.rows[0].transaction_id);

    const ext = file.name.split(".").pop() ?? "jpg";
    const pathname = `proof/${invoice.replace(/[^a-zA-Z0-9-]/g, "_")}.${ext}`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
    });

    await pool.query(
      `SELECT setval('payment_receipts_id_seq',
        GREATEST(nextval('payment_receipts_id_seq'),
          (SELECT COALESCE(MAX(id),0)+1 FROM payment_receipts)))`,
    );

    const receiptRow = await pool.query<{ id: string }>(
      `INSERT INTO payment_receipts (transaction_id, file_url, status)
       VALUES ($1, $2, 'PENDING')
       RETURNING id`,
      [transactionId, blob.url],
    );

    return NextResponse.json({
      url: blob.url,
      receipt_id: Number(receiptRow.rows[0].id),
    });
  } catch (err) {
    console.error("Upload proof error:", err);
    return NextResponse.json(
      { error: "Gagal mengupload file. Coba lagi." },
      { status: 500 },
    );
  }
}
