import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { StatCard } from "../components/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { payments } from "../data";

export const AdminPayments = () => {
  const succeeded = payments.filter((p) => p.status === "succeeded").reduce((a, p) => a + p.amount, 0);
  const refunded = payments.filter((p) => p.status === "refunded").reduce((a, p) => a + p.amount, 0);
  return (
    <>
      <AdminTopbar title="Платежи" subtitle="История транзакций и возвратов" />
      <div className="p-5 lg:p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Получено" value={`${succeeded.toLocaleString("ru")} ₽`} delta={6.8} series={[10, 12, 13, 15, 16, 18, 20]} />
          <StatCard label="Возвраты" value={`${refunded.toLocaleString("ru")} ₽`} delta={-1.4} series={[2, 1, 2, 1.5, 1.2, 1, 0.8]} />
          <StatCard label="Средний чек" value="763 ₽" delta={3.1} series={[600, 650, 680, 700, 720, 740, 763]} />
          <StatCard label="Failed rate" value="2.4%" delta={-0.2} series={[3, 2.8, 2.7, 2.6, 2.5, 2.4, 2.4]} />
        </div>

        <DataToolbar searchPlaceholder="Пользователь, метод, сумма…" />

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>ID</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead>Метод</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-[12.5px] font-mono text-muted-foreground">{p.id}</TableCell>
                  <TableCell className="text-[13.5px] font-semibold">{p.user}</TableCell>
                  <TableCell className="text-[13px]">{p.method}</TableCell>
                  <TableCell><StatusBadge status={p.type} /></TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">{p.date}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums font-semibold">{p.amount} ₽</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
