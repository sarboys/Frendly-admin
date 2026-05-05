import { Plus, Search, SlidersHorizontal, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type Props = {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFiltersClick?: () => void;
  onExportClick?: () => void;
  onAdd?: () => void;
  addLabel?: string;
};

export const DataToolbar = ({
  searchPlaceholder = "Поиск…",
  searchValue,
  onSearchChange,
  onFiltersClick,
  onExportClick,
  onAdd,
  addLabel = "Добавить",
}: Props) => {
  const [localSearch, setLocalSearch] = useState("");
  const value = searchValue ?? localSearch;

  const handleSearchChange = (nextValue: string) => {
    if (searchValue === undefined) {
      setLocalSearch(nextValue);
    }
    onSearchChange?.(nextValue);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-9 h-9 bg-card"
          value={value}
          onChange={(event) => handleSearchChange(event.target.value)}
        />
      </div>
      <Button variant="outline" size="sm" className="h-9 gap-2" onClick={onFiltersClick}>
        <SlidersHorizontal className="w-4 h-4" />
        Фильтры
      </Button>
      <Button variant="outline" size="sm" className="h-9 gap-2" onClick={onExportClick}>
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
};
