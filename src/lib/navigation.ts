import {
  LayoutDashboard,
  Ticket,
  Users,
  Settings,
  Tags,
  UsersRound,
  Activity,
  PlusCircle,
  Forward,
  AlertTriangle,
  Bell,
} from "lucide-react";

import type { UserRole } from "../types/auth.type";
import type { NavigationGroup } from "../types/navigation.type";

export const navigationConfig: Record<UserRole, NavigationGroup[]> = {
  admin: [
    {
      label: "Workspace",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Tickets", url: "/dashboard/tickets", icon: Ticket },
        { title: "Activity", url: "/dashboard/activity", icon: Activity },
        { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
      ],
    },
    {
      label: "Management",
      items: [
        { title: "Users", url: "/dashboard/users", icon: Users },
        { title: "Teams", url: "/dashboard/teams", icon: UsersRound },
        { title: "Categories", url: "/dashboard/categories", icon: Tags },
      ],
    },
    {
      label: "Preferences",
      items: [
        { title: "Settings", url: "/dashboard/settings", icon: Settings },
      ],
    },
  ],

  supervisor: [
    {
      label: "Workspace",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Tickets", url: "/dashboard/tickets", icon: Ticket },
        { title: "Forwarded", url: "/dashboard/forwarded", icon: Forward },
        { title: "Escalated", url: "/dashboard/escalated", icon: AlertTriangle },
        { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
      ],
    },
    {
      label: "Management",
      items: [
        { title: "Teams", url: "/dashboard/teams", icon: UsersRound },
        { title: "Settings", url: "/dashboard/settings", icon: Settings },
      ],
    },
  ],

  agent: [
    {
      label: "Workspace",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "My Tickets", url: "/dashboard/tickets", icon: Ticket },
        { title: "New Ticket", url: "/dashboard/tickets/new", icon: Ticket },
        { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
      ],
    },
  ],

  staff: [
    {
      label: "Workspace",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Create Ticket", url: "/dashboard/tickets/new", icon: PlusCircle },
        { title: "My Tickets", url: "/dashboard/tickets", icon: Ticket },
        { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
      ],
    },
    {
      label: "Preferences",
      items: [
        { title: "Settings", url: "/dashboard/settings", icon: Settings },
      ],
    },
  ],

  customer: [
    {
      label: "Workspace",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Create Ticket", url: "/dashboard/tickets/new", icon: PlusCircle },
        { title: "My Tickets", url: "/dashboard/tickets", icon: Ticket },
        { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
      ],
    },
  ],
};
