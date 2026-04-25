import { useNavigate } from "react-router-dom";
import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { StatCard } from "../components/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { subscriptions } from "../data";
import { Crown, Gift, Settings2 } from "lucide-react";

export const AdminSubscriptions = () => {
  const navigate = useNavigate();
  const active = subscriptions.filter((s) => s.status === "active").length;
  const trial = subscriptions.filter((s) => s.status === "trial").length;
  const mrr = subscriptions
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + s.amount, 0);

  return (
    <>
      <AdminTopbar title="Подписки" subtitle="Управление Frendly+ и After Dark" />
      <div className="p-5 lg:p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Активные" value={active.toString()} delta={4.2} series={[3, 4, 4, 5, 5, 6, 7]} />
          <StatCard label="Триал" value={trial.toString()} delta={12} series={[1, 1, 2, 2, 3, 3, 4]} />
          <StatCard label="MRR" value={`${(mrr / 1000).toFixed(1)}k ₽`} delta={5.2} series={[12, 14, 13, 16, 18, 21, 24]} />
          <StatCard label="Churn" value="2.1%" delta={-0.3} series={[3, 3, 2.8, 2.5, 2.4, 2.2, 2.1]} />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className="gap-2"><Gift className="w-4 h-4" />Подарить подписку</Button>
          <Button variant="outline" className="gap-2"><Crown className="w-4 h-4" />Промокод</Button>
          <Button variant="outline" className="gap-2 ml-auto" onClick={() => navigate("/subscriptions/settings")}>
            <Settings2 className="w-4 h-4" />Настройки тарифов
          </Button>
        </div>

        <DataToolbar searchPlaceholder="Пользователь, план…" />

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Пользователь</TableHead>
                <TableHead>План</TableHead>
                <TableHead>Начало</TableHead>
                <TableHead>Продление</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-[13.5px] font-semibold">{s.user}</TableCell>
                  <TableCell><StatusBadge status={s.plan} /></TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">{s.started}</TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">{s.renews}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums font-semibold">
                    {s.amount > 0 ? `${s.amount} ₽` : "—"}
                  </TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
