import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { rateLimitTracker } from "@/lib/rate-limit";
import { jsPDF } from "jspdf";

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

  const pdf = generateCertificatePDF(data);
  const buffer = pdf.output("arraybuffer");

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Sertifikat-${invoice}.pdf"`,
    },
  });
}

function formatHijriDate(date: Date): string {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const hijriYear = Math.floor((year - 622) * (33 / 32)) + 1;

  return `${day} ${month} ${year} - ${hijriYear} H`;
}

function generateCertificatePDF(data: CertRow): jsPDF {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const participantName =
    data.participant_name || data.customer_name;
  const location =
    data.slaughter_location || data.branch_name || "-";
  const slaughterDate = data.slaughtered_at
    ? formatHijriDate(new Date(data.slaughtered_at))
    : formatHijriDate(new Date());
  const productName = data.item_name || "Qurban";

  drawPage(doc, pageW, pageH, {
    heading: "L A P O R A N",
    subHeading: productName,
    participantName,
    location,
    date: slaughterDate,
    showSignature: true,
  });

  doc.addPage("a4", "landscape");

  drawPage(doc, pageW, pageH, {
    heading: "S E R T I F I K A T",
    subHeading: productName,
    participantName,
    location,
    date: slaughterDate,
    showSignature: false,
  });

  return doc;
}

function drawPage(
  doc: jsPDF,
  pageW: number,
  pageH: number,
  opts: {
    heading: string;
    subHeading: string;
    participantName: string;
    location: string;
    date: string;
    showSignature: boolean;
  }
) {
  const cx = pageW / 2;

  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, pageW, pageH, "F");

  const margin = 12;
  const innerW = pageW - margin * 2;
  const innerH = pageH - margin * 2;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, margin, innerW, innerH, 4, 4, "F");

  doc.setDrawColor(30, 58, 95);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin + 4, margin + 4, innerW - 8, innerH - 8, 2, 2, "S");

  let y = margin + 25;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(30, 58, 95);
  doc.text(opts.heading, cx, y, { align: "center" });
  y += 12;

  doc.setFontSize(16);
  doc.setTextColor(120, 120, 120);
  doc.text(opts.subHeading, cx, y, { align: "center" });
  y += 16;

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text("Dipersembahkan Khusus Kepada :", cx, y, { align: "center" });
  y += 14;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(30, 58, 95);
  doc.text(opts.participantName, cx, y, { align: "center" });
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(
    "Terima kasih telah memilih berqurban di Rumah Qurban",
    cx,
    y,
    { align: "center" }
  );
  y += 16;

  const colGap = 60;
  const leftColX = cx - colGap;
  const rightColX = cx + colGap;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 95);
  doc.text("Lokasi", leftColX, y, { align: "center" });
  doc.text("Tanggal", rightColX, y, { align: "center" });
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(opts.location, leftColX, y, { align: "center" });
  doc.text(opts.date, rightColX, y, { align: "center" });
  y += 16;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const doaText =
    "Semoga amal ibadah qurbannya diterima oleh Allah SWT dan senantiasa dirahmati dengan iman, ilmu,\namal shaleh serta akhlak yang mulia, dan juga kebaikan di dunia dan akhirat. Aamiin";
  doc.text(doaText, cx, y, {
    align: "center",
    maxWidth: innerW - 40,
  });
  y += 16;

  if (opts.showSignature) {
    y = pageH - margin - 30;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 95);
    doc.text("Edhu Enriadis Adilingga", cx, y, { align: "center" });
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Project Leader Rumah Qurban", cx, y, { align: "center" });
  }
}
