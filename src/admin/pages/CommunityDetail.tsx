import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Archive, ArrowLeft, RotateCcw, Trash2, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTopbar } from "../components/Topbar";
import {
  archiveAdminCommunity,
  createAdminCommunityMedia,
  createAdminCommunityNews,
  deleteAdminCommunityMedia,
  deleteAdminCommunityNews,
  getAdminCommunity,
  listAdminCommunityMedia,
  listAdminCommunityMembers,
  listAdminCommunityNews,
  removeAdminCommunityMember,
  restoreAdminCommunity,
  updateAdminCommunity,
  updateAdminCommunityMedia,
  updateAdminCommunityMemberRole,
  updateAdminCommunityNews,
} from "../management/api";
import { adminPageText, formatDateTime, valueOrDash } from "../management/format";
import { archivePartnerCommunity, getPartnerCommunity, updatePartnerCommunity } from "../partner/portal-api";
import type { PartnerCommunity } from "../partner/types";
import { adminPortal } from "../portal";

type CommunityForm = {
  name: string;
  avatar: string;
  description: string;
  privacy: string;
  tags: string;
  joinRule: string;
  premiumOnly: boolean;
  mood: string;
  sharedMediaLabel: string;
};

const defaultNewsForm = {
  title: "",
  blurb: "",
  timeLabel: "сейчас",
};

const defaultMediaForm = {
  emoji: "📷",
  label: "",
  kind: "photo",
};

export const AdminCommunityDetail = () => {
  if (adminPortal === "partner") {
    return <PartnerCommunityDetail />;
  }

  const { id } = useParams();
  const communityId = id ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("settings");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CommunityForm>({
    name: "",
    avatar: "🤝",
    description: "",
    privacy: "public",
    tags: "",
    joinRule: "",
    premiumOnly: false,
    mood: "",
    sharedMediaLabel: "",
  });
  const [newsForm, setNewsForm] = useState(defaultNewsForm);
  const [mediaForm, setMediaForm] = useState(defaultMediaForm);

  const communityQuery = useQuery({
    queryKey: ["admin-community", communityId],
    queryFn: () => getAdminCommunity(communityId),
    enabled: Boolean(communityId),
  });
  const community = communityQuery.data;

  useEffect(() => {
    if (!community) return;
    setForm({
      name: community.name,
      avatar: community.avatar,
      description: community.description,
      privacy: community.privacy,
      tags: Array.isArray(community.tags) ? community.tags.join(", ") : "",
      joinRule: community.joinRule,
      premiumOnly: community.premiumOnly,
      mood: community.mood,
      sharedMediaLabel: community.sharedMediaLabel,
    });
  }, [community]);

  const membersQuery = useQuery({
    queryKey: ["admin-community-members", communityId],
    queryFn: () => listAdminCommunityMembers(communityId),
    enabled: tab === "members" && Boolean(communityId),
  });
  const newsQuery = useQuery({
    queryKey: ["admin-community-news", communityId],
    queryFn: () => listAdminCommunityNews(communityId),
    enabled: tab === "news" && Boolean(communityId),
  });
  const mediaQuery = useQuery({
    queryKey: ["admin-community-media", communityId],
    queryFn: () => listAdminCommunityMedia(communityId),
    enabled: tab === "media" && Boolean(communityId),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateAdminCommunity(communityId, {
        name: form.name,
        avatar: form.avatar,
        description: form.description,
        privacy: form.privacy,
        tags: splitTags(form.tags),
        joinRule: form.joinRule,
        premiumOnly: form.premiumOnly,
        mood: form.mood,
        sharedMediaLabel: form.sharedMediaLabel,
      }),
    onSuccess: (updated) => {
      setError(null);
      queryClient.setQueryData(["admin-community", communityId], updated);
    },
    onError: (caught) => setError(caught instanceof Error ? caught.message : "Не удалось сохранить сообщество"),
  });

  const archiveMutation = useMutation({
    mutationFn: () => {
      if (!community) throw new Error("Community not loaded");
      return community.archivedAt ? restoreAdminCommunity(communityId) : archiveAdminCommunity(communityId);
    },
    onSuccess: (updated) => {
      setError(null);
      queryClient.setQueryData(["admin-community", communityId], updated);
    },
    onError: (caught) => setError(caught instanceof Error ? caught.message : "Не удалось изменить статус"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: string }) =>
      updateAdminCommunityMemberRole(communityId, memberId, { role }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-community-members", communityId] }),
  });
  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => removeAdminCommunityMember(communityId, memberId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-community-members", communityId] }),
  });
  const createNewsMutation = useMutation({
    mutationFn: () => createAdminCommunityNews(communityId, newsForm),
    onSuccess: () => {
      setNewsForm(defaultNewsForm);
      void queryClient.invalidateQueries({ queryKey: ["admin-community-news", communityId] });
    },
  });
  const deleteNewsMutation = useMutation({
    mutationFn: (newsId: string) => deleteAdminCommunityNews(communityId, newsId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-community-news", communityId] }),
  });
  const updateNewsMutation = useMutation({
    mutationFn: ({ newsId, input }: { newsId: string; input: Record<string, unknown> }) =>
      updateAdminCommunityNews(communityId, newsId, input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-community-news", communityId] }),
  });
  const createMediaMutation = useMutation({
    mutationFn: () => createAdminCommunityMedia(communityId, mediaForm),
    onSuccess: () => {
      setMediaForm(defaultMediaForm);
      void queryClient.invalidateQueries({ queryKey: ["admin-community-media", communityId] });
    },
  });
  const deleteMediaMutation = useMutation({
    mutationFn: (mediaId: string) => deleteAdminCommunityMedia(communityId, mediaId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-community-media", communityId] }),
  });
  const updateMediaMutation = useMutation({
    mutationFn: ({ mediaId, input }: { mediaId: string; input: Record<string, unknown> }) =>
      updateAdminCommunityMedia(communityId, mediaId, input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-community-media", communityId] }),
  });

  const ownersOnPage = (membersQuery.data?.items ?? []).filter((member) => textValue(member.role) === "owner").length;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    updateMutation.mutate();
  };

  const submitNews = (event: FormEvent) => {
    event.preventDefault();
    createNewsMutation.mutate();
  };

  const submitMedia = (event: FormEvent) => {
    event.preventDefault();
    createMediaMutation.mutate();
  };

  const editNews = (row: Record<string, unknown>) => {
    const title = window.prompt("Название новости", textValue(row.title));
    if (title === null) return;
    const blurb = window.prompt("Текст новости", textValue(row.blurb));
    if (blurb === null) return;
    updateNewsMutation.mutate({
      newsId: textValue(row.id),
      input: { title, blurb, timeLabel: textValue(row.timeLabel) || "сейчас" },
    });
  };

  const editMedia = (row: Record<string, unknown>) => {
    const label = window.prompt("Название медиа", textValue(row.label));
    if (label === null) return;
    updateMediaMutation.mutate({
      mediaId: textValue(row.id),
      input: { label, emoji: textValue(row.emoji) || "📷", kind: textValue(row.kind) || "photo" },
    });
  };

  if (communityQuery.isLoading) {
    return <PageState text={adminPageText.loading} />;
  }
  if (communityQuery.isError || !community) {
    return <PageState text="Сообщество не найдено." />;
  }

  return (
    <>
      <AdminTopbar title={community.name} subtitle={`#${community.id} · владелец ${community.ownerName}`} />
      <div className="p-5 lg:p-8 space-y-6">
        <button onClick={() => navigate("/communities")} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Все сообщества
        </button>
        {error && <p className="text-[12px] text-destructive">{error}</p>}

        <div className="rounded-lg border border-border bg-card p-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">{community.avatar}</div>
            <div>
              <h2 className="font-display text-[20px] font-semibold">{community.name}</h2>
              <p className="text-[13px] text-muted-foreground">
                {valueOrDash(community.city)} · {community.membersCount} участников · {community.newsCount} новостей
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge status={community.archivedAt ? "archived" : community.privacy} />
                {community.premiumOnly && <StatusBadge status="plus" />}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="gap-2 self-start"
            disabled={archiveMutation.isPending}
            onClick={() => window.confirm(community.archivedAt ? "Восстановить сообщество?" : "Отправить сообщество в архив?") && archiveMutation.mutate()}
          >
            {community.archivedAt ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            {community.archivedAt ? "Восстановить" : "В архив"}
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="settings" onClick={() => setTab("settings")}>Настройки</TabsTrigger>
            <TabsTrigger value="members" onClick={() => setTab("members")}>Участники</TabsTrigger>
            <TabsTrigger value="news" onClick={() => setTab("news")}>Новости</TabsTrigger>
            <TabsTrigger value="media" onClick={() => setTab("media")}>Медиа</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-4">
            <form onSubmit={submit} className="rounded-lg border border-border bg-card p-6 grid lg:grid-cols-2 gap-5">
              <Field label="Название" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
              <Field label="Иконка" value={form.avatar} onChange={(value) => setForm({ ...form, avatar: value })} />
              <SelectField label="Приватность" value={form.privacy} values={["public", "private"]} onChange={(value) => setForm({ ...form, privacy: value })} />
              <Field label="Теги через запятую" value={form.tags} onChange={(value) => setForm({ ...form, tags: value })} required={false} />
              <Field label="Правило вступления" value={form.joinRule} onChange={(value) => setForm({ ...form, joinRule: value })} />
              <Field label="Настроение" value={form.mood} onChange={(value) => setForm({ ...form, mood: value })} />
              <Field label="Медиа label" value={form.sharedMediaLabel} onChange={(value) => setForm({ ...form, sharedMediaLabel: value })} />
              <label className="flex items-center gap-2 text-[13px]">
                <input
                  type="checkbox"
                  checked={form.premiumOnly}
                  onChange={(event) => setForm({ ...form, premiumOnly: event.target.checked })}
                />
                Только premium
              </label>
              <div className="lg:col-span-2 space-y-2">
                <Label>Описание</Label>
                <Textarea aria-label="Описание" rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </div>
              <div className="lg:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => void communityQuery.refetch()}>Отмена</Button>
                <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? adminPageText.saving : "Сохранить"}</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="members" className="mt-4">
            <SimpleRows
              columns={["Пользователь", "Роль", "Город", "Вступил", "Действия"]}
              rows={membersQuery.data?.items ?? []}
              loading={membersQuery.isLoading}
              error={membersQuery.isError}
              render={(row) => {
                const user = objectValue(row.user);
                const role = textValue(row.role);
                const isLastOwner = role === "owner" && ownersOnPage <= 1;
                return [
                  <Link to={`/users/${textValue(row.userId)}`} className="font-semibold hover:text-primary">{textValue(user.displayName)}</Link>,
                  <select
                    aria-label={`Роль ${textValue(user.displayName)}`}
                    value={role}
                    disabled={isLastOwner}
                    onChange={(event) => roleMutation.mutate({ memberId: textValue(row.id), role: event.target.value })}
                    className="h-8 rounded-md border border-input bg-card px-2 text-[13px]"
                  >
                    {["owner", "moderator", "member"].map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>,
                  valueOrDash(textValue(user.city)),
                  formatDateTime(textValue(row.joinedAt)),
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1"
                    disabled={isLastOwner}
                    onClick={() => removeMemberMutation.mutate(textValue(row.id))}
                  >
                    <UserMinus className="w-3.5 h-3.5" /> Исключить
                  </Button>,
                ];
              }}
            />
          </TabsContent>

          <TabsContent value="news" className="mt-4 space-y-4">
            <form onSubmit={submitNews} className="rounded-lg border border-border bg-card p-4 grid gap-3 md:grid-cols-[1fr_2fr_120px_auto]">
              <Field label="Заголовок новости" value={newsForm.title} onChange={(value) => setNewsForm({ ...newsForm, title: value })} />
              <Field label="Текст новости" value={newsForm.blurb} onChange={(value) => setNewsForm({ ...newsForm, blurb: value })} />
              <Field label="Время" value={newsForm.timeLabel} onChange={(value) => setNewsForm({ ...newsForm, timeLabel: value })} />
              <div className="flex items-end">
                <Button type="submit" disabled={createNewsMutation.isPending}>Добавить</Button>
              </div>
            </form>
            <SimpleRows
              columns={["Заголовок", "Текст", "Время", "Действия"]}
              rows={newsQuery.data?.items ?? []}
              loading={newsQuery.isLoading}
              error={newsQuery.isError}
              render={(row) => [
                textValue(row.title),
                textValue(row.blurb),
                textValue(row.timeLabel),
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" className="h-8" onClick={() => editNews(row)}>Изменить</Button>
                  <Button
                    aria-label={`Удалить новость ${textValue(row.title)}`}
                    size="sm"
                    variant="outline"
                    className="h-8 text-destructive border-destructive/30"
                    onClick={() => deleteNewsMutation.mutate(textValue(row.id))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>,
              ]}
            />
          </TabsContent>

          <TabsContent value="media" className="mt-4 space-y-4">
            <form onSubmit={submitMedia} className="rounded-lg border border-border bg-card p-4 grid gap-3 md:grid-cols-[120px_1fr_160px_auto]">
              <Field label="Emoji" value={mediaForm.emoji} onChange={(value) => setMediaForm({ ...mediaForm, emoji: value })} />
              <Field label="Название медиа" value={mediaForm.label} onChange={(value) => setMediaForm({ ...mediaForm, label: value })} />
              <SelectField label="Тип медиа" value={mediaForm.kind} values={["photo", "video", "doc"]} onChange={(value) => setMediaForm({ ...mediaForm, kind: value })} />
              <div className="flex items-end">
                <Button type="submit" disabled={createMediaMutation.isPending}>Добавить</Button>
              </div>
            </form>
            <SimpleRows
              columns={["Emoji", "Название", "Тип", "Действия"]}
              rows={mediaQuery.data?.items ?? []}
              loading={mediaQuery.isLoading}
              error={mediaQuery.isError}
              render={(row) => [
                textValue(row.emoji),
                textValue(row.label),
                textValue(row.kind),
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" className="h-8" onClick={() => editMedia(row)}>Изменить</Button>
                  <Button
                    aria-label={`Удалить медиа ${textValue(row.label)}`}
                    size="sm"
                    variant="outline"
                    className="h-8 text-destructive border-destructive/30"
                    onClick={() => deleteMediaMutation.mutate(textValue(row.id))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>,
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

const PartnerCommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<PartnerCommunity | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const item = await getPartnerCommunity(id);
      setCommunity(item);
      setName(item.name);
      setDescription(item.description);
      setMood(item.mood);
      setTags(item.tags.join(", "));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить сообщество");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    setError(null);
    try {
      const updated = await updatePartnerCommunity(id, {
        name,
        description,
        mood,
        tags: splitTags(tags),
      });
      setCommunity(updated);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось сохранить сообщество");
    }
  };

  const archive = async () => {
    if (!id) return;
    setError(null);
    try {
      await archivePartnerCommunity(id);
      navigate("/communities", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось архивировать сообщество");
    }
  };

  if (isLoading) return <PageState text={adminPageText.loading} />;
  if (!community) return <PageState text={error ?? "Сообщество не найдено."} />;

  return (
    <>
      <AdminTopbar title={community.name} subtitle={`#${community.id}`} />
      <div className="p-5 lg:p-8 space-y-5">
        <button onClick={() => navigate("/communities")} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Все сообщества
        </button>
        {error && <p className="text-[12px] text-destructive">{error}</p>}
        <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">{community.avatar}</div>
            <div>
              <h2 className="font-display text-[20px] font-semibold">{community.name}</h2>
              <p className="text-[13px] text-muted-foreground">{community.membersCount} участников · {community.newsCount} новостей</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => void archive()}>
            <Archive className="w-4 h-4" /> В архив
          </Button>
        </div>
        <form onSubmit={submit} className="rounded-lg border border-border bg-card p-5 grid gap-4 lg:grid-cols-2">
          <Field label="Название" value={name} onChange={setName} />
          <Field label="Настроение" value={mood} onChange={setMood} />
          <Field label="Теги" value={tags} onChange={setTags} required={false} />
          <div className="space-y-2 lg:col-span-2">
            <Label>Описание</Label>
            <Textarea aria-label="Описание" value={description} onChange={(event) => setDescription(event.target.value)} rows={4} required />
          </div>
          <div className="lg:col-span-2 flex justify-end">
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
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

function SimpleRows({
  columns,
  rows,
  loading,
  error,
  render,
}: {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  loading: boolean;
  error: boolean;
  render: (row: Record<string, unknown>) => Array<ReactNode>;
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => <TableHead key={column}>{column}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && <StateRow colSpan={columns.length} text={adminPageText.loading} />}
          {error && <StateRow colSpan={columns.length} text={adminPageText.error} />}
          {!loading && !error && rows.length === 0 && <StateRow colSpan={columns.length} text={adminPageText.empty} />}
          {rows.map((row, index) => (
            <TableRow key={textValue(row.id) || index}>
              {render(row).map((cell, cellIndex) => <TableCell key={cellIndex} className="text-[13px]">{cell}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StateRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center text-[13px] text-muted-foreground py-8">{text}</TableCell>
    </TableRow>
  );
}

function PageState({ text }: { text: string }) {
  return (
    <>
      <AdminTopbar title="Сообщество" subtitle="" />
      <div className="p-8 text-[13px] text-muted-foreground">{text}</div>
    </>
  );
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function textValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function splitTags(value: string) {
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}
