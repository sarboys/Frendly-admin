import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { verifications } from "../data";
import { Check, X, MessageSquare, Image as ImageIcon } from "lucide-react";

export const AdminVerification = () => {
  const queue = verifications.filter((v) => v.status === "queue" || v.status === "needs_info");
  const history = verifications.filter((v) => v.status === "approved" || v.status === "rejected");

  return (
    <>
      <AdminTopbar title="Верификация пользователей" subtitle="Очередь заявок и история проверок" />
      <div className="p-5 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">В очереди</p>
            <p className="font-display text-[28px] font-semibold mt-2">{queue.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Одобрено за нед.</p>
            <p className="font-display text-[28px] font-semibold mt-2">214</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Отклонено за нед.</p>
            <p className="font-display text-[28px] font-semibold mt-2">38</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Ср. время ответа</p>
            <p className="font-display text-[28px] font-semibold mt-2">22 мин</p>
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold text-[15px] mb-3">Очередь заявок</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {queue.map((v) => (
              <div key={v.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <ImageIcon className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-display font-semibold text-[15px]">{v.user}</p>
                      <StatusBadge status={v.status} />
                    </div>
                    <p className="text-[12px] text-muted-foreground">@{v.handle} · {v.city}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={v.type} />
                      <span className="text-[12px] text-muted-foreground">{v.submitted}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1 h-9 gap-1.5">
                    <Check className="w-4 h-4" /> Одобрить
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-9 gap-1.5">
                    <MessageSquare className="w-4 h-4" /> Запрос
                  </Button>
                  <Button size="sm" variant="outline" className="h-9 w-9 p-0 text-destructive">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold text-[15px] mb-3">История</h3>
          <DataToolbar searchPlaceholder="Имя, @handle…" />
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Город</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Решение</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="text-[13.5px] font-semibold">{v.user} <span className="text-muted-foreground font-normal">@{v.handle}</span></TableCell>
                    <TableCell><StatusBadge status={v.type} /></TableCell>
                    <TableCell className="text-[13px]">{v.city}</TableCell>
                    <TableCell className="text-[13px]">{v.submitted}</TableCell>
                    <TableCell><StatusBadge status={v.status} /></TableCell>
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
