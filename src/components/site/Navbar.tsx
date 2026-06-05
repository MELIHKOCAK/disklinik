import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Anasayfa", to: "/", hash: undefined },
  { label: "Hizmetler", to: "/", hash: "hizmetler" },
  { label: "Hakkımızda", to: "/", hash: "hakkimizda" },
  { label: "İletişim", to: "/", hash: "iletisim" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          Beyaz Diş
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button asChild size="lg" className="rounded-full shadow-md transition-transform hover:scale-105">
            <Link to="/randevu">Randevu Al</Link>
          </Button>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden grid place-items-center h-10 w-10 rounded-lg hover:bg-muted"
          aria-label="Menü"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div className={cn("md:hidden overflow-hidden border-t border-border/60 transition-all", open ? "max-h-96" : "max-h-0")}>
        <div className="flex flex-col gap-1 px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Button asChild className="mt-2 rounded-full">
            <Link to="/randevu" onClick={() => setOpen(false)}>Randevu Al</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
