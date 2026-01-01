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

      <div className="container">
        <div className="nav">
          <a className="brand" href="/">{site}</a>
          <a href="/search" style={{ textDecoration: "none" }}>Search</a>
        </div>

        <section className="hero">
          <h1 className="h1">Search once. Shop anywhere.</h1>
          <p className="p">Compare products across Amazon, Temu and SHEIN — then buy directly from the store.</p>

          <form className="searchRow" action="/search">
            <input
              className="input"
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search e.g. air fryer, sneakers, phone case..."
            />
            <button className="btn" type="submit">Search</button>
          </form>

          <div className="p" style={{ fontSize: 14, marginTop: 12 }}>
            Affiliate disclosure: Shop Hub ZA may earn a commission from qualifying purchases.
          </div>
        </section>

        <section style={{ marginTop: 18 }}>
          <h3 style={{ margin: "0 0 10px" }}>Popular categories</h3>
          <div className="pills">
            {["Fashion", "Electronics", "Home", "Beauty", "Baby", "Sports"].map((c) => (
              <a key={c} className="pill" href={`/search?q=${encodeURIComponent(c)}`}>{c}</a>
            ))}
          </div>
        </section>

       <footer className="footer">
  <div className="disclosure">
    Affiliate Disclosure: We may earn commissions from qualifying purchases.
    <a href="/disclosure" style={{ marginLeft: 6, textDecoration: "underline" }}>
      Learn more
    </a>
  </div>
  <div>
    © {new Date().getFullYear()} Shop Hub ZA.
  </div>
</footer>

