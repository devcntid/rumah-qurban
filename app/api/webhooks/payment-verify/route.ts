import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(req: Request) {
  try {
    const body = (await req.json()) as {
      orderId?: number;
      invoice_number?: string;
    };
    console.info("[payment-verify] queued", body);
    return Response.json({ ok: true, received: body });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}

const hasQstashKeys =
  Boolean(process.env.QSTASH_CURRENT_SIGNING_KEY) &&
  Boolean(process.env.QSTASH_NEXT_SIGNING_KEY);

export const POST = hasQstashKeys
  ? verifySignatureAppRouter(handler, {
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
    })
  : handler;
