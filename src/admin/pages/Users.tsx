import { useNavigate } from "react-router-dom";
import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { users } from "../data";
import { CheckCircle2, MoreHorizontal } from "lucide-react";

export const AdminUsers = () => {
  const navigate = useNavigate();
  return (
    <>
      <AdminTopbar title="Пользователи" subtitle={`Всего: ${users.length} · показаны последние`} />
      <div className="p-5 lg:p-8">
        <DataToolbar searchPlaceholder="Имя, @handle, email…" addLabel="Новый пользователь" onAdd={() => {}} />

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Пользователь</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>План</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Встречи</TableHead>
                <TableHead className="text-right">Жалобы</TableHead>
                <TableHead>Регистрация</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} className="cursor-pointer" onClick={() => navigate(`/users/${u.id}`)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary/30 flex items-center justify-center text-[11px] font-semibold">
                        {u.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                      </div>
                      <div className="leading-tight">
                        <p className="text-[13.5px] font-semibold flex items-center gap-1">
                          {u.name}
                          {u.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                        </p>
                        <p className="text-[11.5px] text-muted-foreground">@{u.handle} · {u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px]">{u.city}</TableCell>
                  <TableCell><StatusBadge status={u.plan} /></TableCell>
                  <TableCell><StatusBadge status={u.status} /></TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">{u.meetups}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">
                    <span className={u.reports > 0 ? "text-destructive font-semibold" : "text-muted-foreground"}>
                      {u.reports}
                    </span>
                  </TableCell>
                  <TableCell className="text-[12.5px] text-muted-foreground">{u.joined}</TableCell>
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
