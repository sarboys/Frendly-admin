import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  city: string;
  status: string;
  source: string;
  onCityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onRefresh: () => void;
};

export const RouteReviewFilters = ({
  city,
  status,
  source,
  onCityChange,
  onStatusChange,
  onSourceChange,
  onRefresh,
}: Props) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
      <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
        <span>Город</span>
        <Input value={city} onChange={(event) => onCityChange(event.target.value)} />
      </label>
      <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
        <span>Статус</span>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="needs_review">needs_review</option>
          <option value="approved">approved</option>
          <option value="converted">converted</option>
          <option value="published">published</option>
          <option value="rejected">rejected</option>
          <option value="">all</option>
        </select>
      </label>
      <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
        <span>Источник</span>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
          value={source}
          onChange={(event) => onSourceChange(event.target.value)}
        >
          <option value="">all</option>
          <option value="kudago">kudago</option>
          <option value="timepad">timepad</option>
          <option value="overpass">overpass</option>
        </select>
      </label>
      <div className="flex items-end">
        <Button type="button" variant="outline" onClick={onRefresh}>
          Обновить
        </Button>
      </div>
    </div>
  </div>
);
