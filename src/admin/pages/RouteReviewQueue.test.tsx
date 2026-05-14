import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RouteReviewQueue } from "./RouteReviewQueue";
import {
  approveRouteReviewDraft,
  convertRouteReviewDraft,
  createRouteReviewImportRun,
  createRouteReviewGenerationRun,
  listRouteReviewSources,
  publishRouteReviewDraft,
  rejectRouteReviewDraft,
} from "../evening/routeReviewApi";

vi.mock("../evening/routeReviewApi", () => ({
  listRouteReviewDrafts: vi.fn().mockResolvedValue({
    items: [
      {
        id: "draft-1",
        batchId: "batch-1",
        status: "needs_review",
        title: "Тихий центр",
        description: "Кофе и галерея.",
        city: "Москва",
        timezone: "Europe/Moscow",
        area: "центр",
        vibe: "спокойно",
        budget: "low",
        durationLabel: "2 часа",
        totalPriceFrom: 300,
        goal: "social",
        mood: "calm",
        format: null,
        recommendedFor: "друзья",
        badgeLabel: null,
        score: 80,
        validationStatus: "valid",
        validationIssues: [],
        reviewedByAdminId: null,
        reviewedAt: null,
        reviewNote: null,
        createdTemplateId: null,
        publishedAt: null,
        rejectedAt: null,
        archivedAt: null,
        createdAt: "2026-05-04T10:00:00.000Z",
        updatedAt: "2026-05-04T10:00:00.000Z",
        steps: [
          {
            id: "step-1",
            sortOrder: 1,
            externalContentItemId: "item-1",
            timeLabel: "19:00",
            endTimeLabel: null,
            kind: "cafe",
            title: "Кофе",
            venue: "Кофейня",
            address: "Тверская, 1",
            emoji: "☕",
            distanceLabel: "10 минут",
            walkMin: 10,
            description: "Начало.",
            vibeTag: null,
            ticketPrice: null,
            lat: 55.75,
            lng: 37.61,
            sourceUrl: "https://example.com",
            sourceName: "KudaGo",
            sourceTitle: "Кофейня",
          },
        ],
      },
    ],
    nextCursor: null,
  }),
  listRouteReviewImportRuns: vi.fn().mockResolvedValue({ items: [] }),
  listRouteReviewContentItems: vi.fn().mockResolvedValue({
    items: [
      {
        id: "item-1",
        sourceId: "source-1",
        sourceCode: "timepad",
        sourceName: "Timepad",
        sourceItemId: "event-1",
        sourceUrl: "https://example.com/event",
        contentKind: "event",
        city: "Москва",
        timezone: "Europe/Moscow",
        area: null,
        title: "Экскурсия по Москве",
        shortSummary: null,
        category: "culture",
        tags: [],
        address: "Никольская, 12",
        lat: 55.75,
        lng: 37.61,
        startsAt: "2026-05-05T16:00:00.000Z",
        endsAt: null,
        priceFrom: 0,
        currency: "RUB",
        venueName: "Площадка",
        imageUrl: null,
        actionUrl: "https://example.com/event",
        actionKind: "details",
        priceMode: "free",
        isAffiliate: false,
        sourceProvider: "Timepad",
        placeKind: null,
        publicStatus: "published",
        hasCoords: true,
        moderationStatus: "pending",
        importedAt: "2026-05-04T10:00:00.000Z",
        expiresAt: null,
        routePlannerBlockedReason: null,
        rawSummary: "{\"source\":\"timepad\"}",
      },
    ],
    nextCursor: null,
  }),
  listRouteReviewGenerationRuns: vi.fn().mockResolvedValue({ items: [] }),
  listRouteReviewSources: vi.fn().mockResolvedValue({ items: [] }),
  approveRouteReviewDraft: vi.fn(),
  rejectRouteReviewDraft: vi.fn(),
  convertRouteReviewDraft: vi.fn(),
  publishRouteReviewDraft: vi.fn(),
  createRouteReviewImportRun: vi.fn(),
  createRouteReviewGenerationRun: vi.fn(),
  moderateRouteReviewContentItem: vi.fn().mockResolvedValue({
    id: "item-1",
    sourceId: "source-1",
    sourceCode: "timepad",
    sourceName: "Timepad",
    sourceItemId: "event-1",
    sourceUrl: "https://example.com/event",
    contentKind: "event",
    city: "Москва",
    timezone: "Europe/Moscow",
    area: null,
    title: "Экскурсия по Москве",
    shortSummary: null,
    category: "culture",
    tags: [],
    address: "Никольская, 12",
    lat: 55.75,
    lng: 37.61,
    startsAt: "2026-05-05T16:00:00.000Z",
    endsAt: null,
    priceFrom: 0,
    currency: "RUB",
    venueName: "Площадка",
    imageUrl: null,
    actionUrl: "https://example.com/event",
    actionKind: "details",
    priceMode: "free",
    isAffiliate: false,
    sourceProvider: "Timepad",
    placeKind: null,
    publicStatus: "hidden",
    hasCoords: true,
    routePlannerBlockedReason: null,
    rawSummary: "{\"source\":\"timepad\"}",
    moderationStatus: "pending",
    importedAt: "2026-05-04T10:00:00.000Z",
    expiresAt: null,
  }),
}));

describe("RouteReviewQueue", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the route draft workflow without route filters", async () => {
    render(
      <MemoryRouter>
        <RouteReviewQueue />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Тихий центр")).toBeInTheDocument();
    expect(screen.getByText(/Кофейня/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Статус")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Источник")).not.toBeInTheDocument();

    const citySelect = screen.getByLabelText("Город генерации");
    expect(within(citySelect).getByRole("option", { name: "Воронеж" })).toBeInTheDocument();
    expect(within(citySelect).getByRole("option", { name: "Пермь" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate drafts" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Принять" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Отклонить" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Перегенерировать" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Контент" }));
    expect(screen.getByText("Экскурсия по Москве")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Экскурсия по Москве"));
    expect(screen.getByText("Route planner")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hide" })).toBeEnabled();
  });

  it("shows tomesto in fallback import sources and sends it to manual import", async () => {
    render(
      <MemoryRouter>
        <RouteReviewQueue />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Импорты" }));
    expect(screen.getByLabelText("tomesto")).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Import" }));

    await waitFor(() => {
      expect(createRouteReviewImportRun).toHaveBeenCalledWith(
        expect.objectContaining({
          city: "Москва",
          sources: ["kudago", "timepad", "advcake_ticketland", "tomesto"],
        }),
      );
    });
  });

  it("starts Tomesto catalog import separately", async () => {
    render(
      <MemoryRouter>
        <RouteReviewQueue />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Импорты" }));
    fireEvent.click(screen.getByRole("button", { name: "Импорт каталога ТоМесто" }));

    await waitFor(() => {
      expect(createRouteReviewImportRun).toHaveBeenCalledWith(
        expect.objectContaining({
          city: "Москва",
          sources: ["tomesto"],
          importMode: "tomesto_places_catalog",
        }),
      );
    });
  });

  it("keeps tomesto in import sources when the API source list is missing it", async () => {
    vi.mocked(listRouteReviewSources).mockResolvedValueOnce({
      items: [
        {
          id: "source-advcake",
          code: "advcake_ticketland",
          name: "AdvCake Ticketland",
          kind: "tickets",
          status: "active",
          lastImportedAt: null,
          baseUrl: null,
          lastError: null,
          lastFetchedCount: 0,
          lastPublishedCount: 0,
        },
        {
          id: "source-kudago",
          code: "kudago",
          name: "KudaGo",
          kind: "events",
          status: "active",
          lastImportedAt: null,
          baseUrl: null,
          lastError: null,
          lastFetchedCount: 0,
          lastPublishedCount: 0,
        },
      ],
    });

    render(
      <MemoryRouter>
        <RouteReviewQueue />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Импорты" }));

    expect(screen.getByLabelText("advcake_ticketland")).toBeChecked();
    expect(screen.getByLabelText("kudago")).toBeChecked();
    expect(screen.getByLabelText("tomesto")).toBeChecked();
  });

  it("accepts a generated draft by approving, converting and publishing it in one click", async () => {
    render(
      <MemoryRouter>
        <RouteReviewQueue />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Принять" }));

    await waitFor(() => {
      expect(approveRouteReviewDraft).toHaveBeenCalledWith("draft-1", { reviewNote: "" });
      expect(convertRouteReviewDraft).toHaveBeenCalledWith("draft-1");
      expect(publishRouteReviewDraft).toHaveBeenCalledWith("draft-1");
    });
  });

  it("rejects and regenerates drafts from the same route card", async () => {
    render(
      <MemoryRouter>
        <RouteReviewQueue />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Отклонить" }));
    await waitFor(() => {
      expect(rejectRouteReviewDraft).toHaveBeenCalledWith("draft-1", { reviewNote: "" });
    });

    fireEvent.click(screen.getByRole("button", { name: "Перегенерировать" }));
    await waitFor(() => {
      expect(createRouteReviewGenerationRun).toHaveBeenCalledWith({
        city: "Москва",
        mood: "calm",
        budget: "low",
        maxDrafts: 1,
      });
    });
  });
});
