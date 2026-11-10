export type AssignmentType = "SYSTEM" | "FORWARD" | "ESCALATION";

export type AssignmentStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "SUPERSEDED";

export interface AgentRecipientResponseDTO {
  id: string;
  agent_id: string;
  can_claim: boolean;
  notified_at: string | null;
  acknowledged_at: string | null;
  claimed_at: string | null;
}

export interface TeamRecipientResponseDTO {
  id: string;
  team_id: string;
  agents: AgentRecipientResponseDTO[];
}

export interface AssignmentResponseDTO {
  id: string;
  ticket_id: string;
  assigned_by: string | null;
  assignment_type: AssignmentType;
  status: AssignmentStatus;

  primary_agent_id: string | null;
  responsible_agent_id: string | null;

  team_recipients: TeamRecipientResponseDTO[];

  assigned_at: string | null;
  acknowledged_at: string | null;
  acknowledgment_deadline_at: string | null;
  resolution_deadline_at: string | null;

  acknowledgment_sla_breached_at: string | null;
  resolution_sla_breached_at: string | null;

  completed_at: string | null;

  created_at: string | null;
  updated_at: string | null;
}

export interface AgentRecipientCreateDTO {
  agent_id: string;
}

export interface TeamRecipientCreateDTO {
  team_id: string;
  agents: AgentRecipientCreateDTO[];
}

export interface TeamAssignmentDTO {
  team_id: string;
  agent_ids: string[];
}

export interface ReassignmentDTO {
  teams: TeamAssignmentDTO[];
}

export interface ClaimEligibilityResponse {
  can_claim: boolean;
  reason: string | null;
}

export interface AssignmentQueryDTO {
  page?: number;
  limit?: number;
  status?: AssignmentStatus | string;
  ticket_id?: string;
}
