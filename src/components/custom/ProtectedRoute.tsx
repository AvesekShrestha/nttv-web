import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../../store/auth.store";
import { Spinner } from "../ui/spinner";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const initialized = useAuthStore(
    (state) => state.initialized
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  const initialize = useAuthStore(
    (state) => state.initialize
  );

  const user = useAuthStore(
    (state) => state.user
  );

  const location = useLocation();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  // Wait until authentication initialization completes.
  if (!initialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  // Authentication check.
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Authorization check.
  if (
    allowedRoles?.length &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
