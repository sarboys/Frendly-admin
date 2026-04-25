import { Plus, Search, SlidersHorizontal, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  searchPlaceholder?: string;
  onAdd?: () => void;
  addLabel?: string;
};

export const DataToolbar = ({ searchPlaceholder = "Поиск…", onAdd, addLabel = "Добавить" }: Props) => (
  <div className="flex flex-wrap items-center gap-2 mb-4">
    <div className="relative flex-1 min-w-[200px] max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input placeholder={searchPlaceholder} className="pl-9 h-9 bg-card" />
    </div>
    <Button variant="outline" size="sm" className="h-9 gap-2">
      <SlidersHorizontal className="w-4 h-4" />
      Фильтры
    </Button>
    <Button variant="outline" size="sm" className="h-9 gap-2">
      <Download className="w-4 h-4" />
      Экспорт
    </Button>
    <div className="flex-1" />
    {onAdd && (
      <Button size="sm" className="h-9 gap-2" onClick={onAdd}>
        <Plus className="w-4 h-4" />
        {addLabel}
      </Button>
    )}
  </div>
);
