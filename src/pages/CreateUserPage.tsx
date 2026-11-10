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

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className="max-w-2xl mx-auto py-8 px-6 lg:px-0 space-y-8 text-slate-900 dark:text-slate-100">

      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create New User</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Provision staff accounts and assign role-based permissions.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard/users")}
          className="gap-2 text-xs h-9 px-4 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Button>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Username Field */}
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

        {/* Email Field */}
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

        {/* Password Field */}
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

        {/* Role & Level Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Role Selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" /> User Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer transition-all"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="AGENT">AGENT</option>
              <option value="STAFF">STAFF</option>
              <option value="CUSTOMER">CUSTOMER</option>
            </select>
          </div>

          {/* Level Selector */}
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
                  <option value="L1">Level 1 (L1)</option>
                  <option value="L2">Level 2 (L2)</option>
                  <option value="L3">Level 3 (L3)</option>
                </>
              ) : (
                <option value="">N/A (Agents Only)</option>
              )}
            </select>
          </div>
        </div>

        {/* Submit Action Bar */}
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
  );
}

export default CreateUserPage;
