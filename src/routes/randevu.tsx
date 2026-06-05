import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { servicesQuery } from "@/components/site/Services";
import { toast } from "sonner";

export const Route = createFileRoute("/randevu")({
  head: () => ({
    meta: [
      { title: "Randevu Al — Beyaz Diş Kliniği" },
      { name: "description", content: "Beyaz Diş Kliniği'nden online randevu alın. Hızlı ve kolay." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: RandevuPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "En az 2 karakter").max(255),
  phone: z.string().trim().min(7, "Geçerli bir telefon girin").max(50),
  email: z.string().trim().email("Geçerli e-posta").max(255).optional().or(z.literal("")),
  service_id: z.string().optional(),
  appointment_date: z.date({ required_error: "Tarih seçin" }),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Saat formatı: 09:30"),
  notes: z.string().max(1000).optional(),
});
type FormValues = z.infer<typeof schema>;

function RandevuPage() {
  const navigate = useNavigate();
  const { data: services } = useSuspenseQuery(servicesQuery);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { time: "10:00" },
  });
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const date = watch("appointment_date");
  const serviceId = watch("service_id");

  const onSubmit = async (v: FormValues) => {
    setSubmitting(true);
    const [h, m] = v.time.split(":").map(Number);
    const dt = new Date(v.appointment_date);
    dt.setHours(h, m, 0, 0);
    const { error } = await supabase.from("appointments").insert({
      full_name: v.full_name,
      phone: v.phone,
      email: v.email || null,
      service_id: v.service_id || null,
      appointment_date: dt.toISOString(),
      notes: v.notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Randevu oluşturulamadı: " + error.message);
      return;
    }
    setDone(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 hero-gradient">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Anasayfa
          </Link>
          {done ? (
            <div className="glass-card mt-6 rounded-3xl p-10 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
              <h1 className="mt-4 font-display text-3xl font-bold">Randevunuz alındı!</h1>
              <p className="mt-3 text-muted-foreground">
                En kısa sürede sizi arayarak randevunuzu teyit edeceğiz.
              </p>
              <Button onClick={() => navigate({ to: "/" })} className="mt-6 rounded-full" size="lg">Anasayfaya Dön</Button>
            </div>
          ) : (
            <>
              <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl">Randevu Al</h1>
              <p className="mt-3 text-muted-foreground">Aşağıdaki formu doldurun, en kısa sürede sizinle iletişime geçelim.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="glass-card mt-8 space-y-5 rounded-2xl p-6 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="full_name">Ad Soyad *</Label>
                    <Input id="full_name" {...register("full_name")} className="mt-1.5" />
                    {errors.full_name && <p className="mt-1 text-xs text-destructive">{errors.full_name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input id="phone" {...register("phone")} className="mt-1.5" placeholder="0532 123 45 67" />
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">E-posta (opsiyonel)</Label>
                  <Input id="email" type="email" {...register("email")} className="mt-1.5" />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div>
                  <Label>Hizmet</Label>
                  <Select value={serviceId} onValueChange={(v) => setValue("service_id", v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Bir hizmet seçin (opsiyonel)" /></SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (<SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label>Tarih *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" className={cn("mt-1.5 w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: tr }) : "Tarih seçin"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => d && setValue("appointment_date", d, { shouldValidate: true })}
                          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.appointment_date && <p className="mt-1 text-xs text-destructive">{errors.appointment_date.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="time">Saat *</Label>
                    <Input id="time" type="time" {...register("time")} className="mt-1.5" />
                    {errors.time && <p className="mt-1 text-xs text-destructive">{errors.time.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Not (opsiyonel)</Label>
                  <Textarea id="notes" {...register("notes")} className="mt-1.5 min-h-24" placeholder="Belirtmek istediğiniz bir şey var mı?" />
                </div>
                <Button type="submit" size="lg" disabled={submitting} className="w-full rounded-full">
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Randevu Talebi Gönder
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
