import Head from "next/head";
import { useRouter } from "next/router";
import { providers } from "@/lib/providers";

export default function StorePage() {
  const router = useRouter();
  const provider = String(router.query.provider || "");
  const site = process.env.NEXT_PUBLIC_SITE_NAME || "Shop Hub ZA";
  const label = (providers as any)[provider]?.label || provider;

  return (
    <>
      <Head><title>{label} — {site}</title></Head>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "system-ui, Arial" }}>
        <a href="/" style={{ textDecoration: "none" }}>← Home</a>
        <h1 style={{ marginTop: 12 }}>{label}</h1>
        <p>Store landing page (add featured deals + SEO content here).</p>
      </div>
    </>
  );
}
