import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const site = process.env.NEXT_PUBLIC_SITE_NAME || "Shop Hub ZA";
  const [q, setQ] = useState("");

  return (
    <>
      <Head>
        <title>{site}</title>
        <meta name="description" content="Shop Hub ZA — compare deals across stores in one search." />
      </Head>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "system-ui, Arial" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0 }}>{site}</h1>
          <a href="/search" style={{ textDecoration: "none" }}>Search</a>
        </header>

        <section style={{ marginTop: 28, padding: 18, border: "1px solid #ddd", borderRadius: 14 }}>
          <h2 style={{ marginTop: 0 }}>Search once. Shop anywhere.</h2>
          <p style={{ marginTop: 6, opacity: 0.8 }}>
            Compare products across Amazon, Temu and SHEIN — then buy directly from the store.
          </p>

          <form action="/search" style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search e.g. air fryer, sneakers, phone case..."
              style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #ccc" }}
            />
            <button style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #ccc", cursor: "pointer" }}>
              Search
            </button>
          </form>

          <div style={{ marginTop: 14, fontSize: 14, opacity: 0.8 }}>
            Note: We may earn a commission when you buy via our links (where available).
          </div>
        </section>

        <section style={{ marginTop: 24 }}>
          <h3>Popular categories</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Fashion", "Electronics", "Home", "Beauty", "Baby", "Sports"].map((c) => (
              <a key={c} href={`/search?q=${encodeURIComponent(c)}`} style={{
                border: "1px solid #ddd", borderRadius: 999, padding: "8px 12px",
                textDecoration: "none"
              }}>
                {c}
              </a>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 24, padding: 16, border: "1px solid #eee", borderRadius: 14 }}>
          <h3 style={{ marginTop: 0 }}>MVP tip</h3>
          <p style={{ margin: 0, opacity: 0.85 }}>
            You can add/replace demo items in <code>src/data/featured_deals.json</code> to show real deals immediately,
            while you wait for Amazon/SHEIN/Temu API approvals.
          </p>
        </section>
      </div>
    </>
  );
}
