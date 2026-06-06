import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";

const IG_TOKEN =
  "EAASw0OeksNQBRtNwoVKTNHBfZCLVjZABk54OLoPX11RTto5Rybv7oK3QaCz7JPeP4oAELrLsfm1Ne4iY2hHko9kXKiUP394HNwaPNXfMurjvvZCH6LhZCRQVOpNvTEJKDwcA6AtSYOsXWd17XEd4yp9DoZBiXq11p9Lxp4XXchBciehv6bYL5YEQRDqMdEtrvqD4KF4ZCKBteZAZCBUwFDRN5nZC7hrzzlIqqQ5Qkjhdz8YLthVqt8wqX6u42tnNdid5tT42Icz9O367oa6pQ238r1M0J";

type IGItem = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
};

export function InstagramFeed() {
  const [items, setItems] = useState<IGItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${IG_TOKEN}`;
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!Array.isArray(json.data)) throw new Error("Geçersiz yanıt");
        setItems((json.data as IGItem[]).slice(0, 8));
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Instagram feed error:", err);
        setError(true);
      }
    })();
    return () => ctrl.abort();
  }, []);

  if (error) return null;
  if (!items) {
    return (
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">Instagram</span>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Bizi Takip Edin</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (items.length === 0) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Instagram</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Bizi Takip Edin</h2>
          <p className="mt-2 text-muted-foreground">Son paylaşımlarımıza göz atın.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => {
            const img = it.media_type === "VIDEO" ? it.thumbnail_url || it.media_url : it.media_url;
            return (
              <a
                key={it.id}
                href={it.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-2xl bg-muted"
              >
                <img
                  src={img}
                  alt={it.caption?.slice(0, 80) || "Instagram gönderisi"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 grid place-items-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                  <Instagram className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
