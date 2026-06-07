import { createServerFn } from "@tanstack/react-start";

export type IGItem = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
};

export type IGResult = { items: IGItem[]; error: string | null };

export const getInstagramPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<IGResult> => {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const businessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    if (!token) {
      console.error("[Instagram] INSTAGRAM_ACCESS_TOKEN tanımlı değil");
      return { items: [], error: "missing_token" };
    }

    if (!businessId) {
      console.error("[Instagram] INSTAGRAM_BUSINESS_ACCOUNT_ID tanımlı değil");
      return { items: [], error: "missing_business_id" };
    }

    try {
      const url = `https://graph.facebook.com/v25.0/${businessId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=8&access_token=${encodeURIComponent(token)}`;
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.text();
        console.error("[Instagram] HTTP", res.status, body);
        return { items: [], error: `http_${res.status}` };
      }
      const json = (await res.json()) as { data?: IGItem[] };
      const items = Array.isArray(json.data) ? json.data.slice(0, 8) : [];
      return { items, error: null };
    } catch (err) {
      console.error("[Instagram] fetch error:", err);
      return { items: [], error: "fetch_failed" };
    }
  },
);
