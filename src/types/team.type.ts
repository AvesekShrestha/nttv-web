export type TeamLevel = "L1" | "L2" | "L3";

export interface TeamMemberResponseDTO {
  id: string;
  user_id: string;
  joined_at: string | null;
  is_active: boolean;
}

export interface TeamCreateDTO {
  name: string;
  description: string;
  category_id: string;
  level?: TeamLevel;
}

export interface TeamUpdateDTO {
  name?: string | null;
  description?: string | null;
  category_id?: string | null;
  level?: TeamLevel | null;
}

export interface TeamResponseDTO {
  id: string;
  name: string;
  description: string;
  level: TeamLevel;
  category_id: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface TeamDetailResponseDTO extends TeamResponseDTO {
  members: TeamMemberResponseDTO[];
}

export interface TeamQueryDTO {
  page: number;
  limit: number;
  category_id?: string | null;
  level?: TeamLevel;
  is_active?: boolean;
  search?: string;
  sort_by?: "name" | "level" | "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
}

export interface BulkTeamRequestDTO {
  team_ids: string[];
}
