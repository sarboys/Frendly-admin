import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { communities } from "../data";
import { adminPortal } from "../portal";
import { createPartnerCommunity, listPartnerCommunities } from "../partner/portal-api";
import type { PartnerCommunity } from "../partner/types";
import { MoreHorizontal } from "lucide-react";

export const AdminCommunities = () => {
  if (adminPortal === "partner") {
    return <PartnerCommunities />;
  }

  const navigate = useNavigate();
  return (
    <>
      <AdminTopbar title="Сообщества" subtitle={`${communities.length} клубов · модерация и аналитика`} />
      <div className="p-5 lg:p-8">
        <DataToolbar searchPlaceholder="Название, владелец, город…" addLabel="Новое сообщество" onAdd={() => {}} />

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Сообщество</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Владелец</TableHead>
                <TableHead className="text-right">Участники</TableHead>
                <TableHead className="text-right">Посты</TableHead>
                <TableHead>Создано</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {communities.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate(`/communities/${c.id}`)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[11px] font-semibold">
                        {c.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                      </div>
                      <p className="text-[13.5px] font-semibold">{c.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px]">{c.city}</TableCell>
                  <TableCell className="text-[13px]">{c.owner}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">{c.members}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">{c.posts}</TableCell>
                  <TableCell className="text-[12.5px] text-muted-foreground">{c.created}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

const defaultCommunityForm = {
  name: "",
  avatar: "🤝",
  description: "",
  tags: "",
  mood: "",
};

const PartnerCommunities = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PartnerCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultCommunityForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listPartnerCommunities();
      setItems(response.items);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить сообщества");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const update = (key: keyof typeof defaultCommunityForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await createPartnerCommunity({
        name: form.name,
        avatar: form.avatar,
        description: form.description,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        mood: form.mood,
      });
      setForm(defaultCommunityForm);
      setShowForm(false);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось создать сообщество");
    }
  };

  return (
    <>
      <AdminTopbar title="Сообщества" subtitle={`${items.length} ваших сообществ`} />
      <div className="p-5 lg:p-8 space-y-4">
        <DataToolbar searchPlaceholder="Название..." addLabel="Новое сообщество" onAdd={() => setShowForm((value) => !value)} />
        {showForm && (
          <form onSubmit={submit} className="rounded-lg border border-border bg-card p-4 grid gap-3 md:grid-cols-2">
            <Field label="Название" value={form.name} onChange={(value) => update("name", value)} />
            <Field label="Иконка" value={form.avatar} onChange={(value) => update("avatar", value)} />
            <Field label="Теги через запятую" value={form.tags} onChange={(value) => update("tags", value)} />
            <Field label="Настроение" value={form.mood} onChange={(value) => update("mood", value)} />
            <div className="space-y-2 md:col-span-2">
              <Label>Описание</Label>
              <Textarea value={form.description} onChange={(event) => update("description", event.target.value)} required />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Отмена</Button>
              <Button type="submit">Сохранить</Button>
            </div>
          </form>
        )}
        {error && <p className="text-[12px] text-destructive">{error}</p>}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Сообщество</TableHead>
                <TableHead>Приватность</TableHead>
                <TableHead className="text-right">Участники</TableHead>
                <TableHead className="text-right">Новости</TableHead>
                <TableHead>Создано</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-[13px] text-muted-foreground">Загрузка...</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-[13px] text-muted-foreground">Сообществ пока нет.</TableCell></TableRow>
              ) : (
                items.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate(`/communities/${c.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-[16px]">{c.avatar}</div>
                        <div>
                          <p className="text-[13.5px] font-semibold">{c.name}</p>
                          <p className="text-[11.5px] text-muted-foreground">{c.tags.join(", ") || c.mood}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={c.privacy} /></TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{c.membersCount}</TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{c.newsCount}</TableCell>
                    <TableCell className="text-[12.5px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString("ru")}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} required />
    </div>
  );
}
