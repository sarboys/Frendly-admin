import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminEveningRoutes } from "./EveningRoutes";
import { createRouteTemplate } from "../evening/api";

vi.mock("../evening/api", () => ({
  listRouteTemplates: vi.fn().mockResolvedValue({ items: [] }),
  createRouteTemplate: vi.fn().mockResolvedValue({ id: "template-1" }),
  createAiBrief: vi.fn(),
  generateAiDrafts: vi.fn(),
  convertAiDraft: vi.fn(),
}));

describe("AdminEveningRoutes", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("uses the supported city list when creating route templates", async () => {
    render(
      <MemoryRouter>
        <AdminEveningRoutes />
      </MemoryRouter>,
    );

    const citySelect = await screen.findByLabelText("Город маршрута");
    expect(within(citySelect).getByRole("option", { name: "Воронеж" })).toBeInTheDocument();
    expect(within(citySelect).getByRole("option", { name: "Пермь" })).toBeInTheDocument();

    fireEvent.change(citySelect, { target: { value: "Екатеринбург" } });
    fireEvent.click(screen.getByRole("button", { name: "Создать маршрут" }));

    await waitFor(() => {
      expect(createRouteTemplate).toHaveBeenCalledWith({
        city: "Екатеринбург",
        timezone: "Asia/Yekaterinburg",
        area: null,
      });
    });
  });
});
