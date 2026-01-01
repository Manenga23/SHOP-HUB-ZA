export type Provider = "amazon" | "temu" | "shein";

export type UnifiedProduct = {
  provider: Provider;
  providerProductId: string;
  title: string;
  price: number | null;
  currency: "ZAR" | "USD" | string;
  imageUrl: string | null;
  productUrl: string;
  category?: string | null;
  brand?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  updatedAt: string; // ISO
};

export function stableId(p: Pick<UnifiedProduct, "provider" | "providerProductId">) {
  return `${p.provider}:${p.providerProductId}`;
}
