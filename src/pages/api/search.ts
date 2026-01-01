import type { NextApiRequest, NextApiResponse } from "next";
import { providers, providerList } from "@/lib/providers";
import type { Provider, UnifiedProduct } from "@/lib/normalize";
import featuredDeals from "@/data/featured_deals.json";

function pickProviders(req: NextApiRequest): Provider[] {
  const p = (req.query.providers as string | undefined)?.split(",").map(s => s.trim()).filter(Boolean);
  const allowed = new Set(providerList);
  const filtered = (p || []).filter(x => allowed.has(x as Provider)) as Provider[];
  return filtered.length ? filtered : providerList;
}

function textMatch(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.toLowerCase());
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q as string | undefined)?.trim() || "";
  if (!q || q.length < 2) return res.status(200).json({ query: q, results: [] });

  const wanted = pickProviders(req);

  try {
    const resultsNested = await Promise.all(
      wanted.map(async (prov) => providers[prov].search(q))
    );
    let results: UnifiedProduct[] = resultsNested.flat();

    if (results.length === 0) {
      results = (featuredDeals as UnifiedProduct[]).filter(d =>
        wanted.includes(d.provider) &&
        (textMatch(d.title, q) || (d.category ? textMatch(d.category, q) : false))
      );
    }

    results.sort((a, b) => {
      const ap = a.price ?? Number.POSITIVE_INFINITY;
      const bp = b.price ?? Number.POSITIVE_INFINITY;
      return ap - bp;
    });

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ query: q, providers: wanted, results });
  } catch (e: any) {
    return res.status(500).json({ error: "Search failed", details: e?.message || String(e) });
  }
}
