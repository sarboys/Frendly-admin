import { useNavigate } from "react-router-dom";
import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { reports } from "../data";

export const AdminReports = () => {
  const navigate = useNavigate();
  return (
    <>
      <AdminTopbar title="Жалобы" subtitle={`${reports.filter(r => r.status === "open").length} открытых · модерация`} />
      <div className="p-5 lg:p-8">
        <DataToolbar searchPlaceholder="Цель, причина, отправитель…" />

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>От кого</TableHead>
                <TableHead>На что/кого</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Причина</TableHead>
                <TableHead>Серьёзность</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => navigate(`/reports/${r.id}`)}>
                  <TableCell className="text-[13.5px] font-semibold">{r.reporter}</TableCell>
                  <TableCell className="text-[13px]">{r.target}</TableCell>
                  <TableCell><StatusBadge status={r.type} /></TableCell>
                  <TableCell className="text-[13px] text-muted-foreground">{r.reason}</TableCell>
                  <TableCell><StatusBadge status={r.severity} /></TableCell>
                  <TableCell className="text-[12.5px] text-muted-foreground">{r.date}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" className="h-8" onClick={() => navigate(`/reports/${r.id}`)}>Открыть</Button>
                      <Button size="sm" className="h-8" onClick={() => navigate(`/reports/${r.id}`)}>Решить</Button>
                    </div>
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
