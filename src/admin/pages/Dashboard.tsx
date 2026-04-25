import { AdminTopbar } from "../components/Topbar";
import { StatCard } from "../components/StatCard";
import { kpis, recentActivity, meetups, users } from "../data";
import { StatusBadge } from "../components/StatusBadge";
import {
  UserPlus,
  CalendarPlus,
  ShieldAlert,
  CreditCard,
  Users as UsersIcon,
  Ban,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "user-plus": UserPlus,
  "calendar-plus": CalendarPlus,
  "shield-alert": ShieldAlert,
  "credit-card": CreditCard,
  users: UsersIcon,
  ban: Ban,
};

export const AdminDashboard = () => {
  return (
    <>
      <AdminTopbar title="Дашборд" subtitle="Обзор всего, что происходит в Frendly" />

      <div className="p-5 lg:p-8 space-y-6">
        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard label="Пользователи" value={kpis.users.value.toLocaleString("ru")} delta={kpis.users.delta} series={kpis.users.series} hint="за всё время" />
          <StatCard label="Активные / неделя" value={kpis.active.value.toLocaleString("ru")} delta={kpis.active.delta} series={kpis.active.series} hint="DAU за 7 дней" />
          <StatCard label="Встречи" value={kpis.meetups.value.toString()} delta={kpis.meetups.delta} series={kpis.meetups.series} hint="за неделю" />
          <StatCard label="Доход" value={`${(kpis.revenue.value / 1000).toFixed(1)}k ₽`} delta={kpis.revenue.delta} series={kpis.revenue.series} hint="MRR" />
          <StatCard label="Жалобы" value={kpis.reports.value.toString()} delta={kpis.reports.delta} series={kpis.reports.series} hint="открыто" />
          <StatCard label="Конверсия в +" value={`${kpis.conversion.value}%`} delta={kpis.conversion.delta} series={kpis.conversion.series} hint="free → plus" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity feed */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-[16px]">Последние события</h2>
              <button className="text-[12px] text-primary font-semibold">Все события</button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((a) => {
                const Icon = iconMap[a.icon] ?? UsersIcon;
                return (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-foreground/70" />
                    </div>
                    <p className="text-[13.5px] flex-1 min-w-0 truncate">{a.text}</p>
                    <span className="text-[11px] text-muted-foreground shrink-0">{a.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="font-display font-semibold text-[16px] mb-4">Быстрые действия</h2>
            <div className="space-y-2">
              {[
                { label: "Выдать Frendly+", desc: "Подарить подписку юзеру", color: "primary" },
                { label: "Создать афишу", desc: "Опубликовать новое событие", color: "secondary" },
                { label: "Разобрать жалобы", desc: "5 ждут модерации", color: "destructive" },
                { label: "Рассылка", desc: "Push всем активным", color: "muted" },
              ].map((a) => (
                <button
                  key={a.label}
                  className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <p className="text-[13.5px] font-semibold">{a.label}</p>
                  <p className="text-[11.5px] text-muted-foreground mt-0.5">{a.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Two columns: latest meetups + new users */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-[16px]">Ближайшие встречи</h2>
              <button className="text-[12px] text-primary font-semibold">Все</button>
            </div>
            <div className="space-y-2">
              {meetups.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] text-muted-foreground leading-none">{m.date.split(" ")[1]}</span>
                    <span className="font-display font-bold text-[13px] leading-tight">{m.date.split(" ")[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold truncate">{m.title}</p>
                    <p className="text-[11.5px] text-muted-foreground truncate">
                      {m.host} · {m.venue} · {m.participants}/{m.capacity}
                    </p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-[16px]">Новые пользователи</h2>
              <button className="text-[12px] text-primary font-semibold">Все</button>
            </div>
            <div className="space-y-2">
              {users.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-secondary/30 text-foreground flex items-center justify-center text-[12px] font-semibold shrink-0">
                    {u.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold truncate">{u.name}</p>
                    <p className="text-[11.5px] text-muted-foreground truncate">
                      @{u.handle} · {u.city} · {u.joined}
                    </p>
                  </div>
                  <StatusBadge status={u.plan} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
