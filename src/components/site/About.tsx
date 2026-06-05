import { Check } from "lucide-react";
import clinicImg from "@/assets/clinic-interior.jpg";

const values = [
  "Sterilizasyon ve hijyen standartlarında uluslararası protokoller",
  "Dijital röntgen ve 3D görüntüleme ile hassas teşhis",
  "Hasta konforunu önceleyen ağrısız tedavi yaklaşımları",
  "Tedavi öncesi şeffaf bilgilendirme ve planlama",
];

export function About() {
  return (
    <section id="hakkimizda" className="scroll-mt-24 bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Hakkımızda</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Güveniniz, en değerli tedavimiz.
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
            Beyaz Diş Kliniği olarak 20 yılı aşkın süredir İstanbul'da hizmet veriyoruz.
            Uzman hekim kadromuz ve son teknoloji ekipmanlarımızla, hastalarımıza
            sadece tedavi değil; rahat, güvenli ve şeffaf bir deneyim sunuyoruz.
          </p>
          <ul className="mt-8 space-y-3">
            {values.map((v) => (
              <li key={v} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm leading-relaxed text-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary-glow/30 blur-3xl" />
          <img
            src={clinicImg}
            alt="Beyaz Diş Kliniği iç mekan"
            width={1280}
            height={960}
            loading="lazy"
            className="relative w-full rounded-3xl object-cover shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
