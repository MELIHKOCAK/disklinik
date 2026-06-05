import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Stethoscope } from "lucide-react";
import heroSmile from "@/assets/hero-smile.jpg";

export function Hero() {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:px-8 lg:py-32">
        <div className="text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            20+ yıllık uzman kadro
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Sağlıklı gülüşler,<br />
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">güvenli ellerde.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Modern teknoloji, ağrısız tedavi yöntemleri ve insan odaklı yaklaşımımızla
            ağız ve diş sağlığınız için yanınızdayız.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-7 shadow-lg shadow-primary/20">
              <Link to="/randevu">
                Randevu Al <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-7">
              <Link to="/" hash="hizmetler">
                <Stethoscope className="mr-1 h-4 w-4" /> Hizmetlerimiz
              </Link>
            </Button>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 text-left">
            <div>
              <dt className="text-3xl font-bold text-foreground">15k+</dt>
              <dd className="text-xs text-muted-foreground">Mutlu hasta</dd>
            </div>
            <div>
              <dt className="text-3xl font-bold text-foreground">20+</dt>
              <dd className="text-xs text-muted-foreground">Yıllık deneyim</dd>
            </div>
            <div>
              <dt className="text-3xl font-bold text-foreground">12</dt>
              <dd className="text-xs text-muted-foreground">Uzman hekim</dd>
            </div>
          </dl>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-primary-glow/30 blur-3xl" />
          <div className="absolute -bottom-8 -right-4 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
          <div className="glass-card relative overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={heroSmile}
              alt="Sağlıklı ve mutlu bir gülümseme"
              width={1024}
              height={1280}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
