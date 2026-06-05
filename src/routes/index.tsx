import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Services, servicesQuery } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beyaz Diş Kliniği — Modern Diş Sağlığı" },
      { name: "description", content: "İstanbul'da modern teknoloji ve uzman kadromuzla sağlıklı, estetik gülüşler için yanınızdayız. Hemen randevu alın." },
      { property: "og:title", content: "Beyaz Diş Kliniği" },
      { property: "og:description", content: "Modern teknoloji ve uzman kadromuzla sağlıklı gülüşler." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: HomePage,
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <p className="text-sm text-muted-foreground">Sayfa yüklenirken bir hata oluştu: {error.message}</p>
    </div>
  ),
});

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Yükleniyor…</div>}>
          <Services />
        </Suspense>
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
