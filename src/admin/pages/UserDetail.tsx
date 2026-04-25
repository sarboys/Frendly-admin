import { useParams, Link, useNavigate } from "react-router-dom";
import { AdminTopbar } from "../components/Topbar";
import { StatusBadge } from "../components/StatusBadge";
import { StatCard } from "../components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { users, meetups, payments, reports } from "../data";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  Crown,
  Gift,
  Key,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = users.find((u) => u.id === id) ?? users[0];
  const userMeetups = meetups.filter((m) => m.host.startsWith(user.name.split(" ")[0]));
  const userPayments = payments.filter((p) => p.user.startsWith(user.name.split(" ")[0]));
  const userReports = reports.filter((r) => r.target.startsWith(user.name.split(" ")[0]));

  const action = (msg: string) => toast({ title: msg });

  return (
    <>
      <AdminTopbar title={user.name} subtitle={`@${user.handle} · ${user.email}`} />
      <div className="p-5 lg:p-8 space-y-6">
        <button
          onClick={() => navigate("/users")}
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Все пользователи
        </button>

        {/* Header card */}
        <div className="rounded-lg border border-border bg-card p-6 flex flex-col lg:flex-row gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-2xl font-display font-bold">
              {user.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-[20px] font-semibold">{user.name}</h2>
                {user.verified && <BadgeCheck className="w-5 h-5 text-primary" />}
              </div>
              <p className="text-[13px] text-muted-foreground">@{user.handle} · #{user.id}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <StatusBadge status={user.status} />
                <StatusBadge status={user.plan} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:ml-auto self-start">
            <Button variant="outline" className="gap-2" onClick={() => action("Подписка выдана")}>
              <Gift className="w-4 h-4" /> Выдать Frendly+
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => action("Сбросить пароль — ссылка отправлена")}>
              <Key className="w-4 h-4" /> Сброс пароля
            </Button>
            {user.status !== "banned" ? (
              <Button variant="outline" className="gap-2 text-destructive border-destructive/30" onClick={() => action("Пользователь забанен")}>
                <Ban className="w-4 h-4" /> Забанить
              </Button>
            ) : (
              <Button className="gap-2" onClick={() => action("Бан снят")}>
                <BadgeCheck className="w-4 h-4" /> Снять бан
              </Button>
            )}
            <Button variant="outline" size="icon" className="text-destructive" onClick={() => action("Удаление подтверждено")}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Встречи" value={user.meetups.toString()} delta={4.2} series={[1, 2, 3, 4, 5, 6, 7]} />
          <StatCard label="Жалобы" value={user.reports.toString()} delta={-12} series={[3, 2, 2, 1, 1, 0, 0]} />
          <StatCard label="Платежи" value={`${userPayments.reduce((a, p) => a + p.amount, 0)} ₽`} delta={2.1} series={[1, 1, 2, 2, 3, 3, 4]} />
          <StatCard label="Дней с нами" value="42" delta={0} series={[1, 2, 3, 4, 5, 6, 7]} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="meetups">Встречи ({userMeetups.length})</TabsTrigger>
            <TabsTrigger value="payments">Платежи ({userPayments.length})</TabsTrigger>
            <TabsTrigger value="reports">Жалобы ({userReports.length})</TabsTrigger>
            <TabsTrigger value="permissions">Доступ</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="rounded-lg border border-border bg-card p-6 grid lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Имя</Label>
                <Input defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label>Handle</Label>
                <Input defaultValue={user.handle} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</Label>
                <Input defaultValue={user.email} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Телефон</Label>
                <Input defaultValue="+7 999 123-45-67" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Город</Label>
                <Input defaultValue={user.city} />
              </div>
              <div className="space-y-2">
                <Label>Дата рождения</Label>
                <Input defaultValue="14 марта 1996" />
              </div>
              <div className="lg:col-span-2 space-y-2">
                <Label>О себе</Label>
                <Textarea rows={3} defaultValue="Винные вечера, бег по утрам, поиск тёплой компании." />
              </div>
              <div className="lg:col-span-2 flex justify-end gap-2">
                <Button variant="outline">Отмена</Button>
                <Button onClick={() => action("Профиль сохранён")}>Сохранить</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meetups">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Название</TableHead>
                    <TableHead>Город</TableHead>
                    <TableHead>Когда</TableHead>
                    <TableHead className="text-right">Участники</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userMeetups.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-[13px] text-muted-foreground py-8">Нет встреч</TableCell></TableRow>
                  )}
                  {userMeetups.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <Link to={`/meetups/${m.id}`} className="text-[13.5px] font-semibold hover:text-primary">{m.title}</Link>
                      </TableCell>
                      <TableCell className="text-[13px]">{m.city}</TableCell>
                      <TableCell className="text-[13px]">{m.date} · {m.time}</TableCell>
                      <TableCell className="text-right tabular-nums text-[13px]">{m.participants}/{m.capacity}</TableCell>
                      <TableCell><StatusBadge status={m.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>ID</TableHead>
                    <TableHead>Метод</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPayments.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-[13px] text-muted-foreground py-8">Платежей нет</TableCell></TableRow>
                  )}
                  {userPayments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-[12.5px] text-muted-foreground">#{p.id}</TableCell>
                      <TableCell className="text-[13px]">{p.method}</TableCell>
                      <TableCell className="text-[13px]">{p.date}</TableCell>
                      <TableCell className="text-right tabular-nums text-[13px] font-semibold">{p.amount} ₽</TableCell>
                      <TableCell><StatusBadge status={p.type} /></TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>От кого</TableHead>
                    <TableHead>Причина</TableHead>
                    <TableHead>Серьёзность</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userReports.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-[13px] text-muted-foreground py-8 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4 text-secondary" /> Жалоб нет</TableCell></TableRow>
                  )}
                  {userReports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-[13px]">{r.reporter}</TableCell>
                      <TableCell className="text-[13px]">{r.reason}</TableCell>
                      <TableCell><StatusBadge status={r.severity} /></TableCell>
                      <TableCell className="text-[13px] text-muted-foreground">{r.date}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="permissions">
            <div className="rounded-lg border border-border bg-card p-6 space-y-5 max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-primary" /> Верификация</p>
                  <p className="text-[12px] text-muted-foreground">Подтверждённый профиль с галочкой</p>
                </div>
                <Switch defaultChecked={user.verified} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold flex items-center gap-1.5"><Crown className="w-4 h-4 text-primary" /> After Dark</p>
                  <p className="text-[12px] text-muted-foreground">Доступ к 18+ контенту</p>
                </div>
                <Switch defaultChecked={user.plan === "afterdark"} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold">Может создавать встречи</p>
                  <p className="text-[12px] text-muted-foreground">Хост-привилегии</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold">Чат отключён</p>
                  <p className="text-[12px] text-muted-foreground">Пользователь не может писать в чатах</p>
                </div>
                <Switch />
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <Label>Принудительный план</Label>
                <Select defaultValue={user.plan}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="plus">Frendly+</SelectItem>
                    <SelectItem value="afterdark">After Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => action("Доступ обновлён")}>Применить</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
