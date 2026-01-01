import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const provider = String(req.query.provider || "");
  const id = String(req.query.id || "");
  const url = String(req.query.url || "");

  if (!provider || !id || !url) {
    return res.status(400).send("Missing provider, id, or url");
  }

  const sb = supabaseServer();
  if (sb) {
    try {
      await sb.from("click_events").insert([{
        ts: new Date().toISOString(),
        provider,
        provider_product_id: id,
        destination_url: url,
        referrer: req.headers.referer || null,
        user_agent: req.headers["user-agent"] || null
      }]);
    } catch {
      // ignore logging errors
    }
  }

  res.writeHead(302, { Location: url });
  res.end();
}
