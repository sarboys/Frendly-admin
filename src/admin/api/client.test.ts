import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminApiError, adminApiRequest } from "./client";

describe("adminApiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests data from the configured admin API base URL", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await adminApiRequest<{ ok: boolean }>("/admin/health");

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/admin/health", {
      headers: { "Content-Type": "application/json" },
    });
  });

  it("throws a typed error when the admin API rejects a request", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ code: "forbidden", message: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(adminApiRequest("/admin/users")).rejects.toEqual(
      new AdminApiError(403, "forbidden", "Forbidden"),
    );
  });
});
