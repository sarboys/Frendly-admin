export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function valueOrDash(value: string | number | null | undefined) {
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

export function toCsv(rows: Array<Record<string, unknown>>) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) =>
    headers.map((header) => csvCell(row[header])).join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

function csvCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export const adminPageText = {
  loading: "Загрузка...",
  empty: "Ничего не найдено.",
  error: "Не удалось загрузить данные.",
  saving: "Сохранение...",
};

export function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
