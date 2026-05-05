import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  listAdminAfficheContentItems,
  listAdminPosters,
  moderateAdminAfficheContentItem,
  publishAdminPoster,
} from "../management/api";
import { AdminPosters } from "./Posters";

vi.mock("../management/api", () => ({
  archiveAdminPoster: vi.fn(),
  createAdminPoster: vi.fn(),
  featureAdminPoster: vi.fn(),
  hideAdminPoster: vi.fn(),
  listAdminAfficheContentItems: vi.fn(),
  listAdminPosters: vi.fn(),
  moderateAdminAfficheContentItem: vi.fn(),
  publishAdminPoster: vi.fn(),
  rejectAdminPoster: vi.fn(),
  unfeatureAdminPoster: vi.fn(),
  updateAdminAfficheContentItem: vi.fn(),
  updateAdminPoster: vi.fn(),
}));

const poster = {
  source: "native",
  id: "poster-1",
  city: "Москва",
  category: "concert",
  title: "Jazz Night",
  emoji: "🎷",
  startsAt: "2026-05-06T10:30:00.000Z",
  dateLabel: "06.05",
  timeLabel: "10:30",
  venue: "Club",
  address: "Street 1",
  priceFrom: 1000,
  ticketUrl: "https://tickets.example.com",
  provider: "admin",
  tags: ["jazz"],
  description: "Music",
  status: "draft",
  isFeatured: false,
  linkedEventsCount: 0,
  createdAt: "2026-05-05T10:00:00.000Z",
  updatedAt: "2026-05-05T10:00:00.000Z",
} as const;

const importedEvent = {
  source: "imported",
  id: "item-1",
  sourceId: "source-1",
  sourceCode: "timepad",
  sourceName: "Timepad",
  sourceItemId: "remote-1",
  contentKind: "event",
  city: "Москва",
  title: "Imported Jazz",
  shortSummary: "Imported summary",
  category: "concert",
  tags: ["music"],
  address: "Street 2",
  lat: 55.7,
  lng: 37.6,
  startsAt: "2026-05-07T10:30:00.000Z",
  endsAt: null,
  priceFrom: null,
  currency: null,
  venueName: "Hall",
  imageUrl: null,
  actionUrl: "https://example.com",
  actionKind: "ticket",
  priceMode: "unknown",
  publicStatus: "hidden",
  moderationStatus: "pending",
  hasCoords: true,
  importedAt: "2026-05-05T10:00:00.000Z",
  createdAt: "2026-05-05T10:00:00.000Z",
  updatedAt: "2026-05-05T10:00:00.000Z",
} as const;

const importedPlace = {
  ...importedEvent,
  id: "place-1",
  title: "Imported Place",
  contentKind: "place",
} as const;

describe("AdminPosters page", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("renders native posters", async () => {
    vi.mocked(listAdminPosters).mockResolvedValue({ items: [poster], nextCursor: null });

    renderWithProviders(<AdminPosters />);

    expect(await screen.findByText("Jazz Night")).toBeInTheDocument();
    expect(screen.getByText("Club")).toBeInTheDocument();
  });

  it("renders imported events only", async () => {
    vi.mocked(listAdminPosters).mockResolvedValue({ items: [], nextCursor: null });
    vi.mocked(listAdminAfficheContentItems).mockResolvedValue({ items: [importedEvent, importedPlace], nextCursor: null });

    renderWithProviders(<AdminPosters />);

    fireEvent.click(screen.getByRole("tab", { name: "Imported events" }));

    expect(await screen.findByText("Imported Jazz")).toBeInTheDocument();
    expect(screen.queryByText("Imported Place")).not.toBeInTheDocument();
  });

  it("publishes native poster", async () => {
    vi.mocked(listAdminPosters).mockResolvedValue({ items: [poster], nextCursor: null });
    vi.mocked(publishAdminPoster).mockResolvedValue({ ...poster, status: "published" });

    renderWithProviders(<AdminPosters />);

    fireEvent.click(await screen.findByRole("button", { name: /Опубликовать Jazz Night/i }));

    await waitFor(() => {
      expect(publishAdminPoster).toHaveBeenCalledWith("poster-1");
    });
  });

  it("forces imported event free", async () => {
    vi.mocked(listAdminPosters).mockResolvedValue({ items: [], nextCursor: null });
    vi.mocked(listAdminAfficheContentItems).mockResolvedValue({ items: [importedEvent], nextCursor: null });
    vi.mocked(moderateAdminAfficheContentItem).mockResolvedValue({
      ...importedEvent,
      priceMode: "free",
      priceFrom: 0,
      publicStatus: "published",
    });

    renderWithProviders(<AdminPosters />);

    fireEvent.click(screen.getByRole("tab", { name: "Imported events" }));
    fireEvent.click(await screen.findByRole("button", { name: /Force free Imported Jazz/i }));

    await waitFor(() => {
      expect(moderateAdminAfficheContentItem).toHaveBeenCalledWith("item-1", "force-free");
    });
  });

  it("shows unknown price label", async () => {
    vi.mocked(listAdminPosters).mockResolvedValue({ items: [], nextCursor: null });
    vi.mocked(listAdminAfficheContentItems).mockResolvedValue({ items: [importedEvent], nextCursor: null });

    renderWithProviders(<AdminPosters />);

    fireEvent.click(screen.getByRole("tab", { name: "Imported events" }));

    expect(await screen.findByText("Цена неизвестна")).toBeInTheDocument();
  });
});

function renderWithProviders(element: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{element}</MemoryRouter>
    </QueryClientProvider>,
  );
}
