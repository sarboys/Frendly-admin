import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { banners, featuredItems } from "../data";
import { MoreHorizontal, GripVertical, Image as ImageIcon } from "lucide-react";

export const AdminFeatured = () => {
  return (
    <>
      <AdminTopbar title="Афиша и фичеринг" subtitle="Баннеры, продвигаемые встречи и сообщества" />
      <div className="p-5 lg:p-8 space-y-6">
        <div>
          <h3 className="font-display font-semibold text-[15px] mb-3">Баннеры</h3>
          <DataToolbar searchPlaceholder="Заголовок баннера…" addLabel="Создать баннер" onAdd={() => {}} />
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Размещение</TableHead>
                  <TableHead>Старт</TableHead>
                  <TableHead>Финиш</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="text-[13.5px] font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        {b.title}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={b.placement} /></TableCell>
                    <TableCell className="text-[13px]">{b.starts}</TableCell>
                    <TableCell className="text-[13px]">{b.ends}</TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">{b.ctr ? `${b.ctr}%` : "—"}</TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
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
          <h3 className="font-display font-semibold text-[15px] mb-3">Продвигаемая лента</h3>
          <p className="text-[12.5px] text-muted-foreground mb-3">Перетащи, чтобы изменить позицию в публичной афише.</p>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {featuredItems.map((f) => (
              <div key={f.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[12px] font-semibold shrink-0">
                  {f.position}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold truncate">{f.title}</p>
                  <p className="text-[12px] text-muted-foreground">{f.city} · {f.views.toLocaleString("ru")} показов</p>
                </div>
                <StatusBadge status={f.type} />
                <Button variant="ghost" size="sm" className="h-8">Снять</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
