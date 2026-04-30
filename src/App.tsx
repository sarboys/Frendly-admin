import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthGate } from "./admin/AdminAuthGate";
import { AdminAnalytics } from "./admin/pages/Analytics";
import { AdminCommunities } from "./admin/pages/Communities";
import { AdminCommunityDetail } from "./admin/pages/CommunityDetail";
import { AdminContent } from "./admin/pages/Content";
import { AdminDashboard } from "./admin/pages/Dashboard";
import { AdminFeatured } from "./admin/pages/Featured";
import { AdminEveningRouteDetail } from "./admin/pages/EveningRouteDetail";
import { AdminEveningRoutes } from "./admin/pages/EveningRoutes";
import { AdminMeetupDetail } from "./admin/pages/MeetupDetail";
import { AdminMeetups } from "./admin/pages/Meetups";
import { AdminNotifications } from "./admin/pages/Notifications";
import { AdminLogin } from "./admin/pages/AdminLogin";
import { PartnerLogin } from "./admin/pages/PartnerLogin";
import { PartnerPending } from "./admin/pages/PartnerPending";
import { PartnerRegister } from "./admin/pages/PartnerRegister";
import { PartnerRejected } from "./admin/pages/PartnerRejected";
import { AdminPayments } from "./admin/pages/Payments";
import { AdminPartners } from "./admin/pages/Partners";
import { AdminPosters } from "./admin/pages/Posters";
import { AdminPromos } from "./admin/pages/Promos";
import { AdminReportDetail } from "./admin/pages/ReportDetail";
import { AdminReports } from "./admin/pages/Reports";
import { AdminSettings } from "./admin/pages/Settings";
import { AdminSubscriptionSettings } from "./admin/pages/SubscriptionSettings";
import { AdminSubscriptions } from "./admin/pages/Subscriptions";
import { AdminUserDetail } from "./admin/pages/UserDetail";
import { AdminUsers } from "./admin/pages/Users";
import { AdminVenues } from "./admin/pages/Venues";
import { AdminVerification } from "./admin/pages/Verification";
import { PartnerAuthGate } from "./admin/partner/PartnerAuthGate";
import { adminPortal, isAdminRouteEnabled, type AdminRouteId } from "./admin/portal";

const queryClient = new QueryClient();

const adminRoutes: Array<{
  id: AdminRouteId;
  path?: string;
  index?: true;
  element: JSX.Element;
}> = [
  { id: "dashboard", index: true, element: <AdminDashboard /> },
  { id: "analytics", path: "analytics", element: <AdminAnalytics /> },
  { id: "users", path: "users", element: <AdminUsers /> },
  { id: "userDetail", path: "users/:id", element: <AdminUserDetail /> },
  { id: "verification", path: "verification", element: <AdminVerification /> },
  { id: "meetups", path: "meetups", element: <AdminMeetups /> },
  { id: "meetupDetail", path: "meetups/:id", element: <AdminMeetupDetail /> },
  { id: "eveningRoutes", path: "evening-routes", element: <AdminEveningRoutes /> },
  {
    id: "eveningRouteDetail",
    path: "evening-routes/:templateId",
    element: <AdminEveningRouteDetail />,
  },
  { id: "venues", path: "venues", element: <AdminVenues /> },
  { id: "partners", path: "partners", element: <AdminPartners /> },
  { id: "communities", path: "communities", element: <AdminCommunities /> },
  { id: "communityDetail", path: "communities/:id", element: <AdminCommunityDetail /> },
  { id: "posters", path: "posters", element: <AdminPosters /> },
  { id: "featured", path: "featured", element: <AdminFeatured /> },
  { id: "notifications", path: "notifications", element: <AdminNotifications /> },
  { id: "promos", path: "promos", element: <AdminPromos /> },
  { id: "content", path: "content", element: <AdminContent /> },
  { id: "subscriptions", path: "subscriptions", element: <AdminSubscriptions /> },
  {
    id: "subscriptionSettings",
    path: "subscriptions/settings",
    element: <AdminSubscriptionSettings />,
  },
  { id: "payments", path: "payments", element: <AdminPayments /> },
  { id: "reports", path: "reports", element: <AdminReports /> },
  { id: "reportDetail", path: "reports/:id", element: <AdminReportDetail /> },
  { id: "settings", path: "settings", element: <AdminSettings /> },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {adminPortal === "partner" && (
            <>
              <Route path="/login" element={<PartnerLogin />} />
              <Route path="/register" element={<PartnerRegister />} />
              <Route path="/pending" element={<PartnerPending />} />
              <Route path="/rejected" element={<PartnerRejected />} />
            </>
          )}
          {adminPortal !== "partner" && <Route path="/login" element={<AdminLogin />} />}
          <Route path="/" element={adminPortal === "partner" ? <PartnerAuthGate /> : <AdminAuthGate />}>
            {adminRoutes.filter((route) => isAdminRouteEnabled(route.id)).map((route) =>
              route.index ? (
                <Route key={route.id} index element={route.element} />
              ) : (
                <Route key={route.id} path={route.path} element={route.element} />
              ),
            )}
          </Route>
          <Route path="*" element={<Navigate to={adminPortal === "partner" ? "/login" : "/"} replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
