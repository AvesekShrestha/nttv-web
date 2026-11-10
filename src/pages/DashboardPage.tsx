import { useAuthStore } from "@/store/auth.store";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AgentDashboard } from "./AgentDashboard";
import type { ComponentType } from "react";

const dashboardRegistry: Record<string, ComponentType> = {
  admin: AdminDashboard,
  agent: AgentDashboard,
};

export function DashboardRouter() {
  const user = useAuthStore((state) => state.user);

  const userRole = (user?.role?.toLowerCase() || "customer") as string;

  const SelectedDashboard = dashboardRegistry[userRole] || AgentDashboard;

  return <SelectedDashboard />;
}
