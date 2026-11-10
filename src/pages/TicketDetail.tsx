import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useTicketDetailQuery,
  useAcknowledgeTicketMutation
} from "@/api/ticket.api";
import {
  useAssignmentDetailQuery,
  useClaimEligibilityQuery
} from "@/api/assignment.api";
import { useAuthStore } from "@/store/auth.store";
import {
  ArrowLeft,
  Clock,
  Tag,
  ShieldAlert,
  Activity,
  AlertCircle,
  FileText,
  CheckCircle2,
  Share2,
  TrendingUp
} from "lucide-react";
import DashboardCard from "@/components/custom/DashboardCard";
import { Button } from "@/components/ui/button";

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const {
    data: ticket,
    isLoading: isTicketLoading,
    isError: isTicketError
  } = useTicketDetailQuery(id || "");

  // 2. Extract current_assignment_id safely (string | undefined)
  const assignmentId = ticket?.current_assignment_id ?? undefined;

  // 3. Chain dependent fetches using the assignment ID
  const {
    data: assignment,
    isLoading: isAssignmentLoading
  } = useAssignmentDetailQuery(assignmentId);

  const {
    data: eligibility,
    isLoading: isEligibilityLoading
  } = useClaimEligibilityQuery(assignmentId);

  // 4. Mutations
  const acknowledgeMutation = useAcknowledgeTicketMutation();

  // Unified loading check to prevent multiple re-rendering flashes
  const isInitialLoading = isTicketLoading || (!!assignmentId && isAssignmentLoading);

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading ticket workspace...</p>
      </div>
    );
  }

  if (isTicketError || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-slate-600 dark:text-slate-400">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="font-medium">Ticket not found or removed.</p>
        <button
          onClick={() => navigate("/dashboard/tickets/new")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </button>
      </div>
    );
  }

  const activities = ticket.activities ?? [];

  // Visibility and action evaluation rules
  const canClaim = eligibility?.can_claim ?? false;
  const isResponsibleAgent = assignment?.responsible_agent_id === currentUser?.id;

  const handleAcknowledge = () => {
    if (!ticket.id) return;
    acknowledgeMutation.mutate(ticket.id);
  };

  const handleForward = () => {
    // Forward action handler / modal trigger
  };

  const handleEscalate = () => {
    // Escalate action handler / modal trigger
  };

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full text-slate-900 dark:text-slate-100">

      {/* Navigation & Page Header with Dynamic Action Buttons */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <Link
          to="/dashboard/tickets/new"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Tickets
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {ticket.title}
            </h1>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">ID: #{ticket.id}</p>
          </div>

          {/* Conditional Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Show Acknowledge button ONLY if can_claim is true */}
            {!isEligibilityLoading && canClaim && (
              <Button
                onClick={handleAcknowledge}
                disabled={acknowledgeMutation.isPending}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4 rounded-lg shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {acknowledgeMutation.isPending ? "Acknowledging..." : "Acknowledge Ticket"}
              </Button>
            )}

            {/* Show Forward and Escalate buttons if assignment.responsible_agent_id == user.id */}
            {isResponsibleAgent && (
              <>
                <Button
                  onClick={handleForward}
                  className="gap-2 text-sm font-medium h-10 px-5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Forward
                </Button>
                <Button
                  onClick={handleEscalate}
                  className="gap-2 text-sm font-medium h-10 px-5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 shadow-sm transition-all cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Escalate
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard
          title="Status"
          value={ticket.status}
          icon={Activity}
        />
        <DashboardCard
          title="Priority"
          value={ticket.priority}
          icon={ShieldAlert}
        />
        <DashboardCard
          title="Category ID"
          value={ticket.category_id}
          icon={Tag}
        />
      </section>

      {/* Description & Core Information Section */}
      <section className="flex flex-col gap-4 bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold">Ticket Description</h2>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {ticket.description || "No description provided for this ticket."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div>Created By: <span className="text-slate-800 dark:text-slate-200">{ticket.created_by}</span></div>
          <div>Assignment ID: <span className="text-slate-800 dark:text-slate-200">{ticket.current_assignment_id || "Unassigned"}</span></div>
          <div>Assignment Type: <span className="text-slate-800 dark:text-slate-200">{assignment?.assignment_type || "N/A"}</span></div>
        </div>
      </section>

      {/* Activity Timeline Section */}
      <section className="flex flex-col gap-4 bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold">Activity Timeline ({activities.length})</h2>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No recorded activities for this ticket yet.
            </div>
          ) : (
            activities.map((activity, index) => (
              <div key={activity.id || index} className="relative flex flex-col gap-1.5">
                <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-500" />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {activity.activity_type || "ACTIVITY"}
                  </span>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                    {new Date(activity.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {activity.description || `Action performed by actor: `}
                  {activity.actor_id && (
                    <span className="font-mono text-slate-800 dark:text-slate-200 ml-1">{activity.actor_id}</span>
                  )}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
