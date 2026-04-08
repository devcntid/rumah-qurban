export function computeMaxParticipants(species: string, displayName: string): number {
  const n = displayName.toLowerCase();
  if (species === "Domba") return 1;
  if (species === "Sapi") {
    if (n.includes("kolektif") || n.includes("1/7") || n.includes("patungan")) return 1;
    return 7;
  }
  return 1;
}

export function deriveProductType(species: string, displayName: string): string {
  const n = displayName.toLowerCase();
  if (n.includes("kolektif") || n.includes("1/7") || n.includes("patungan")) return "SAPI_1_7";
  if (species === "Sapi") return "SAPI_UTUH";
  return "DOMBA";
}
