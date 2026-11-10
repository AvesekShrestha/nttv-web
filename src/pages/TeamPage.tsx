import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FilterConfig } from "@/components/custom/Searchbar";
import Searchbar from "@/components/custom/Searchbar";
import DashboardCard from "@/components/custom/DashboardCard";
import DataTable from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { Users, Layers, ShieldCheck, CheckCircle2, UserPlus } from "lucide-react";
import type { Column } from "@/types/table.type";
import type { TeamDetailResponseDTO, TeamLevel, TeamQueryDTO } from "@/types/team.type";
import { useTeamsQuery } from "@/api/team.api";
import { useCategoriesQuery } from "@/api/category.api";

export function TeamPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<TeamLevel | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: categoriesResponse } = useCategoriesQuery({ limit: 5 });
  const categories = categoriesResponse?.items || [];

  const queryParams: TeamQueryDTO = {
    page,
    limit,
    level: levelFilter !== "all" ? (levelFilter as TeamLevel) : undefined,
    is_active: statusFilter === "all" ? undefined : statusFilter === "true",
    category_id: categoryId,
    search: searchQuery || undefined,
  };

  const { data: response, isLoading } = useTeamsQuery(queryParams);

  const teams = response?.items || [];
  const totalCount = response?.total || 0;

  const activeCount = teams.filter((t) => t.is_active).length;
  const l1Count = teams.filter((t) => t.level === "L1").length;
  const l2AndL3Count = teams.filter((t) => t.level === "L2" || t.level === "L3").length;

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
          label: cat.name,
          value: cat.id,
        })),
      ],
    },
    {
      key: "level",
      value: levelFilter,
      onChange: (val) => {
        setLevelFilter(val as TeamLevel | "all");
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

  const columns: Column<TeamDetailResponseDTO>[] = [
    {
      header: "Team ID",
      accessorKey: "id",
      className: "font-mono font-medium text-slate-900 dark:text-white",
    },
    {
      header: "Team Name",
      accessorKey: "name",
      className: "font-medium text-slate-800 dark:text-slate-200",
    },
    {
      header: "Level",
      cell: (team) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono">
          <Layers className="w-3.5 h-3.5" />
          {team.level}
        </span>
      ),
    },
    {
      header: "Members",
      cell: (team) => {
        const activeMembersCount = team.members?.filter((m) => m.is_active).length || 0;
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {activeMembersCount} {activeMembersCount === 1 ? "Member" : "Members"}
          </span>
        );
      },
    },
    {
      header: "Category ID",
      accessorKey: "category_id",
      className: "text-slate-500 dark:text-slate-400 font-mono text-xs",
    },
    {
      header: "Status",
      cell: (team) => (
        <span
          className={`inline-flex items-center gap-2 text-xs font-medium ${team.is_active
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 dark:text-slate-400"
            }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${team.is_active ? "bg-emerald-500" : "bg-slate-400"
              }`}
          />
          {team.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created Date",
      cell: (team) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
          {team.created_at ? new Date(team.created_at).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">

      {/* Streamlined Header: Title & Action Button on the same row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">Teams Management</h1>
        <Button
          onClick={() => navigate("/dashboard/teams/new")}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 px-4 rounded-lg shadow-sm cursor-pointer w-fit"
        >
          <UserPlus className="w-4 h-4" />
          Add New Team
        </Button>
      </div>

      {/* Metric Cards at the Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={Users} title="Total Teams" value={totalCount} />
        <DashboardCard icon={CheckCircle2} title="Active Teams" value={activeCount} />
        <DashboardCard icon={ShieldCheck} title="Level 1 (L1)" value={l1Count} />
        <DashboardCard icon={Layers} title="Level 2 & 3" value={l2AndL3Count} />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl">
        <Searchbar
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPage(1);
          }}
          searchPlaceholder="Search teams by name, ID, or description..."
          filters={filters}
        />
      </div>

      {/* Data Table */}
      <DataTable<TeamDetailResponseDTO>
        columns={columns}
        data={teams}
        pagination={paginationData}
        onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(team) => navigate(`/dashboard/teams/${team.id}`)}
        getRowId={(team) => team.id}
        isLoading={isLoading}
        emptyMessage="No teams found matching your criteria"
      />
    </div>
  );
}

export default TeamPage;
