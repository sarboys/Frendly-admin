export type AdminPortal = "internal" | "partner";

export type AdminRouteId =
  | "dashboard"
  | "analytics"
  | "users"
  | "userDetail"
  | "verification"
  | "meetups"
  | "meetupDetail"
  | "eveningRoutes"
  | "eveningRouteDetail"
  | "venues"
  | "partners"
  | "communities"
  | "communityDetail"
  | "posters"
  | "featured"
  | "notifications"
  | "promos"
  | "content"
  | "subscriptions"
  | "subscriptionSettings"
  | "payments"
  | "reports"
  | "reportDetail"
  | "settings";

export type PortalChrome = {
  subtitle: string;
  footerTitle: string;
  footerText: string;
};

const internalRouteIds: AdminRouteId[] = [
  "dashboard",
  "analytics",
  "users",
  "userDetail",
  "verification",
  "meetups",
  "meetupDetail",
  "eveningRoutes",
  "eveningRouteDetail",
  "venues",
  "partners",
  "communities",
  "communityDetail",
  "posters",
  "featured",
  "notifications",
  "promos",
  "content",
  "subscriptions",
  "subscriptionSettings",
  "payments",
  "reports",
  "reportDetail",
  "settings",
];

const partnerRouteIds: AdminRouteId[] = [
  "dashboard",
  "analytics",
  "meetups",
  "meetupDetail",
  "communities",
  "communityDetail",
  "posters",
  "featured",
];

const portalRouteIds: Record<AdminPortal, AdminRouteId[]> = {
  internal: internalRouteIds,
  partner: partnerRouteIds,
};

const portalChrome: Record<AdminPortal, PortalChrome> = {
  internal: {
    subtitle: "Admin Console",
    footerTitle: "Frendly+ статистика",
    footerText: "7.4% юзеров на платном плане. +0.6% за неделю.",
  },
  partner: {
    subtitle: "Partner Console",
    footerTitle: "Партнерская сводка",
    footerText: "Встречи, афиша и фичеринг без внутренних модераторских разделов.",
  },
};

export function resolveAdminPortal(
  envPortal = import.meta.env.VITE_ADMIN_PORTAL,
  hostname = window.location.hostname,
): AdminPortal {
  if (envPortal === "partner" || hostname === "partner.frendly.tech") {
    return "partner";
  }

  return "internal";
}

export const adminPortal = resolveAdminPortal();

export function getEnabledAdminRouteIds(portal: AdminPortal = adminPortal) {
  return portalRouteIds[portal];
}

export function isAdminRouteEnabled(routeId: AdminRouteId, portal: AdminPortal = adminPortal) {
  return portalRouteIds[portal].includes(routeId);
}

export function getPortalChrome(portal: AdminPortal = adminPortal) {
  return portalChrome[portal];
}
