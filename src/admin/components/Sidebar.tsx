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
  Handshake,
  MapPinned,
  ClipboardCheck,
  Route as RouteIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPortalChrome, isAdminRouteEnabled, type AdminRouteId } from "../portal";

const items: Array<{
  id: AdminRouteId;
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
}> = [
  { id: "dashboard", to: "/", label: "Дашборд", icon: LayoutDashboard, end: true },
  { id: "analytics", to: "/analytics", label: "Аналитика", icon: BarChart3 },
  { id: "users", to: "/users", label: "Пользователи", icon: Users },
  { id: "verification", to: "/verification", label: "Верификация", icon: BadgeCheck },
  { id: "meetups", to: "/meetups", label: "Встречи", icon: CalendarDays },
  { id: "eveningRoutes", to: "/evening-routes", label: "Маршруты", icon: RouteIcon },
  { id: "routeReview", to: "/route-review", label: "Ревью маршрутов", icon: ClipboardCheck },
  { id: "venues", to: "/venues", label: "Места", icon: MapPinned },
  { id: "partners", to: "/partners", label: "Партнеры", icon: Handshake },
  { id: "communities", to: "/communities", label: "Сообщества", icon: UsersRound },
  { id: "posters", to: "/posters", label: "Афиша", icon: ImageIcon },
  { id: "featured", to: "/featured", label: "Фичеринг", icon: Megaphone },
  { id: "notifications", to: "/notifications", label: "Рассылки", icon: Bell },
  { id: "promos", to: "/promos", label: "Промокоды", icon: Tag },
  { id: "content", to: "/content", label: "Контент", icon: FileText },
  { id: "subscriptions", to: "/subscriptions", label: "Подписки", icon: Crown },
  { id: "payments", to: "/payments", label: "Платежи", icon: CreditCard },
  { id: "reports", to: "/reports", label: "Жалобы", icon: ShieldAlert },
  { id: "settings", to: "/settings", label: "Настройки", icon: Settings },
];

export const AdminSidebar = () => {
  const chrome = getPortalChrome();
  const visibleItems = items.filter((item) => isAdminRouteEnabled(item.id));

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-card sticky top-0 h-screen">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-border">
        <span className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm">
          Fr
        </span>
        <div className="leading-tight">
          <p className="font-display font-semibold text-[15px]">Frendly</p>
          <p className="text-[11px] text-muted-foreground">{chrome.subtitle}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
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
          <p className="text-[13px] font-semibold">{chrome.footerTitle}</p>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {chrome.footerText}
        </p>
      </div>
    </aside>
  );
};
