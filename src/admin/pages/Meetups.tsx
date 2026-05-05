import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTopbar } from "../components/Topbar";
import { createAdminMeetup, listAdminMeetups } from "../management/api";
import { adminPageText, downloadCsv, formatDateTime } from "../management/format";
import { createPartnerMeetup, listPartnerMeetups } from "../partner/portal-api";
import type { PartnerMeetup } from "../partner/types";
import { adminPortal } from "../portal";

const defaultMeetupForm = {
  hostId: "",
  title: "",
  emoji: "🤝",
  startsAt: "",
  durationMinutes: "120",
  place: "",
  latitude: "",
  longitude: "",
  capacity: "20",
  description: "",
  joinMode: "open",
  priceMode: "free",
};

const statusOptions = ["upcoming", "live", "past", "cancelled"];
const joinModeOptions = ["open", "request"];
const priceModeOptions = ["free", "fixed", "from", "range", "split"];

export const AdminMeetups = () => {
  if (adminPortal === "partner") {
    return <PartnerMeetups />;
  }

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultMeetupForm);
  const filters = {
    q: searchParams.get("q") ?? "",
    city: searchParams.get("city") ?? "",
    status: searchParams.get("status") ?? "",
    joinMode: searchParams.get("joinMode") ?? "",
    priceMode: searchParams.get("priceMode") ?? "",
    startsFrom: searchParams.get("startsFrom") ?? "",
    startsTo: searchParams.get("startsTo") ?? "",
  };
  const query = useQuery({
    queryKey: ["admin-meetups", filters],
    queryFn: () => listAdminMeetups(filters),
  });
  const meetups = query.data?.items ?? [];
  const createMutation = useMutation({
    mutationFn: () =>
      createAdminMeetup({
        ...form,
        startsAt: new Date(form.startsAt).toISOString(),
        durationMinutes: Number(form.durationMinutes),
        capacity: Number(form.capacity),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      }),
    onSuccess: () => {
      setForm(defaultMeetupForm);
      setShowForm(false);
      void queryClient.invalidateQueries({ queryKey: ["admin-meetups"] });
    },
  });

  const setFilter = (key: keyof typeof filters, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate();
  };

  return (
    <>
      <AdminTopbar title="Встречи" subtitle={`Загружено: ${meetups.length}`} />
      <div className="p-5 lg:p-8">
        <DataToolbar
          searchPlaceholder="Название, хост, место…"
          searchValue={filters.q}
          onSearchChange={(value) => setFilter("q", value)}
          addLabel="Создать встречу"
          onAdd={() => setShowForm((value) => !value)}
          onExportClick={() => downloadCsv("admin-meetups.csv", meetups as unknown as Array<Record<string, unknown>>)}
        />

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <FilterInput label="Город" value={filters.city} onChange={(value) => setFilter("city", value)} />
          <FilterSelect label="Статус" value={filters.status} onChange={(value) => setFilter("status", value)} options={statusOptions} />
          <FilterSelect label="Join mode" value={filters.joinMode} onChange={(value) => setFilter("joinMode", value)} options={joinModeOptions} />
          <FilterSelect label="Price" value={filters.priceMode} onChange={(value) => setFilter("priceMode", value)} options={priceModeOptions} />
          <FilterInput label="С" type="date" value={filters.startsFrom} onChange={(value) => setFilter("startsFrom", value)} />
          <FilterInput label="По" type="date" value={filters.startsTo} onChange={(value) => setFilter("startsTo", value)} />
        </div>

        {showForm && (
          <form onSubmit={submit} className="mb-4 rounded-lg border border-border bg-card p-4 grid gap-3 md:grid-cols-2">
            <Field label="Host ID" value={form.hostId} onChange={(value) => setForm({ ...form, hostId: value })} />
            <Field label="Название" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
            <Field label="Emoji" value={form.emoji} onChange={(value) => setForm({ ...form, emoji: value })} />
            <Field label="Дата и время" type="datetime-local" value={form.startsAt} onChange={(value) => setForm({ ...form, startsAt: value })} />
            <Field label="Длительность" type="number" value={form.durationMinutes} onChange={(value) => setForm({ ...form, durationMinutes: value })} />
            <Field label="Место" value={form.place} onChange={(value) => setForm({ ...form, place: value })} />
            <Field label="Latitude" type="number" value={form.latitude} onChange={(value) => setForm({ ...form, latitude: value })} required={false} />
            <Field label="Longitude" type="number" value={form.longitude} onChange={(value) => setForm({ ...form, longitude: value })} required={false} />
            <Field label="Лимит гостей" type="number" value={form.capacity} onChange={(value) => setForm({ ...form, capacity: value })} />
            <FilterSelect label="Join mode" value={form.joinMode} onChange={(value) => setForm({ ...form, joinMode: value })} options={joinModeOptions} />
            <FilterSelect label="Price" value={form.priceMode} onChange={(value) => setForm({ ...form, priceMode: value })} options={priceModeOptions} />
            <div className="space-y-2 md:col-span-2">
              <Label>Описание</Label>
              <Textarea aria-label="Описание" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            </div>
            {createMutation.isError && <p className="text-[12px] text-destructive md:col-span-2">Не удалось сохранить встречу.</p>}
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Отмена</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? adminPageText.saving : "Сохранить"}</Button>
            </div>
          </form>
        )}

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Встреча</TableHead>
                <TableHead>Хост</TableHead>
                <TableHead>Когда</TableHead>
                <TableHead>Место</TableHead>
                <TableHead className="text-right">Участники</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isLoading && <StateRow text={adminPageText.loading} />}
              {query.isError && <StateRow text={adminPageText.error} />}
              {!query.isLoading && !query.isError && meetups.length === 0 && <StateRow text={adminPageText.empty} />}
              {meetups.map((meetup) => (
                <TableRow key={meetup.id} className="cursor-pointer" onClick={() => navigate(`/meetups/${meetup.id}`)}>
                  <TableCell>
                    <p className="text-[13.5px] font-semibold">{meetup.title}</p>
                    <p className="text-[11.5px] text-muted-foreground">#{meetup.id}</p>
                  </TableCell>
                  <TableCell className="text-[13px]">{meetup.hostName}</TableCell>
                  <TableCell className="text-[13px]">{formatDateTime(meetup.startsAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-[13px]">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {meetup.place}{meetup.city ? `, ${meetup.city}` : ""}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">
                    {meetup.participantsCount}/{meetup.capacity}
                  </TableCell>
                  <TableCell><StatusBadge status={meetup.status} /></TableCell>
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
              <Textarea aria-label="Описание" value={form.description} onChange={(event) => update("description", event.target.value)} required />
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
                items.map((meetup) => (
                  <TableRow key={meetup.id} className="cursor-pointer" onClick={() => navigate(`/meetups/${meetup.id}`)}>
                    <TableCell>
                      <p className="text-[13.5px] font-semibold">{meetup.title}</p>
                      <p className="text-[11.5px] text-muted-foreground">#{meetup.id}</p>
                    </TableCell>
                    <TableCell className="text-[13px]">{meetup.time}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-[13px]">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {meetup.place}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{meetup.participantsCount}/{meetup.capacity}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{meetup.joinRequestsCount}</TableCell>
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
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input aria-label={label} type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </div>
  );
}

function FilterInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <input
      aria-label={label}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={label}
      className="h-9 w-[150px] rounded-md border border-input bg-card px-3 text-[13px]"
    />
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 rounded-md border border-input bg-card px-3 text-[13px]"
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

function StateRow({ text }: { text: string }) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center text-[13px] text-muted-foreground py-8">
        {text}
      </TableCell>
    </TableRow>
  );
}
