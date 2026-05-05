import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BadgeCheck, Ban, Key, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AdminApiError } from "../api/client";
import { StatusBadge } from "../components/StatusBadge";
import { StatCard } from "../components/StatCard";
import { AdminTopbar } from "../components/Topbar";
import {
  getAdminUser,
  listAdminUserAudit,
  listAdminUserMeetups,
  listAdminUserReports,
  revokeAdminUserSessions,
  suspendAdminUser,
  unsuspendAdminUser,
  unverifyAdminUser,
  updateAdminUserProfile,
  verifyAdminUser,
} from "../management/api";
import { adminPageText, formatDateTime, valueOrDash } from "../management/format";

type ProfileForm = {
  displayName: string;
  email: string;
  phoneNumber: string;
  city: string;
  bio: string;
  avatarUrl: string;
};

export const AdminUserDetail = () => {
  const { id } = useParams();
  const userId = id ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("profile");
  const [errorText, setErrorText] = useState<string | null>(null);
  const userQuery = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => getAdminUser(userId),
    enabled: Boolean(userId),
  });
  const user = userQuery.data;
  const [form, setForm] = useState<ProfileForm>({
    displayName: "",
    email: "",
    phoneNumber: "",
    city: "",
    bio: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (!user) return;
    const profile = objectValue(user.profile);
    setForm({
      displayName: user.displayName,
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
      city: textValue(profile.city),
      bio: textValue(profile.bio),
      avatarUrl: textValue(profile.avatarUrl),
    });
  }, [user]);

  const meetupsQuery = useQuery({
    queryKey: ["admin-user-meetups", userId],
    queryFn: () => listAdminUserMeetups(userId),
    enabled: tab === "meetups" && Boolean(userId),
  });
  const reportsQuery = useQuery({
    queryKey: ["admin-user-reports", userId],
    queryFn: () => listAdminUserReports(userId),
    enabled: tab === "reports" && Boolean(userId),
  });
  const auditQuery = useQuery({
    queryKey: ["admin-user-audit", userId],
    queryFn: () => listAdminUserAudit(userId),
    enabled: tab === "audit" && Boolean(userId),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      updateAdminUserProfile(userId, {
        displayName: form.displayName,
        email: form.email || null,
        phoneNumber: form.phoneNumber || null,
        profile: {
          city: form.city || null,
          bio: form.bio || null,
          avatarUrl: form.avatarUrl || null,
        },
      }),
    onSuccess: (updated) => {
      setErrorText(null);
      queryClient.setQueryData(["admin-user", userId], updated);
    },
    onError: (error) => setErrorText(apiErrorText(error)),
  });

  const actionMutation = useMutation({
    mutationFn: async (action: "verify" | "unverify" | "suspend" | "unsuspend" | "revoke") => {
      if (action === "verify") return verifyAdminUser(userId);
      if (action === "unverify") return unverifyAdminUser(userId);
      if (action === "suspend") {
        const reason = window.prompt("Причина блокировки") ?? "";
        return suspendAdminUser(userId, { reason });
      }
      if (action === "unsuspend") return unsuspendAdminUser(userId);
      await revokeAdminUserSessions(userId);
      return getAdminUser(userId);
    },
    onSuccess: (updated) => {
      setErrorText(null);
      queryClient.setQueryData(["admin-user", userId], updated);
    },
    onError: (error) => setErrorText(apiErrorText(error)),
  });

  const guardedAction = (action: "verify" | "unverify" | "suspend" | "unsuspend" | "revoke") => {
    if (action === "suspend" && !window.confirm("Заблокировать пользователя?")) return;
    if (action === "revoke" && !window.confirm("Отозвать активные сессии?")) return;
    actionMutation.mutate(action);
  };

  if (userQuery.isLoading) {
    return <PageState title="Пользователь" text={adminPageText.loading} />;
  }
  if (userQuery.error instanceof AdminApiError && userQuery.error.status === 404) {
    return <PageState title="Пользователь" text="Пользователь не найден." />;
  }
  if (userQuery.isError || !user) {
    return <PageState title="Пользователь" text={adminPageText.error} />;
  }

  return (
    <>
      <AdminTopbar title={user.displayName} subtitle={`${valueOrDash(user.email)} · #${user.id}`} />
      <div className="p-5 lg:p-8 space-y-6">
        <button
          onClick={() => navigate("/users")}
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Все пользователи
        </button>

        <div className="rounded-lg border border-border bg-card p-6 flex flex-col lg:flex-row gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-secondary/30 flex items-center justify-center text-2xl font-display font-bold">
              {initials(user.displayName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-[20px] font-semibold">{user.displayName}</h2>
                {user.verified && <BadgeCheck className="w-5 h-5 text-primary" />}
              </div>
              <p className="text-[13px] text-muted-foreground">{valueOrDash(user.phoneNumber)} · #{user.id}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <StatusBadge status={user.status} />
                <StatusBadge status={user.plan} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:ml-auto self-start">
            {user.verified ? (
              <Button variant="outline" className="gap-2" onClick={() => guardedAction("unverify")}>
                <BadgeCheck className="w-4 h-4" /> Снять вериф.
              </Button>
            ) : (
              <Button variant="outline" className="gap-2" onClick={() => guardedAction("verify")}>
                <BadgeCheck className="w-4 h-4" /> Вериф.
              </Button>
            )}
            {user.status === "suspended" ? (
              <Button className="gap-2" onClick={() => guardedAction("unsuspend")}>
                <BadgeCheck className="w-4 h-4" /> Разблок.
              </Button>
            ) : (
              <Button variant="outline" className="gap-2 text-destructive border-destructive/30" onClick={() => guardedAction("suspend")}>
                <Ban className="w-4 h-4" /> Блок.
              </Button>
            )}
            <Button variant="outline" className="gap-2" onClick={() => guardedAction("revoke")}>
              <Key className="w-4 h-4" /> Сессии
            </Button>
          </div>
        </div>

        {errorText && <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-[13px] text-destructive">{errorText}</div>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Встречи" value={String(user.hostedMeetupsCount + user.joinedMeetupsCount)} delta={0} series={[1, 2, 3, 4, 5, 6, 7]} />
          <StatCard label="Жалобы" value={String(user.reportsCount)} delta={0} series={[3, 2, 2, 1, 1, 0, 0]} />
          <StatCard label="Сессии" value={String(user.counts.activeSessions ?? 0)} delta={0} series={[1, 1, 2, 2, 3, 3, 4]} />
          <StatCard label="С нами" value={formatDateTime(user.createdAt)} delta={0} series={[1, 2, 3, 4, 5, 6, 7]} />
        </div>

        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="meetups">Встречи</TabsTrigger>
            <TabsTrigger value="reports">Жалобы</TabsTrigger>
            <TabsTrigger value="audit">Аудит</TabsTrigger>
            <TabsTrigger value="access">Доступ</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="rounded-lg border border-border bg-card p-6 grid lg:grid-cols-2 gap-5">
              <Field label="Имя" value={form.displayName} onChange={(value) => setForm({ ...form, displayName: value })} />
              <Field label="Email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
              <Field label="Телефон" value={form.phoneNumber} onChange={(value) => setForm({ ...form, phoneNumber: value })} />
              <Field label="Город" value={form.city} onChange={(value) => setForm({ ...form, city: value })} />
              <Field label="Avatar URL" value={form.avatarUrl} onChange={(value) => setForm({ ...form, avatarUrl: value })} />
              <div className="lg:col-span-2 space-y-2">
                <Label>О себе</Label>
                <Textarea rows={3} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
              </div>
              <div className="lg:col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => userQuery.refetch()}>Отмена</Button>
                <Button disabled={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
                  {saveMutation.isPending ? adminPageText.saving : "Сохранить"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meetups">
            <SimpleRows
              columns={["Название", "Когда", "Роль", "Статус"]}
              rows={meetupsQuery.data?.items ?? []}
              loading={meetupsQuery.isLoading}
              error={meetupsQuery.isError}
              render={(row) => [linkCell(`/meetups/${textValue(row.id)}`, textValue(row.title)), formatDateTime(textValue(row.startsAt)), textValue(row.role), <StatusBadge status={textValue(row.status)} />]}
            />
          </TabsContent>

          <TabsContent value="reports">
            <SimpleRows
              columns={["От кого", "Причина", "Дата", "Статус"]}
              rows={reportsQuery.data?.items ?? []}
              loading={reportsQuery.isLoading}
              error={reportsQuery.isError}
              render={(row) => [textValue(objectValue(row.reporter).displayName), textValue(row.reason), formatDateTime(textValue(row.createdAt)), <StatusBadge status={textValue(row.status)} />]}
            />
          </TabsContent>

          <TabsContent value="audit">
            <SimpleRows
              columns={["Метод", "Путь", "Статус", "Дата"]}
              rows={auditQuery.data?.items ?? []}
              loading={auditQuery.isLoading}
              error={auditQuery.isError}
              render={(row) => [textValue(row.method), textValue(row.path), valueOrDash(numberValue(row.statusCode)), formatDateTime(textValue(row.createdAt))]}
            />
          </TabsContent>

          <TabsContent value="access">
            <div className="rounded-lg border border-border bg-card p-6 space-y-4 max-w-2xl">
              <p className="text-[14px] font-semibold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-secondary" /> Доступ</p>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={user.status} />
                <StatusBadge status={user.verified ? "approved" : "pending"} />
                <StatusBadge status={user.plan} />
              </div>
              <p className="text-[13px] text-muted-foreground">Причина блокировки: {valueOrDash(user.suspensionReason)}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
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

function PageState({ title, text }: { title: string; text: string }) {
  return (
    <>
      <AdminTopbar title={title} subtitle="" />
      <div className="p-5 lg:p-8 text-[13px] text-muted-foreground">{text}</div>
    </>
  );
}

function linkCell(path: string, text: string) {
  return <Link to={path} className="font-semibold hover:text-primary">{text || "—"}</Link>;
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function textValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown) {
  return typeof value === "number" ? value : null;
}

function apiErrorText(error: unknown) {
  if (error instanceof AdminApiError) return `${error.code}: ${error.message}`;
  return "admin_api_error";
}
