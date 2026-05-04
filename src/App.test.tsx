import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./admin/api/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./admin/api/client")>();
  return {
    ...actual,
    getAdminMe: vi.fn().mockResolvedValue({
      admin: {
        id: "admin-1",
        email: "admin@example.com",
        name: "Admin",
        role: "owner",
      },
    }),
  };
});

describe("Frendly admin app", () => {
  it("renders the admin console as the root route", async () => {
    render(<App />);

    expect(await screen.findByText("Admin Console")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Пользователи/i })).toBeInTheDocument();
  });
});
