import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  Shield,
  Clock,
  ArrowLeft,
  AlertCircle,
  FolderTree,
  UserPlus,
  UserMinus,
  Search,
} from "lucide-react";
import {
  useTeamDetailQuery,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
} from "@/api/team.api";
import { useUsersQuery } from "@/api/user.api";
import { useCategoryDetailQuery } from "@/api/category.api";
import { Button } from "@/components/ui/button";

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch team details
  const { data: team, isLoading: isTeamLoading, isError: isTeamError } = useTeamDetailQuery(id || "");

  // 2. Fetch category details directly by ID instead of loading the whole list
  const { data: category } = useCategoryDetailQuery(team?.category_id || "");

  // 3. Fetch all users to resolve assigned member usernames
  const assignedMemberIds = team?.members?.map((m) => m.user_id) || [];
  const { data: assignedUsersData } = useUsersQuery({
    page: 1,
    limit: 100,
  });
  const allAssignedUsers = assignedUsersData?.items || [];

  // 4. Fetch available users filtered on the backend by level and search query
  const { data: availableUsersData, isLoading: isUsersLoading } = useUsersQuery(
    {
      page: 1,
      limit: 50,
      level: team?.level,
      search: searchQuery || undefined,
      is_active: true,
    }
  );

  const addMemberMutation = useAddTeamMemberMutation();
  const removeMemberMutation = useRemoveTeamMemberMutation();

  const allAvailableUsers = availableUsersData?.items || [];
  const filteredAvailableUsers = allAvailableUsers.filter(
    (user) => !assignedMemberIds.includes(user.id)
  );

  const handleAddMemberDirect = async (userId: string) => {
    if (!id) return;
    try {
      await addMemberMutation.mutateAsync({
        teamId: id,
        memberId: userId,
      });
    } catch (error) {
      console.error("Failed to add team member:", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!id) return;
    try {
      await removeMemberMutation.mutateAsync({
        teamId: id,
        memberId: memberId,
      });
    } catch (error) {
      console.error("Failed to remove team member:", error);
    }
  };

  if (isTeamLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading team profile...
        </div>
      </div>
    );
  }

  if (isTeamError || !team) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 flex flex-col items-center justify-center space-y-4 text-center transition-colors">
        <AlertCircle className="w-8 h-8 text-rose-500 dark:text-rose-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Team Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">The requested team profile could not be loaded.</p>
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
            <h1 className="text-xl font-semibold tracking-tight">{team.name}</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">ID: {team.id}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-100 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{team.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{team.description}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full w-fit ${team.is_active
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${team.is_active ? "bg-emerald-500 dark:bg-emerald-400" : "bg-slate-400 dark:bg-slate-500"}`} />
            {team.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-2xl space-y-6 transition-colors">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Team Metadata</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Level</span>
              </div>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{team.level}</p>
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <FolderTree className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Category</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {category?.name || "N/A"}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                  ({team.category_id})
                </p>
              </div>
            </div>

            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Total Members</span>
              </div>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{team.members.length} Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-2xl space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned Members</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{team.members.length} items</span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
            {team.members.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">No members assigned to this team yet.</div>
            ) : (
              team.members.map((member) => {
                const matchedUser = allAssignedUsers.find((u) => u.id === member.user_id);
                const displayName = matchedUser ? matchedUser.username : member.user_id;

                return (
                  <div key={member.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{displayName}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">({member.user_id})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Joined: {member.joined_at ? new Date(member.joined_at).toLocaleString() : "N/A"}
                          {matchedUser && ` • ${matchedUser.role}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${member.is_active
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${member.is_active ? "bg-emerald-500 dark:bg-emerald-400" : "bg-slate-400 dark:bg-slate-500"}`} />
                        {member.is_active ? "Active" : "Inactive"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={removeMemberMutation.isPending}
                        onClick={() => handleRemoveMember(member.user_id)}
                        className="h-7 px-2.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded transition-colors cursor-pointer"
                      >
                        <UserMinus className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-2xl space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Available {team.level} Agents
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Querying server for eligible unassigned agents matching level {team.level}.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
            {isUsersLoading ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">Querying available agents...</div>
            ) : filteredAvailableUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <Users className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                No available agents found matching the criteria.
              </div>
            ) : (
              filteredAvailableUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user.username}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">({user.id})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 capitalize">
                        {user.role} • Level {user.level}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={addMemberMutation.isPending}
                    onClick={() => handleAddMemberDirect(user.id)}
                    className="gap-1.5 h-7 px-3 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-600 transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
            <span>Created: {team.created_at ? new Date(team.created_at).toLocaleString() : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
            <span>Updated: {team.updated_at ? new Date(team.updated_at).toLocaleString() : "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamDetailPage;
