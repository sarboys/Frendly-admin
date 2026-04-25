import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { promos, referrals } from "../data";
import { MoreHorizontal, Copy } from "lucide-react";

export const AdminPromos = () => {
  return (
    <>
      <AdminTopbar title="Промокоды и рефералы" subtitle="Промо-кампании и приглашения" />
      <div className="p-5 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Активных промо</p>
            <p className="font-display text-[28px] font-semibold mt-2">{promos.filter((p) => p.status === "active").length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Всего рефералов</p>
            <p className="font-display text-[28px] font-semibold mt-2">{referrals.total.toLocaleString("ru")}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Активных рефералов</p>
            <p className="font-display text-[28px] font-semibold mt-2">{referrals.active.toLocaleString("ru")}</p>
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold text-[15px] mb-3">Промокоды</h3>
          <DataToolbar searchPlaceholder="Код или название…" addLabel="Создать промокод" onAdd={() => {}} />
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Код</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Значение</TableHead>
                  <TableHead className="text-right">Использован</TableHead>
                  <TableHead>Истекает</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {promos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <span className="inline-flex items-center gap-2 font-mono text-[13px] font-semibold">
                        {p.code}
                        <Copy className="w-3.5 h-3.5 text-muted-foreground cursor-pointer" />
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={p.type} /></TableCell>
                    <TableCell className="text-[13px] font-semibold">{p.value}</TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">
                      {p.uses.toLocaleString("ru")}{p.limit > 0 ? ` / ${p.limit.toLocaleString("ru")}` : ""}
                    </TableCell>
                    <TableCell className="text-[13px]">{p.expires}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
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
          <h3 className="font-display font-semibold text-[15px] mb-3">Топ рефереров</h3>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Пользователь</TableHead>
                  <TableHead className="text-right">Приглашений</TableHead>
                  <TableHead className="text-right">Купили подписку</TableHead>
                  <TableHead className="text-right">Заработано бонусов</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.topReferrers.map((r) => (
                  <TableRow key={r.user}>
                    <TableCell className="text-[13.5px] font-semibold">{r.user}</TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{r.invites}</TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{r.paid}</TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{r.earned.toLocaleString("ru")} ₽</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};
