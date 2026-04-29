import { Button } from "@/components/ui/button";
import { StatusBadge } from "../../components/StatusBadge";
import type { AdminEveningRouteTemplateDto } from "../types";

type RoutePublishPanelProps = {
  template: AdminEveningRouteTemplateDto;
  onPublish: () => Promise<void>;
  onArchive: () => Promise<void>;
  isSaving?: boolean;
  error?: string | null;
};

export const RoutePublishPanel = ({
  template,
  onPublish,
  onArchive,
  isSaving,
  error,
}: RoutePublishPanelProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold">Публикация</p>
          <p className="text-[12px] text-muted-foreground">
            Save создает новую версию только для будущих встреч.
          </p>
        </div>
        <StatusBadge status={template.status} />
      </div>
      <div className="grid gap-2 text-[12px] text-muted-foreground">
        <p>Текущая версия: {template.currentRouteId ?? "нет"}</p>
        <p>Всего версий: {template.revisionCount}</p>
        <p>Опубликовано: {template.publishedAt ?? "нет"}</p>
      </div>
      {error && <p className="text-[12px] text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => void onPublish()} disabled={isSaving}>
          Опубликовать
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => void onArchive()} disabled={isSaving}>
          В архив
        </Button>
      </div>
    </div>
  );
};
