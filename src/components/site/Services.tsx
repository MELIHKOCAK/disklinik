import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Stethoscope, Smile, Sparkles, Activity, HeartPulse, Baby, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Genel Diş Muayenesi": ShieldCheck,
  "İmplant Tedavisi": Activity,
  "Diş Beyazlatma": Sparkles,
  "Ortodonti": Smile,
  "Kanal Tedavisi": HeartPulse,
  "Çocuk Diş Hekimliği": Baby,
};

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data;
  },
});

export function Services() {
  const { data: services } = useSuspenseQuery(servicesQuery);
  return (
    <section id="hizmetler" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Hizmetlerimiz</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Size özel tedavi çözümleri
          </h2>
          <p className="mt-4 text-muted-foreground">
            Uzman kadromuz ve modern ekipmanlarımızla ihtiyacınız olan her tedaviyi
            güvenle sunuyoruz.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = iconMap[s.title] ?? Stethoscope;
            return (
              <Card key={s.id} className="group relative overflow-hidden border-border/60 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
