import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle2, Clock, MapPin, Users, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTopbar } from "../components/Topbar";
import {
  approveAdminMeetupJoinRequest,
  cancelAdminMeetup,
  getAdminMeetup,
  listAdminMeetupJoinRequests,
  listAdminMeetupParticipants,
  rejectAdminMeetupJoinRequest,
  removeAdminMeetupParticipant,
  restoreAdminMeetup,
  updateAdminMeetup,
} from "../management/api";
import { adminPageText, formatDateTime, valueOrDash } from "../management/format";
import { cancelPartnerMeetup, getPartnerMeetup, updatePartnerMeetup } from "../partner/portal-api";
import type { PartnerMeetup } from "../partner/types";
import { adminPortal } from "../portal";

type MeetupForm = {
  title: string;
  emoji: string;
  startsAt: string;
  durationMinutes: string;
  place: string;
  latitude: string;
  longitude: string;
  description: string;
  capacity: string;
  joinMode: string;
  priceMode: string;
};

export const AdminMeetupDetail = () => {
  if (adminPortal === "partner") {
    return <PartnerMeetupDetail />;
  }

  const { id } = useParams();
  const meetupId = id ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("details");
  const [error, setError] = useState<string | null>(null);
  const meetupQuery = useQuery({
    queryKey: ["admin-meetup", meetupId],
    queryFn: () => getAdminMeetup(meetupId),
    enabled: Boolean(meetupId),
  });
  const meetup = meetupQuery.data;
  const [form, setForm] = useState<MeetupForm>({
    title: "",
    emoji: "🤝",
    startsAt: "",
    durationMinutes: "120",
    place: "",
    latitude: "",
    longitude: "",
    description: "",
    capacity: "20",
    joinMode: "open",
    priceMode: "free",
  });

  useEffect(() => {
    if (!meetup) return;
    setForm({
      title: meetup.title,
      emoji: meetup.emoji,
      startsAt: toDateTimeLocal(meetup.startsAt),
      durationMinutes: String(meetup.durationMinutes),
      place: meetup.place,
      latitude: meetup.latitude == null ? "" : String(meetup.latitude),
      longitude: meetup.longitude == null ? "" : String(meetup.longitude),
      description: meetup.description,
      capacity: String(meetup.capacity),
      joinMode: meetup.joinMode,
      priceMode: meetup.priceMode,
    });
  }, [meetup]);

  const participantsQuery = useQuery({
    queryKey: ["admin-meetup-participants", meetupId],
    queryFn: () => listAdminMeetupParticipants(meetupId),
    enabled: tab === "participants" && Boolean(meetupId),
  });
  const requestsQuery = useQuery({
    queryKey: ["admin-meetup-requests", meetupId],
    queryFn: () => listAdminMeetupJoinRequests(meetupId),
    enabled: tab === "requests" && Boolean(meetupId),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateAdminMeetup(meetupId, {
        title: form.title,
        emoji: form.emoji,
        startsAt: new Date(form.startsAt).toISOString(),
        durationMinutes: Number(form.durationMinutes),
        place: form.place,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        description: form.description,
        capacity: Number(form.capacity),
        joinMode: form.joinMode,
        priceMode: form.priceMode,
      }),
    onSuccess: (updated) => {
      setError(null);
      queryClient.setQueryData(["admin-meetup", meetupId], updated);
    },
    onError: (caught) => setError(caught instanceof Error ? caught.message : "Не удалось сохранить встречу"),
  });

  const cancelMutation = useMutation({
    mutationFn: async (action: "cancel" | "restore") => {
      if (action === "restore") return restoreAdminMeetup(meetupId);
      const reason = window.prompt("Причина отмены") ?? "";
      return cancelAdminMeetup(meetupId, { reason });
    },
    onSuccess: (updated) => {
      setError(null);
      queryClient.setQueryData(["admin-meetup", meetupId], updated);
    },
  });

  const participantMutation = useMutation({
    mutationFn: (participantId: string) => removeAdminMeetupParticipant(meetupId, participantId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-meetup-participants", meetupId] }),
  });

  const requestMutation = useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: "approve" | "reject" }) =>
      action === "approve"
        ? approveAdminMeetupJoinRequest(meetupId, requestId)
        : rejectAdminMeetupJoinRequest(meetupId, requestId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-meetup-requests", meetupId] });
      void queryClient.invalidateQueries({ queryKey: ["admin-meetup-participants", meetupId] });
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    updateMutation.mutate();
  };

  if (meetupQuery.isLoading) {
    return <PageState text={adminPageText.loading} />;
  }
  if (meetupQuery.isError || !meetup) {
    return <PageState text={adminPageText.error} />;
  }

  return (
    <>
      <AdminTopbar title={meetup.title} subtitle={`#${meetup.id} · хост ${meetup.hostName}`} />
      <div className="p-5 lg:p-8 space-y-6">
        <button onClick={() => navigate("/meetups")} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Все встречи
        </button>
        {error && <p className="text-[12px] text-destructive">{error}</p>}

        <div className="rounded-lg border border-border bg-card p-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusBadge status={meetup.status} />
              <StatusBadge status={meetup.joinMode} />
              <StatusBadge status={meetup.priceMode} />
            </div>
            <h2 className="font-display text-[22px] font-semibold mb-3">{meetup.title}</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-[13px]">
              <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /> {formatDateTime(meetup.startsAt)}</p>
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /> {meetup.durationMinutes} мин</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> {meetup.place}</p>
              <p className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" /> {meetup.participantsCount}/{meetup.capacity}</p>
            </div>
          </div>
          {meetup.status === "cancelled" ? (
            <Button className="gap-2 self-start" onClick={() => cancelMutation.mutate("restore")}>
              <CheckCircle2 className="w-4 h-4" /> Восстановить
            </Button>
          ) : (
            <Button variant="outline" className="gap-2 text-destructive border-destructive/30 self-start" onClick={() => window.confirm("Отменить встречу?") && cancelMutation.mutate("cancel")}>
              <XCircle className="w-4 h-4" /> Отменить
            </Button>
          )}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="details" onClick={() => setTab("details")}>Детали</TabsTrigger>
            <TabsTrigger value="participants" onClick={() => setTab("participants")}>Участники</TabsTrigger>
            <TabsTrigger value="requests" onClick={() => setTab("requests")}>Заявки</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <form onSubmit={submit} className="rounded-lg border border-border bg-card p-6 grid lg:grid-cols-2 gap-5">
              <Field label="Название" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
              <Field label="Emoji" value={form.emoji} onChange={(value) => setForm({ ...form, emoji: value })} />
              <Field label="Дата и время" type="datetime-local" value={form.startsAt} onChange={(value) => setForm({ ...form, startsAt: value })} />
              <Field label="Длительность" type="number" value={form.durationMinutes} onChange={(value) => setForm({ ...form, durationMinutes: value })} />
              <Field label="Место" value={form.place} onChange={(value) => setForm({ ...form, place: value })} />
              <Field label="Лимит гостей" type="number" value={form.capacity} onChange={(value) => setForm({ ...form, capacity: value })} />
              <Field label="Latitude" type="number" value={form.latitude} onChange={(value) => setForm({ ...form, latitude: value })} required={false} />
              <Field label="Longitude" type="number" value={form.longitude} onChange={(value) => setForm({ ...form, longitude: value })} required={false} />
              <SelectField label="Join mode" value={form.joinMode} values={["open", "request"]} onChange={(value) => setForm({ ...form, joinMode: value })} />
              <SelectField label="Price" value={form.priceMode} values={["free", "fixed", "from", "range", "split"]} onChange={(value) => setForm({ ...form, priceMode: value })} />
              <div className="lg:col-span-2 space-y-2">
                <Label>Описание</Label>
                <Textarea aria-label="Описание" rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </div>
              <div className="lg:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => meetupQuery.refetch()}>Отмена</Button>
                <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? adminPageText.saving : "Сохранить"}</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="participants" className="mt-4">
            <SimpleRows
              columns={["Пользователь", "Город", "Вступил", "Действия"]}
              rows={participantsQuery.data?.items ?? []}
              loading={participantsQuery.isLoading}
              error={participantsQuery.isError}
              render={(row) => [
                <Link to={`/users/${textValue(row.userId)}`} className="font-semibold hover:text-primary">{textValue(row.displayName || objectValue(row.user).displayName)}</Link>,
                textValue(row.city || objectValue(row.user).city),
                formatDateTime(textValue(row.joinedAt)),
                <Button size="sm" variant="outline" className="h-8" onClick={() => participantMutation.mutate(textValue(row.id))}>Исключить</Button>,
              ]}
            />
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            <SimpleRows
              columns={["Пользователь", "Статус", "Дата", "Действия"]}
              rows={requestsQuery.data?.items ?? []}
              loading={requestsQuery.isLoading}
              error={requestsQuery.isError}
              render={(row) => {
                const user = objectValue(row.user);
                return [
                  textValue(user.displayName),
                  <StatusBadge status={textValue(row.status)} />,
                  formatDateTime(textValue(row.createdAt)),
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" className="h-8" onClick={() => requestMutation.mutate({ requestId: textValue(row.id), action: "approve" })}>Одобрить</Button>
                    <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/30" onClick={() => requestMutation.mutate({ requestId: textValue(row.id), action: "reject" })}>Отклонить</Button>
                  </div>,
                ];
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

const PartnerMeetupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meetup, setMeetup] = useState<PartnerMeetup | null>(null);
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("20");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const item = await getPartnerMeetup(id);
      setMeetup(item);
      setTitle(item.title);
      setPlace(item.place);
      setDescription(item.description);
      setCapacity(String(item.capacity));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось загрузить встречу");
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
      const updated = await updatePartnerMeetup(id, {
        title,
        place,
        description,
        capacity: Number(capacity),
      });
      setMeetup(updated);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось сохранить встречу");
    }
  };

  const cancel = async () => {
    if (!id) return;
    setError(null);
    try {
      await cancelPartnerMeetup(id);
      navigate("/meetups", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось отменить встречу");
    }
  };

  if (isLoading) return <PageState text={adminPageText.loading} />;
  if (!meetup) return <PageState text={error ?? "Встреча не найдена."} />;

  return (
    <>
      <AdminTopbar title={meetup.title} subtitle={`#${meetup.id}`} />
      <div className="p-5 lg:p-8 space-y-5">
        <button onClick={() => navigate("/meetups")} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Все встречи
        </button>
        {error && <p className="text-[12px] text-destructive">{error}</p>}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="font-display text-[22px] font-semibold">{meetup.title}</h2>
              <div className="mt-3 grid gap-2 text-[13px] text-muted-foreground sm:grid-cols-2">
                <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(meetup.startsAt).toLocaleDateString("ru")}</p>
                <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {meetup.time}</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {meetup.place}</p>
                <p className="flex items-center gap-2"><Users className="w-4 h-4" /> {meetup.participantsCount}/{meetup.capacity}</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2 text-destructive border-destructive/30" onClick={() => void cancel()}>
              <XCircle className="w-4 h-4" /> Отменить
            </Button>
          </div>
        </div>
        <form onSubmit={submit} className="rounded-lg border border-border bg-card p-5 grid gap-4 lg:grid-cols-2">
          <Field label="Название" value={title} onChange={setTitle} />
          <Field label="Место" value={place} onChange={setPlace} />
          <Field label="Лимит гостей" type="number" value={capacity} onChange={setCapacity} />
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
      <AdminTopbar title="Встреча" subtitle="" />
      <div className="p-8 text-[13px] text-muted-foreground">{text}</div>
    </>
  );
}

function toDateTimeLocal(value: string) {
  return value.slice(0, 16);
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function textValue(value: unknown) {
  return typeof value === "string" ? value : "";
}
