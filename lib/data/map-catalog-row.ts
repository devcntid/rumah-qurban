import { computeMaxParticipants, deriveProductType } from "@/lib/participants";
import type { CatalogProduct } from "@/lib/types/catalog";

export type CatalogRow = {
  id: string;
  display_name: string;
  projected_weight: string | null;
  price: string;
  image_url: string | null;
  sub_type: string | null;
  product_code: string;
  requires_shipping: boolean;
  animal_variant_id: string;
  species: string;
  class_grade: string | null;
  weight_range: string | null;
  variant_description: string | null;
  vendor_name: string | null;
  vendor_location: string | null;
  shipping_fee: string | null;
  slaughter_fee: string | null;
  branch_id: string | null;
};

export function mapRowToCatalogProduct(
  r: CatalogRow,
  productCode: string
): CatalogProduct {
  const price = Number(r.price);
  const shipping = r.shipping_fee != null ? Number(r.shipping_fee) : null;
  const slaughter = r.slaughter_fee != null ? Number(r.slaughter_fee) : null;
  const loc =
    r.vendor_location?.trim() || r.vendor_name?.trim() || "Lokasi mitra";
  const maxP = computeMaxParticipants(r.species, r.display_name);
  const pType = deriveProductType(r.species, r.display_name);
  const weight =
    r.projected_weight?.trim() || r.weight_range?.trim() || "—";
  const desc =
    r.variant_description?.trim() ||
    `Produk ${r.display_name}. Spesifikasi mengikuti katalog cabang.`;
  const img =
    r.image_url?.trim() ||
    "https://images.pexels.com/photos/840111/pexels-photo-840111.jpeg?auto=compress&cs=tinysrgb&w=600";

  return {
    id: Number(r.id),
    catalog_offer_id: Number(r.id),
    type: pType,
    typeName: r.display_name,
    weight,
    price,
    img,
    desc,
    location: productCode === "QB" ? loc : undefined,
    animal_variant_id: Number(r.animal_variant_id),
    product_code: r.product_code,
    requires_shipping: r.requires_shipping,
    shipping_fee: shipping,
    slaughter_fee: slaughter,
    max_participants: maxP,
    branch_id: r.branch_id != null ? Number(r.branch_id) : null,
  };
}
