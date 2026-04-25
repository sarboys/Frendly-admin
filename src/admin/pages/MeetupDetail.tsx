import { useParams, Link, useNavigate } from "react-router-dom";
import { AdminTopbar } from "../components/Topbar";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { meetups, users } from "../data";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  Trash2,
  Users,
  XCircle,
  CheckCircle2,
  Pin,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const AdminMeetupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const meetup = meetups.find((m) => m.id === id) ?? meetups[0];
  const participants = users.slice(0, meetup.participants);

  const action = (msg: string) => toast({ title: msg });

  return (
    <>
      <AdminTopbar title={meetup.title} subtitle={`#${meetup.id} · хост ${meetup.host}`} />
      <div className="p-5 lg:p-8 space-y-6">
        <button
          onClick={() => navigate("/meetups")}
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Все встречи
        </button>

        {/* Header */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="h-40 bg-gradient-to-br from-primary/40 via-secondary/30 to-purple-300 relative">
            <div className="absolute top-3 left-3 flex gap-2">
              <StatusBadge status={meetup.type} />
              <StatusBadge status={meetup.status} />
            </div>
          </div>
          <div className="p-6 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h2 className="font-display text-[22px] font-semibold mb-3">{meetup.title}</h2>
              <div className="grid sm:grid-cols-2 gap-3 text-[13px]">
                <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /> {meetup.date}</p>
                <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /> {meetup.time}</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> {meetup.venue}, {meetup.city}</p>
                <p className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" /> {meetup.participants}/{meetup.capacity} участников</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 self-start">
              <Button variant="outline" className="gap-2" onClick={() => action("Закреплено в афише")}>
                <Pin className="w-4 h-4" /> В топ
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => action("Помечено как рекомендованное")}>
                <Star className="w-4 h-4" /> Рекомендовать
              </Button>
              {meetup.status !== "cancelled" && (
                <Button variant="outline" className="gap-2 text-destructive border-destructive/30" onClick={() => action("Встреча отменена")}>
                  <XCircle className="w-4 h-4" /> Отменить
                </Button>
              )}
              <Button variant="outline" size="icon" className="text-destructive" onClick={() => action("Удалено")}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Детали</TabsTrigger>
            <TabsTrigger value="participants">Участники ({meetup.participants})</TabsTrigger>
            <TabsTrigger value="moderation">Модерация</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-6 grid lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input defaultValue={meetup.title} />
              </div>
              <div className="space-y-2">
                <Label>Тип</Label>
                <Select defaultValue={meetup.type}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meetup">Встреча</SelectItem>
                    <SelectItem value="date">Свидание</SelectItem>
                    <SelectItem value="afterdark">After Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Дата</Label>
                <Input defaultValue={meetup.date} />
              </div>
              <div className="space-y-2">
                <Label>Время</Label>
                <Input defaultValue={meetup.time} />
              </div>
              <div className="space-y-2">
                <Label>Город</Label>
                <Input defaultValue={meetup.city} />
              </div>
              <div className="space-y-2">
                <Label>Место</Label>
                <Input defaultValue={meetup.venue} />
              </div>
              <div className="space-y-2">
                <Label>Капасити</Label>
                <Input type="number" defaultValue={meetup.capacity} />
              </div>
              <div className="space-y-2">
                <Label>Статус</Label>
                <Select defaultValue={meetup.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Скоро</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="past">Прошло</SelectItem>
                    <SelectItem value="cancelled">Отменено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-2 space-y-2">
                <Label>Описание</Label>
                <Textarea rows={4} defaultValue="Тёплый вечер с домашним вином, музыкой и видом на крыши." />
              </div>
              <div className="lg:col-span-2 flex justify-end gap-2">
                <Button variant="outline">Отмена</Button>
                <Button onClick={() => action("Встреча обновлена")}>Сохранить</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="mt-4">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Город</TableHead>
                    <TableHead>План</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <Link to={`/users/${u.id}`} className="flex items-center gap-3 hover:text-primary">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[11px] font-semibold">
                            {u.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-[13.5px] font-semibold">{u.name}</p>
                            <p className="text-[11.5px] text-muted-foreground">@{u.handle}</p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-[13px]">{u.city}</TableCell>
                      <TableCell><StatusBadge status={u.plan} /></TableCell>
                      <TableCell><StatusBadge status={u.status} /></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-8" onClick={() => action(`${u.name} удалён со встречи`)}>
                          Исключить
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="moderation" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-6 space-y-5 max-w-2xl">
              <div>
                <p className="text-[14px] font-semibold mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" /> Проверки
                </p>
                <ul className="text-[13px] space-y-2 text-muted-foreground">
                  <li>✓ Локация существует</li>
                  <li>✓ Описание прошло авто-модерацию</li>
                  <li>✓ Хост верифицирован</li>
                  <li>⚠ 1 жалоба ожидает рассмотрения</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <Label>Заметка модератора</Label>
                <Textarea rows={3} placeholder="Внутренняя заметка для команды…" />
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button variant="outline" onClick={() => action("Скрыто из ленты")}>Скрыть из ленты</Button>
                  <Button variant="outline" className="text-destructive border-destructive/30" onClick={() => action("Заблокировано")}>
                    Заблокировать
                  </Button>
                  <Button onClick={() => action("Одобрено")}>Одобрить</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
