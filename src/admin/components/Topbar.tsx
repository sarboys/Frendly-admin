import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const AdminTopbar = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
      <div className="flex items-center gap-3 px-5 lg:px-8 h-16">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-semibold text-[18px] leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-[12px] text-muted-foreground truncate">{subtitle}</p>}
        </div>

        <div className="hidden md:flex items-center gap-2 w-72">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Поиск по админке…" className="pl-9 h-9 bg-card" />
          </div>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-[12px] font-semibold">
            АД
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-[13px] font-semibold">Админ</p>
            <p className="text-[11px] text-muted-foreground">root@frendly</p>
          </div>
        </div>
      </div>
    </header>
  );
};
