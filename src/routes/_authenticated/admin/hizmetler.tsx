import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/hizmetler")({
  component: Page,
});

type Service = { id: string; title: string; description: string; image_url: string | null };

function Page() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);

  const { data: services = [] } = useQuery({
    queryKey: ["services-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data as Service[];
    },
  });

  const remove = async (id: string) => {
    if (!confirm("Bu hizmet silinsin mi?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Silindi");
    qc.invalidateQueries({ queryKey: ["services-admin"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Hizmetler</h1>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="rounded-full"><Plus className="mr-1 h-4 w-4" /> Yeni Hizmet</Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.id} className="p-5">
            <h3 className="font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="mr-1 h-3.5 w-3.5" /> Düzenle</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
            </div>
          </Card>
        ))}
      </div>
      <ServiceDialog open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}

function ServiceDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (b: boolean) => void; editing: Service | null }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset when opening
  useState(() => { /* noop */ });
  if (open && editing && title === "" && description === "") {
    setTitle(editing.title); setDescription(editing.description);
  }

  const close = () => { onOpenChange(false); setTitle(""); setDescription(""); };

  const save = async () => {
    if (!title.trim() || !description.trim()) { toast.error("Tüm alanları doldurun"); return; }
    setSaving(true);
    const payload = { title: title.trim(), description: description.trim() };
    const { error } = editing
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? "Güncellendi" : "Eklendi");
    qc.invalidateQueries({ queryKey: ["services-admin"] });
    qc.invalidateQueries({ queryKey: ["services"] });
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(b) => { if (!b) close(); else onOpenChange(b); }}>
      <DialogTrigger asChild><span /></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Hizmeti Düzenle" : "Yeni Hizmet"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="t">Başlık</Label>
            <Input id="t" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="d">Açıklama</Label>
            <Textarea id="d" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5 min-h-32" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={close}>İptal</Button>
          <Button onClick={save} disabled={saving}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
