export type CatalogProduct = {
  id: number;
  catalog_offer_id: number;
  type: string;
  typeName: string;
  weight: string;
  price: number;
  img: string;
  desc: string;
  location?: string;
  target?: number;
  current?: number;
  animal_variant_id: number;
  product_code: string;
  requires_shipping: boolean;
  shipping_fee: number | null;
  slaughter_fee: number | null;
  max_participants: number;
  species: string;
  /** Cabang untuk QA; null untuk produk nasional */
  branch_id: number | null;
};

export type BranchRow = { id: number; name: string };

export type PaymentMethodOption = {
  id: string;
  name: string;
  type: "qris" | "va" | "ewallet" | "transfer";
  code: string;
  bank?: string;
  account?: string;
};

export type PaymentCategory = {
  id: string;
  title: string;
  subtitle: string;
  examples: string;
  options: PaymentMethodOption[];
};
