import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./components/Sidebar";

export const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};
