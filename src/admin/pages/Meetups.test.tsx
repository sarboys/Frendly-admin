import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  approveAdminMeetupJoinRequest,
  cancelAdminMeetup,
  createAdminMeetup,
  getAdminMeetup,
  listAdminMeetupJoinRequests,
  listAdminMeetupParticipants,
  listAdminMeetups,
  removeAdminMeetupParticipant,
} from "../management/api";
import { AdminMeetupDetail } from "./MeetupDetail";
import { AdminMeetups } from "./Meetups";

vi.mock("../management/api", () => ({
  approveAdminMeetupJoinRequest: vi.fn(),
  cancelAdminMeetup: vi.fn(),
  createAdminMeetup: vi.fn(),
  getAdminMeetup: vi.fn(),
  listAdminMeetupJoinRequests: vi.fn(),
  listAdminMeetupParticipants: vi.fn(),
  listAdminMeetups: vi.fn(),
  rejectAdminMeetupJoinRequest: vi.fn(),
  removeAdminMeetupParticipant: vi.fn(),
  restoreAdminMeetup: vi.fn(),
  updateAdminMeetup: vi.fn(),
}));

const meetupListItem = {
  id: "meetup-1",
  title: "Гаражный ужин",
  emoji: "🍝",
  city: "Москва",
  place: "Гараж",
  startsAt: "2026-05-06T10:30:00.000Z",
  hostId: "user-1",
  hostName: "Анна",
  partnerId: null,
  partnerName: null,
  joinMode: "open",
  priceMode: "free",
  participantsCount: 4,
  joinRequestsCount: 1,
  capacity: 12,
  status: "upcoming",
} as const;

const meetupDetail = {
  ...meetupListItem,
  durationMinutes: 120,
  latitude: 55.75,
  longitude: 37.61,
  vibe: "Ужин",
  description: "Едим пасту",
  accessMode: "public",
  visibilityMode: "public",
  chatId: "chat-1",
  canceledAt: null,
  cancelReason: null,
  sourcePoster: null,
  sourceExternalContentItem: null,
  createdAt: "2026-05-05T10:00:00.000Z",
  updatedAt: "2026-05-05T10:00:00.000Z",
};

describe("AdminMeetups pages", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("renders API list data", async () => {
    vi.mocked(listAdminMeetups).mockResolvedValue({ items: [meetupListItem], nextCursor: null });

    renderWithProviders(<AdminMeetups />);

    expect(await screen.findByText("Гаражный ужин")).toBeInTheDocument();
    expect(screen.getByText("Анна")).toBeInTheDocument();
  });

  it("posts create form payload", async () => {
    vi.mocked(listAdminMeetups).mockResolvedValue({ items: [], nextCursor: null });
    vi.mocked(createAdminMeetup).mockResolvedValue(meetupDetail);

    renderWithProviders(<AdminMeetups />);

    fireEvent.click(screen.getByRole("button", { name: /Создать встречу/i }));
    fireEvent.change(screen.getByLabelText("Host ID"), { target: { value: "user-1" } });
    fireEvent.change(screen.getByLabelText("Название"), { target: { value: "Гаражный ужин" } });
    fireEvent.change(screen.getByLabelText("Emoji"), { target: { value: "🍝" } });
    fireEvent.change(screen.getByLabelText("Дата и время"), { target: { value: "2026-05-06T10:30" } });
    fireEvent.change(screen.getByLabelText("Место"), { target: { value: "Гараж" } });
    fireEvent.change(screen.getByLabelText("Описание"), { target: { value: "Едим пасту" } });

    fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

    await waitFor(() => {
      expect(createAdminMeetup).toHaveBeenCalledWith(
        expect.objectContaining({
          hostId: "user-1",
          title: "Гаражный ужин",
          durationMinutes: 120,
          place: "Гараж",
          capacity: 20,
          joinMode: "open",
          priceMode: "free",
        }),
      );
    });
  });

  it("cancels meetup with reason", async () => {
    vi.mocked(getAdminMeetup).mockResolvedValue(meetupDetail);
    vi.mocked(cancelAdminMeetup).mockResolvedValue({
      ...meetupDetail,
      status: "cancelled",
      canceledAt: "2026-05-05T11:00:00.000Z",
      cancelReason: "rain",
    });
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(window, "prompt").mockReturnValue("rain");

    renderDetail("/meetups/meetup-1");

    fireEvent.click(await screen.findByRole("button", { name: /Отменить/i }));

    await waitFor(() => {
      expect(cancelAdminMeetup).toHaveBeenCalledWith("meetup-1", { reason: "rain" });
    });
  });

  it("removes participant", async () => {
    vi.mocked(getAdminMeetup).mockResolvedValue(meetupDetail);
    vi.mocked(listAdminMeetupParticipants).mockResolvedValue({
      items: [
        {
          id: "participant-1",
          userId: "user-2",
          joinedAt: "2026-05-05T10:00:00.000Z",
          user: { displayName: "Лера", city: "Казань" },
        },
      ],
      nextCursor: null,
    });
    vi.mocked(removeAdminMeetupParticipant).mockResolvedValue({ ok: true });

    renderDetail("/meetups/meetup-1");

    fireEvent.click(await screen.findByRole("tab", { name: "Участники" }));
    expect(await screen.findByText("Лера")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Исключить" }));

    await waitFor(() => {
      expect(removeAdminMeetupParticipant).toHaveBeenCalledWith("meetup-1", "participant-1");
    });
  });

  it("approves join request", async () => {
    vi.mocked(getAdminMeetup).mockResolvedValue(meetupDetail);
    vi.mocked(listAdminMeetupJoinRequests).mockResolvedValue({
      items: [
        {
          id: "request-1",
          status: "pending",
          createdAt: "2026-05-05T10:00:00.000Z",
          user: { displayName: "Никита" },
        },
      ],
      nextCursor: null,
    });
    vi.mocked(approveAdminMeetupJoinRequest).mockResolvedValue({ ok: true });

    renderDetail("/meetups/meetup-1");

    fireEvent.click(await screen.findByRole("tab", { name: "Заявки" }));
    expect(await screen.findByText("Никита")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Одобрить" }));

    await waitFor(() => {
      expect(approveAdminMeetupJoinRequest).toHaveBeenCalledWith("meetup-1", "request-1");
    });
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

function renderDetail(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/meetups/:id" element={<AdminMeetupDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
