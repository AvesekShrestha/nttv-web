export type UserLevel = "L1" | "L2" | "L3";

export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
  role: string;
  level: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateStaffDTO {
  username: string;
  email: string;
  password: string;
  role: string;
  level?: string | null;
}

export interface UserQueryDTO {
  page: number;
  limit: number;
  role?: string;
  level?: string;
  is_active?: boolean;
  search?: string;
}
