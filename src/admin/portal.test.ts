import { describe, expect, it } from "vitest";
import {
  getEnabledAdminRouteIds,
  getPortalChrome,
  resolveAdminPortal,
} from "./portal";

describe("admin portal config", () => {
  it("keeps the full admin surface for the internal portal", () => {
    expect(resolveAdminPortal("internal", "admin.frendly.tech")).toBe("internal");
    expect(getPortalChrome("internal")).toEqual({
      subtitle: "Admin Console",
      footerTitle: "Frendly+ статистика",
      footerText: "7.4% юзеров на платном плане. +0.6% за неделю.",
    });
    expect(getEnabledAdminRouteIds("internal")).toContain("users");
    expect(getEnabledAdminRouteIds("internal")).toContain("reports");
    expect(getEnabledAdminRouteIds("internal")).toContain("routeReview");
    expect(getEnabledAdminRouteIds("internal")).toContain("settings");
  });

  it("limits the partner portal to partner-facing routes", () => {
    expect(resolveAdminPortal("partner", "admin.frendly.tech")).toBe("partner");
    expect(resolveAdminPortal(undefined, "partner.frendly.tech")).toBe("partner");
    expect(getPortalChrome("partner")).toEqual({
      subtitle: "Partner Console",
      footerTitle: "Партнерская сводка",
      footerText: "Встречи, афиша и фичеринг без внутренних модераторских разделов.",
    });
    expect(getEnabledAdminRouteIds("partner")).toEqual([
      "dashboard",
      "analytics",
      "meetups",
      "meetupDetail",
      "communities",
      "communityDetail",
      "posters",
      "featured",
    ]);
  });
});
