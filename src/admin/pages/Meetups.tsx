import { useNavigate } from "react-router-dom";
import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { meetups } from "../data";
import { MapPin, MoreHorizontal } from "lucide-react";

export const AdminMeetups = () => {
  const navigate = useNavigate();
  return (
    <>
      <AdminTopbar title="Встречи" subtitle={`${meetups.length} активных и прошедших`} />
      <div className="p-5 lg:p-8">
        <DataToolbar searchPlaceholder="Название, хост, город…" addLabel="Создать встречу" onAdd={() => {}} />

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Встреча</TableHead>
                <TableHead>Хост</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Когда</TableHead>
                <TableHead>Место</TableHead>
                <TableHead className="text-right">Участники</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetups.map((m) => (
                <TableRow key={m.id} className="cursor-pointer" onClick={() => navigate(`/meetups/${m.id}`)}>
                  <TableCell>
                    <p className="text-[13.5px] font-semibold">{m.title}</p>
                    <p className="text-[11.5px] text-muted-foreground">#{m.id}</p>
                  </TableCell>
                  <TableCell className="text-[13px]">{m.host}</TableCell>
                  <TableCell><StatusBadge status={m.type} /></TableCell>
                  <TableCell className="text-[13px]">{m.date} · {m.time}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-[13px]">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {m.venue}, {m.city}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">
                    {m.participants}/{m.capacity}
                  </TableCell>
                  <TableCell><StatusBadge status={m.status} /></TableCell>
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
