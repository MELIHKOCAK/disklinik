import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/randevular")({
  component: Page,
});

const statusLabels: Record<string, string> = {
  beklemede: "Beklemede", onaylandi: "Onaylandı", iptal_edildi: "İptal Edildi",
};
const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  beklemede: "secondary", onaylandi: "default", iptal_edildi: "destructive",
};

function Page() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", statusFilter],
    queryFn: async () => {
      let q = supabase.from("appointments").select("*").order("appointment_date", { ascending: false });
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const filtered = (data ?? []).filter((a) =>
    !search || a.full_name.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search)
  );

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Durum güncellendi");
    qc.invalidateQueries({ queryKey: ["appointments"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Randevular</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <Input placeholder="Ad veya telefon ile ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="beklemede">Beklemede</SelectItem>
            <SelectItem value="onaylandi">Onaylandı</SelectItem>
            <SelectItem value="iptal_edildi">İptal Edildi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Ad Soyad</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3 text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Yükleniyor...</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Kayıt bulunamadı</td></tr>}
              {filtered.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{a.full_name}</td>
                  <td className="px-4 py-3">{a.phone}</td>
                  <td className="px-4 py-3">{format(new Date(a.appointment_date), "d MMM yyyy HH:mm", { locale: tr })}</td>
                  <td className="px-4 py-3"><Badge variant={statusVariants[a.status]}>{statusLabels[a.status]}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "onaylandi")}>Onayla</Button>
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, "iptal_edildi")}>İptal</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
