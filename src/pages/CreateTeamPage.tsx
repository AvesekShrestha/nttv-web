import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTeamMutation.mutate(formData, {
      onSuccess: () => {
        navigate("/dashboard/teams");
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Create New Team</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Establish a new operational support team and assign its category and tier level
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-500" /> Team Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Voice-Team-002"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the team's core responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-500" /> Category
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer transition-all"
              >
                <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">
                    {cat.name} ({cat.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Team Level
              </label>
              <select
                value={formData.level || "L1"}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as TeamLevel })}
                className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer transition-all"
              >
                <option value="L1" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">Level 1 (L1)</option>
                <option value="L2" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">Level 2 (L2)</option>
                <option value="L3" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">Level 3 (L3)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/teams")}
              className="cursor-pointer h-10 px-5 text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTeamMutation.isPending}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-10 px-6 text-xs cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              {createTeamMutation.isPending ? "Creating Team..." : "Create Team"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTeamPage;
