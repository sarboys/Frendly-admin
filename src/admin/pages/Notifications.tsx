import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { campaigns, notificationTemplates } from "../data";
import { MoreHorizontal, Bell, Mail, Smartphone } from "lucide-react";

const channelIcon = (ch: string) => {
  if (ch === "push") return <Smartphone className="w-3.5 h-3.5" />;
  if (ch === "email") return <Mail className="w-3.5 h-3.5" />;
  return <Bell className="w-3.5 h-3.5" />;
};

export const AdminNotifications = () => {
  return (
    <>
      <AdminTopbar title="Уведомления и рассылки" subtitle="Push, email и in-app кампании" />
      <div className="p-5 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Отправлено за месяц</p>
            <p className="font-display text-[28px] font-semibold mt-2">142 480</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Open rate</p>
            <p className="font-display text-[28px] font-semibold mt-2">38.2%</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">CTR</p>
            <p className="font-display text-[28px] font-semibold mt-2">11.4%</p>
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold text-[15px] mb-3">Кампании</h3>
          <DataToolbar searchPlaceholder="Название кампании…" addLabel="Создать рассылку" onAdd={() => {}} />
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Название</TableHead>
                  <TableHead>Канал</TableHead>
                  <TableHead>Сегмент</TableHead>
                  <TableHead className="text-right">Аудитория</TableHead>
                  <TableHead>Когда</TableHead>
                  <TableHead className="text-right">Open / CTR</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-[13.5px] font-semibold">{c.title}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-[12px]">
                        {channelIcon(c.channel)}
                        <StatusBadge status={c.channel} />
                      </span>
                    </TableCell>
                    <TableCell className="text-[13px]">{c.segment}</TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{c.audience.toLocaleString("ru")}</TableCell>
                    <TableCell className="text-[13px]">{c.scheduled}</TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">
                      {c.status === "sent" || c.status === "sending" ? `${c.open}% / ${c.click}%` : "—"}
                    </TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
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
          <h3 className="font-display font-semibold text-[15px] mb-3">Шаблоны</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {notificationTemplates.map((t) => (
              <div key={t.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <StatusBadge status={t.channel} />
                  <span className="text-[11px] text-muted-foreground">{t.uses} исп.</span>
                </div>
                <p className="font-semibold text-[14px]">{t.name}</p>
                <Button variant="outline" size="sm" className="h-8 mt-3 w-full">Открыть</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
