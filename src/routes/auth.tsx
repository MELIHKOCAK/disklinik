import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Yönetici Girişi" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      navigate({ to: "/admin", replace: true });
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Hesap oluşturuldu. Yönetici yetkisi için site sahibine bilgi verin.");
    }
  };

  return (
    <div className="hero-gradient grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 font-display text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span>
          Beyaz Diş
        </Link>
        <Card className="p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold">{mode === "signin" ? "Yönetici Girişi" : "Hesap Oluştur"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Yönetim paneline erişmek için giriş yapın.</p>
          <form onSubmit={handle} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Şifre</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full" size="lg">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Giriş Yap" : "Kayıt Ol"}
            </Button>
          </form>
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground">
            {mode === "signin" ? "Hesabınız yok mu? Kayıt olun" : "Zaten hesabınız var mı? Giriş yapın"}
          </button>
        </Card>
      </div>
    </div>
  );
}
