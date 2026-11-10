import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, FileText, ArrowLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateCategoryMutation } from "@/api/category.api";
import type { CategoryCreateDTO } from "@/types/category.type";

export function CreateCategoryPage() {
  const navigate = useNavigate();
  const createCategoryMutation = useCreateCategoryMutation();

  const [formData, setFormData] = useState<CategoryCreateDTO>({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate(formData, {
      onSuccess: () => {
        navigate("/dashboard/categories");
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 lg:px-8 space-y-8 text-slate-900 dark:text-slate-100">

      {/* Navigation & Label Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/dashboard/categories")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Categories
        </button>
        <div className="text-right">
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full font-medium">
            Category Taxonomy
          </span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Category</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add a new root topic or service category for ticket routing and team assignments.
        </p>
      </div>

      {/* Unified Card Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">

        <div className="p-6 md:p-8 space-y-6">

          {/* Category Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-500" /> Category Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Voice"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
            />
          </div>

          {/* Category Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Description
            </label>
            <textarea
              required
              rows={4}
              placeholder="e.g. Voice category description."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium resize-none transition-all"
            />
          </div>

        </div>

        {/* Card Footer Action Bar */}
        <div className="bg-slate-50/80 dark:bg-slate-950/50 px-6 md:px-8 py-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/dashboard/categories")}
            className="cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createCategoryMutation.isPending}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-10 px-6 text-xs rounded-xl cursor-pointer shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
          </Button>
        </div>

      </form>
    </div>
  );
}

export default CreateCategoryPage;
