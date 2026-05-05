import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  archiveAdminCommunity,
  createAdminCommunity,
  createAdminCommunityNews,
  deleteAdminCommunityNews,
  getAdminCommunity,
  listAdminCommunities,
  listAdminCommunityMembers,
  listAdminCommunityNews,
  updateAdminCommunityMemberRole,
} from "../management/api";
import { AdminCommunities } from "./Communities";
import { AdminCommunityDetail } from "./CommunityDetail";

vi.mock("../management/api", () => ({
  archiveAdminCommunity: vi.fn(),
  createAdminCommunity: vi.fn(),
  createAdminCommunityMedia: vi.fn(),
  createAdminCommunityNews: vi.fn(),
  deleteAdminCommunityMedia: vi.fn(),
  deleteAdminCommunityNews: vi.fn(),
  getAdminCommunity: vi.fn(),
  listAdminCommunities: vi.fn(),
  listAdminCommunityMedia: vi.fn(),
  listAdminCommunityMembers: vi.fn(),
  listAdminCommunityNews: vi.fn(),
  removeAdminCommunityMember: vi.fn(),
  restoreAdminCommunity: vi.fn(),
  updateAdminCommunity: vi.fn(),
  updateAdminCommunityMedia: vi.fn(),
  updateAdminCommunityMemberRole: vi.fn(),
  updateAdminCommunityNews: vi.fn(),
}));

const communityListItem = {
  id: "community-1",
  name: "Книжный клуб",
  avatar: "📚",
  city: "Москва",
  privacy: "public",
  ownerId: "user-1",
  ownerName: "Анна",
  partnerId: null,
  partnerName: null,
  membersCount: 8,
  newsCount: 2,
  mediaCount: 1,
  archivedAt: null,
  createdAt: "2026-05-05T10:00:00.000Z",
  updatedAt: "2026-05-05T10:00:00.000Z",
} as const;

const communityDetail = {
  ...communityListItem,
  description: "Читаем вместе",
  tags: ["books", "coffee"],
  joinRule: "Открытое вступление",
  premiumOnly: false,
  mood: "Спокойно",
  sharedMediaLabel: "1 медиа",
  chatId: "chat-1",
  owner: { id: "user-1", displayName: "Анна", city: "Москва" },
  partner: null,
  socialLinks: [],
};

describe("AdminCommunities pages", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("renders API list data", async () => {
    vi.mocked(listAdminCommunities).mockResolvedValue({ items: [communityListItem], nextCursor: null });

    renderWithProviders(<AdminCommunities />);

    expect(await screen.findByText("Книжный клуб")).toBeInTheDocument();
    expect(screen.getByText("Анна")).toBeInTheDocument();
  });

  it("posts create form payload", async () => {
    vi.mocked(listAdminCommunities).mockResolvedValue({ items: [], nextCursor: null });
    vi.mocked(createAdminCommunity).mockResolvedValue(communityDetail);

    renderWithProviders(<AdminCommunities />);

    fireEvent.click(screen.getByRole("button", { name: /Новое сообщество/i }));
    fireEvent.change(screen.getByLabelText("Owner user ID"), { target: { value: "user-1" } });
    fireEvent.change(screen.getByLabelText("Название"), { target: { value: "Книжный клуб" } });
    fireEvent.change(screen.getByLabelText("Описание"), { target: { value: "Читаем вместе" } });
    fireEvent.change(screen.getByLabelText("Теги через запятую"), { target: { value: "books, coffee" } });

    fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

    await waitFor(() => {
      expect(createAdminCommunity).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerId: "user-1",
          name: "Книжный клуб",
          description: "Читаем вместе",
          privacy: "public",
          tags: ["books", "coffee"],
        }),
      );
    });
  });

  it("archives community after confirm", async () => {
    vi.mocked(getAdminCommunity).mockResolvedValue(communityDetail);
    vi.mocked(archiveAdminCommunity).mockResolvedValue({
      ...communityDetail,
      archivedAt: "2026-05-05T11:00:00.000Z",
    });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderDetail("/communities/community-1");

    fireEvent.click(await screen.findByRole("button", { name: /В архив/i }));

    await waitFor(() => {
      expect(archiveAdminCommunity).toHaveBeenCalledWith("community-1");
    });
  });

  it("updates member role", async () => {
    vi.mocked(getAdminCommunity).mockResolvedValue(communityDetail);
    vi.mocked(listAdminCommunityMembers).mockResolvedValue({
      items: [
        {
          id: "member-1",
          userId: "user-2",
          role: "member",
          joinedAt: "2026-05-05T10:00:00.000Z",
          user: { displayName: "Лера", city: "Казань" },
        },
      ],
      nextCursor: null,
    });
    vi.mocked(updateAdminCommunityMemberRole).mockResolvedValue({ ok: true });

    renderDetail("/communities/community-1");

    fireEvent.click(await screen.findByRole("tab", { name: "Участники" }));
    const roleSelect = await screen.findByLabelText("Роль Лера");
    fireEvent.change(roleSelect, { target: { value: "moderator" } });

    await waitFor(() => {
      expect(updateAdminCommunityMemberRole).toHaveBeenCalledWith(
        "community-1",
        "member-1",
        { role: "moderator" },
      );
    });
  });

  it("creates and deletes news", async () => {
    vi.mocked(getAdminCommunity).mockResolvedValue(communityDetail);
    vi.mocked(listAdminCommunityNews).mockResolvedValue({
      items: [{ id: "news-1", title: "Встреча", blurb: "В пятницу", timeLabel: "сейчас" }],
    });
    vi.mocked(createAdminCommunityNews).mockResolvedValue({ id: "news-2" });
    vi.mocked(deleteAdminCommunityNews).mockResolvedValue({ ok: true });

    renderDetail("/communities/community-1");

    fireEvent.click(await screen.findByRole("tab", { name: "Новости" }));
    fireEvent.change(await screen.findByLabelText("Заголовок новости"), { target: { value: "Новый пост" } });
    fireEvent.change(screen.getByLabelText("Текст новости"), { target: { value: "Текст" } });
    fireEvent.click(screen.getByRole("button", { name: "Добавить" }));

    await waitFor(() => {
      expect(createAdminCommunityNews).toHaveBeenCalledWith(
        "community-1",
        expect.objectContaining({ title: "Новый пост", blurb: "Текст" }),
      );
    });

    fireEvent.click(await screen.findByRole("button", { name: /Удалить новость Встреча/i }));

    await waitFor(() => {
      expect(deleteAdminCommunityNews).toHaveBeenCalledWith("community-1", "news-1");
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
          <Route path="/communities/:id" element={<AdminCommunityDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
