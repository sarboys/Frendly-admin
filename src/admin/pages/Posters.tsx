import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { posters } from "../data";
import { MoreHorizontal } from "lucide-react";

export const AdminPosters = () => {
  return (
    <>
      <AdminTopbar title="Афиша" subtitle="События для раздела «Афиша» — модерация" />
      <div className="p-5 lg:p-8">
        <DataToolbar searchPlaceholder="Название, площадка…" addLabel="Опубликовать афишу" onAdd={() => {}} />

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Событие</TableHead>
                <TableHead>Площадка</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="text-right">Идёт</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posters.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-[13.5px] font-semibold">{p.title}</TableCell>
                  <TableCell className="text-[13px]">{p.venue}</TableCell>
                  <TableCell className="text-[13px]">{p.city}</TableCell>
                  <TableCell className="text-[13px]">{p.date}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">{p.attendees}</TableCell>
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
    </>
  );
};
