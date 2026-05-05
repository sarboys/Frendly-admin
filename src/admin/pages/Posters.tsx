import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import {
  archiveAdminPoster,
  createAdminPoster,
  featureAdminPoster,
  hideAdminPoster,
  listAdminAfficheContentItems,
  listAdminPosters,
  moderateAdminAfficheContentItem,
  publishAdminPoster,
  rejectAdminPoster,
  unfeatureAdminPoster,
  updateAdminAfficheContentItem,
  updateAdminPoster,
} from "../management/api";
import { adminPageText, downloadCsv, formatDateTime, valueOrDash } from "../management/format";
import type { AdminAfficheContentItemDto, AdminPosterDto } from "../management/types";
import { createPartnerPoster, listPartnerPosters, submitPartnerPoster } from "../partner/portal-api";
import type { PartnerPoster } from "../partner/types";
import { adminPortal } from "../portal";

const defaultPosterForm = {
  id: "",
  title: "",
  city: "",
  category: "concert",
  emoji: "🎟️",
  startsAt: "",
  venue: "",
  address: "",
  priceFrom: "0",
  ticketUrl: "",
  provider: "admin",
  tags: "",
  description: "",
  status: "draft",
  featured: false,
};

const defaultImportedForm = {
  title: "",
  shortSummary: "",
  category: "",
  tags: "",
  address: "",
  lat: "",
  lng: "",
  startsAt: "",
  endsAt: "",
  priceFrom: "",
  currency: "RUB",
  venueName: "",
  imageUrl: "",
  actionUrl: "",
  actionKind: "",
  priceMode: "unknown",
  publicStatus: "hidden",
  moderationStatus: "pending",
};

const categories = ["concert", "sport", "exhibition", "theatre", "standup", "festival", "cinema"];
const posterStatuses = ["draft", "published", "hidden", "rejected", "archived"];
const priceModes = ["free", "paid", "unknown", "fixed", "from", "range"];

export const AdminPosters = () => {
  if (adminPortal === "partner") {
    return <PartnerPosters />;
  }

  const queryClient = useQueryClient();
  const [tab, setTab] = useState("native");
  const [showPosterForm, setShowPosterForm] = useState(false);
  const [editingPosterId, setEditingPosterId] = useState<string | null>(null);
  const [posterForm, setPosterForm] = useState(defaultPosterForm);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [importedForm, setImportedForm] = useState(defaultImportedForm);
  const [filters, setFilters] = useState({
    q: "",
    city: "",
    source: "",
    category: "",
    status: "",
    priceMode: "",
    featured: "",
    hasCoords: "",
    dateFrom: "",
    dateTo: "",
  });

  const posterQuery = useQuery({
    queryKey: ["admin-affiche-posters", filters],
    queryFn: () =>
      listAdminPosters({
        q: filters.q,
        city: filters.city,
        category: filters.category,
        status: filters.status,
        featured: filters.featured,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      }),
    enabled: tab === "native",
  });
  const contentQuery = useQuery({
    queryKey: ["admin-affiche-content-items", filters],
    queryFn: () =>
      listAdminAfficheContentItems({
        q: filters.q,
        city: filters.city,
        source: filters.source,
        category: filters.category,
        priceMode: filters.priceMode,
        hasCoords: filters.hasCoords,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        publicStatus: filters.status,
      }),
    enabled: tab === "imported",
  });
  const posters = posterQuery.data?.items ?? [];
  const importedItems = (contentQuery.data?.items ?? []).filter((item) => item.contentKind === "event");

  const savePosterMutation = useMutation({
    mutationFn: () => {
      const payload = posterPayload(posterForm);
      return editingPosterId ? updateAdminPoster(editingPosterId, payload) : createAdminPoster(payload);
    },
    onSuccess: () => {
      setShowPosterForm(false);
      setEditingPosterId(null);
      setPosterForm(defaultPosterForm);
      void queryClient.invalidateQueries({ queryKey: ["admin-affiche-posters"] });
    },
  });
  const posterActionMutation = useMutation({
    mutationFn: ({ posterId, action }: { posterId: string; action: string }) => runPosterAction(posterId, action),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-affiche-posters"] }),
  });
  const saveImportedMutation = useMutation({
    mutationFn: () => {
      if (!editingItemId) throw new Error("Item not selected");
      return updateAdminAfficheContentItem(editingItemId, importedPayload(importedForm));
    },
    onSuccess: () => {
      setEditingItemId(null);
      setImportedForm(defaultImportedForm);
      void queryClient.invalidateQueries({ queryKey: ["admin-affiche-content-items"] });
    },
  });
  const importedActionMutation = useMutation({
    mutationFn: ({ itemId, action }: { itemId: string; action: string }) => moderateAdminAfficheContentItem(itemId, action),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-affiche-content-items"] }),
  });

  const setFilter = (key: keyof typeof filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const openCreatePoster = () => {
    setEditingPosterId(null);
    setPosterForm(defaultPosterForm);
    setShowPosterForm((value) => !value);
  };

  const editPoster = (poster: AdminPosterDto) => {
    setTab("native");
    setEditingPosterId(poster.id);
    setShowPosterForm(true);
    setPosterForm({
      id: poster.id,
      title: poster.title,
      city: poster.city,
      category: poster.category,
      emoji: poster.emoji,
      startsAt: toDateTimeLocal(poster.startsAt),
      venue: poster.venue,
      address: poster.address,
      priceFrom: String(poster.priceFrom),
      ticketUrl: poster.ticketUrl,
      provider: poster.provider,
      tags: poster.tags.join(", "),
      description: poster.description,
      status: poster.status,
      featured: poster.isFeatured,
    });
  };

  const editImported = (item: AdminAfficheContentItemDto) => {
    setEditingItemId(item.id);
    setImportedForm({
      title: item.title,
      shortSummary: item.shortSummary ?? "",
      category: item.category,
      tags: item.tags.join(", "),
      address: item.address ?? "",
      lat: item.lat == null ? "" : String(item.lat),
      lng: item.lng == null ? "" : String(item.lng),
      startsAt: item.startsAt ? toDateTimeLocal(item.startsAt) : "",
      endsAt: item.endsAt ? toDateTimeLocal(item.endsAt) : "",
      priceFrom: item.priceFrom == null ? "" : String(item.priceFrom),
      currency: item.currency ?? "RUB",
      venueName: item.venueName ?? "",
      imageUrl: item.imageUrl ?? "",
      actionUrl: item.actionUrl ?? "",
      actionKind: item.actionKind ?? "",
      priceMode: item.priceMode,
      publicStatus: item.publicStatus,
      moderationStatus: item.moderationStatus,
    });
  };

  const submitPoster = (event: FormEvent) => {
    event.preventDefault();
    savePosterMutation.mutate();
  };

  const submitImported = (event: FormEvent) => {
    event.preventDefault();
    saveImportedMutation.mutate();
  };

  return (
    <>
      <AdminTopbar title="Афиша" subtitle="Native posters и imported events" />
      <div className="p-5 lg:p-8 space-y-4">
        <DataToolbar
          searchPlaceholder="Название, площадка…"
          searchValue={filters.q}
          onSearchChange={(value) => setFilter("q", value)}
          addLabel="Опубликовать афишу"
          onAdd={tab === "native" ? openCreatePoster : undefined}
          onExportClick={() => downloadCsv(tab === "native" ? "admin-posters.csv" : "admin-imported-affiche.csv", (tab === "native" ? posters : importedItems) as unknown as Array<Record<string, unknown>>)}
        />

        <div className="flex flex-wrap items-center gap-2">
          <FilterInput label="Город" value={filters.city} onChange={(value) => setFilter("city", value)} />
          <FilterInput label="Source" value={filters.source} onChange={(value) => setFilter("source", value)} />
          <FilterSelect label="Категория" value={filters.category} onChange={(value) => setFilter("category", value)} options={categories} />
          <FilterSelect label="Статус" value={filters.status} onChange={(value) => setFilter("status", value)} options={["draft", "published", "hidden", "rejected", "archived", "stale"]} />
          <FilterSelect label="Цена" value={filters.priceMode} onChange={(value) => setFilter("priceMode", value)} options={priceModes} />
          <FilterSelect label="Featured" value={filters.featured} onChange={(value) => setFilter("featured", value)} options={["true", "false"]} />
          <FilterSelect label="Coords" value={filters.hasCoords} onChange={(value) => setFilter("hasCoords", value)} options={["true", "false"]} />
          <FilterInput label="С" type="date" value={filters.dateFrom} onChange={(value) => setFilter("dateFrom", value)} />
          <FilterInput label="По" type="date" value={filters.dateTo} onChange={(value) => setFilter("dateTo", value)} />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="native" onClick={() => setTab("native")}>Native posters</TabsTrigger>
            <TabsTrigger value="imported" onClick={() => setTab("imported")}>Imported events</TabsTrigger>
          </TabsList>

          <TabsContent value="native" className="mt-4 space-y-4">
            {showPosterForm && (
              <form onSubmit={submitPoster} className="rounded-lg border border-border bg-card p-4 grid gap-3 md:grid-cols-2">
                <Field label="ID" value={posterForm.id} onChange={(value) => setPosterForm({ ...posterForm, id: value })} required={!editingPosterId} disabled={Boolean(editingPosterId)} />
                <Field label="Название" value={posterForm.title} onChange={(value) => setPosterForm({ ...posterForm, title: value })} />
                <Field label="Город" value={posterForm.city} onChange={(value) => setPosterForm({ ...posterForm, city: value })} />
                <SelectField label="Категория" value={posterForm.category} values={categories} onChange={(value) => setPosterForm({ ...posterForm, category: value })} />
                <Field label="Emoji" value={posterForm.emoji} onChange={(value) => setPosterForm({ ...posterForm, emoji: value })} />
                <Field label="Дата и время" type="datetime-local" value={posterForm.startsAt} onChange={(value) => setPosterForm({ ...posterForm, startsAt: value })} />
                <Field label="Площадка" value={posterForm.venue} onChange={(value) => setPosterForm({ ...posterForm, venue: value })} />
                <Field label="Адрес" value={posterForm.address} onChange={(value) => setPosterForm({ ...posterForm, address: value })} />
                <Field label="Цена от" type="number" value={posterForm.priceFrom} onChange={(value) => setPosterForm({ ...posterForm, priceFrom: value })} />
                <Field label="Ссылка на билеты" value={posterForm.ticketUrl} onChange={(value) => setPosterForm({ ...posterForm, ticketUrl: value })} />
                <Field label="Провайдер" value={posterForm.provider} onChange={(value) => setPosterForm({ ...posterForm, provider: value })} />
                <SelectField label="Статус" value={posterForm.status} values={posterStatuses} onChange={(value) => setPosterForm({ ...posterForm, status: value })} />
                <Field label="Теги через запятую" value={posterForm.tags} onChange={(value) => setPosterForm({ ...posterForm, tags: value })} required={false} />
                <label className="flex items-center gap-2 text-[13px]">
                  <input
                    type="checkbox"
                    checked={posterForm.featured}
                    onChange={(event) => setPosterForm({ ...posterForm, featured: event.target.checked })}
                  />
                  Featured
                </label>
                <div className="space-y-2 md:col-span-2">
                  <Label>Описание</Label>
                  <Textarea aria-label="Описание" value={posterForm.description} onChange={(event) => setPosterForm({ ...posterForm, description: event.target.value })} required />
                </div>
                {savePosterMutation.isError && <p className="text-[12px] text-destructive md:col-span-2">Не удалось сохранить poster.</p>}
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowPosterForm(false)}>Отмена</Button>
                  <Button type="submit" disabled={savePosterMutation.isPending}>{savePosterMutation.isPending ? adminPageText.saving : "Сохранить"}</Button>
                </div>
              </form>
            )}

            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Событие</TableHead>
                    <TableHead>Площадка</TableHead>
                    <TableHead>Город</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posterQuery.isLoading && <StateRow colSpan={7} text={adminPageText.loading} />}
                  {posterQuery.isError && <StateRow colSpan={7} text={adminPageText.error} />}
                  {!posterQuery.isLoading && !posterQuery.isError && posters.length === 0 && <StateRow colSpan={7} text={adminPageText.empty} />}
                  {posters.map((poster) => (
                    <TableRow key={poster.id}>
                      <TableCell>
                        <p className="text-[13.5px] font-semibold">{poster.title}</p>
                        <p className="text-[11.5px] text-muted-foreground">#{poster.id}</p>
                      </TableCell>
                      <TableCell className="text-[13px]">{poster.venue}</TableCell>
                      <TableCell className="text-[13px]">{poster.city}</TableCell>
                      <TableCell className="text-[13px]">{formatDateTime(poster.startsAt)}</TableCell>
                      <TableCell className="text-[13px]">{poster.priceFrom === 0 ? "Бесплатно" : `${poster.priceFrom}`}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <StatusBadge status={poster.status} />
                          {poster.isFeatured && <StatusBadge status="featured" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button size="sm" variant="outline" className="h-8" onClick={() => editPoster(poster)}>Изменить</Button>
                          <Button aria-label={`Опубликовать ${poster.title}`} size="sm" variant="outline" className="h-8" onClick={() => posterActionMutation.mutate({ posterId: poster.id, action: "publish" })}>Publish</Button>
                          <Button size="sm" variant="outline" className="h-8" onClick={() => posterActionMutation.mutate({ posterId: poster.id, action: "hide" })}>Hide</Button>
                          <Button size="sm" variant="outline" className="h-8" onClick={() => posterActionMutation.mutate({ posterId: poster.id, action: "reject" })}>Reject</Button>
                          <Button size="sm" variant="outline" className="h-8" onClick={() => posterActionMutation.mutate({ posterId: poster.id, action: "archive" })}>Archive</Button>
                          <Button size="sm" variant="outline" className="h-8" onClick={() => posterActionMutation.mutate({ posterId: poster.id, action: poster.isFeatured ? "unfeature" : "feature" })}>
                            {poster.isFeatured ? "Unfeature" : "Feature"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="imported" className="mt-4 space-y-4">
            {editingItemId && (
              <form onSubmit={submitImported} className="rounded-lg border border-border bg-card p-4 grid gap-3 md:grid-cols-2">
                <Field label="Название" value={importedForm.title} onChange={(value) => setImportedForm({ ...importedForm, title: value })} />
                <Field label="Категория" value={importedForm.category} onChange={(value) => setImportedForm({ ...importedForm, category: value })} />
                <Field label="Теги через запятую" value={importedForm.tags} onChange={(value) => setImportedForm({ ...importedForm, tags: value })} required={false} />
                <Field label="Адрес" value={importedForm.address} onChange={(value) => setImportedForm({ ...importedForm, address: value })} required={false} />
                <Field label="Latitude" type="number" value={importedForm.lat} onChange={(value) => setImportedForm({ ...importedForm, lat: value })} required={false} />
                <Field label="Longitude" type="number" value={importedForm.lng} onChange={(value) => setImportedForm({ ...importedForm, lng: value })} required={false} />
                <Field label="Дата начала" type="datetime-local" value={importedForm.startsAt} onChange={(value) => setImportedForm({ ...importedForm, startsAt: value })} required={false} />
                <Field label="Дата конца" type="datetime-local" value={importedForm.endsAt} onChange={(value) => setImportedForm({ ...importedForm, endsAt: value })} required={false} />
                <Field label="Цена от" type="number" value={importedForm.priceFrom} onChange={(value) => setImportedForm({ ...importedForm, priceFrom: value })} required={false} />
                <Field label="Валюта" value={importedForm.currency} onChange={(value) => setImportedForm({ ...importedForm, currency: value })} required={false} />
                <Field label="Площадка" value={importedForm.venueName} onChange={(value) => setImportedForm({ ...importedForm, venueName: value })} required={false} />
                <Field label="Image URL" value={importedForm.imageUrl} onChange={(value) => setImportedForm({ ...importedForm, imageUrl: value })} required={false} />
                <Field label="Action URL" value={importedForm.actionUrl} onChange={(value) => setImportedForm({ ...importedForm, actionUrl: value })} required={false} />
                <Field label="Action kind" value={importedForm.actionKind} onChange={(value) => setImportedForm({ ...importedForm, actionKind: value })} required={false} />
                <SelectField label="Цена" value={importedForm.priceMode} values={priceModes} onChange={(value) => setImportedForm({ ...importedForm, priceMode: value })} />
                <Field label="Public status" value={importedForm.publicStatus} onChange={(value) => setImportedForm({ ...importedForm, publicStatus: value })} />
                <Field label="Moderation status" value={importedForm.moderationStatus} onChange={(value) => setImportedForm({ ...importedForm, moderationStatus: value })} />
                <div className="space-y-2 md:col-span-2">
                  <Label>Summary</Label>
                  <Textarea aria-label="Summary" value={importedForm.shortSummary} onChange={(event) => setImportedForm({ ...importedForm, shortSummary: event.target.value })} />
                </div>
                {saveImportedMutation.isError && <p className="text-[12px] text-destructive md:col-span-2">Не удалось сохранить imported event.</p>}
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingItemId(null)}>Отмена</Button>
                  <Button type="submit" disabled={saveImportedMutation.isPending}>{saveImportedMutation.isPending ? adminPageText.saving : "Сохранить"}</Button>
                </div>
              </form>
            )}

            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Событие</TableHead>
                    <TableHead>Источник</TableHead>
                    <TableHead>Площадка</TableHead>
                    <TableHead>Город</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentQuery.isLoading && <StateRow colSpan={8} text={adminPageText.loading} />}
                  {contentQuery.isError && <StateRow colSpan={8} text={adminPageText.error} />}
                  {!contentQuery.isLoading && !contentQuery.isError && importedItems.length === 0 && <StateRow colSpan={8} text={adminPageText.empty} />}
                  {importedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="text-[13.5px] font-semibold">{item.title}</p>
                        <p className="text-[11.5px] text-muted-foreground">{valueOrDash(item.shortSummary)}</p>
                        <p className="text-[11.5px] text-muted-foreground">{item.lat != null && item.lng != null ? `${item.lat}, ${item.lng}` : "Нет координат"}</p>
                      </TableCell>
                      <TableCell className="text-[13px]">{valueOrDash(item.sourceName ?? item.sourceCode)}</TableCell>
                      <TableCell className="text-[13px]">{valueOrDash(item.venueName)}</TableCell>
                      <TableCell className="text-[13px]">{item.city}</TableCell>
                      <TableCell className="text-[13px]">{formatDateTime(item.startsAt)}</TableCell>
                      <TableCell className="text-[13px]">{pricePolicyLabel(item.priceMode)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <StatusBadge status={item.publicStatus} />
                          <StatusBadge status={item.moderationStatus} />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button size="sm" variant="outline" className="h-8" onClick={() => editImported(item)}>Изменить</Button>
                          <Button aria-label={`Опубликовать imported ${item.title}`} size="sm" variant="outline" className="h-8" onClick={() => importedActionMutation.mutate({ itemId: item.id, action: "publish" })}>Publish</Button>
                          <Button size="sm" variant="outline" className="h-8" onClick={() => importedActionMutation.mutate({ itemId: item.id, action: "hide" })}>Hide</Button>
                          <Button size="sm" variant="outline" className="h-8" onClick={() => importedActionMutation.mutate({ itemId: item.id, action: "reject" })}>Reject</Button>
                          <Button size="sm" variant="outline" className="h-8" onClick={() => importedActionMutation.mutate({ itemId: item.id, action: "stale" })}>Stale</Button>
                          <Button aria-label={`Force free ${item.title}`} size="sm" variant="outline" className="h-8" onClick={() => importedActionMutation.mutate({ itemId: item.id, action: "force-free" })}>Бесплатно</Button>
                          <Button size="sm" variant="outline" className="h-8" onClick={() => importedActionMutation.mutate({ itemId: item.id, action: "force-paid" })}>Платно</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

const PartnerPosters = () => {
  const [items, setItems] = useState<PartnerPoster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    city: "",
    venue: "",
    address: "",
    startsAt: "",
    priceFrom: "0",
    ticketUrl: "",
    description: "",
    tags: "",
  });
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

  const update = (key: keyof typeof form, value: string) => {
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
        tags: splitTags(form.tags),
        category: "concert",
        emoji: "🎟️",
      });
      setForm({
        title: "",
        city: "",
        venue: "",
        address: "",
        startsAt: "",
        priceFrom: "0",
        ticketUrl: "",
        description: "",
        tags: "",
      });
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
              <Textarea aria-label="Описание" value={form.description} onChange={(event) => update("description", event.target.value)} required />
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
                <StateRow colSpan={6} text="Загрузка..." />
              ) : items.length === 0 ? (
                <StateRow colSpan={6} text="Афиши пока нет." />
              ) : (
                items.map((poster) => (
                  <TableRow key={poster.id}>
                    <TableCell className="text-[13.5px] font-semibold">{poster.title}</TableCell>
                    <TableCell className="text-[13px]">{poster.venue}</TableCell>
                    <TableCell className="text-[13px]">{poster.address.split(",")[0] || "Москва"}</TableCell>
                    <TableCell className="text-[13px]">{poster.date} · {poster.time}</TableCell>
                    <TableCell><StatusBadge status={poster.status} /></TableCell>
                    <TableCell className="text-right">
                      {poster.status === "draft" ? (
                        <Button variant="ghost" size="sm" onClick={() => void sendToReview(poster.id)}>На модерацию</Button>
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
  required = true,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        aria-label={label}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

function SelectField({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-input bg-card px-3 text-[13px]">
        {values.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
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

function StateRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center text-[13px] text-muted-foreground py-8">
        {text}
      </TableCell>
    </TableRow>
  );
}

function posterPayload(form: typeof defaultPosterForm) {
  return {
    id: form.id,
    title: form.title,
    city: form.city,
    category: form.category,
    emoji: form.emoji,
    startsAt: new Date(form.startsAt).toISOString(),
    venue: form.venue,
    address: form.address,
    priceFrom: Number(form.priceFrom),
    ticketUrl: form.ticketUrl,
    provider: form.provider,
    tags: splitTags(form.tags),
    description: form.description,
    status: form.status,
    featured: form.featured,
  };
}

function importedPayload(form: typeof defaultImportedForm) {
  return {
    title: form.title,
    shortSummary: form.shortSummary || null,
    category: form.category,
    tags: splitTags(form.tags),
    address: form.address || null,
    lat: form.lat ? Number(form.lat) : null,
    lng: form.lng ? Number(form.lng) : null,
    startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
    endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
    priceFrom: form.priceFrom ? Number(form.priceFrom) : null,
    currency: form.currency || null,
    venueName: form.venueName || null,
    imageUrl: form.imageUrl || null,
    actionUrl: form.actionUrl || null,
    actionKind: form.actionKind || null,
    priceMode: form.priceMode,
    publicStatus: form.publicStatus,
    moderationStatus: form.moderationStatus,
  };
}

function runPosterAction(posterId: string, action: string) {
  if (action === "publish") return publishAdminPoster(posterId);
  if (action === "hide") return hideAdminPoster(posterId);
  if (action === "reject") return rejectAdminPoster(posterId);
  if (action === "archive") return archiveAdminPoster(posterId);
  if (action === "feature") return featureAdminPoster(posterId);
  return unfeatureAdminPoster(posterId);
}

function pricePolicyLabel(priceMode: string) {
  if (priceMode === "free") return "Бесплатно";
  if (priceMode === "paid") return "Платно";
  return "Цена неизвестна";
}

function toDateTimeLocal(value: string) {
  return value.slice(0, 16);
}

function splitTags(value: string) {
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}
