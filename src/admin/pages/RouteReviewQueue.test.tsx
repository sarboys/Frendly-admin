import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RouteReviewQueue } from "./RouteReviewQueue";

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
  listRouteReviewSources: vi.fn().mockResolvedValue({ items: [] }),
  approveRouteReviewDraft: vi.fn(),
  rejectRouteReviewDraft: vi.fn(),
  convertRouteReviewDraft: vi.fn(),
  publishRouteReviewDraft: vi.fn(),
  createRouteReviewImportRun: vi.fn(),
}));

describe("RouteReviewQueue", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders a draft with review actions", async () => {
    render(
      <MemoryRouter>
        <RouteReviewQueue />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Тихий центр")).toBeInTheDocument();
    expect(screen.getByText(/Кофейня/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Reject" })).toBeEnabled();
  });
});
