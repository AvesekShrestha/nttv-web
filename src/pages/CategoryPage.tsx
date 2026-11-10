import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FilterConfig } from "@/components/custom/Searchbar";
import Searchbar from "@/components/custom/Searchbar";
import DashboardCard from "@/components/custom/DashboardCard";
import DataTable from "@/components/custom/DataTable";
import { Tag, CheckCircle2, AlertCircle, PlusCircle } from "lucide-react";
import type { Column } from "@/types/table.type";
import type { CategoryResponseDTO, CategoryQueryDTO } from "@/types/category.type";
import { useCategoriesQuery } from "@/api/category.api";
import { Button } from "@/components/ui/button";

export function CategoryPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [page, setPage] = useState(1);
  const limit = 5;

  const queryParams: CategoryQueryDTO = {
    page,
    limit,
    search: searchQuery || undefined,
  };

  const { data: response, isLoading } = useCategoriesQuery(queryParams);

  const categories = response?.items || [];
  const totalCount = response?.total || 0;

  // Calculate summary metrics dynamically
  const activeCount = categories.filter((c) => c.is_active).length;
  const inactiveCount = categories.filter((c) => !c.is_active).length;

  const filters: FilterConfig[] = [
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

  // Client-side filtering for status if backend query doesn't handle status filtering directly
  const filteredCategories = categories.filter((cat) => {
    if (statusFilter === "true") return cat.is_active === true;
    if (statusFilter === "false") return cat.is_active === false;
    return true;
  });

  const paginationData = {
    page,
    limit,
    total: totalCount,
  };

  const columns: Column<CategoryResponseDTO>[] = [
    {
      header: "Category ID",
      accessorKey: "id",
      className: "font-mono font-medium text-slate-900 dark:text-white",
    },
    {
      header: "Category Name",
      accessorKey: "name",
      className: "font-medium text-slate-800 dark:text-slate-200",
    },
    {
      header: "Description",
      accessorKey: "description",
      className: "text-slate-600 dark:text-slate-400 max-w-xs truncate",
    },
    {
      header: "Status",
      cell: (category) => (
        <span
          className={`inline-flex items-center gap-2 text-xs font-medium ${category.is_active
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-500 dark:text-slate-400"
            }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${category.is_active ? "bg-emerald-500" : "bg-slate-400"
              }`}
          />
          {category.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created Date",
      cell: (category) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
          {category.created_at ? new Date(category.created_at).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">Categories Management</h1>
        <Button
          onClick={() => navigate("/dashboard/categories/new")}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 px-4 rounded-lg shadow-sm cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Category
        </Button>
      </div>


      {/* Metric Cards at the Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard icon={Tag} title="Total Categories" value={totalCount} />
        <DashboardCard icon={CheckCircle2} title="Active Categories" value={activeCount} />
        <DashboardCard icon={AlertCircle} title="Inactive Categories" value={inactiveCount} />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl">
        <Searchbar
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPage(1);
          }}
          searchPlaceholder="Search categories by name, ID, or description..."
          filters={filters}
        />
      </div>

      {/* Data Table */}
      <DataTable<CategoryResponseDTO>
        columns={columns}
        data={filteredCategories}
        pagination={paginationData}
        onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(category) => navigate(`/dashboard/categories/${category.id}`)}
        getRowId={(category) => category.id}
        isLoading={isLoading}
        emptyMessage="No categories found matching your criteria"
      />
    </div>
  );
}

export default CategoryPage;
