import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().trim().min(2, "En az 2 karakter").max(255),
  email: z.string().trim().email("Geçerli bir e-posta girin").max(255),
  message: z.string().trim().min(10, "En az 10 karakter").max(5000),
});
type FormValues = z.infer<typeof schema>;

export function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(values);
    setSubmitting(false);
    if (error) {
      toast.error("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
      return;
    }
    toast.success("Mesajınız alındı, en kısa sürede dönüş yapacağız.");
    reset();
  };

  return (
    <section id="iletisim" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">İletişim</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Bize ulaşın
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Sorularınız mı var? Bize mesaj bırakın ya da doğrudan arayın.
            En kısa sürede dönüş yapıyoruz.
          </p>
          <ul className="mt-8 space-y-5 text-sm">
            <li className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></span>
              <div><p className="font-semibold text-foreground">Adres</p><p className="text-muted-foreground">Bağdat Cad. No: 123, Kadıköy / İstanbul</p></div>
            </li>
            <li className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Phone className="h-5 w-5" /></span>
              <div><p className="font-semibold text-foreground">Telefon</p><p className="text-muted-foreground">+90 (212) 555 12 34</p></div>
            </li>
            <li className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Mail className="h-5 w-5" /></span>
              <div><p className="font-semibold text-foreground">E-posta</p><p className="text-muted-foreground">info@beyazdis.com</p></div>
            </li>
            <li className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Clock className="h-5 w-5" /></span>
              <div><p className="font-semibold text-foreground">Çalışma Saatleri</p><p className="text-muted-foreground">Pzt–Cmt 09:00 – 19:00</p></div>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-5 rounded-2xl p-6 sm:p-8">
          <div>
            <Label htmlFor="full_name">Ad Soyad</Label>
            <Input id="full_name" {...register("full_name")} className="mt-1.5" placeholder="Adınız Soyadınız" />
            {errors.full_name && <p className="mt-1 text-xs text-destructive">{errors.full_name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" {...register("email")} className="mt-1.5" placeholder="ornek@email.com" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="message">Mesajınız</Label>
            <Textarea id="message" {...register("message")} className="mt-1.5 min-h-32" placeholder="Bize ne sormak istersiniz?" />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
          </div>
          <Button type="submit" disabled={submitting} size="lg" className="w-full rounded-full">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Mesaj Gönder
          </Button>
        </form>
      </div>
    </section>
  );
}
