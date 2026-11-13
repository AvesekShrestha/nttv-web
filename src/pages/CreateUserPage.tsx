import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Shield, Layers, Mail, User, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateStaffMutation } from "@/api/user.api";
import type { CreateStaffDTO } from "@/types/user.type";

export function CreateUserPage() {
  const navigate = useNavigate();
  const createStaffMutation = useCreateStaffMutation();

  const [formData, setFormData] = useState<CreateStaffDTO>({
    username: "",
    email: "",
    password: "",
    role: "AGENT",
    level: "L1",
  });

  const isAgentRole = formData.role === "AGENT";

  const handleRoleChange = (newRole: string) => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      level: newRole === "AGENT" ? "L1" : null,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...formData,
      level: isAgentRole ? formData.level : null,
    };

    createStaffMutation.mutate(payload, {
      onSuccess: () => {
        navigate("/dashboard/users");
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
            <h1 className="text-xl font-semibold tracking-tight">Create New User</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Provision staff accounts and assign role-based permissions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" /> Username
            </label>
            <input
              type="text"
              required
              placeholder="e.g. agent_john"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-500" /> Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. john.doe@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500" /> Temporary Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter secure temporary password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" /> User Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer transition-all"
              >
                <option value="ADMIN" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">ADMIN</option>
                <option value="AGENT" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">AGENT</option>
                <option value="STAFF" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">STAFF</option>
                <option value="CUSTOMER" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">CUSTOMER</option>
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Agent Level
              </label>
              <select
                disabled={!isAgentRole}
                value={isAgentRole ? formData.level || "L1" : ""}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className={`w-full h-11 px-4 rounded-lg border text-sm font-medium transition-all ${!isAgentRole
                  ? "bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed"
                  : "bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  }`}
              >
                {isAgentRole ? (
                  <>
                    <option value="L1" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">Level 1 (L1)</option>
                    <option value="L2" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">Level 2 (L2)</option>
                    <option value="L3" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">Level 3 (L3)</option>
                  </>
                ) : (
                  <option value="" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">N/A (Agents Only)</option>
                )}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/users")}
              className="cursor-pointer h-10 px-5 text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createStaffMutation.isPending}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-10 px-6 text-xs cursor-pointer shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              {createStaffMutation.isPending ? "Creating User..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserPage;
