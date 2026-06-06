import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Instagram } from "lucide-react";
import { getInstagramPosts } from "@/lib/instagram.functions";

export function InstagramFeed() {
  const fetchPosts = useServerFn(getInstagramPosts);
  const { data, isLoading } = useQuery({
    queryKey: ["instagram-feed"],
    queryFn: () => fetchPosts(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const items = data?.items ?? [];
  const hasError = !isLoading && (!!data?.error || items.length === 0);

  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Instagram</span>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Bizi Takip Edin</h2>
          <p className="mt-2 text-muted-foreground">Son paylaşımlarımıza göz atın.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : hasError ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-secondary/40 p-8 text-center">
            <Instagram className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Gönderiler şu an yüklenemiyor. Bizi Instagram'da takip etmeyi unutmayın.
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
}
