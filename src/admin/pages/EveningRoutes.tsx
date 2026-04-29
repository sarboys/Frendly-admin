import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminApiError } from "../api/client";
import { createRouteTemplate, listRouteTemplates } from "../evening/api";
import type { AdminEveningRouteTemplateDto } from "../evening/types";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTopbar } from "../components/Topbar";

export const AdminEveningRoutes = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<AdminEveningRouteTemplateDto[]>([]);
  const [city, setCity] = useState("Москва");
  const [area, setArea] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listRouteTemplates({ limit: 50 });
      setTemplates(response.items);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const createTemplate = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const template = await createRouteTemplate({
        city,
        timezone: "Europe/Moscow",
        area: area || null,
      });
      navigate(`/evening-routes/${template.id}`);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AdminTopbar
        title="Маршруты"
        subtitle="Командные маршруты Frendly и версии для будущих встреч"
      />
      <div className="space-y-5 p-5 lg:p-8">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Город</span>
              <Input value={city} onChange={(event) => setCity(event.target.value)} />
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Район</span>
              <Input value={area} onChange={(event) => setArea(event.target.value)} />
            </label>
            <div className="flex items-end">
              <Button type="button" onClick={() => void createTemplate()} disabled={isSaving}>
                Создать маршрут
              </Button>
            </div>
          </div>
          {error && <p className="mt-3 text-[12px] text-destructive">{error}</p>}
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-[14px] font-semibold">Route Studio</p>
              <p className="text-[12px] text-muted-foreground">
                Список шаблонов, текущая версия и статус публикации.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Обновить
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Маршрут</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Район</TableHead>
                <TableHead>Версий</TableHead>
                <TableHead>Опубликован</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-[13px] text-muted-foreground">
                    Загрузка маршрутов...
                  </TableCell>
                </TableRow>
              ) : templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-[13px] text-muted-foreground">
                    Маршрутов пока нет.
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow
                    key={template.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/evening-routes/${template.id}`)}
                  >
                    <TableCell>
                      <p className="text-[13.5px] font-semibold">
                        {template.currentRoute?.title ?? "Без версии"}
                      </p>
                      <p className="text-[11.5px] text-muted-foreground">{template.id}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={template.status} />
                    </TableCell>
                    <TableCell className="text-[13px]">{template.city}</TableCell>
                    <TableCell className="text-[13px]">{template.area ?? "нет"}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{template.revisionCount}</TableCell>
                    <TableCell className="text-[13px]">{template.publishedAt ?? "нет"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

function errorMessage(caught: unknown) {
  if (caught instanceof AdminApiError) {
    return `${caught.code}: ${caught.message}`;
  }
  if (caught instanceof Error) {
    return caught.message;
  }
  return "Не удалось выполнить запрос";
}
