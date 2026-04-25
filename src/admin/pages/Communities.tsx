import { useNavigate } from "react-router-dom";
import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { communities } from "../data";
import { MoreHorizontal } from "lucide-react";

export const AdminCommunities = () => {
  const navigate = useNavigate();
  return (
    <>
      <AdminTopbar title="Сообщества" subtitle={`${communities.length} клубов · модерация и аналитика`} />
      <div className="p-5 lg:p-8">
        <DataToolbar searchPlaceholder="Название, владелец, город…" addLabel="Новое сообщество" onAdd={() => {}} />

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Сообщество</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Владелец</TableHead>
                <TableHead className="text-right">Участники</TableHead>
                <TableHead className="text-right">Посты</TableHead>
                <TableHead>Создано</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {communities.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate(`/communities/${c.id}`)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[11px] font-semibold">
                        {c.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                      </div>
                      <p className="text-[13.5px] font-semibold">{c.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px]">{c.city}</TableCell>
                  <TableCell className="text-[13px]">{c.owner}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">{c.members}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">{c.posts}</TableCell>
                  <TableCell className="text-[12.5px] text-muted-foreground">{c.created}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
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
