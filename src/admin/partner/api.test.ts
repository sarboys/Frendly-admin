import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearPartnerTokens,
  getPartnerTokens,
  partnerApiRequest,
  setPartnerTokens,
} from "./api";

describe("partnerApiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    clearPartnerTokens();
  });

  it("adds the partner bearer token to API requests", async () => {
    setPartnerTokens({ accessToken: "access-1", refreshToken: "refresh-1" });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await partnerApiRequest<{ ok: boolean }>("/partner/me");

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/partner/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer access-1",
      },
    });
  });

  it("stores and clears partner tokens", () => {
    setPartnerTokens({ accessToken: "access-1", refreshToken: "refresh-1" });

    expect(getPartnerTokens()).toEqual({
      accessToken: "access-1",
      refreshToken: "refresh-1",
    });

    clearPartnerTokens();
    expect(getPartnerTokens()).toBeNull();
  });
});
