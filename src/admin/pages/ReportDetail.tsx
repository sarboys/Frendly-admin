import { useParams, useNavigate } from "react-router-dom";
import { AdminTopbar } from "../components/Topbar";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reports } from "../data";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Clock,
  Flag,
  MessageSquare,
  ShieldAlert,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const timeline = [
  { id: 1, icon: Flag, text: "Жалоба создана", time: "23 апр, 14:02", color: "text-destructive" },
  { id: 2, icon: Clock, text: "Передана модератору @anna", time: "23 апр, 14:05", color: "text-amber-600" },
  { id: 3, icon: MessageSquare, text: "Запрошены доказательства у заявителя", time: "23 апр, 14:30", color: "text-primary" },
];

export const AdminReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = reports.find((r) => r.id === id) ?? reports[0];

  const action = (msg: string) => toast({ title: msg });

  return (
    <>
      <AdminTopbar title={`Жалоба #${report.id}`} subtitle={`${report.type} · ${report.severity} severity`} />
      <div className="p-5 lg:p-8 space-y-6">
        <button
          onClick={() => navigate("/reports")}
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Все жалобы
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldAlert className="w-5 h-5 text-destructive" />
                    <h2 className="font-display text-[18px] font-semibold">{report.reason}</h2>
                  </div>
                  <p className="text-[13px] text-muted-foreground">
                    Жалоба от <span className="font-semibold text-foreground">{report.reporter}</span> на{" "}
                    <span className="font-semibold text-foreground">{report.target}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={report.status} />
                  <StatusBadge status={report.severity} />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-[13px] py-4 border-y border-border">
                <div>
                  <p className="text-muted-foreground text-[11.5px] uppercase tracking-wide mb-1">Тип</p>
                  <StatusBadge status={report.type} />
                </div>
                <div>
                  <p className="text-muted-foreground text-[11.5px] uppercase tracking-wide mb-1">Дата</p>
                  <p className="font-semibold">{report.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11.5px] uppercase tracking-wide mb-1">SLA</p>
                  <p className="font-semibold text-amber-600">12 часов</p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-[11.5px] uppercase tracking-wide text-muted-foreground mb-2">Описание</p>
                <p className="text-[13.5px] leading-relaxed">
                  Пользователь сообщает, что в чате встречи были оскорбительные высказывания. Прикреплено 2 скриншота.
                  Заявитель просит проверить и принять меры.
                </p>
              </div>
            </div>

            {/* Evidence */}
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-[14px] font-semibold mb-3">Доказательства</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-muted to-muted/50 border border-border" />
                <div className="aspect-square rounded-lg bg-gradient-to-br from-muted to-muted/50 border border-border" />
                <div className="aspect-square rounded-lg bg-gradient-to-br from-muted to-muted/50 border border-border" />
              </div>
            </div>

            {/* Resolution */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <p className="text-[14px] font-semibold">Решение</p>
              <div className="space-y-2">
                <Label>Действие</Label>
                <Select defaultValue="warn">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dismiss">Отклонить — жалоба необоснована</SelectItem>
                    <SelectItem value="warn">Предупреждение пользователю</SelectItem>
                    <SelectItem value="mute">Mute на 7 дней</SelectItem>
                    <SelectItem value="ban">Бан аккаунта</SelectItem>
                    <SelectItem value="remove">Удалить контент</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Комментарий для команды (внутр.)</Label>
                <Textarea rows={3} placeholder="Подробности решения…" />
              </div>
              <div className="space-y-2">
                <Label>Сообщение заявителю</Label>
                <Textarea rows={2} defaultValue="Спасибо за обращение. Мы рассмотрели вашу жалобу и приняли меры." />
              </div>
              <div className="flex flex-wrap gap-2 justify-end pt-2">
                <Button variant="outline" className="gap-2" onClick={() => action("Жалоба отклонена")}>
                  <XCircle className="w-4 h-4" /> Отклонить
                </Button>
                <Button variant="outline" className="gap-2 text-destructive border-destructive/30" onClick={() => action("Аккаунт забанен")}>
                  <Ban className="w-4 h-4" /> Бан
                </Button>
                <Button variant="outline" className="gap-2 text-destructive border-destructive/30" onClick={() => action("Контент удалён")}>
                  <Trash2 className="w-4 h-4" /> Удалить
                </Button>
                <Button className="gap-2" onClick={() => action("Жалоба решена")}>
                  <CheckCircle2 className="w-4 h-4" /> Применить и закрыть
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-[14px] font-semibold mb-3">История</p>
              <div className="space-y-3">
                {timeline.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div key={t.id} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 ${t.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium">{t.text}</p>
                        <p className="text-[11.5px] text-muted-foreground">{t.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-[14px] font-semibold mb-2">О цели</p>
              <p className="text-[13px] mb-1">{report.target}</p>
              <p className="text-[11.5px] text-muted-foreground mb-3">5 жалоб всего · 1 предупреждение</p>
              <Button variant="outline" size="sm" className="w-full">Открыть профиль</Button>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-[14px] font-semibold mb-2">Похожие</p>
              <ul className="space-y-2 text-[12.5px]">
                {reports.slice(0, 3).map((r) => (
                  <li key={r.id} className="flex items-center justify-between">
                    <span className="truncate">#{r.id} · {r.reason}</span>
                    <StatusBadge status={r.severity} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
