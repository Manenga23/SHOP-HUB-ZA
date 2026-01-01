import type { Provider, UnifiedProduct } from "./normalize";

type SearchFn = (q: string) => Promise<UnifiedProduct[]>;

/**
 * Provider adapters (stubs until you add approved API credentials + endpoints).
 * Keep secrets server-side (only use them inside API routes).
 */
async function amazonSearch(q: string): Promise<UnifiedProduct[]> {
  void q;
  return [];
}
async function temuSearch(q: string): Promise<UnifiedProduct[]> {
  void q;
  return [];
}
async function sheinSearch(q: string): Promise<UnifiedProduct[]> {
  void q;
  return [];
}

export const providers: Record<Provider, { label: string; search: SearchFn }> = {
  amazon: { label: "Amazon", search: amazonSearch },
  temu: { label: "Temu", search: temuSearch },
  shein: { label: "SHEIN", search: sheinSearch }
};

export const providerList: Provider[] = ["amazon", "temu", "shein"];
