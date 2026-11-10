import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FilterConfig } from "@/components/custom/Searchbar";
import Searchbar from "@/components/custom/Searchbar";
import DashboardCard from "@/components/custom/DashboardCard";
import DataTable from "@/components/custom/DataTable";
import { Ticket, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Column } from "@/types/table.type";
import type { TicketResponseDTO } from "@/types/ticket.type";
import { useTicketsQuery } from "@/api/ticket.api";
import { useCategoriesQuery } from "@/api/category.api";
import { useAuthStore } from "@/store/auth.store";

export function CreateTicket() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user)

  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: categoriesResponse } = useCategoriesQuery({ limit: 5 });
  const categories = categoriesResponse?.items || [];

  const { data: response, isLoading } = useTicketsQuery({
    page,
    limit,
    status: status !== "all" ? status : undefined,
    priority: priority !== "all" ? priority : undefined,
    category_id: categoryId,
    user_id: user?.id,
    search: searchQuery || undefined,
  });

  const tickets = response?.items || [];
  const totalCount = response?.total || 0;

  const filters: FilterConfig[] = [
    {
      key: "category",
      value: categoryId ?? "",
      onChange: (val) => {
        setCategoryId(val === "" ? null : val);
        setPage(1);
      },
      options: [
        { label: "All Categories", value: "" },
        ...categories.map((cat) => ({
          label: cat.name, // Display category.name in the dropdown
          value: cat.id,   // Pass category.id when selected
        })),
      ],
    },
    {
      key: "status",
      value: status,
      onChange: (val) => {
        setStatus(val);
        setPage(1);
      },
      options: [
        { label: "All Status", value: "all" },
        { label: "In Process", value: "INPROCESS" },
        { label: "Assigned", value: "ASSIGNED" },
        { label: "Resolved", value: "RESOLVED" },
        { label: "Closed", value: "CLOSED" },
      ],
    },
    {
      key: "priority",
      value: priority,
      onChange: (val) => {
        setPriority(val);
        setPage(1);
      },
      options: [
        { label: "All Priorities", value: "all" },
        { label: "Low", value: "LOW" },
        { label: "Medium", value: "MEDIUM" },
        { label: "High", value: "HIGH" },
        { label: "Critical", value: "CRITICAL" },
      ],
    },
  ];

  const paginationData = {
    page,
    limit,
    total: totalCount,
  };

  const columns: Column<TicketResponseDTO>[] = [
    {
      header: "Ticket ID",
      accessorKey: "id",
      className: "font-mono font-medium text-slate-900 dark:text-white",
    },
    {
      header: "Title",
      accessorKey: "title",
      className: "font-medium max-w-xs truncate text-slate-800 dark:text-slate-200",
    },
    {
      header: "Category ID",
      accessorKey: "category_id",
      className: "text-slate-600 dark:text-slate-400 font-mono text-xs",
    },
    {
      header: "Priority",
      cell: (ticket) => {
        const priorityConfig: Record<string, { dot: string; text: string }> = {
          CRITICAL: { dot: "bg-red-500", text: "text-red-600 dark:text-red-400 font-medium" },
          HIGH: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400 font-medium" },
          MEDIUM: { dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400 font-medium" },
          LOW: { dot: "bg-slate-400", text: "text-slate-600 dark:text-slate-400" },
        };
        const cfg = priorityConfig[ticket.priority] || { dot: "bg-slate-400", text: "text-slate-600" };
        return (
          <span className={`inline-flex items-center gap-2 text-xs ${cfg.text}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {ticket.priority}
          </span>
        );
      },
    },
    {
      header: "Status",
      cell: (ticket) => {
        const statusConfig: Record<string, { dot: string; text: string }> = {
          INPROCESS: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400 font-medium" },
          ASSIGNED: { dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400 font-medium" },
          RESOLVED: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400 font-medium" },
          CLOSED: { dot: "bg-slate-400", text: "text-slate-500 dark:text-slate-400" },
        };
        const cfg = statusConfig[ticket.status] || { dot: "bg-slate-400", text: "text-slate-500" };
        return (
          <span className={`inline-flex items-center gap-2 text-xs ${cfg.text}`}>
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {ticket.status}
          </span>
        );
      },
    },
    {
      header: "Created Date",
      cell: (ticket) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
          {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={Ticket} title="Total Tickets" value={totalCount} />
        <DashboardCard icon={Clock} title="In Progress" value="8" />
        <DashboardCard icon={AlertCircle} title="Escalated" value="3" />
        <DashboardCard icon={CheckCircle2} title="Resolved" value="13" />
      </div>

      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl">
        <Searchbar
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPage(1);
          }}
          searchPlaceholder="Search tickets by title, ID, or category..."
          filters={filters}
        />
      </div>

      <DataTable<TicketResponseDTO>
        columns={columns}
        data={tickets}
        pagination={paginationData}
        onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(ticket) => navigate(`/dashboard/tickets/${ticket.id}`)}
        getRowId={(ticket) => ticket.id}
        isLoading={isLoading}
        emptyMessage="No tickets found matching your criteria"
      />
    </div>
  );
}

export default CreateTicket;
