import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UsersRound,
  Image as ImageIcon,
  Crown,
  CreditCard,
  ShieldAlert,
  Settings,
  Sparkles,
  BarChart3,
  Bell,
  BadgeCheck,
  Tag,
  FileText,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Дашборд", icon: LayoutDashboard, end: true },
  { to: "/analytics", label: "Аналитика", icon: BarChart3 },
  { to: "/users", label: "Пользователи", icon: Users },
  { to: "/verification", label: "Верификация", icon: BadgeCheck },
  { to: "/meetups", label: "Встречи", icon: CalendarDays },
  { to: "/communities", label: "Сообщества", icon: UsersRound },
  { to: "/posters", label: "Афиша", icon: ImageIcon },
  { to: "/featured", label: "Фичеринг", icon: Megaphone },
  { to: "/notifications", label: "Рассылки", icon: Bell },
  { to: "/promos", label: "Промокоды", icon: Tag },
  { to: "/content", label: "Контент", icon: FileText },
  { to: "/subscriptions", label: "Подписки", icon: Crown },
  { to: "/payments", label: "Платежи", icon: CreditCard },
  { to: "/reports", label: "Жалобы", icon: ShieldAlert },
  { to: "/settings", label: "Настройки", icon: Settings },
];

export const AdminSidebar = () => {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-card sticky top-0 h-screen">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-border">
        <span className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm">
          Fr
        </span>
        <div className="leading-tight">
          <p className="font-display font-semibold text-[15px]">Frendly</p>
          <p className="text-[11px] text-muted-foreground">Admin Console</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/75 hover:bg-muted hover:text-foreground",
                )
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="m-3 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-[13px] font-semibold">Frendly+ статистика</p>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          7.4% юзеров на платном плане. +0.6% за неделю.
        </p>
      </div>
    </aside>
  );
};
