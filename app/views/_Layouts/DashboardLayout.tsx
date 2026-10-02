import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "~/components/Layout/Sidebar";
import Topbar from "~/components/Layout/Topbar";

export default function DashboardLayout() {
  const fullYear = useMemo(() => new Date().getFullYear(), []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO complete authentication
    // this.$store.dispatch('setCredentials')
    // const isLoggedIn = this.$store.getters.isLoggedIn

    // if (!isLoggedIn) {
    //   this.$router.push('/login')
    // } else {
    //   this.loading = false
    //   // this.$store.dispatch("getUnreadNotifications");
    // }
    setTimeout(() => {
      setLoading(false);
    }, 150);
  }, []);

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
