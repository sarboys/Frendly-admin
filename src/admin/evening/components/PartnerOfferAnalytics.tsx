import { FormEvent, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminApiError } from "../../api/client";
import { getPartnerOfferAnalytics } from "../api";
import type { PartnerOfferAnalyticsDto } from "../types";

export const PartnerOfferAnalytics = () => {
  const defaultRange = createDefaultRange();
  const [from, setFrom] = useState(defaultRange.from);
  const [to, setTo] = useState(defaultRange.to);
  const [data, setData] = useState<PartnerOfferAnalyticsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (nextFrom = from, nextTo = to) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPartnerOfferAnalytics({
        from: nextFrom,
        to: nextTo,
      });
      setData(response);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load(defaultRange.from, defaultRange.to);
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void load();
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-display text-[16px] font-semibold">Партнерские офферы</p>
          <p className="text-[12px] text-muted-foreground">
            Активации QR без имен, телефонов и профилей пользователей.
          </p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
            <span>С</span>
            <Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </label>
          <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
            <span>По</span>
            <Input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </label>
          <Button type="submit" disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Обновить
          </Button>
        </form>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-[13px] text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Активации" value={data?.activations ?? 0} loading={isLoading} />
        <Metric label="Уникальные клиенты" value={data?.uniqueUsers ?? 0} loading={isLoading} />
        <Metric label="Партнеры в топе" value={data?.topPartners.length ?? 0} loading={isLoading} />
        <Metric label="Маршруты в топе" value={data?.topRoutes.length ?? 0} loading={isLoading} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AnalyticsTable
          title="Топ партнеров"
          emptyText="Активаций за период нет."
          rows={data?.topPartners ?? []}
          isLoading={isLoading}
          name={(row) => row.partnerName}
          caption={(row) => row.city ?? row.partnerId}
        />
        <AnalyticsTable
          title="Топ маршрутов"
          emptyText="Маршрутов с активациями пока нет."
          rows={data?.topRoutes ?? []}
          isLoading={isLoading}
          name={(row) => row.routeTitle}
          caption={(row) => row.city ?? row.routeTemplateId}
        />
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <p className="text-[14px] font-semibold">По дням</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Дата</TableHead>
              <TableHead className="text-right">Активации</TableHead>
              <TableHead className="text-right">Уникальные клиенты</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-[13px] text-muted-foreground">
                  Загрузка аналитики...
                </TableCell>
              </TableRow>
            ) : data?.daily.length ? (
              data.daily.map((day) => (
                <TableRow key={day.date}>
                  <TableCell className="text-[13px]">{day.date}</TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">
                    {formatNumber(day.activations)}
                  </TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">
                    {formatNumber(day.uniqueUsers)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-[13px] text-muted-foreground">
                  Данных за период нет.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

function Metric({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-[28px] font-semibold leading-none">
        {loading ? "..." : formatNumber(value)}
      </p>
    </div>
  );
}

function AnalyticsTable<T extends { activations: number; uniqueUsers: number }>({
  title,
  emptyText,
  rows,
  isLoading,
  name,
  caption,
}: {
  title: string;
  emptyText: string;
  rows: T[];
  isLoading: boolean;
  name: (row: T) => string;
  caption: (row: T) => string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <p className="text-[14px] font-semibold">{title}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Название</TableHead>
            <TableHead className="text-right">Активации</TableHead>
            <TableHead className="text-right">Клиенты</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-[13px] text-muted-foreground">
                Загрузка...
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-[13px] text-muted-foreground">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={caption(row)}>
                <TableCell>
                  <p className="text-[13.5px] font-semibold">{name(row)}</p>
                  <p className="text-[11.5px] text-muted-foreground">{caption(row)}</p>
                </TableCell>
                <TableCell className="text-right text-[13px] tabular-nums">
                  {formatNumber(row.activations)}
                </TableCell>
                <TableCell className="text-right text-[13px] tabular-nums">
                  {formatNumber(row.uniqueUsers)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function createDefaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);
  return {
    from: toDateInputValue(from),
    to: toDateInputValue(to),
  };
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatNumber(value: number) {
  return value.toLocaleString("ru");
}

function errorMessage(caught: unknown) {
  if (caught instanceof AdminApiError) {
    return `${caught.code}: ${caught.message}`;
  }
  if (caught instanceof Error) {
    return caught.message;
  }
  return "Не удалось загрузить аналитику офферов";
}
