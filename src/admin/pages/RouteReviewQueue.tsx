import { useEffect, useMemo, useState } from "react";
import { AdminApiError } from "../api/client";
import { AdminTopbar } from "../components/Topbar";
import {
  approveRouteReviewDraft,
  convertRouteReviewDraft,
  createRouteReviewGenerationRun,
  createRouteReviewImportRun,
  listRouteReviewContentItems,
  listRouteReviewDrafts,
  listRouteReviewGenerationRuns,
  listRouteReviewImportRuns,
  listRouteReviewSources,
  moderateRouteReviewContentItem,
  publishRouteReviewDraft,
  rejectRouteReviewDraft,
} from "../evening/routeReviewApi";
import { RouteReviewDraftCard } from "../evening/components/RouteReviewDraftCard";
import { RouteReviewFilters } from "../evening/components/RouteReviewFilters";
import type {
  RouteReviewContentItemDto,
  RouteReviewDraftDto,
  RouteReviewGenerationRunDto,
  RouteReviewImportRunDto,
  RouteReviewSourceDto,
} from "../evening/routeReviewTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DEFAULT_SOURCES = ["kudago", "timepad", "advcake_ticketland"];
const TABS = ["Источники", "Импорты", "Контент", "Маршруты"] as const;
type RouteReviewTab = (typeof TABS)[number];

export const RouteReviewQueue = () => {
  const [drafts, setDrafts] = useState<RouteReviewDraftDto[]>([]);
  const [runs, setRuns] = useState<RouteReviewImportRunDto[]>([]);
  const [contentItems, setContentItems] = useState<RouteReviewContentItemDto[]>([]);
  const [generationRuns, setGenerationRuns] = useState<RouteReviewGenerationRunDto[]>([]);
  const [sources, setSources] = useState<RouteReviewSourceDto[]>([]);
  const [selectedContentItem, setSelectedContentItem] = useState<RouteReviewContentItemDto | null>(null);
  const [city, setCity] = useState("Москва");
  const [status, setStatus] = useState("needs_review");
  const [source, setSource] = useState("");
  const [tab, setTab] = useState<RouteReviewTab>("Маршруты");
  const [contentKind, setContentKind] = useState("");
  const [priceMode, setPriceMode] = useState("");
  const [publicStatus, setPublicStatus] = useState("");
  const [contentCategory, setContentCategory] = useState("");
  const [hasCoords, setHasCoords] = useState("");
  const [contentDateFrom, setContentDateFrom] = useState("");
  const [contentDateTo, setContentDateTo] = useState("");
  const [importCity, setImportCity] = useState("Москва");
  const [from, setFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [selectedSources, setSelectedSources] = useState<string[]>(DEFAULT_SOURCES);
  const [generationCity, setGenerationCity] = useState("Москва");
  const [generationMood, setGenerationMood] = useState("calm");
  const [generationBudget, setGenerationBudget] = useState("low");
  const [generationMaxDrafts, setGenerationMaxDrafts] = useState(2);
  const [busyDraftId, setBusyDraftId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [busyItemAction, setBusyItemAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableSources = useMemo(() => {
    const fromApi = sources.map((item) => item.code);
    return fromApi.length > 0 ? fromApi : DEFAULT_SOURCES;
  }, [sources]);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [draftResponse, runResponse, itemResponse, generationResponse, sourceResponse] = await Promise.all([
        listRouteReviewDrafts({ city, status, source, limit: 50 }),
        listRouteReviewImportRuns({ city, limit: 20 }),
        listRouteReviewContentItems({
          city,
          source,
          contentKind,
          priceMode,
          publicStatus,
          category: contentCategory,
          hasCoords,
          dateFrom: contentDateFrom,
          dateTo: contentDateTo,
          limit: 50,
        }),
        listRouteReviewGenerationRuns({ city, limit: 20 }),
        listRouteReviewSources(),
      ]);
      setDrafts(draftResponse.items);
      setRuns(runResponse.items);
      setContentItems(itemResponse.items);
      setSelectedContentItem((current) =>
        current == null
          ? null
          : itemResponse.items.find((item) => item.id === current.id) ?? current,
      );
      setGenerationRuns(generationResponse.items);
      setSources(sourceResponse.items);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsLoading(false);
    }
  };

  const runContentItemAction = async (item: RouteReviewContentItemDto, action: string) => {
    setBusyItemAction(action);
    setError(null);
    try {
      const updated = await moderateRouteReviewContentItem(item.id, action);
      setSelectedContentItem(updated);
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusyItemAction(null);
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

  const submitGeneration = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      await createRouteReviewGenerationRun({
        city: generationCity,
        mood: generationMood,
        budget: generationBudget,
        maxDrafts: generationMaxDrafts,
      });
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsGenerating(false);
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
        <div className="flex flex-wrap gap-2">
          {TABS.map((item) => (
            <Button
              key={item}
              type="button"
              variant={tab === item ? "default" : "outline"}
              onClick={() => setTab(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className={`${tab === "Источники" ? "" : "hidden "}grid gap-3 md:grid-cols-3`}>
          {sources.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-4 text-[13px] text-muted-foreground">
              Источники пока не найдены.
            </div>
          ) : (
            sources.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold">{item.name}</p>
                    <p className="text-[12px] text-muted-foreground">{item.code}</p>
                  </div>
                  <span className="rounded-md bg-muted px-2 py-1 text-[12px]">{item.status}</span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <dt className="text-muted-foreground">kind</dt>
                    <dd>{item.kind}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">last import</dt>
                    <dd>{item.lastImportedAt ?? ""}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">fetched</dt>
                    <dd className="tabular-nums">{item.lastFetchedCount}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">public</dt>
                    <dd className="tabular-nums">{item.lastPublishedCount}</dd>
                  </div>
                </dl>
                {item.lastError ? <p className="mt-3 text-[12px] text-destructive">{item.lastError}</p> : null}
              </div>
            ))
          )}
        </div>

        <div className={`${tab === "Импорты" ? "" : "hidden "}rounded-lg border border-border bg-card p-4`}>
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

        <div className={`${tab === "Маршруты" ? "" : "hidden "}rounded-lg border border-border bg-card p-4`}>
          <div className="grid gap-3 lg:grid-cols-[160px_140px_140px_120px_auto]">
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Город</span>
              <Input value={generationCity} onChange={(event) => setGenerationCity(event.target.value)} />
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Mood</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
                value={generationMood}
                onChange={(event) => setGenerationMood(event.target.value)}
              >
                <option value="calm">calm</option>
                <option value="social">social</option>
                <option value="date">date</option>
                <option value="culture">culture</option>
                <option value="active">active</option>
                <option value="outdoor">outdoor</option>
              </select>
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Budget</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
                value={generationBudget}
                onChange={(event) => setGenerationBudget(event.target.value)}
              >
                <option value="free">free</option>
                <option value="low">low</option>
                <option value="mid">mid</option>
              </select>
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Drafts</span>
              <Input
                type="number"
                min={1}
                max={12}
                value={generationMaxDrafts}
                onChange={(event) => setGenerationMaxDrafts(Number(event.target.value) || 1)}
              />
            </label>
            <div className="flex items-end">
              <Button
                type="button"
                disabled={isGenerating}
                onClick={() => void submitGeneration()}
              >
                Generate drafts
              </Button>
            </div>
          </div>
        </div>

        <div className={`${tab === "Маршруты" ? "" : "hidden "}space-y-3`}>
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

        <div className={`${tab === "Импорты" ? "" : "hidden "}rounded-lg border border-border bg-card`}>
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
                <TableHead>Published</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Free</TableHead>
                <TableHead>Unknown</TableHead>
                <TableHead>No coords</TableHead>
                <TableHead>Skipped</TableHead>
                <TableHead>Ошибка</TableHead>
                <TableHead>Started</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-[13px] text-muted-foreground">
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
                    <TableCell className="text-[13px] tabular-nums">{run.publishedCount}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{run.paidCount}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{run.freeCount}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{run.unknownPriceCount}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{run.missingCoordsCount}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{run.skippedCount}</TableCell>
                    <TableCell className="text-[12px] text-destructive">{run.errorCode ?? ""}</TableCell>
                    <TableCell className="text-[13px]">{run.startedAt}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className={`${tab === "Маршруты" ? "" : "hidden "}rounded-lg border border-border bg-card`}>
          <div className="border-b border-border px-4 py-3">
            <p className="text-[14px] font-semibold">Generation runs</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Город</TableHead>
                <TableHead>Mood</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Drafts</TableHead>
                <TableHead>Ошибка</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generationRuns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-[13px] text-muted-foreground">
                    Generation runs пока нет.
                  </TableCell>
                </TableRow>
              ) : (
                generationRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="text-[13px]">{run.city}</TableCell>
                    <TableCell className="text-[13px]">{run.mood}</TableCell>
                    <TableCell className="text-[13px]">{run.budget}</TableCell>
                    <TableCell className="text-[13px]">{run.status}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">{run.draftCount}</TableCell>
                    <TableCell className="text-[12px] text-destructive">{run.errorCode ?? ""}</TableCell>
                    <TableCell className="text-[13px]">{run.createdAt}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className={`${tab === "Контент" ? "" : "hidden "}rounded-lg border border-border bg-card`}>
          <div className="border-b border-border px-4 py-3">
            <p className="text-[14px] font-semibold">Imported items</p>
          </div>
          <div className="grid gap-3 border-b border-border p-4 md:grid-cols-4 xl:grid-cols-8">
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Тип</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
                value={contentKind}
                onChange={(event) => setContentKind(event.target.value)}
              >
                <option value="">any</option>
                <option value="event">event</option>
                <option value="place">place</option>
              </select>
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Цена</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
                value={priceMode}
                onChange={(event) => setPriceMode(event.target.value)}
              >
                <option value="">any</option>
                <option value="free">free</option>
                <option value="paid">paid</option>
                <option value="unknown">unknown</option>
              </select>
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Public</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
                value={publicStatus}
                onChange={(event) => setPublicStatus(event.target.value)}
              >
                <option value="">any</option>
                <option value="published">published</option>
                <option value="hidden">hidden</option>
                <option value="stale">stale</option>
                <option value="duplicate">duplicate</option>
              </select>
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Coords</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-[13px]"
                value={hasCoords}
                onChange={(event) => setHasCoords(event.target.value)}
              >
                <option value="">any</option>
                <option value="true">yes</option>
                <option value="false">no</option>
              </select>
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>Категория</span>
              <Input value={contentCategory} onChange={(event) => setContentCategory(event.target.value)} />
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>С</span>
              <Input type="date" value={contentDateFrom} onChange={(event) => setContentDateFrom(event.target.value)} />
            </label>
            <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
              <span>До</span>
              <Input type="date" value={contentDateTo} onChange={(event) => setContentDateTo(event.target.value)} />
            </label>
            <div className="flex items-end">
              <Button type="button" onClick={() => void load()}>
                Apply
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Источник</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Площадка</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Coords</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Public</TableHead>
                <TableHead>Imported</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-[13px] text-muted-foreground">
                    Imported items пока нет.
                  </TableCell>
                </TableRow>
              ) : (
                contentItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedContentItem(item)}
                  >
                    <TableCell className="text-[13px]">{item.sourceCode ?? item.sourceId}</TableCell>
                    <TableCell className="text-[13px]">{item.contentKind}</TableCell>
                    <TableCell className="max-w-[420px] text-[13px]">
                      {item.sourceUrl ? (
                        <a className="text-primary underline-offset-2 hover:underline" href={item.sourceUrl} target="_blank" rel="noreferrer">
                          {item.title}
                        </a>
                      ) : item.title}
                    </TableCell>
                    <TableCell className="text-[13px]">{item.category}</TableCell>
                    <TableCell className="text-[13px]">{item.city}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-[13px]">{item.venueName ?? item.address ?? ""}</TableCell>
                    <TableCell className="text-[13px] tabular-nums">
                      {item.priceMode}
                      {item.priceFrom == null ? "" : ` · ${item.priceFrom}`}
                    </TableCell>
                    <TableCell className="text-[13px]">
                      {item.hasCoords ? "yes" : item.routePlannerBlockedReason ?? "no"}
                    </TableCell>
                    <TableCell className="text-[13px]">
                      {item.actionUrl ? (
                        <a className="text-primary underline-offset-2 hover:underline" href={item.actionUrl} target="_blank" rel="noreferrer">
                          {item.actionKind ?? "url"}
                        </a>
                      ) : item.actionKind ?? ""}
                    </TableCell>
                    <TableCell className="text-[13px]">{item.publicStatus}</TableCell>
                    <TableCell className="text-[13px]">{item.importedAt}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {selectedContentItem ? (
            <div className="border-t border-border p-4">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="space-y-3">
                  <div>
                    <p className="text-[12px] text-muted-foreground">
                      {selectedContentItem.sourceCode} · {selectedContentItem.contentKind} · {selectedContentItem.publicStatus}
                    </p>
                    <h3 className="text-[18px] font-semibold">{selectedContentItem.title}</h3>
                  </div>
                  <dl className="grid gap-2 text-[13px] md:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Описание</dt>
                      <dd>{selectedContentItem.shortSummary ?? ""}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Площадка</dt>
                      <dd>{selectedContentItem.venueName ?? ""}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Адрес</dt>
                      <dd>{selectedContentItem.address ?? ""}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Координаты</dt>
                      <dd>
                        {selectedContentItem.hasCoords
                          ? `${selectedContentItem.lat}, ${selectedContentItem.lng}`
                          : "нет"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Route planner</dt>
                      <dd>{selectedContentItem.routePlannerBlockedReason ?? "можно использовать"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Action URL</dt>
                      <dd className="break-all">
                        {selectedContentItem.actionUrl ? (
                          <a className="text-primary hover:underline" href={selectedContentItem.actionUrl} target="_blank" rel="noreferrer">
                            {selectedContentItem.actionUrl}
                          </a>
                        ) : ""}
                      </dd>
                    </div>
                  </dl>
                  {selectedContentItem.imageUrl ? (
                    <img
                      src={selectedContentItem.imageUrl}
                      alt=""
                      className="h-36 w-64 rounded-md object-cover"
                    />
                  ) : null}
                  {selectedContentItem.rawSummary ? (
                    <pre className="max-h-52 overflow-auto rounded-md bg-muted p-3 text-[11px]">
                      {selectedContentItem.rawSummary}
                    </pre>
                  ) : null}
                </div>
                <div className="space-y-2">
                  {[
                    ["publish", "Publish"],
                    ["hide", "Hide"],
                    ["reject", "Reject"],
                    ["stale", "Mark stale"],
                    ["force-free", "Force free"],
                    ["force-paid", "Force paid"],
                  ].map(([action, label]) => (
                    <Button
                      key={action}
                      type="button"
                      variant={action === "reject" ? "destructive" : "outline"}
                      className="w-full justify-start"
                      disabled={busyItemAction != null}
                      onClick={() => void runContentItemAction(selectedContentItem, action)}
                    >
                      {busyItemAction === action ? "..." : label}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedContentItem(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
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
