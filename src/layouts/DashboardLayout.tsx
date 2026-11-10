import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
} from "../components/ui/sidebar";
import { ApplicationSidebar } from "../components/custom/ApplicationSidebar";

export function DashboardLayout() {

  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <ApplicationSidebar />

      <SidebarInset className="flex flex-col h-full min-w-0 overflow-hidden">

        <main className="flex-1 overflow-y-auto bg-muted/30">
          <Outlet />
        </main>

      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
