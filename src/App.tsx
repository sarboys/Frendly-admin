import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminAnalytics } from "./admin/pages/Analytics";
import { AdminCommunities } from "./admin/pages/Communities";
import { AdminCommunityDetail } from "./admin/pages/CommunityDetail";
import { AdminContent } from "./admin/pages/Content";
import { AdminDashboard } from "./admin/pages/Dashboard";
import { AdminFeatured } from "./admin/pages/Featured";
import { AdminMeetupDetail } from "./admin/pages/MeetupDetail";
import { AdminMeetups } from "./admin/pages/Meetups";
import { AdminNotifications } from "./admin/pages/Notifications";
import { AdminPayments } from "./admin/pages/Payments";
import { AdminPosters } from "./admin/pages/Posters";
import { AdminPromos } from "./admin/pages/Promos";
import { AdminReportDetail } from "./admin/pages/ReportDetail";
import { AdminReports } from "./admin/pages/Reports";
import { AdminSettings } from "./admin/pages/Settings";
import { AdminSubscriptionSettings } from "./admin/pages/SubscriptionSettings";
import { AdminSubscriptions } from "./admin/pages/Subscriptions";
import { AdminUserDetail } from "./admin/pages/UserDetail";
import { AdminUsers } from "./admin/pages/Users";
import { AdminVerification } from "./admin/pages/Verification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserDetail />} />
            <Route path="verification" element={<AdminVerification />} />
            <Route path="meetups" element={<AdminMeetups />} />
            <Route path="meetups/:id" element={<AdminMeetupDetail />} />
            <Route path="communities" element={<AdminCommunities />} />
            <Route path="communities/:id" element={<AdminCommunityDetail />} />
            <Route path="posters" element={<AdminPosters />} />
            <Route path="featured" element={<AdminFeatured />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="promos" element={<AdminPromos />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="subscriptions/settings" element={<AdminSubscriptionSettings />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="reports/:id" element={<AdminReportDetail />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
