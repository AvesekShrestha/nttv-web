import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../store/auth.store";

export function PublicRoute() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const initialized = useAuthStore(
    (state) => state.initialized
  );

  if (initialized && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
