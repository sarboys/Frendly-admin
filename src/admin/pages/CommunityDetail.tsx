import { useParams, Link, useNavigate } from "react-router-dom";
import { AdminTopbar } from "../components/Topbar";
import { StatusBadge } from "../components/StatusBadge";
import { StatCard } from "../components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { communities, users } from "../data";
import {
  ArrowLeft,
  Archive,
  Crown,
  EyeOff,
  Flag,
  MessageSquare,
  Pin,
  ShieldCheck,
  Trash2,
  UserMinus,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const fakePosts = [
  { id: "p1", author: "Аня К.", text: "Кто завтра на пробежку 8 утра?", reports: 0, pinned: true, time: "2 ч" },
  { id: "p2", author: "Никита О.", text: "Скинул трек в плейлист, послушайте!", reports: 0, pinned: false, time: "5 ч" },
  { id: "p3", author: "Артём Б.", text: "Спам про крипту в комментариях", reports: 3, pinned: false, time: "1 д" },
  { id: "p4", author: "Соня Л.", text: "Новый плейлист для медленных вечеров", reports: 0, pinned: false, time: "2 д" },
];

export const AdminCommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const community = communities.find((c) => c.id === id) ?? communities[0];
  const members = users.slice(0, 6);

  const action = (msg: string) => toast({ title: msg });

  return (
    <>
      <AdminTopbar title={community.name} subtitle={`#${community.id} · владелец ${community.owner}`} />
      <div className="p-5 lg:p-8 space-y-6">
        <button
          onClick={() => navigate("/communities")}
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Все сообщества
        </button>

        {/* Header */}
        <div className="rounded-lg border border-border bg-card p-6 flex flex-col lg:flex-row gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center text-2xl font-display font-bold">
              {community.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h2 className="font-display text-[20px] font-semibold">{community.name}</h2>
              <p className="text-[13px] text-muted-foreground">{community.city} · создано {community.created}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <StatusBadge status={community.status} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:ml-auto self-start">
            <Button variant="outline" className="gap-2" onClick={() => action("Закреплено в каталоге")}>
              <Pin className="w-4 h-4" /> В топ
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => action("Помечено как verified")}>
              <ShieldCheck className="w-4 h-4" /> Верифицировать
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => action("В архив")}>
              <Archive className="w-4 h-4" /> В архив
            </Button>
            <Button variant="outline" size="icon" className="text-destructive" onClick={() => action("Сообщество удалено")}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Участники" value={community.members.toString()} delta={6.4} series={[400, 410, 420, 440, 460, 470, 482]} />
          <StatCard label="Посты" value={community.posts.toString()} delta={3.1} series={[100, 105, 110, 115, 118, 122, 124]} />
          <StatCard label="Активные за нед." value="184" delta={2.2} series={[150, 160, 165, 170, 175, 180, 184]} />
          <StatCard label="Жалобы" value="3" delta={-25} series={[5, 4, 4, 3, 3, 3, 3]} />
        </div>

        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Посты</TabsTrigger>
            <TabsTrigger value="members">Участники ({community.members})</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4">
            <div className="rounded-lg border border-border bg-card divide-y divide-border">
              {fakePosts.map((p) => (
                <div key={p.id} className="p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[11px] font-semibold shrink-0">
                    {p.author.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13.5px] font-semibold">{p.author}</p>
                      <p className="text-[11.5px] text-muted-foreground">{p.time}</p>
                      {p.pinned && <Pin className="w-3 h-3 text-primary" />}
                      {p.reports > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-destructive">
                          <Flag className="w-3 h-3" /> {p.reports}
                        </span>
                      )}
                    </div>
                    <p className="text-[13.5px] mt-0.5">{p.text}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => action(p.pinned ? "Откреплено" : "Закреплено")}>
                      <Pin className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => action("Скрыто")}>
                      <EyeOff className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => action("Пост удалён")}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-4">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Город</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((u, i) => (
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
                      <TableCell className="text-[13px]">
                        {i === 0 ? <span className="inline-flex items-center gap-1 text-primary font-semibold"><Crown className="w-3.5 h-3.5" /> Владелец</span> : i === 1 ? "Модератор" : "Участник"}
                      </TableCell>
                      <TableCell className="text-[13px]">{u.city}</TableCell>
                      <TableCell><StatusBadge status={u.status} /></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => action(`${u.name} исключён`)}>
                          <UserMinus className="w-3.5 h-3.5" /> Исключить
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-6 space-y-5 max-w-2xl">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input defaultValue={community.name} />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea rows={3} defaultValue="Бегаем по утрам, делимся маршрутами и кофе." />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> Чат включён</p>
                  <p className="text-[12px] text-muted-foreground">Участники могут общаться в чате</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold">Только по приглашениям</p>
                  <p className="text-[12px] text-muted-foreground">Закрытое сообщество</p>
                </div>
                <Switch defaultChecked={community.status === "closed"} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold">Премодерация постов</p>
                  <p className="text-[12px] text-muted-foreground">Все посты требуют одобрения</p>
                </div>
                <Switch />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => action("Настройки сохранены")}>Сохранить</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
