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
    amazon: true, temu: true, shein: true
  });

  const providersParam = useMemo(() => {
    const picked = providerList.filter(p => activeProviders[p]);
    return picked.join(",");
  }, [activeProviders]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!q) return;
      setLoading(true);
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(q)}&providers=${encodeURIComponent(providersParam)}`);
        const data = await r.json();
        if (!cancelled) setResults(data.results || []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [q, providersParam]);

  return (
    <>
      <Head><title>{q ? `${q} — ${site}` : `Search — ${site}`}</title></Head>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: 20, fontFamily: "system-ui, Arial" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ textDecoration: "none" }}>{site}</a>
          <form action="/search" style={{ display: "flex", gap: 10, flex: 1, maxWidth: 640 }}>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search products..."
              style={{ flex: 1, padding: 10, borderRadius: 12, border: "1px solid #ccc" }}
            />
            <button style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #ccc", cursor: "pointer" }}>
              Search
            </button>
          </form>
        </header>

        <section style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {providerList.map(p => (
            <label key={p} style={{ display: "inline-flex", gap: 8, alignItems: "center", border: "1px solid #ddd", padding: "8px 10px", borderRadius: 999 }}>
              <input
                type="checkbox"
                checked={!!activeProviders[p]}
                onChange={(e) => setActiveProviders(prev => ({ ...prev, [p]: e.target.checked }))}
              />
              {providers[p].label}
            </label>
          ))}
        </section>

        <section style={{ marginTop: 18 }}>
          {!q && <p>Type a search above.</p>}
          {q && loading && <p>Searching…</p>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {results.map((p) => {
              const zar = (p.price != null) ? toZar(p.price, String(p.currency)) : null;
              const outUrl = `/api/out?provider=${encodeURIComponent(p.provider)}&id=${encodeURIComponent(p.providerProductId)}&url=${encodeURIComponent(p.productUrl)}`;

              return (
                <div key={`${p.provider}:${p.providerProductId}`} style={{ border: "1px solid #ddd", borderRadius: 14, padding: 12 }}>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>{providers[p.provider].label}</div>

                  <div style={{ height: 140, marginTop: 8, borderRadius: 12, border: "1px solid #eee", display: "grid", placeItems: "center", overflow: "hidden" }}>
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={p.title} src={p.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ opacity: 0.6, fontSize: 12 }}>No image</div>
                    )}
                  </div>

                  <div style={{ marginTop: 10, fontWeight: 600, lineHeight: 1.2 }}>{p.title}</div>

                  <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <div style={{ fontWeight: 700 }}>
                      {zar != null ? formatZar(zar) : "—"}
                    </div>

                    <a href={outUrl}
                      style={{ border: "1px solid #ccc", padding: "8px 10px", borderRadius: 12, textDecoration: "none" }}>
                      Buy
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {q && !loading && results.length === 0 && (
            <p style={{ marginTop: 14 }}>
              No results yet. Add deals in <code>src/data/featured_deals.json</code> or connect provider APIs.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
