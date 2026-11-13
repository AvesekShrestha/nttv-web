import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FolderTree,
  Clock,
  ArrowLeft,
  AlertCircle,
  Edit3,
  Save,
  X,
  CheckCircle2,
  FileText,
  Hash,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCategoryDetailQuery } from "@/api/category.api";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";

export function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const currentUser = useAuthStore((state) => state.user);
  const isAdmin = currentUser?.role === "ADMIN";

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { data: category, isLoading, isError } = useCategoryDetailQuery(id || "");

  const handleStartEditing = () => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
      setIsActive(category.is_active);
    }
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    setIsSaving(true);
    try {
      await api.patch(`/category/${id}`, {
        name,
        description,
        is_active: isActive,
      });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update category details:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading category profile...
        </div>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 flex flex-col items-center justify-center space-y-4 text-center transition-colors">
        <AlertCircle className="w-8 h-8 text-rose-500 dark:text-rose-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Category Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">The requested category profile could not be loaded.</p>
        <Button
          onClick={() => navigate(-1)}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs h-8 px-3.5 rounded-md border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
        >
          Go Back
        </Button>
      </div>
    );
  }

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
            <h1 className="text-xl font-semibold tracking-tight">Category Details</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">ID: {category.id}</p>
          </div>
        </div>

        {isAdmin && !isEditing && (
          <Button
            onClick={handleStartEditing}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs h-8 px-3.5 rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Category
          </Button>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-2xl flex items-center justify-between transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-100 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
              <FolderTree className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{category.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{category.description || "No description provided."}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${category.is_active
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${category.is_active ? "bg-emerald-500 dark:bg-emerald-400" : "bg-slate-400 dark:bg-slate-500"}`} />
            {category.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-2xl space-y-6 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category Metadata</h3>
            {isEditing && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="h-7 px-2.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-7 px-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                >
                  <Save className="w-3 h-3 mr-1" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Hash className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Category ID</span>
              </div>
              <p className="text-xs font-mono text-slate-800 dark:text-slate-200">{category.id}</p>
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <FolderTree className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Category Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
                  required
                />
              ) : (
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{category.name}</p>
              )}
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg md:col-span-2">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Description</span>
              </div>
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-medium resize-none"
                  placeholder="Enter category description..."
                />
              ) : (
                <p className="text-xs text-slate-800 dark:text-slate-200">{category.description || "No description provided."}</p>
              )}
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg md:col-span-2">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Status</span>
              </div>
              {isEditing ? (
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Active Status</span>
                </label>
              ) : (
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {category.is_active ? "Active" : "Inactive"}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-500 dark:text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
              <span>Created: {category.created_at ? new Date(category.created_at).toLocaleString() : "N/A"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
              <span>Updated: {category.updated_at ? new Date(category.updated_at).toLocaleString() : "N/A"}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryDetailPage;
