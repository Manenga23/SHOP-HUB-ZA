import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { UnifiedProduct } from "@/lib/normalize";
import { providerList, providers } from "@/lib/providers";
import { formatZar, toZar } from "@/lib/money";

export default function SearchPage() {
  const site = process.env.NEXT_PUBLIC_SITE_NAME || "Shop Hub ZA";
  const router = useRouter();
  const q = String(router.query.q || "").trim();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UnifiedProduct[]>([]);
  const [activeProviders, setActiveProviders] = useState<Record<string, boolean>>({
    amazon: true,
    temu: true,
    shein: true
  });

  const providersParam = useMemo(() => {
    return providerList.filter((p) => activeProviders[p]).join(",");
  }, [activeProviders]);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        const r = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&providers=${encodeURIComponent(providersParam)}`
        );
        const data = await r.json();
        if (!cancelled) setResults(data.results || []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [q, providersParam]);

  return (
    <>
      <Head>
        <title>{q ? `${q} — ${site}` : `Search — ${site}`}</title>
      </Head>

      <div className="container">
        {/* Header */}
        <div className="nav">
          <a className="brand" href="/">
            {site}
          </a>

          <form action="/search" className="searchRow" style={{ maxWidth: 520 }}>
            <input className="input" name="q" defaultValue={q} placeholder="Search products..." />
            <button className="btn" type="submit">
              Search
            </button>
          </form>
        </div>

        {/* Provider filters */}
        <div className="filters">
          {providerList.map((p) => (
            <label key={p} className="chip">
              <input
                type="checkbox"
                checked={!!activeProviders[p]}
                onChange={(e) => setActiveProviders((prev) => ({ ...prev, [p]: e.target.checked }))}
              />
              {providers[p].label}
            </label>
          ))}
        </div>

        {/* Status */}
        {!q && <p className="p">Type a search above.</p>}
        {q && loading && <p className="p">Searching…</p>}

        {/* Results grid */}
        <div className="grid">
          {results.map((p) => {
            const zar = p.price != null ? toZar(p.price, String(p.currency)) : null;
            const outUrl =
              `/api/out?provider=${encodeURIComponent(p.provider)}` +
              `&id=${encodeURIComponent(p.providerProductId)}` +
              `&url=${encodeURIComponent(p.productUrl)}`;

            return (
              <div key={`${p.provider}:${p.providerProductId}`} className="card">
                <div className="small">{providers[p.provider].label}</div>

                <div className="imgBox">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="small">No image</div>
                  )}
                </div>

                <div className="title">{p.title}</div>

                <div className="row">
                  <div style={{ fontWeight: 800 }}>{zar != null ? formatZar(zar) : "—"}</div>

                  <a href={outUrl} className="buy" target="_blank" rel="noopener noreferrer">
                    Buy
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {q && !loading && results.length === 0 && (
          <p className="p" style={{ marginTop: 16 }}>
            No results found. Try another search or enable more stores.
          </p>
        )}

        <footer className="footer"><footer className="footer">
  <div className="disclosure">
    Affiliate Disclosure: Shop Hub ZA participates in affiliate programs, including Amazon Associates,
    and may earn a commission from qualifying purchases at no extra cost to you.
  </div>
  <div>
    © {new Date().getFullYear()} Shop Hub ZA. All rights reserved.
  </div>
</footer>
