import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import path from "path";
import fs from "fs";
import { pool } from "@/lib/db";
import { rateLimitTracker } from "@/lib/rate-limit";
import {
  CertificateTemplate,
  type CertificateTemplateProps,
} from "@/components/certificates/certificate-template";

type CertRow = {
  order_id: string;
  invoice_number: string;
  customer_name: string;
  order_status: string;
  participant_name: string | null;
  father_name: string | null;
  eartag_id: string | null;
  slaughter_location: string | null;
  slaughtered_at: string | null;
  performed_by: string | null;
  certificate_url: string | null;
  documentation_photos: string | null;
  item_name: string | null;
  branch_name: string | null;
};

export async function GET(req: NextRequest) {
  const invoice = req.nextUrl.searchParams.get("invoice")?.trim();
  if (!invoice) {
    return NextResponse.json(
      { error: "Parameter invoice wajib" },
      { status: 400 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "local";
  const rl = await rateLimitTracker(`cert:${ip}:${invoice.slice(0, 40)}`);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi sebentar." },
      { status: 429 }
    );
  }

  const { rows } = await pool.query<CertRow>(
    `
    SELECT
      o.id AS order_id,
      o.invoice_number,
      o.customer_name,
      o.status AS order_status,
      op.participant_name,
      op.father_name,
      fi.eartag_id,
      sr.slaughter_location,
      sr.slaughtered_at,
      sr.performed_by,
      sr.certificate_url,
      sr.documentation_photos::text AS documentation_photos,
      oi.item_name,
      b.name AS branch_name
    FROM orders o
    INNER JOIN order_items oi ON oi.order_id = o.id AND oi.item_type = 'ANIMAL'
    LEFT JOIN order_participants op ON op.order_item_id = oi.id
    LEFT JOIN farm_inventories fi ON fi.order_item_id = oi.id
    LEFT JOIN slaughter_records sr ON sr.order_item_id = oi.id
    LEFT JOIN branches b ON b.id = o.branch_id
    WHERE o.invoice_number = $1
    LIMIT 1
    `,
    [invoice]
  );

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Pesanan tidak ditemukan" },
      { status: 404 }
    );
  }

  const data = rows[0];

  if (data.order_status !== "FULL_PAID" && data.order_status !== "DP_PAID") {
    return NextResponse.json(
      { error: "Sertifikat tersedia setelah pembayaran terverifikasi." },
      { status: 403 }
    );
  }

  if (data.certificate_url) {
    return NextResponse.redirect(data.certificate_url);
  }

  const mainName = data.participant_name || data.customer_name;
  const slaughterDate = data.slaughtered_at
    ? new Date(data.slaughtered_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  const hijriYear = new Date().getFullYear() - 579;
  const slaughterLocation =
    data.slaughter_location || data.branch_name || "-";

  let photos: string[] = [];
  if (data.documentation_photos) {
    try {
      const parsed: { url: string }[] =
        typeof data.documentation_photos === "string"
          ? JSON.parse(data.documentation_photos)
          : data.documentation_photos;
      photos = parsed.slice(0, 4).map((p) => p.url);
    } catch {
      photos = [];
    }
  }

  const localLogo = path.join(process.cwd(), "public", "logo-agro.png");
  const logoFileExists = fs.existsSync(localLogo);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://tracking.rumahqurban.id";

  const props: CertificateTemplateProps = {
    mainName,
    slaughterDate,
    slaughterLocation,
    hijriYear,
    photos,
    logoPath: logoFileExists ? localLogo : undefined,
    logoUrl: logoFileExists ? undefined : `${siteUrl}/logo-agro.png`,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream = await renderToStream(
    React.createElement(CertificateTemplate, props) as any
  );

  const safeName = mainName.replace(/[^a-zA-Z0-9\s-]/g, "").trim();

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Sertifikat Qurban - ${safeName}.pdf"`,
    },
  });
}
