import { AdminTopbar } from "../components/Topbar";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { contentPages } from "../data";
import { MoreHorizontal, FileText } from "lucide-react";

export const AdminContent = () => {
  return (
    <>
      <AdminTopbar title="Контент и страницы" subtitle="Правила, FAQ, политики, онбординг" />
      <div className="p-5 lg:p-8 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
        <div>
          <DataToolbar searchPlaceholder="Название, slug…" addLabel="Новая страница" onAdd={() => {}} />
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Обновлено</TableHead>
                  <TableHead>Автор</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentPages.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-[13.5px] font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                        {p.title}
                      </span>
                    </TableCell>
                    <TableCell className="text-[12px] font-mono text-muted-foreground">{p.slug}</TableCell>
                    <TableCell><StatusBadge status={p.type} /></TableCell>
                    <TableCell className="text-[13px]">{p.updated}</TableCell>
                    <TableCell className="text-[13px]">{p.author}</TableCell>
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

        <div className="rounded-lg border border-border bg-card p-5 h-fit">
          <p className="text-[12px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Быстрый редактор</p>
          <div className="space-y-3">
            <div>
              <label className="text-[12px] font-semibold mb-1 block">Заголовок</label>
              <Input defaultValue="Правила сообщества" className="h-9 bg-background" />
            </div>
            <div>
              <label className="text-[12px] font-semibold mb-1 block">Slug</label>
              <Input defaultValue="/rules" className="h-9 bg-background font-mono text-[13px]" />
            </div>
            <div>
              <label className="text-[12px] font-semibold mb-1 block">Содержимое (Markdown)</label>
              <Textarea
                rows={10}
                defaultValue={`# Правила Frendly\n\n1. Уважай других участников\n2. Не публикуй рекламу\n3. Запрещено 18+ контент вне After Dark\n4. Подделка профиля = бан`}
                className="bg-background font-mono text-[12.5px]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1 h-9">Сохранить</Button>
              <Button size="sm" variant="outline" className="h-9">Превью</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
