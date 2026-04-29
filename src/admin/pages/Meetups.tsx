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
import { meetups } from "../data";
import { adminPortal } from "../portal";
import { createPartnerMeetup, listPartnerMeetups } from "../partner/portal-api";
import type { PartnerMeetup } from "../partner/types";
import { MapPin, MoreHorizontal } from "lucide-react";

export const AdminMeetups = () => {
  if (adminPortal === "partner") {
    return <PartnerMeetups />;
  }

  const navigate = useNavigate();
  return (
    <>
      <AdminTopbar title="Встречи" subtitle={`${meetups.length} активных и прошедших`} />
      <div className="p-5 lg:p-8">
        <DataToolbar searchPlaceholder="Название, хост, город…" addLabel="Создать встречу" onAdd={() => {}} />

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Встреча</TableHead>
                <TableHead>Хост</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Когда</TableHead>
                <TableHead>Место</TableHead>
                <TableHead className="text-right">Участники</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetups.map((m) => (
                <TableRow key={m.id} className="cursor-pointer" onClick={() => navigate(`/meetups/${m.id}`)}>
                  <TableCell>
                    <p className="text-[13.5px] font-semibold">{m.title}</p>
                    <p className="text-[11.5px] text-muted-foreground">#{m.id}</p>
                  </TableCell>
                  <TableCell className="text-[13px]">{m.host}</TableCell>
                  <TableCell><StatusBadge status={m.type} /></TableCell>
                  <TableCell className="text-[13px]">{m.date} · {m.time}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-[13px]">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {m.venue}, {m.city}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">
                    {m.participants}/{m.capacity}
                  </TableCell>
                  <TableCell><StatusBadge status={m.status} /></TableCell>
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

const defaultMeetupForm = {
  title: "",
  place: "",
  startsAt: "",
  capacity: "20",
  description: "",
};

const PartnerMeetups = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PartnerMeetup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultMeetupForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listPartnerMeetups();
      setItems(response.items);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить встречи");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const update = (key: keyof typeof defaultMeetupForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await createPartnerMeetup({
        title: form.title,
        place: form.place,
        startsAt: new Date(form.startsAt).toISOString(),
        capacity: Number(form.capacity),
        description: form.description,
      });
      setForm(defaultMeetupForm);
      setShowForm(false);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось создать встречу");
    }
  };

  return (
    <>
      <AdminTopbar title="Встречи" subtitle={`${items.length} ваших встреч`} />
      <div className="p-5 lg:p-8 space-y-4">
        <DataToolbar searchPlaceholder="Название или место..." addLabel="Создать встречу" onAdd={() => setShowForm((value) => !value)} />
        {showForm && (
          <form onSubmit={submit} className="rounded-lg border border-border bg-card p-4 grid gap-3 md:grid-cols-2">
            <Field label="Название" value={form.title} onChange={(value) => update("title", value)} />
            <Field label="Место" value={form.place} onChange={(value) => update("place", value)} />
            <Field label="Дата и время" type="datetime-local" value={form.startsAt} onChange={(value) => update("startsAt", value)} />
            <Field label="Лимит гостей" type="number" value={form.capacity} onChange={(value) => update("capacity", value)} />
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
                <TableHead>Встреча</TableHead>
                <TableHead>Когда</TableHead>
                <TableHead>Место</TableHead>
                <TableHead className="text-right">Участники</TableHead>
                <TableHead>Заявки</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-[13px] text-muted-foreground">Загрузка...</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-[13px] text-muted-foreground">Встреч пока нет.</TableCell></TableRow>
              ) : (
                items.map((m) => (
                  <TableRow key={m.id} className="cursor-pointer" onClick={() => navigate(`/meetups/${m.id}`)}>
                    <TableCell>
                      <p className="text-[13.5px] font-semibold">{m.title}</p>
                      <p className="text-[11.5px] text-muted-foreground">#{m.id}</p>
                    </TableCell>
                    <TableCell className="text-[13px]">{m.time}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-[13px]">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {m.place}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{m.participantsCount}/{m.capacity}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{m.joinRequestsCount}</TableCell>
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
