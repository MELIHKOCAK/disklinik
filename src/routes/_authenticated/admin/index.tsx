import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CalendarDays, MessageSquare, Stethoscope, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function useStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    staleTime: 60_000,
    queryFn: async () => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      const [todayAppts, pendingAppts, unreadMsgs, totalServices] = await Promise.all([
        supabase.from("appointments").select("id", { count: "exact", head: true })
          .gte("appointment_date", today.toISOString()).lt("appointment_date", tomorrow.toISOString()),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "beklemede"),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "okunmadi"),
        supabase.from("services").select("id", { count: "exact", head: true }),
      ]);
      return {
        today: todayAppts.count ?? 0,
        pending: pendingAppts.count ?? 0,
        unread: unreadMsgs.count ?? 0,
        services: totalServices.count ?? 0,
      };
    },
  });
}

function Dashboard() {
  const { data } = useStats();
  const cards = [
    { label: "Bugünkü Randevular", value: data?.today ?? "—", icon: CalendarDays },
    { label: "Bekleyen Randevular", value: data?.pending ?? "—", icon: Clock },
    { label: "Okunmamış Mesajlar", value: data?.unread ?? "—", icon: MessageSquare },
    { label: "Toplam Hizmet", value: data?.services ?? "—", icon: Stethoscope },
  ];
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Yönetim Paneli</h1>
      <p className="mt-1 text-muted-foreground">Klinik özeti</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{c.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
