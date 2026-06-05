import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Archive, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/mesajlar")({
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: messages = [] } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const selected = messages.find((m) => m.id === selectedId) ?? messages[0];

  const update = async (id: string, status: string) => {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["messages"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
    toast.success("Güncellendi");
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Mesajlar</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card className="overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-border">
            {messages.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">Mesaj yok</p>}
            {messages.map((m) => (
              <button key={m.id} onClick={() => setSelectedId(m.id)} className={cn(
                "block w-full text-left p-4 hover:bg-muted/50 transition-colors",
                selected?.id === m.id && "bg-muted"
              )}>
                <div className="flex items-center justify-between">
                  <p className={cn("font-medium text-sm", m.status === "okunmadi" && "text-foreground", m.status !== "okunmadi" && "text-muted-foreground")}>{m.full_name}</p>
                  {m.status === "okunmadi" && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{m.email}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{m.message}</p>
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          {selected ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold">{selected.full_name}</h2>
                  <p className="text-sm text-muted-foreground">{selected.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{format(new Date(selected.created_at), "d MMM yyyy HH:mm", { locale: tr })}</p>
                </div>
                <Badge variant={selected.status === "okunmadi" ? "default" : "secondary"}>{selected.status}</Badge>
              </div>
              <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">{selected.message}</p>
              <div className="mt-6 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => update(selected.id, "okundu")}><Check className="mr-1 h-4 w-4" /> Okundu</Button>
                <Button size="sm" variant="outline" onClick={() => update(selected.id, "arsivlendi")}><Archive className="mr-1 h-4 w-4" /> Arşivle</Button>
              </div>
            </>
          ) : <p className="text-sm text-muted-foreground">Bir mesaj seçin</p>}
        </Card>
      </div>
    </div>
  );
}
