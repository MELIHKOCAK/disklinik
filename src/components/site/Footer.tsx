import { Link } from "@tanstack/react-router";
import { Sparkles, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            Beyaz Diş Kliniği
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Modern teknoloji ve uzman ekibimizle sağlıklı, estetik gülüşler için yanınızdayız.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Hızlı Bağlantılar</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Anasayfa</Link></li>
            <li><Link to="/" hash="hizmetler" className="hover:text-foreground">Hizmetler</Link></li>
            <li><Link to="/" hash="hakkimizda" className="hover:text-foreground">Hakkımızda</Link></li>
            <li><Link to="/" hash="iletisim" className="hover:text-foreground">İletişim</Link></li>
            <li><Link to="/randevu" className="hover:text-foreground">Randevu Al</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">İletişim</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Bağdat Cad. No: 123, Kadıköy / İstanbul</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +90 (212) 555 12 34</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@beyazdis.com</li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-background text-muted-foreground hover:text-primary"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-background text-muted-foreground hover:text-primary"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-full bg-background text-muted-foreground hover:text-primary"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Beyaz Diş Kliniği. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
