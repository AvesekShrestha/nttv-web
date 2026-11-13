import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import { ProtectedRoute } from "./components/custom/ProtectedRoute";
import { PublicRoute } from "./components/custom/PublicRoute";

import { DashboardLayout } from "./layouts/DashboardLayout";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardRouter } from "./pages/DashboardPage";
import { NotFoundPage } from "./pages/NotfoundPage";
import TicketPage from "./pages/TicketPage";
import TicketDetail from "./pages/TicketDetail";
import { TeamPage } from "./pages/TeamPage";

import { useThemeStore } from "./store/theme.store";
import CategoryPage from "./pages/CategoryPage";
import UserPage from "./pages/UserPage";
import CreateUserPage from "./pages/CreateUserPage";
import CreateTeamPage from "./pages/CreateTeamPage";
import CreateCategoryPage from "./pages/CreateCategoryPage";
import UserDetailPage from "./pages/UserDetail";
import TeamDetailPage from "./pages/TeamDetail";
import CategoryDetailPage from "./pages/CategoryDetail";
import CreateTicketPage from "./pages/CreateTicket";

function App() {
  const initializeTheme = useThemeStore(
    (state) => state.initializeTheme
  );

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/dashboard/tickets" element={<TicketPage />} />
          <Route path="/dashboard/tickets/new" element={<CreateTicketPage />} />
          <Route path="/dashboard/tickets/:id" element={<TicketDetail />} />
          <Route path="/dashboard/users/:id" element={<UserDetailPage />} />
          <Route path="/dashboard/teams/:id" element={<TeamDetailPage />} />
          <Route path="/dashboard/categories/:id" element={<CategoryDetailPage />} />


          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/dashboard/teams" element={<TeamPage />} />
            <Route path="/dashboard/categories" element={<CategoryPage />} />
            <Route path="/dashboard/users" element={<UserPage />} />
            <Route path="/dashboard/users/new" element={<CreateUserPage />} />
            <Route path="/dashboard/teams/new" element={<CreateTeamPage />} />
            <Route path="/dashboard/categories/new" element={<CreateCategoryPage />} />
          </Route>

        </Route>
      </Route>

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
