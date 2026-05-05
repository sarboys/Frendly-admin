import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTopbar } from "../components/Topbar";
import { createAdminCommunity, listAdminCommunities } from "../management/api";
import { adminPageText, downloadCsv, formatDate } from "../management/format";
import { createPartnerCommunity, listPartnerCommunities } from "../partner/portal-api";
import type { PartnerCommunity } from "../partner/types";
import { adminPortal } from "../portal";

const defaultCommunityForm = {
  ownerId: "",
  name: "",
  avatar: "🤝",
  description: "",
  privacy: "public",
  tags: "",
  mood: "",
  premiumOnly: false,
};

export const AdminCommunities = () => {
  if (adminPortal === "partner") {
    return <PartnerCommunities />;
  }

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultCommunityForm);
  const filters = {
    q: searchParams.get("q") ?? "",
    city: searchParams.get("city") ?? "",
    privacy: searchParams.get("privacy") ?? "",
    archived: searchParams.get("archived") ?? "",
    partnerId: searchParams.get("partnerId") ?? "",
  };
  const query = useQuery({
    queryKey: ["admin-communities", filters],
    queryFn: () => listAdminCommunities(filters),
  });
  const communities = query.data?.items ?? [];
  const createMutation = useMutation({
    mutationFn: () =>
      createAdminCommunity({
        ownerId: form.ownerId,
        name: form.name,
        avatar: form.avatar,
        description: form.description,
        privacy: form.privacy,
        tags: splitTags(form.tags),
        mood: form.mood,
        premiumOnly: form.premiumOnly,
      }),
    onSuccess: () => {
      setForm(defaultCommunityForm);
      setShowForm(false);
      void queryClient.invalidateQueries({ queryKey: ["admin-communities"] });
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
      <AdminTopbar title="Сообщества" subtitle={`Загружено: ${communities.length}`} />
      <div className="p-5 lg:p-8">
        <DataToolbar
          searchPlaceholder="Название, владелец, город…"
          searchValue={filters.q}
          onSearchChange={(value) => setFilter("q", value)}
          addLabel="Новое сообщество"
          onAdd={() => setShowForm((value) => !value)}
          onExportClick={() => downloadCsv("admin-communities.csv", communities as unknown as Array<Record<string, unknown>>)}
        />

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <FilterInput label="Город" value={filters.city} onChange={(value) => setFilter("city", value)} />
          <FilterSelect label="Приватность" value={filters.privacy} onChange={(value) => setFilter("privacy", value)} options={["public", "private"]} />
          <FilterSelect label="Архив" value={filters.archived} onChange={(value) => setFilter("archived", value)} options={["true", "false"]} />
          <FilterInput label="Partner ID" value={filters.partnerId} onChange={(value) => setFilter("partnerId", value)} />
        </div>

        {showForm && (
          <form onSubmit={submit} className="mb-4 rounded-lg border border-border bg-card p-4 grid gap-3 md:grid-cols-2">
            <Field label="Owner user ID" value={form.ownerId} onChange={(value) => setForm({ ...form, ownerId: value })} />
            <Field label="Название" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Field label="Иконка" value={form.avatar} onChange={(value) => setForm({ ...form, avatar: value })} />
            <FilterSelect label="Приватность" value={form.privacy} onChange={(value) => setForm({ ...form, privacy: value })} options={["public", "private"]} />
            <Field label="Теги через запятую" value={form.tags} onChange={(value) => setForm({ ...form, tags: value })} required={false} />
            <Field label="Настроение" value={form.mood} onChange={(value) => setForm({ ...form, mood: value })} required={false} />
            <label className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={form.premiumOnly}
                onChange={(event) => setForm({ ...form, premiumOnly: event.target.checked })}
              />
              Только premium
            </label>
            <div className="space-y-2 md:col-span-2">
              <Label>Описание</Label>
              <Textarea aria-label="Описание" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            </div>
            {createMutation.isError && <p className="text-[12px] text-destructive md:col-span-2">Не удалось сохранить сообщество.</p>}
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
                <TableHead>Сообщество</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Владелец</TableHead>
                <TableHead className="text-right">Участники</TableHead>
                <TableHead className="text-right">Новости</TableHead>
                <TableHead>Создано</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isLoading && <StateRow text={adminPageText.loading} />}
              {query.isError && <StateRow text={adminPageText.error} />}
              {!query.isLoading && !query.isError && communities.length === 0 && <StateRow text={adminPageText.empty} />}
              {communities.map((community) => (
                <TableRow key={community.id} className="cursor-pointer" onClick={() => navigate(`/communities/${community.id}`)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-[16px]">
                        {community.avatar}
                      </div>
                      <div>
                        <p className="text-[13.5px] font-semibold">{community.name}</p>
                        <p className="text-[11.5px] text-muted-foreground">#{community.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px]">{community.city ?? "—"}</TableCell>
                  <TableCell className="text-[13px]">{community.ownerName}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">{community.membersCount}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">{community.newsCount}</TableCell>
                  <TableCell className="text-[12.5px] text-muted-foreground">{formatDate(community.createdAt)}</TableCell>
                  <TableCell><StatusBadge status={community.archivedAt ? "archived" : community.privacy} /></TableCell>
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

const PartnerCommunities = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PartnerCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    avatar: "🤝",
    description: "",
    tags: "",
    mood: "",
  });
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

  const update = (key: keyof typeof form, value: string) => {
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
        tags: splitTags(form.tags),
        mood: form.mood,
      });
      setForm({ name: "", avatar: "🤝", description: "", tags: "", mood: "" });
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
                items.map((community) => (
                  <TableRow key={community.id} className="cursor-pointer" onClick={() => navigate(`/communities/${community.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-[16px]">{community.avatar}</div>
                        <div>
                          <p className="text-[13.5px] font-semibold">{community.name}</p>
                          <p className="text-[11.5px] text-muted-foreground">{community.tags.join(", ") || community.mood}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={community.privacy} /></TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{community.membersCount}</TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{community.newsCount}</TableCell>
                    <TableCell className="text-[12.5px] text-muted-foreground">{new Date(community.createdAt).toLocaleDateString("ru")}</TableCell>
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

function FilterInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <input
      aria-label={label}
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
      <TableCell colSpan={8} className="text-center text-[13px] text-muted-foreground py-8">
        {text}
      </TableCell>
    </TableRow>
  );
}

function splitTags(value: string) {
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}
