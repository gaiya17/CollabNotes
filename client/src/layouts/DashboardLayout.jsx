import { Outlet } from "react-router-dom";
import AppNavbar from "../components/layout/AppNavbar";
import Sidebar from "../components/layout/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />

      <div className="flex min-h-[calc(100vh-81px)] flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;