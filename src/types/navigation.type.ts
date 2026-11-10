import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}
