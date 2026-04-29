import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { banners, featuredItems } from "../data";
import { adminPortal } from "../portal";
import {
  createPartnerFeaturedRequest,
  listPartnerCommunities,
  listPartnerFeaturedRequests,
  listPartnerMeetups,
  listPartnerPosters,
  submitPartnerFeaturedRequest,
} from "../partner/portal-api";
import type { PartnerCommunity, PartnerFeaturedRequest, PartnerMeetup, PartnerPoster } from "../partner/types";
import { MoreHorizontal, GripVertical, Image as ImageIcon } from "lucide-react";

export const AdminFeatured = () => {
  if (adminPortal === "partner") {
    return <PartnerFeatured />;
  }

  return (
    <>
      <AdminTopbar title="Афиша и фичеринг" subtitle="Баннеры, продвигаемые встречи и сообщества" />
      <div className="p-5 lg:p-8 space-y-6">
        <div>
          <h3 className="font-display font-semibold text-[15px] mb-3">Баннеры</h3>
          <DataToolbar searchPlaceholder="Заголовок баннера…" addLabel="Создать баннер" onAdd={() => {}} />
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Размещение</TableHead>
                  <TableHead>Старт</TableHead>
                  <TableHead>Финиш</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="text-[13.5px] font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        {b.title}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={b.placement} /></TableCell>
                    <TableCell className="text-[13px]">{b.starts}</TableCell>
                    <TableCell className="text-[13px]">{b.ends}</TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{b.ctr ? `${b.ctr}%` : "—"}</TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
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

        <div>
          <h3 className="font-display font-semibold text-[15px] mb-3">Продвигаемая лента</h3>
          <p className="text-[12.5px] text-muted-foreground mb-3">Перетащи, чтобы изменить позицию в публичной афише.</p>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {featuredItems.map((f) => (
              <div key={f.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[12px] font-semibold shrink-0">
                  {f.position}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold truncate">{f.title}</p>
                  <p className="text-[12px] text-muted-foreground">{f.city} · {f.views.toLocaleString("ru")} показов</p>
                </div>
                <StatusBadge status={f.type} />
                <Button variant="ghost" size="sm" className="h-8">Снять</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const defaultFeaturedForm = {
  targetType: "event",
  targetId: "",
  city: "",
  placement: "home",
  title: "",
  description: "",
  startsAt: "",
  endsAt: "",
};

const PartnerFeatured = () => {
  const [items, setItems] = useState<PartnerFeaturedRequest[]>([]);
  const [meetups, setMeetups] = useState<PartnerMeetup[]>([]);
  const [communities, setCommunities] = useState<PartnerCommunity[]>([]);
  const [posters, setPosters] = useState<PartnerPoster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultFeaturedForm);
  const [error, setError] = useState<string | null>(null);

  const targetOptions = useMemo(() => {
    if (form.targetType === "community") {
      return communities.map((item) => ({ id: item.id, title: item.name }));
    }
    if (form.targetType === "poster") {
      return posters.map((item) => ({ id: item.id, title: item.title }));
    }
    return meetups.map((item) => ({ id: item.id, title: item.title }));
  }, [communities, form.targetType, meetups, posters]);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [requestResponse, meetupResponse, communityResponse, posterResponse] = await Promise.all([
        listPartnerFeaturedRequests(),
        listPartnerMeetups(),
        listPartnerCommunities(),
        listPartnerPosters(),
      ]);
      setItems(requestResponse.items);
      setMeetups(meetupResponse.items);
      setCommunities(communityResponse.items);
      setPosters(posterResponse.items);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить фичеринг");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const update = (key: keyof typeof defaultFeaturedForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "targetType" ? { targetId: "" } : {}),
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await createPartnerFeaturedRequest({
        ...form,
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
      });
      setForm(defaultFeaturedForm);
      setShowForm(false);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось создать заявку");
    }
  };

  const sendToReview = async (requestId: string) => {
    setError(null);
    try {
      await submitPartnerFeaturedRequest(requestId);
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось отправить заявку");
    }
  };

  return (
    <>
      <AdminTopbar title="Фичеринг" subtitle="Заявки на продвижение ваших объектов" />
      <div className="p-5 lg:p-8 space-y-4">
        <DataToolbar searchPlaceholder="Заголовок заявки..." addLabel="Создать заявку" onAdd={() => setShowForm((value) => !value)} />
        {showForm && (
          <form onSubmit={submit} className="rounded-lg border border-border bg-card p-4 grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Тип объекта</Label>
              <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-[13px]" value={form.targetType} onChange={(event) => update("targetType", event.target.value)}>
                <option value="event">Встреча</option>
                <option value="community">Сообщество</option>
                <option value="poster">Афиша</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Объект</Label>
              <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-[13px]" value={form.targetId} onChange={(event) => update("targetId", event.target.value)} required>
                <option value="">Выберите</option>
                {targetOptions.map((target) => (
                  <option key={target.id} value={target.id}>{target.title}</option>
                ))}
              </select>
            </div>
            <Field label="Город" value={form.city} onChange={(value) => update("city", value)} />
            <Field label="Размещение" value={form.placement} onChange={(value) => update("placement", value)} />
            <Field label="Заголовок" value={form.title} onChange={(value) => update("title", value)} />
            <Field label="Старт" type="datetime-local" value={form.startsAt} onChange={(value) => update("startsAt", value)} />
            <Field label="Финиш" type="datetime-local" value={form.endsAt} onChange={(value) => update("endsAt", value)} />
            <div className="space-y-2 md:col-span-2">
              <Label>Описание</Label>
              <Textarea value={form.description} onChange={(event) => update("description", event.target.value)} required />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Отмена</Button>
              <Button type="submit">Сохранить заявку</Button>
            </div>
          </form>
        )}
        {error && <p className="text-[12px] text-destructive">{error}</p>}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Заявка</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Размещение</TableHead>
                <TableHead>Период</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-[13px] text-muted-foreground">Загрузка...</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-[13px] text-muted-foreground">Заявок пока нет.</TableCell></TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="text-[13.5px] font-semibold">{item.title}</p>
                      <p className="text-[11.5px] text-muted-foreground">{item.city}</p>
                    </TableCell>
                    <TableCell><StatusBadge status={item.targetType} /></TableCell>
                    <TableCell className="text-[13px]">{item.placement}</TableCell>
                    <TableCell className="text-[13px]">{new Date(item.startsAt).toLocaleDateString("ru")} - {new Date(item.endsAt).toLocaleDateString("ru")}</TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell className="text-right">
                      {item.status === "draft" ? (
                        <Button variant="ghost" size="sm" onClick={() => void sendToReview(item.id)}>Отправить</Button>
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
