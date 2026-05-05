import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminApiError } from "../api/client";
import {
  getAdminUser,
  listAdminUsers,
  revokeAdminUserSessions,
  suspendAdminUser,
} from "../management/api";
import { AdminUserDetail } from "./UserDetail";
import { AdminUsers } from "./Users";

vi.mock("../management/api", () => ({
  getAdminUser: vi.fn(),
  listAdminUsers: vi.fn(),
  listAdminUserMeetups: vi.fn(),
  listAdminUserReports: vi.fn(),
  listAdminUserAudit: vi.fn(),
  revokeAdminUserSessions: vi.fn(),
  suspendAdminUser: vi.fn(),
  unsuspendAdminUser: vi.fn(),
  unverifyAdminUser: vi.fn(),
  updateAdminUserProfile: vi.fn(),
  verifyAdminUser: vi.fn(),
}));

const userListItem = {
  id: "user-1",
  displayName: "Анна",
  email: "anna@example.com",
  phoneNumber: "+70000000000",
  city: "Москва",
  status: "active",
  verified: true,
  plan: "plus",
  hostedMeetupsCount: 2,
  joinedMeetupsCount: 3,
  reportsCount: 0,
  createdAt: "2026-05-05T10:00:00.000Z",
  updatedAt: "2026-05-05T10:00:00.000Z",
} as const;

const userDetail = {
  ...userListItem,
  suspendedAt: null,
  suspensionReason: null,
  profile: { city: "Москва", bio: "Bio", avatarUrl: null },
  settings: null,
  verification: null,
  subscription: { status: "active" },
  counts: { activeSessions: 2, openReports: 0 },
};

describe("AdminUsers pages", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("renders API list data", async () => {
    vi.mocked(listAdminUsers).mockResolvedValue({ items: [userListItem], nextCursor: null });

    renderWithProviders(<AdminUsers />);

    expect(await screen.findByText("Анна")).toBeInTheDocument();
    expect(screen.getByText("anna@example.com")).toBeInTheDocument();
  });

  it("changes query when search changes", async () => {
    vi.mocked(listAdminUsers).mockResolvedValue({ items: [], nextCursor: null });

    renderWithProviders(<AdminUsers />);
    fireEvent.change(screen.getByPlaceholderText("Имя, email, телефон…"), {
      target: { value: "Анна" },
    });

    await waitFor(() => {
      expect(listAdminUsers).toHaveBeenCalledWith(
        expect.objectContaining({ q: "Анна" }),
      );
    });
  });

  it("shows detail not found state", async () => {
    vi.mocked(getAdminUser).mockRejectedValue(
      new AdminApiError(404, "admin_user_not_found", "User not found"),
    );

    renderDetail("/users/missing");

    expect(await screen.findByText("Пользователь не найден.")).toBeInTheDocument();
  });

  it("calls suspend endpoint after confirm", async () => {
    vi.mocked(getAdminUser).mockResolvedValue(userDetail);
    vi.mocked(suspendAdminUser).mockResolvedValue({ ...userDetail, status: "suspended" });
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(window, "prompt").mockReturnValue("spam");

    renderDetail("/users/user-1");

    fireEvent.click(await screen.findByRole("button", { name: /Блок/i }));

    await waitFor(() => {
      expect(suspendAdminUser).toHaveBeenCalledWith("user-1", { reason: "spam" });
    });
  });

  it("revokes sessions after confirm", async () => {
    vi.mocked(getAdminUser).mockResolvedValue(userDetail);
    vi.mocked(revokeAdminUserSessions).mockResolvedValue({ revokedCount: 2 });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderDetail("/users/user-1");

    fireEvent.click(await screen.findByRole("button", { name: /Сессии/i }));

    await waitFor(() => {
      expect(revokeAdminUserSessions).toHaveBeenCalledWith("user-1");
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
          <Route path="/users/:id" element={<AdminUserDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
