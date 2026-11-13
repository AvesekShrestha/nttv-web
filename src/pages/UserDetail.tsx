import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  UserCheck,
  Shield,
  Mail,
  Hash,
  Clock,
  ArrowLeft,
  AlertCircle,
  Award,
  Edit3,
  Save,
  X
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserDetailQuery } from "@/api/user.api";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const currentUser = useAuthStore((state) => state.user);
  const isSelf = currentUser?.id === id;

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { data: user, isLoading, isError } = useUserDetailQuery(id || "");

  // Initialize form state when entering edit mode
  const handleStartEditing = () => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
    setIsEditing(true);
  };

  const handleSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    setIsSaving(true);
    try {
      await api.patch(`/user/${id}`, { username, email });
      queryClient.invalidateQueries({ queryKey: ["users", "detail", id] });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 flex flex-col items-center justify-center space-y-4 text-center transition-colors">
        <AlertCircle className="w-8 h-8 text-rose-500 dark:text-rose-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">User Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">The requested profile could not be loaded.</p>
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
            <h1 className="text-xl font-semibold tracking-tight">User Profile</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Viewing account information</p>
          </div>
        </div>

        {isSelf && !isEditing && (
          <Button
            onClick={handleStartEditing}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs h-8 px-3.5 rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-2xl flex items-center justify-between transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-100 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{user.username}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${user.is_active
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-emerald-500 dark:bg-emerald-400" : "bg-slate-400 dark:bg-slate-500"}`} />
            {user.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-2xl space-y-6 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account Metadata</h3>
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
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Hash className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>User ID</span>
              </div>
              <p className="text-xs font-mono text-slate-800 dark:text-slate-200">{user.id}</p>
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Username</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
                  required
                />
              ) : (
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{user.username}</p>
              )}
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Email Address</span>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
                  required
                />
              ) : (
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{user.email}</p>
              )}
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Role</span>
              </div>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 uppercase">{user.role}</p>
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg md:col-span-2">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Level</span>
              </div>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{user.level || "N/A"}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-500 dark:text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
              <span>Created: {user.created_at ? new Date(user.created_at).toLocaleString() : "N/A"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
              <span>Updated: {user.updated_at ? new Date(user.updated_at).toLocaleString() : "N/A"}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserDetailPage;
