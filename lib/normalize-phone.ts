/**
 * Given a raw phone input, return all plausible stored formats.
 *
 * DB stores phones as `62xxxx` (no plus sign).
 * Customers commonly type `08xxxx` (local) or `+628xxxx`.
 *
 * Returns an array of unique candidates to match against `customer_phone`.
 */
export function phoneVariants(raw: string): string[] {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return [raw];

  const variants = new Set<string>();
  variants.add(raw);
  variants.add(digits);

  if (digits.startsWith("0")) {
    variants.add("62" + digits.slice(1));
  } else if (digits.startsWith("62")) {
    variants.add("0" + digits.slice(2));
  }

  return [...variants];
}
