import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Layers, FolderGit2, FileText, Tag, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTeamMutation } from "@/api/team.api";
import { useCategoriesQuery } from "@/api/category.api";
import type { TeamCreateDTO, TeamLevel } from "@/types/team.type";

export function CreateTeamPage() {
  const navigate = useNavigate();
  const createTeamMutation = useCreateTeamMutation();

  const { data: categoriesResponse } = useCategoriesQuery({ limit: 100 });
  const categories = categoriesResponse?.items || [];

  const [formData, setFormData] = useState<TeamCreateDTO>({
    name: "",
    description: "",
    category_id: "",
    level: "L1",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTeamMutation.mutate(formData, {
      onSuccess: () => {
        navigate("/dashboard/teams");
      },
    });
  };

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 lg:p-10 max-w-4xl mx-auto w-full text-slate-900 dark:text-slate-100">

      <div className="flex flex-col gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <Link
          to="/dashboard/teams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Teams
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Create New Team</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Establish a new operational support team and assign its category and tier level.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm space-y-6">

        {/* Team Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-500" /> Team Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Voice-Team-002"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" /> Description
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe the team's core responsibilities..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-500" /> Category
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
            >
              <option value="" disabled>Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.id})
                </option>
              ))}
            </select>
          </div>

          {/* Level Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Team Level
            </label>
            <select
              value={formData.level || "L1"}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as TeamLevel })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
            >
              <option value="L1">Level 1 (L1)</option>
              <option value="L2">Level 2 (L2)</option>
              <option value="L3">Level 3 (L3)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/teams")}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createTeamMutation.isPending}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            {createTeamMutation.isPending ? "Creating Team..." : "Create Team"}
          </Button>
        </div>

      </form>
    </div>
  );
}

export default CreateTeamPage;
