import { useEffect, useMemo, useState } from "react";
import { AdminApiError } from "../api/client";
import { AdminTopbar } from "../components/Topbar";
import {
  approveRouteReviewDraft,
  convertRouteReviewDraft,
  createRouteReviewImportRun,
  listRouteReviewDrafts,
  listRouteReviewImportRuns,
  listRouteReviewSources,
  publishRouteReviewDraft,
  rejectRouteReviewDraft,
} from "../evening/routeReviewApi";
import { RouteReviewDraftCard } from "../evening/components/RouteReviewDraftCard";
import { RouteReviewFilters } from "../evening/components/RouteReviewFilters";
import type {
  RouteReviewDraftDto,
  RouteReviewImportRunDto,
  RouteReviewSourceDto,
} from "../evening/routeReviewTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DEFAULT_SOURCES = ["kudago", "overpass", "timepad"];

export const RouteReviewQueue = () => {
  const [drafts, setDrafts] = useState<RouteReviewDraftDto[]>([]);
  const [runs, setRuns] = useState<RouteReviewImportRunDto[]>([]);
  const [sources, setSources] = useState<RouteReviewSourceDto[]>([]);
  const [city, setCity] = useState("Москва");
  const [status, setStatus] = useState("needs_review");
  const [source, setSource] = useState("");
  const [importCity, setImportCity] = useState("Москва");
  const [from, setFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [selectedSources, setSelectedSources] = useState<string[]>(["kudago", "overpass"]);
  const [busyDraftId, setBusyDraftId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableSources = useMemo(() => {
    const fromApi = sources.map((item) => item.code);
    return fromApi.length > 0 ? fromApi : DEFAULT_SOURCES;
  }, [sources]);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [draftResponse, runResponse, sourceResponse] = await Promise.all([
        listRouteReviewDrafts({ city, status, source, limit: 50 }),
        listRouteReviewImportRuns({ city, limit: 20 }),
        listRouteReviewSources(),
      ]);
      setDrafts(draftResponse.items);
      setRuns(runResponse.items);
      setSources(sourceResponse.items);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const runDraftAction = async (
    draft: RouteReviewDraftDto,
    action: () => Promise<unknown>,
  ) => {
    setBusyDraftId(draft.id);
    setError(null);
    try {
      await action();
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusyDraftId(null);
    }
  };

  const submitImport = async () => {
    setIsImporting(true);
    setError(null);
    try {
      await createRouteReviewImportRun({
        city: importCity,
        sources: selectedSources,
        from,
        to,
      });
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <AdminTopbar
        title="Ревью маршрутов"
        subtitle="Generated drafts проходят ручной approve, reject, convert и publish"
      />
      <div className="space-y-5 p-5 lg:p-8">
        <RouteReviewFilters
          city={city}
          status={status}
          source={source}
          onCityChange={setCity}
          onStatusChange={setStatus}
          onSourceChange={setSource}
          onRefresh={() => void load()}
        />

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid gap-3 lg:grid-cols-[160px_160px_160px_minmax(0,1fr)_auto]">
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Город</span>
              <Input value={importCity} onChange={(event) => setImportCity(event.target.value)} />
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>С</span>
              <Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>До</span>
              <Input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
            </label>
            <div className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Источники</span>
              <div className="flex min-h-10 flex-wrap items-center gap-3">
                {availableSources.map((code) => (
                  <label key={code} className="flex items-center gap-2 text-[13px] text-foreground">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(code)}
                      onChange={(event) => {
                        setSelectedSources((current) =>
                          event.target.checked
                            ? Array.from(new Set([...current, code]))
                            : current.filter((item) => item !== code),
                        );
                      }}
                    />
                    {code}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                disabled={isImporting || selectedSources.length === 0}
                onClick={() => void submitImport()}
              >
                Import
              </Button>
            </div>
          </div>
          {error ? <p className="mt-3 text-[12px] text-destructive">{error}</p> : null}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="rounded-lg border border-border bg-card p-4 text-[13px] text-muted-foreground">
              Загрузка drafts...
            </div>
          ) : drafts.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-4 text-[13px] text-muted-foreground">
              Drafts не найдены.
            </div>
          ) : (
            drafts.map((draft) => (
              <RouteReviewDraftCard
                key={draft.id}
                draft={draft}
                isBusy={busyDraftId === draft.id}
                onApprove={(item, note) =>
                  void runDraftAction(item, () => approveRouteReviewDraft(item.id, { reviewNote: note }))
                }
                onReject={(item, note) =>
                  void runDraftAction(item, () => rejectRouteReviewDraft(item.id, { reviewNote: note }))
                }
                onConvert={(item) => void runDraftAction(item, () => convertRouteReviewDraft(item.id))}
                onPublish={(item) => void runDraftAction(item, () => publishRouteReviewDraft(item.id))}
              />
            ))
          )}
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <p className="text-[14px] font-semibold">Import runs</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Источник</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Fetched</TableHead>
                <TableHead>Normalized</TableHead>
                <TableHead>Skipped</TableHead>
                <TableHead>Started</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-[13px] text-muted-foreground">
                    Runs пока нет.
                  </TableCell>
                </TableRow>
              ) : (
                runs.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="text-[13px]">{run.sourceCode ?? run.sourceId}</TableCell>
                    <TableCell className="text-[13px]">{run.city}</TableCell>
                    <TableCell className="text-[13px]">{run.status}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{run.fetchedCount}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{run.normalizedCount}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{run.skippedCount}</TableCell>
                    <TableCell className="text-[13px]">{run.startedAt}</TableCell>
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
