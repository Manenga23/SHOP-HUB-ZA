import Head from "next/head";
import { useRouter } from "next/router";

export default function ProductPage() {
  const router = useRouter();
  const id = String(router.query.id || "");
  const site = process.env.NEXT_PUBLIC_SITE_NAME || "Shop Hub ZA";

  return (
    <>
      <Head><title>Product — {site}</title></Head>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "system-ui, Arial" }}>
        <a href="/search" style={{ textDecoration: "none" }}>← Back to search</a>
        <h1 style={{ marginTop: 12 }}>Product</h1>
        <p style={{ opacity: 0.75 }}>ID: {id}</p>
        <p>
          This page becomes fully functional once your provider adapters store product details in a cache/database.
        </p>
      </div>
    </>
  );
}
