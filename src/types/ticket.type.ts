export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TicketStatus =
  | "NEW"
  | "INPROCESS"
  | "ASSIGNED"
  | "RESOLVED"
  | "CLOSED"
  | "INPROCESS";

export interface TicketActivityResponseDTO {
  id: string;
  ticket_id?: string;
  activity_type?: string;
  actor_id?: string | null;
  description?: string;
  created_at: string;
}

export interface TicketResponseDTO {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority | string;
  status: TicketStatus | string;
  category_id: string;
  created_by: string;
  current_assignment_id: string | null;
  activities: TicketActivityResponseDTO[];
  created_at: string | null;
  updated_at: string | null;
  resolved_at: string | null;
}

export interface TicketQueryDTO {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category_id?: string | null;
  user_id?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages?: number;
}

export interface TicketCreateDTO {
  title: string;
  description: string;
  priority?: TicketPriority;
  category_id: string;
}
