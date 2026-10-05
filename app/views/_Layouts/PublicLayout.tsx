import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "~/store/hooks";
import {
  selectIsAuthenticated,
  selectSessionChecked,
} from "~/store/slices/authSlice";

export default function PublicLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const sessionChecked = useAppSelector(selectSessionChecked);

  // Wait for the session restore before deciding to redirect
  if (!sessionChecked) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="d-flex align-items-center justify-content-center h-100">
      <div className="card mx-4">
        <div className="card-header text-center">
          <img src="/img/logo.svg" alt="Logo" className="brand-logo my-3" />
          <h3 className="m-0">QUARTZ</h3>
          <small>Admin Panel</small>
        </div>
        <div className="card-body px-4 pb-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
