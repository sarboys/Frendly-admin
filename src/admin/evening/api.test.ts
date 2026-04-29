import { afterEach, describe, expect, it, vi } from "vitest";
import {
  archiveRouteTemplate,
  createPartner,
  listVenues,
  publishRouteTemplate,
  saveRouteRevision,
  updateVenue,
} from "./api";

describe("evening admin api", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds list URLs with query params", async () => {
    const fetchMock = mockFetch({ items: [] });

    await listVenues({ city: "Москва", limit: 20 });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/admin/evening/venues?city=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&limit=20",
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  });

  it("sends create requests as JSON", async () => {
    const fetchMock = mockFetch({ id: "partner-1" });

    await createPartner({
      name: "Example Partner",
      city: "Москва",
      status: "active",
      contact: "owner@example.com",
      notes: "test",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/admin/evening/partners",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Example Partner",
          city: "Москва",
          status: "active",
          contact: "owner@example.com",
          notes: "test",
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
  });

  it("sends update requests with PATCH", async () => {
    const fetchMock = mockFetch({ id: "venue-1" });

    await updateVenue("venue-1", { status: "closed" });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/admin/evening/venues/venue-1",
      {
        method: "PATCH",
        body: JSON.stringify({ status: "closed" }),
        headers: { "Content-Type": "application/json" },
      },
    );
  });

  it("sends route revision and status actions", async () => {
    const fetchMock = mockFetch({ id: "template-1" });

    await saveRouteRevision("template-1", {
      title: "Кино без кино",
      vibe: "спокойный вечер",
      blurb: "Два места в центре.",
      totalPriceFrom: 1800,
      totalSavings: 300,
      durationLabel: "2.5 часа",
      area: "центр",
      goal: "date",
      mood: "chill",
      budget: "mid",
      format: "mixed",
      recommendedFor: "свидание",
      badgeLabel: "Маршрут от команды Frendly",
      steps: [],
    });
    await publishRouteTemplate("template-1");
    await archiveRouteTemplate("template-1");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3000/admin/evening/route-templates/template-1/revisions",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3000/admin/evening/route-templates/template-1/publish",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "http://localhost:3000/admin/evening/route-templates/template-1/archive",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
});

function mockFetch(body: unknown) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}
