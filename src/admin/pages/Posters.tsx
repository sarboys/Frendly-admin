import { FormEvent, useEffect, useState } from "react";
import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { posters } from "../data";
import { adminPortal } from "../portal";
import { createPartnerPoster, listPartnerPosters, submitPartnerPoster } from "../partner/portal-api";
import type { PartnerPoster } from "../partner/types";
import { MoreHorizontal } from "lucide-react";

export const AdminPosters = () => {
  if (adminPortal === "partner") {
    return <PartnerPosters />;
  }

  return (
    <>
      <AdminTopbar title="Афиша" subtitle="События для раздела «Афиша» — модерация" />
      <div className="p-5 lg:p-8">
        <DataToolbar searchPlaceholder="Название, площадка…" addLabel="Опубликовать афишу" onAdd={() => {}} />

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Событие</TableHead>
                <TableHead>Площадка</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="text-right">Идёт</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posters.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-[13.5px] font-semibold">{p.title}</TableCell>
                  <TableCell className="text-[13px]">{p.venue}</TableCell>
                  <TableCell className="text-[13px]">{p.city}</TableCell>
                  <TableCell className="text-[13px]">{p.date}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">{p.attendees}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
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

const defaultPosterForm = {
  title: "",
  city: "",
  venue: "",
  address: "",
  startsAt: "",
  priceFrom: "0",
  ticketUrl: "",
  description: "",
  tags: "",
};

const PartnerPosters = () => {
  const [items, setItems] = useState<PartnerPoster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultPosterForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listPartnerPosters();
      setItems(response.items);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить афишу");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const update = (key: keyof typeof defaultPosterForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await createPartnerPoster({
        ...form,
        startsAt: new Date(form.startsAt).toISOString(),
        priceFrom: Number(form.priceFrom),
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        category: "concert",
        emoji: "🎟️",
      });
      setForm(defaultPosterForm);
      setShowForm(false);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось создать событие афиши");
    }
  };

  const sendToReview = async (posterId: string) => {
    setError(null);
    try {
      await submitPartnerPoster(posterId);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось отправить на модерацию");
    }
  };

  return (
    <>
      <AdminTopbar title="Афиша" subtitle={`${items.length} ваших событий`} />
      <div className="p-5 lg:p-8 space-y-4">
        <DataToolbar searchPlaceholder="Название, площадка..." addLabel="Добавить событие" onAdd={() => setShowForm((value) => !value)} />
        {showForm && (
          <form onSubmit={submit} className="rounded-lg border border-border bg-card p-4 grid gap-3 md:grid-cols-2">
            <Field label="Название" value={form.title} onChange={(value) => update("title", value)} />
            <Field label="Город" value={form.city} onChange={(value) => update("city", value)} />
            <Field label="Площадка" value={form.venue} onChange={(value) => update("venue", value)} />
            <Field label="Адрес" value={form.address} onChange={(value) => update("address", value)} />
            <Field label="Дата и время" type="datetime-local" value={form.startsAt} onChange={(value) => update("startsAt", value)} />
            <Field label="Цена от" type="number" value={form.priceFrom} onChange={(value) => update("priceFrom", value)} />
            <Field label="Ссылка на билеты" value={form.ticketUrl} onChange={(value) => update("ticketUrl", value)} />
            <Field label="Теги через запятую" value={form.tags} onChange={(value) => update("tags", value)} />
            <div className="space-y-2 md:col-span-2">
              <Label>Описание</Label>
              <Textarea value={form.description} onChange={(event) => update("description", event.target.value)} required />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Отмена</Button>
              <Button type="submit">Сохранить черновик</Button>
            </div>
          </form>
        )}
        {error && <p className="text-[12px] text-destructive">{error}</p>}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Событие</TableHead>
                <TableHead>Площадка</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-[13px] text-muted-foreground">Загрузка...</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-[13px] text-muted-foreground">Афиши пока нет.</TableCell></TableRow>
              ) : (
                items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-[13.5px] font-semibold">{p.title}</TableCell>
                    <TableCell className="text-[13px]">{p.venue}</TableCell>
                    <TableCell className="text-[13px]">{p.address.split(",")[0] || "Москва"}</TableCell>
                    <TableCell className="text-[13px]">{p.date} · {p.time}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell className="text-right">
                      {p.status === "draft" ? (
                        <Button variant="ghost" size="sm" onClick={() => void sendToReview(p.id)}>На модерацию</Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                      )}
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} required />
    </div>
  );
}
