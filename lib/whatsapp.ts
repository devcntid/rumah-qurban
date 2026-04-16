export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.slice(1);
  return cleaned;
}

export function renderTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    return vars[key] ?? match;
  });
}

export async function sendWhatsApp(
  phone: string,
  message: string,
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const apiUrl = process.env.STARSENDER_API_URL;
  const apiKey = process.env.STARSENDER_API_KEY;

  if (!apiUrl || !apiKey) {
    return { ok: false, error: "STARSENDER env vars not configured" };
  }

  const to = normalizePhone(phone);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        messageType: "text",
        to,
        body: message,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}`, data };
    }

    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
