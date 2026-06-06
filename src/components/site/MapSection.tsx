import { MapPin } from "lucide-react";

const ADDRESS = "Yavruturna Mahallesi, Maliye 3. Sokak No:6, Merkez/Çorum";

export function MapSection() {
  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
  const src = key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encodeURIComponent(ADDRESS)}&language=tr&region=TR`
    : `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;

  return (
    <section id="harita" className="scroll-mt-24 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start gap-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Konum</span>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Bizi Ziyaret Edin</h2>
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" /> {ADDRESS}
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg ring-1 ring-primary/5">
          <iframe
            title="Klinik Konumu"
            src={src}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-[320px] w-full border-0 sm:h-[420px] md:h-[480px]"
          />
        </div>
      </div>
    </section>
  );
}
