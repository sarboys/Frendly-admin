import { afterEach, describe, expect, it, vi } from "vitest";
import {
  approveRouteReviewDraft,
  createRouteReviewGenerationRun,
  createRouteReviewImportRun,
  listRouteReviewContentItems,
  listRouteReviewDrafts,
  rejectRouteReviewDraft,
} from "./routeReviewApi";

describe("route review admin api", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds draft list URLs with filters", async () => {
    const fetchMock = mockFetch({ items: [], nextCursor: null });

    await listRouteReviewDrafts({ city: "Москва", status: "needs_review", limit: 20 });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/admin/evening/route-review/drafts?city=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&status=needs_review&limit=20",
      {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );
  });

  it("sends approve and reject bodies", async () => {
    const fetchMock = mockFetch({ id: "draft-1" });

    await approveRouteReviewDraft("draft-1", { reviewNote: "подходит" });
    await rejectRouteReviewDraft("draft-1", { reviewNote: "далеко идти" });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3000/admin/evening/route-review/drafts/draft-1/approve",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ reviewNote: "подходит" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3000/admin/evening/route-review/drafts/draft-1/reject",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ reviewNote: "далеко идти" }),
      }),
    );
  });

  it("creates manual import requests without source tokens", async () => {
    const fetchMock = mockFetch({ id: "run-1" });

    await createRouteReviewImportRun({
      city: "Москва",
      sources: ["kudago", "overpass"],
      from: "2026-05-04",
      to: "2026-05-11",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/admin/evening/route-review/import-runs",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          city: "Москва",
          sources: ["kudago", "overpass"],
          from: "2026-05-04",
          to: "2026-05-11",
        }),
      }),
    );
  });

  it("lists imported content items for review", async () => {
    const fetchMock = mockFetch({ items: [], nextCursor: null });

    await listRouteReviewContentItems({ city: "Москва", source: "timepad", limit: 25 });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/admin/evening/route-review/content-items?city=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&source=timepad&limit=25",
      {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      },
    );
  });

  it("queues manual route generation runs", async () => {
    const fetchMock = mockFetch({ id: "batch-1", status: "pending_manual" });

    await createRouteReviewGenerationRun({
      city: "Москва",
      mood: "calm",
      budget: "low",
      maxDrafts: 2,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/admin/evening/route-review/generation-runs",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          city: "Москва",
          mood: "calm",
          budget: "low",
          maxDrafts: 2,
        }),
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
