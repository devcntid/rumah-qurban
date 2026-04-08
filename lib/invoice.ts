export function generateInvoiceNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `INV-WEB-${ts}-${r}`;
}
