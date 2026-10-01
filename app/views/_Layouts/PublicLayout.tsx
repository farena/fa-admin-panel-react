import { useEffect } from "react";
import { Outlet } from "react-router";

export default function PublicLayout() {
  useEffect(() => {
    // $store.dispatch("setCredentials");
    // const isLoggedIn = $store.getters.isLoggedIn;
    // if (isLoggedIn) {
    //   $router.push("/dashboard");
    // }
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center h-100">
      <div className="card mx-4">
        <div className="card-header text-center">
          <img src="/img/logo.svg" alt="Logo" className="brand-logo my-3" />
          <h3 className="m-0">QUARTZ</h3>
          <small>Admin Panel</small>
        </div>
        <div className="card-body px-4 pb-4"><Outlet /></div>
      </div>
    </div>
  );
}
