import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FilterConfig } from "@/components/custom/Searchbar";
import Searchbar from "@/components/custom/Searchbar";
import DashboardCard from "@/components/custom/DashboardCard";
import DataTable from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { Users, ShieldCheck, Headphones, CheckCircle2, Layers, UserPlus } from "lucide-react";
import type { Column } from "@/types/table.type";
import type { UserResponseDTO, UserQueryDTO } from "@/types/user.type";
import { useUsersQuery } from "@/api/user.api";

export function UserPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [page, setPage] = useState(1);
  const limit = 10;

  const queryParams: UserQueryDTO = {
    page,
    limit,
    role: roleFilter !== "all" ? roleFilter : undefined,
    level: levelFilter !== "all" ? levelFilter : undefined,
    is_active: statusFilter === "all" ? undefined : statusFilter === "true",
    search: searchQuery || undefined,
  };

  const { data: response, isLoading } = useUsersQuery(queryParams);

  const users = response?.items || [];
  const totalCount = response?.total || 0;

  const activeCount = users.filter((u) => u.is_active).length;
  const agentCount = users.filter((u) => u.role === "AGENT").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  const filters: FilterConfig[] = [
    {
      key: "role",
      value: roleFilter,
      onChange: (val) => {
        setRoleFilter(val);
        setPage(1);
      },
      options: [
        { label: "All Roles", value: "all" },
        { label: "Admin", value: "ADMIN" },
        { label: "Agent", value: "AGENT" },
        { label: "Staff", value: "STAFF" },
        { label: "Customer", value: "CUSTOMER" },
      ],
    },
    {
      key: "level",
      value: levelFilter,
      onChange: (val) => {
        setLevelFilter(val);
        setPage(1);
      },
      options: [
        { label: "All Levels", value: "all" },
        { label: "Level 1 (L1)", value: "L1" },
        { label: "Level 2 (L2)", value: "L2" },
        { label: "Level 3 (L3)", value: "L3" },
      ],
    },
    {
      key: "status",
      value: statusFilter,
      onChange: (val) => {
        setStatusFilter(val);
        setPage(1);
      },
      options: [
        { label: "All Status", value: "all" },
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ];

  const paginationData = {
    page,
    limit,
    total: totalCount,
  };

  const columns: Column<UserResponseDTO>[] = [
    {
      header: "User ID",
      accessorKey: "id",
      className: "font-mono font-medium text-slate-900 dark:text-white",
    },
    {
      header: "Username",
      accessorKey: "username",
      className: "font-medium text-slate-800 dark:text-slate-200",
    },
    {
      header: "Email",
      accessorKey: "email",
      className: "text-slate-600 dark:text-slate-400 font-mono text-xs",
    },
    {
      header: "Role",
      cell: (user) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          {user.role}
        </span>
      ),
    },
    {
      header: "Level",
      cell: (user) => (
        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
          {user.level ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
              <Layers className="w-3 h-3 text-slate-400" />
              {user.level}
            </span>
          ) : (
            "N/A"
          )}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (user) => (
        <span
          className={`inline-flex items-center gap-2 text-xs font-medium ${user.is_active
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-500 dark:text-slate-400"
            }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-slate-400"
              }`}
          />
          {user.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created Date",
      cell: (user) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
          {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
        <Button
          onClick={() => navigate("/dashboard/users/new")}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 px-4 rounded-lg shadow-sm cursor-pointer w-fit"
        >
          <UserPlus className="w-4 h-4" />
          Add New Staff
        </Button>
      </div>

      {/* Metric Cards at the Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={Users} title="Total Users" value={totalCount} />
        <DashboardCard icon={CheckCircle2} title="Active Users" value={activeCount} />
        <DashboardCard icon={Headphones} title="Agents" value={agentCount} />
        <DashboardCard icon={ShieldCheck} title="Admins" value={adminCount} />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl">
        <Searchbar
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPage(1);
          }}
          searchPlaceholder="Search users by username, email, or ID..."
          filters={filters}
        />
      </div>

      {/* Data Table */}
      <DataTable<UserResponseDTO>
        columns={columns}
        data={users}
        pagination={paginationData}
        onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(user) => navigate(`/dashboard/users/${user.id}`)}
        getRowId={(user) => user.id}
        isLoading={isLoading}
        emptyMessage="No users found matching your criteria"
      />
    </div>
  );
}

export default UserPage;
