import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import Sidebar from "~/components/Layout/Sidebar";
import Topbar from "~/components/Layout/Topbar";
import { useAppSelector } from "~/store/hooks";
import { selectIsAuthenticated } from "~/store/slices/authSlice";

export default function DashboardLayout() {
  const fullYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content-wrapper">
          <div className="content">{!loading && <Outlet />}</div>
          <div className="footer">
            Copyright &reg; {fullYear} - Quartz - All rights reserved
          </div>
        </div>
      </div>
    </div>
  );
}
